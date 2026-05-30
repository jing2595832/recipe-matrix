/**
 * Cloudflare Pages 批量部署脚本
 *
 * 使用方法:
 *   1. 先获取 Cloudflare API Token (见下方说明)
 *   2. 运行: node deploy_cf_pages.js <API_TOKEN>
 *
 * 获取 API Token 的方法:
 *   方法一: 通过 Cloudflare Dashboard
 *     - 登录 https://dash.cloudflare.com
 *     - 进入 Profile > API Tokens
 *     - 点击 "Create Token"
 *     - 选择 "Edit Cloudflare Workers" 模板
 *     - 点击 "Continue to summary" > "Create Token"
 *     - 复制生成的 Token
 *
 *   方法二: 通过 Wrangler CLI
 *     - 运行: npx wrangler login
 *     - 在浏览器中完成授权
 *     - Token 会自动保存到 ~/.wrangler/config/default.toml
 *
 *   方法三: 使用 Global API Key
 *     - 登录 https://dash.cloudflare.com
 *     - 进入 Profile > API Tokens > Global API Key
 *     - 查看 Global API Key (需要输入密码确认)
 *     - 运行: node deploy_cf_pages.js <GLOBAL_API_KEY> --global-key --email <YOUR_EMAIL>
 */

const https = require('https');

const ACCOUNT_ID = '243a88b11027802a7ca7e78830726236';
const API_BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects`;

const SITES = [
    { name: 'cn-home-recipe', root_dir: 'sites/cn-home' },
    { name: 'us-family-recipe', root_dir: 'sites/us-family' },
    { name: 'kid-nutrition-recipe', root_dir: 'sites/kid-nutrition' },
    { name: 'fitness-diet-recipe', root_dir: 'sites/fitness-diet' },
    { name: 'quick-meal-recipe', root_dir: 'sites/quick-meal' },
    { name: 'party-feast-recipe', root_dir: 'sites/party-feast' },
];

// Parse arguments
const args = process.argv.slice(2);
let apiToken = args[0];
let useGlobalKey = args.includes('--global-key');
let email = '';

if (useGlobalKey) {
    const emailIdx = args.indexOf('--email');
    if (emailIdx === -1 || !args[emailIdx + 1]) {
        console.error('Error: --global-key requires --email <YOUR_EMAIL>');
        process.exit(1);
    }
    email = args[emailIdx + 1];
}

if (!apiToken) {
    console.error('Usage: node deploy_cf_pages.js <API_TOKEN> [--global-key --email <YOUR_EMAIL>]');
    console.error('');
    console.error('Please provide your Cloudflare API Token.');
    console.error('See the comments at the top of this file for instructions on how to get one.');
    process.exit(1);
}

function makeRequest(method, url, body) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (useGlobalKey) {
            options.headers['X-Auth-Email'] = email;
            options.headers['X-Auth-Key'] = apiToken;
        } else {
            options.headers['Authorization'] = `Bearer ${apiToken}`;
        }

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error(`Invalid JSON response: ${data.substring(0, 500)}`));
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function createProject(site) {
    const projectBody = {
        name: site.name,
        production_branch: 'main',
        source: {
            type: 'github',
            config: {
                owner: 'jing2595832',
                repo_name: 'recipe-matrix',
                production_branch: 'main',
                deployments_enabled: true,
                production_deployment_enabled: true,
                pr_comments_enabled: false,
                preview_deployment_setting: 'all'
            }
        },
        build_config: {
            build_command: '',
            destination_dir: '/',
            root_dir: site.root_dir
        }
    };

    console.log(`\n${'='.repeat(50)}`);
    console.log(`Creating: ${site.name}`);
    console.log(`Root Dir: ${site.root_dir}`);
    console.log(`${'='.repeat(50)}`);

    try {
        const response = await makeRequest('POST', API_BASE, projectBody);

        if (response.success) {
            const project = response.result;
            const url = `https://${project.subdomain}.pages.dev`;
            console.log(`  SUCCESS!`);
            console.log(`  Project: ${project.name}`);
            console.log(`  Subdomain: ${project.subdomain}`);
            console.log(`  URL: ${url}`);
            return { name: site.name, root_dir: site.root_dir, url, subdomain: project.subdomain, success: true };
        } else {
            const errors = (response.errors || []).map(e => e.message).join(', ');
            console.log(`  FAILED: ${errors}`);
            return { name: site.name, root_dir: site.root_dir, success: false, error: errors };
        }
    } catch (err) {
        console.log(`  ERROR: ${err.message}`);
        return { name: site.name, root_dir: site.root_dir, success: false, error: err.message };
    }
}

async function main() {
    console.log('Cloudflare Pages Batch Deployment');
    console.log(`Account ID: ${ACCOUNT_ID}`);
    console.log(`Auth method: ${useGlobalKey ? 'Global API Key' : 'API Token'}`);
    console.log(`Sites to deploy: ${SITES.length}`);

    // First verify the token works by listing existing projects
    console.log('\nVerifying API access...');
    try {
        const listResp = await makeRequest('GET', API_BASE);
        if (listResp.success) {
            console.log(`  API access verified. Existing projects: ${listResp.result_info ? listResp.result_info.total_count : listResp.result.length}`);
        } else {
            const errors = (listResp.errors || []).map(e => e.message).join(', ');
            console.log(`  API access FAILED: ${errors}`);
            console.log('  Please check your API Token and try again.');
            process.exit(1);
        }
    } catch (err) {
        console.log(`  API access ERROR: ${err.message}`);
        process.exit(1);
    }

    // Create all projects
    const results = [];
    for (const site of SITES) {
        const result = await createProject(site);
        results.push(result);
        // Small delay between requests to avoid rate limiting
        if (SITES.indexOf(site) < SITES.length - 1) {
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    // Summary
    console.log(`\n${'='.repeat(50)}`);
    console.log('DEPLOYMENT SUMMARY');
    console.log(`${'='.repeat(50)}`);

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    console.log(`\nTotal: ${results.length} | Success: ${successCount} | Failed: ${failCount}\n`);

    for (const r of results) {
        if (r.success) {
            console.log(`  [OK]     ${r.name}`);
            console.log(`          URL: ${r.url}`);
        } else {
            console.log(`  [FAIL]   ${r.name}`);
            console.log(`          Error: ${r.error}`);
        }
    }

    console.log('');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
