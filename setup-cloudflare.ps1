# ============================================================
# Cloudflare Recipe Stats System - 一键部署脚本
# ============================================================
# 使用方法:
#   1. 在 Cloudflare Dashboard 创建 API Token:
#      https://dash.cloudflare.com/profile/api-tokens
#      -> Create Token -> Custom Token
#      -> Permissions: Account > D1 > Edit, Account > Workers Scripts > Edit
#      -> Account Resources: Include > Your Account
#   2. 将 Token 粘贴到下方变量中
#   3. 在 PowerShell 中运行此脚本
# ============================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$ApiToken
)

$ACCOUNT_ID = "243a88b11027802a7ca7e78830726236"
$BASE_URL = "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID"

$Headers = @{
    "Authorization" = "Bearer $ApiToken"
    "Content-Type" = "application/json"
}

function Invoke-CfApi {
    param(
        [string]$Method,
        [string]$Uri,
        [object]$Body,
        [string]$ContentType = "application/json"
    )
    try {
        $params = @{
            Method = $Method
            Uri = $Uri
            Headers = $Headers
            TimeoutSec = 60
        }
        if ($ContentType -eq "application/json") {
            $params["ContentType"] = "application/json"
            if ($Body) {
                $params["Body"] = ($Body | ConvertTo-Json -Depth 10 -Compress)
            }
        } else {
            $params["ContentType"] = $ContentType
            if ($Body) {
                $params["Body"] = $Body
            }
        }
        $response = Invoke-RestMethod @params
        return $response
    }
    catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            try {
                $stream = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($stream)
                $errBody = $reader.ReadToEnd()
                Write-Host "  Response: $errBody" -ForegroundColor DarkRed
            } catch {}
        }
        return $null
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Cloudflare Recipe Stats System - Deployment" -ForegroundColor Cyan
Write-Host "  Account: $ACCOUNT_ID" -ForegroundColor DarkGray
Write-Host "============================================================" -ForegroundColor Cyan

# ============================================
# Step 1: Create D1 Database
# ============================================
Write-Host ""
Write-Host "[Step 1/4] Creating D1 Database 'recipe-stats'..." -ForegroundColor Yellow

$dbResp = Invoke-CfApi -Method "POST" -Uri "$BASE_URL/d1/database" -Body @{ name = "recipe-stats" }

$DB_UUID = $null
if ($dbResp -and $dbResp.success) {
    $DB_UUID = $dbResp.result.uuid
    Write-Host "  Created successfully!" -ForegroundColor Green
    Write-Host "  UUID: $DB_UUID" -ForegroundColor White
} else {
    Write-Host "  Create failed (may already exist), checking..." -ForegroundColor Yellow
    $listResp = Invoke-CfApi -Method "GET" -Uri "$BASE_URL/d1/database"
    if ($listResp -and $listResp.success) {
        $existingDb = $listResp.result | Where-Object { $_.name -eq "recipe-stats" }
        if ($existingDb) {
            $DB_UUID = $existingDb.uuid
            Write-Host "  Found existing database!" -ForegroundColor Green
            Write-Host "  UUID: $DB_UUID" -ForegroundColor White
        } else {
            Write-Host "  FATAL: Cannot find or create database." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "  FATAL: Cannot list databases. Check your API token permissions." -ForegroundColor Red
        exit 1
    }
}

# ============================================
# Step 2: Create Worker with D1 Binding
# ============================================
Write-Host ""
Write-Host "[Step 2/4] Deploying Worker 'recipe-stats-worker'..." -ForegroundColor Yellow

$workerCode = 'export default{async fetch(request,env){const url=new URL(request.url);const path=url.pathname;const corsHeaders={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,PUT,DELETE,OPTIONS","Access-Control-Allow-Headers":"Content-Type,Authorization"};if(request.method==="OPTIONS")return new Response(null,{headers:corsHeaders});try{if(path==="/"||path==="/health")return new Response(JSON.stringify({status:"ok",message:"Recipe Stats API",version:"1.0.0"}),{headers:{"Content-Type":"application/json",...corsHeaders}});if(path==="/api/page-view"&&request.method==="POST"){const{site_id,fingerprint,ip}=await request.json();if(!site_id||!fingerprint)return new Response(JSON.stringify({error:"Missing site_id or fingerprint"}),{status:400,headers:{"Content-Type":"application/json",...corsHeaders}});const clientIP=request.headers.get("CF-Connecting-IP")||ip||"";await env.DB.prepare("INSERT INTO page_views (site_id,fingerprint,ip,created_at) VALUES (?,?,?,datetime(\"now\"))").bind(site_id,fingerprint,clientIP).run();await env.DB.prepare("INSERT INTO site_daily_stats (site_id,date,views) VALUES (?,date(\"now\"),1) ON CONFLICT(site_id,date) DO UPDATE SET views=views+1").bind(site_id).run();return new Response(JSON.stringify({status:"ok"}),{headers:{"Content-Type":"application/json",...corsHeaders}})}if(path==="/api/recipe-view"&&request.method==="POST"){const{recipe_id,site_id,fingerprint}=await request.json();if(!recipe_id||!site_id||!fingerprint)return new Response(JSON.stringify({error:"Missing required fields"}),{status:400,headers:{"Content-Type":"application/json",...corsHeaders}});await env.DB.prepare("INSERT INTO recipe_views (recipe_id,site_id,fingerprint,created_at) VALUES (?,?,?,datetime(\"now\"))").bind(recipe_id,site_id,fingerprint).run();await env.DB.prepare("INSERT INTO recipe_stats (recipe_id,views) VALUES (?,1) ON CONFLICT(recipe_id) DO UPDATE SET views=views+1").bind(recipe_id).run();return new Response(JSON.stringify({status:"ok"}),{headers:{"Content-Type":"application/json",...corsHeaders}})}if(path.startsWith("/api/recipe-stats/")&&request.method==="GET"){const recipeId=path.replace("/api/recipe-stats/","");const result=await env.DB.prepare("SELECT * FROM recipe_stats WHERE recipe_id=?").bind(recipeId).first();return new Response(JSON.stringify(result||{recipe_id:recipeId,views:0,favorites:0}),{headers:{"Content-Type":"application/json",...corsHeaders}})}if(path==="/api/site-stats"&&request.method==="GET"){const siteId=url.searchParams.get("site_id");if(!siteId)return new Response(JSON.stringify({error:"Missing site_id parameter"}),{status:400,headers:{"Content-Type":"application/json",...corsHeaders}});const result=await env.DB.prepare("SELECT SUM(views) as total_views,SUM(meals) as total_meals FROM site_daily_stats WHERE site_id=?").bind(siteId).first();return new Response(JSON.stringify(result),{headers:{"Content-Type":"application/json",...corsHeaders}})}if(path==="/api/meal-generate"&&request.method==="POST"){const{site_id,fingerprint,dish_count}=await request.json();if(!site_id||!fingerprint)return new Response(JSON.stringify({error:"Missing required fields"}),{status:400,headers:{"Content-Type":"application/json",...corsHeaders}});await env.DB.prepare("INSERT INTO meal_generations (site_id,fingerprint,dish_count,created_at) VALUES (?,?,?,datetime(\"now\"))").bind(site_id,fingerprint,dish_count||0).run();await env.DB.prepare("INSERT INTO site_daily_stats (site_id,date,meals) VALUES (?,date(\"now\"),1) ON CONFLICT(site_id,date) DO UPDATE SET meals=meals+1").bind(site_id).run();return new Response(JSON.stringify({status:"ok"}),{headers:{"Content-Type":"application/json",...corsHeaders}})}if(path==="/api/register"&&request.method==="POST"){const{username,email,password,nickname}=await request.json();if(!username||!password)return new Response(JSON.stringify({error:"Missing username or password"}),{status:400,headers:{"Content-Type":"application/json",...corsHeaders}});const id=crypto.randomUUID();const encoder=new TextEncoder();const hashBuffer=await crypto.subtle.digest("SHA-256",encoder.encode(password));const hashArray=Array.from(new Uint8Array(hashBuffer));const passwordHash=hashArray.map(b=>b.toString(16).padStart(2,"0")).join("");try{await env.DB.prepare("INSERT INTO users (id,username,email,password_hash,nickname,created_at) VALUES (?,?,?,?,?,datetime(\"now\"))").bind(id,username,email||null,passwordHash,nickname||username).run();return new Response(JSON.stringify({status:"ok",user_id:id}),{headers:{"Content-Type":"application/json",...corsHeaders}})}catch(e){return new Response(JSON.stringify({error:"Username or email already exists"}),{status:409,headers:{"Content-Type":"application/json",...corsHeaders}})}}if(path==="/api/login"&&request.method==="POST"){const{username,password}=await request.json();if(!username||!password)return new Response(JSON.stringify({error:"Missing username or password"}),{status:400,headers:{"Content-Type":"application/json",...corsHeaders}});const encoder=new TextEncoder();const hashBuffer=await crypto.subtle.digest("SHA-256",encoder.encode(password));const hashArray=Array.from(new Uint8Array(hashBuffer));const passwordHash=hashArray.map(b=>b.toString(16).padStart(2,"0")).join("");const user=await env.DB.prepare("SELECT id,username,nickname,avatar FROM users WHERE username=? AND password_hash=?").bind(username,passwordHash).first();if(!user)return new Response(JSON.stringify({error:"Invalid credentials"}),{status:401,headers:{"Content-Type":"application/json",...corsHeaders}});const sessionId=crypto.randomUUID();await env.DB.prepare("INSERT INTO sessions (session_id,user_id,created_at,expires_at) VALUES (?,?,datetime(\"now\"),datetime(\"now\",\"+30 days\"))").bind(sessionId,user.id).run();return new Response(JSON.stringify({status:"ok",user:user,session_id:sessionId}),{headers:{"Content-Type":"application/json",...corsHeaders}})}return new Response(JSON.stringify({error:"Not found"}),{status:404,headers:{"Content-Type":"application/json",...corsHeaders}})}catch(e){return new Response(JSON.stringify({error:e.message}),{status:500,headers:{"Content-Type":"application/json",...corsHeaders}})}}}'

# Build multipart form data for worker upload with D1 binding
$boundary = [guid]::NewGuid().ToString()
$metadata = @{
    main_module = "worker.js"
    bindings = @(
        @{
            type = "d1"
            name = "DB"
            id = $DB_UUID
        }
    )
}
$metadataJson = $metadata | ConvertTo-Json -Compress

$bodyParts = @()
$bodyParts += "--$boundary"
$bodyParts += 'Content-Disposition: form-data; name="metadata"'
$bodyParts += ""
$bodyParts += $metadataJson
$bodyParts += "--$boundary"
$bodyParts += 'Content-Disposition: form-data; name="worker.js"; filename="worker.js"'
$bodyParts += "Content-Type: application/javascript+module"
$bodyParts += ""
$bodyParts += $workerCode
$bodyParts += "--$boundary--"
$bodyStr = $bodyParts -join "`r`n"

try {
    $workerHeaders = @{
        "Authorization" = "Bearer $ApiToken"
        "Content-Type" = "multipart/form-data; boundary=$boundary"
    }
    $workerResp = Invoke-RestMethod -Method "PUT" -Uri "$BASE_URL/workers/scripts/recipe-stats-worker" -Headers $workerHeaders -Body $bodyStr -TimeoutSec 60
    if ($workerResp.success) {
        Write-Host "  Deployed successfully!" -ForegroundColor Green
    } else {
        Write-Host "  Deployment failed." -ForegroundColor Red
        if ($workerResp.errors) { Write-Host "  Errors: $($workerResp.errors | ConvertTo-Json)" -ForegroundColor Red }
    }
} catch {
    Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $errBody = $reader.ReadToEnd()
            Write-Host "  Response: $errBody" -ForegroundColor DarkRed
        } catch {}
    }
}

# ============================================
# Step 3: Create Business Tables
# ============================================
Write-Host ""
Write-Host "[Step 3/4] Creating business tables..." -ForegroundColor Yellow

$businessSQL = @"
CREATE TABLE IF NOT EXISTS page_views (id INTEGER PRIMARY KEY AUTOINCREMENT, site_id TEXT NOT NULL, fingerprint TEXT NOT NULL, ip TEXT, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_pv_site ON page_views(site_id);
CREATE TABLE IF NOT EXISTS recipe_views (id INTEGER PRIMARY KEY AUTOINCREMENT, recipe_id TEXT NOT NULL, site_id TEXT NOT NULL, fingerprint TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_rv_recipe ON recipe_views(recipe_id);
CREATE TABLE IF NOT EXISTS recipe_stats (recipe_id TEXT PRIMARY KEY, views INTEGER DEFAULT 0, favorites INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS meal_generations (id INTEGER PRIMARY KEY AUTOINCREMENT, site_id TEXT NOT NULL, fingerprint TEXT NOT NULL, dish_count INTEGER DEFAULT 0, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_mg_site ON meal_generations(site_id);
CREATE TABLE IF NOT EXISTS meal_plans (meal_id TEXT PRIMARY KEY, site_id TEXT NOT NULL, dish_ids TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_mp_date ON meal_plans(created_at);
CREATE TABLE IF NOT EXISTS site_daily_stats (site_id TEXT NOT NULL, date TEXT NOT NULL, views INTEGER DEFAULT 0, meals INTEGER DEFAULT 0, PRIMARY KEY (site_id, date));
"@

$sqlResp = Invoke-CfApi -Method "POST" -Uri "$BASE_URL/d1/database/$DB_UUID/raw" -Body @{ sql = $businessSQL }
if ($sqlResp -and $sqlResp.success) {
    Write-Host "  Created: page_views, recipe_views, recipe_stats, meal_generations, meal_plans, site_daily_stats" -ForegroundColor Green
} else {
    Write-Host "  Failed to create business tables." -ForegroundColor Red
    if ($sqlResp) { Write-Host "  Errors: $($sqlResp.errors | ConvertTo-Json)" -ForegroundColor Red }
}

# ============================================
# Step 4: Create User Tables
# ============================================
Write-Host ""
Write-Host "[Step 4/4] Creating user tables..." -ForegroundColor Yellow

$userSQL = @"
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, email TEXT UNIQUE, password_hash TEXT NOT NULL, nickname TEXT, avatar TEXT DEFAULT '👨‍🍳', favorites TEXT DEFAULT '[]', history TEXT DEFAULT '[]', preferences TEXT DEFAULT '{}', created_at TEXT NOT NULL, last_login TEXT);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE TABLE IF NOT EXISTS sessions (session_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, created_at TEXT NOT NULL, expires_at TEXT NOT NULL, ip TEXT, user_agent TEXT);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
"@

$userSqlResp = Invoke-CfApi -Method "POST" -Uri "$BASE_URL/d1/database/$DB_UUID/raw" -Body @{ sql = $userSQL }
if ($userSqlResp -and $userSqlResp.success) {
    Write-Host "  Created: users, sessions" -ForegroundColor Green
} else {
    Write-Host "  Failed to create user tables." -ForegroundColor Red
    if ($userSqlResp) { Write-Host "  Errors: $($userSqlResp.errors | ConvertTo-Json)" -ForegroundColor Red }
}

# ============================================
# Summary
# ============================================
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  D1 Database UUID:  $DB_UUID" -ForegroundColor White
Write-Host "  Worker Name:       recipe-stats-worker" -ForegroundColor White
Write-Host "  Worker URL:        https://recipe-stats-worker.$ACCOUNT_ID.workers.dev" -ForegroundColor White
Write-Host ""
Write-Host "  API Endpoints:" -ForegroundColor Yellow
Write-Host "    GET  /health               - Health check" -ForegroundColor DarkGray
Write-Host "    POST /api/page-view         - Track page view" -ForegroundColor DarkGray
Write-Host "    POST /api/recipe-view       - Track recipe view" -ForegroundColor DarkGray
Write-Host "    GET  /api/recipe-stats/:id  - Get recipe stats" -ForegroundColor DarkGray
Write-Host "    GET  /api/site-stats        - Get site stats" -ForegroundColor DarkGray
Write-Host "    POST /api/meal-generate     - Track meal generation" -ForegroundColor DarkGray
Write-Host "    POST /api/register          - User registration" -ForegroundColor DarkGray
Write-Host "    POST /api/login             - User login" -ForegroundColor DarkGray
Write-Host ""
