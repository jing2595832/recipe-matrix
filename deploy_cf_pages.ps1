# Cloudflare Pages 批量部署脚本
# 使用方法: .\deploy_cf_pages.ps1 -ApiToken "your_api_token_here"
param(
    [Parameter(Mandatory=$true)]
    [string]$ApiToken,

    [string]$AccountId = "243a88b11027802a7ca7e78830726236"
)

$baseUrl = "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects"
$headers = @{
    "Authorization" = "Bearer $ApiToken"
    "Content-Type" = "application/json"
}

# 定义 6 个子站点
$sites = @(
    @{ name = "cn-home-recipe"; root_dir = "sites/cn-home" }
    @{ name = "us-family-recipe"; root_dir = "sites/us-family" }
    @{ name = "kid-nutrition-recipe"; root_dir = "sites/kid-nutrition" }
    @{ name = "fitness-diet-recipe"; root_dir = "sites/fitness-diet" }
    @{ name = "quick-meal-recipe"; root_dir = "sites/quick-meal" }
    @{ name = "party-feast-recipe"; root_dir = "sites/party-feast" }
)

$results = @()

foreach ($site in $sites) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Creating Pages project: $($site.name)" -ForegroundColor Cyan
    Write-Host "  Root Directory: $($site.root_dir)" -ForegroundColor Gray
    Write-Host "========================================" -ForegroundColor Cyan

    $body = @{
        name = $site.name
        production_branch = "main"
        source = @{
            type = "github"
            config = @{
                owner = "jing2595832"
                repo_name = "recipe-matrix"
                production_branch = "main"
                deployments_enabled = $true
                production_deployment_enabled = $true
                pr_comments_enabled = $false
                preview_deployment_setting = "all"
            }
        }
        build_config = @{
            build_command = ""
            destination_dir = "/"
            root_dir = $site.root_dir
        }
    } | ConvertTo-Json -Depth 10

    try {
        $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $body -ErrorAction Stop

        if ($response.success) {
            $project = $response.result
            $subdomain = $project.subdomain
            $url = "https://$subdomain.pages.dev"
            Write-Host "  SUCCESS!" -ForegroundColor Green
            Write-Host "  Project Name: $($project.name)" -ForegroundColor Green
            Write-Host "  Subdomain: $subdomain" -ForegroundColor Green
            Write-Host "  URL: $url" -ForegroundColor Green
            $results += @{
                name = $site.name
                root_dir = $site.root_dir
                url = $url
                subdomain = $subdomain
                success = $true
            }
        } else {
            $errorMsg = ($response.errors | ForEach-Object { $_.message }) -join ", "
            Write-Host "  FAILED: $errorMsg" -ForegroundColor Red
            $results += @{
                name = $site.name
                root_dir = $site.root_dir
                success = $false
                error = $errorMsg
            }
        }
    } catch {
        $errorMsg = $_.Exception.Message
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            $errorMsg = $errorBody
        }
        Write-Host "  ERROR: $errorMsg" -ForegroundColor Red
        $results += @{
            name = $site.name
            root_dir = $site.root_dir
            success = $false
            error = $errorMsg
        }
    }
}

# 输出汇总
Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "DEPLOYMENT SUMMARY" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow

$successCount = ($results | Where-Object { $_.success }).Count
$failCount = ($results | Where-Object { -not $_.success }).Count

Write-Host "`nTotal: $($results.Count) projects | Success: $successCount | Failed: $failCount" -ForegroundColor White
Write-Host ""

foreach ($r in $results) {
    if ($r.success) {
        Write-Host "  [OK] $($r.name)" -ForegroundColor Green
        Write-Host "       URL: $($r.url)" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $($r.name)" -ForegroundColor Red
        Write-Host "         Error: $($r.error)" -ForegroundColor Red
    }
}

Write-Host ""
