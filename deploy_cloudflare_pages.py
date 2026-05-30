#!/usr/bin/env python3
"""
Cloudflare Pages 多站点部署脚本
用于部署 recipe-matrix 仓库的6个子站点
"""

import time
from playwright.sync_api import sync_playwright

# 部署配置
SITES = [
    {"name": "cn-home", "display_name": "中式家常菜", "root_dir": "sites/cn-home"},
    {"name": "us-family", "display_name": "美式家庭餐", "root_dir": "sites/us-family"},
    {"name": "kid-nutrition", "display_name": "儿童辅食营养", "root_dir": "sites/kid-nutrition"},
    {"name": "fitness-diet", "display_name": "减脂健康餐", "root_dir": "sites/fitness-diet"},
    {"name": "quick-meal", "display_name": "懒人快手餐", "root_dir": "sites/quick-meal"},
    {"name": "party-feast", "display_name": "宴席派对餐", "root_dir": "sites/party-feast"},
]

CLOUDFLARE_PAGES_URL = "https://dash.cloudflare.com/243a88b11027802a7ca7e78830726236/pages/new/provider/github"

def deploy_site(page, site, index):
    """部署单个站点"""
    print(f"\n{'='*60}")
    print(f"[{index}/6] 正在部署: {site['display_name']} ({site['name']})")
    print(f"{'='*60}")
    
    # 1. 访问 Cloudflare Pages 创建页面
    print(f"1. 访问 Cloudflare Pages 创建页面...")
    page.goto(CLOUDFLARE_PAGES_URL)
    page.wait_for_load_state("networkidle")
    time.sleep(3)
    
    # 2. 查找并选择 recipe-matrix 仓库
    print(f"2. 查找 recipe-matrix 仓库...")
    try:
        # 等待仓库列表加载
        page.wait_for_selector("text=recipe-matrix", timeout=10000)
        repo_button = page.locator("text=recipe-matrix").first
        repo_button.click()
        print("   ✓ 已选择 recipe-matrix 仓库")
    except Exception as e:
        print(f"   ✗ 未找到 recipe-matrix 仓库: {e}")
        return None
    
    time.sleep(2)
    
    # 3. 点击 "Begin setup"
    print(f"3. 点击 'Begin setup'...")
    try:
        begin_button = page.locator("button:has-text('Begin setup'), button:has-text('开始设置')").first
        begin_button.click()
        print("   ✓ 已点击 Begin setup")
    except Exception as e:
        print(f"   ✗ 未找到 Begin setup 按钮: {e}")
        return None
    
    time.sleep(2)
    
    # 4. 修改 Project name
    print(f"4. 设置 Project name: {site['name']}...")
    try:
        # 查找 Project name 输入框
        name_input = page.locator("input[name='projectName'], input[placeholder*='project'], input[id*='project']").first
        name_input.fill(site['name'])
        print(f"   ✓ 已设置 Project name: {site['name']}")
    except Exception as e:
        print(f"   ⚠ 设置 Project name 时出错: {e}")
    
    time.sleep(1)
    
    # 5. 展开 "Root directory (advanced)"
    print(f"5. 展开 Root directory (advanced)...")
    try:
        # 查找并点击 Root directory 展开按钮
        root_toggle = page.locator("text=Root directory, button:has-text('Root directory'), [data-testid*='root']").first
        root_toggle.click()
        print("   ✓ 已展开 Root directory")
    except Exception as e:
        print(f"   ⚠ 展开 Root directory 时出错: {e}")
    
    time.sleep(1)
    
    # 6. 输入 Root directory 路径
    print(f"6. 设置 Root directory: {site['root_dir']}...")
    try:
        # 查找 Path 输入框
        path_input = page.locator("input[name='rootDirectory'], input[placeholder*='sites/'], input[id*='root']").first
        path_input.fill(site['root_dir'])
        print(f"   ✓ 已设置 Root directory: {site['root_dir']}")
    except Exception as e:
        print(f"   ⚠ 设置 Root directory 时出错: {e}")
    
    time.sleep(1)
    
    # 7. 点击 "Save and Deploy"
    print(f"7. 点击 'Save and Deploy'...")
    try:
        save_button = page.locator("button:has-text('Save and Deploy'), button:has-text('保存并部署')").first
        save_button.click()
        print("   ✓ 已点击 Save and Deploy")
    except Exception as e:
        print(f"   ✗ 未找到 Save and Deploy 按钮: {e}")
        return None
    
    # 8. 等待部署完成
    print(f"8. 等待部署完成...")
    time.sleep(30)  # 初始等待
    
    # 检查部署状态
    max_wait = 120  # 最大等待2分钟
    waited = 30
    while waited < max_wait:
        try:
            # 检查是否出现成功提示或部署状态
            if page.locator("text=Success, text=成功, text=Deployed").first.is_visible(timeout=5000):
                print("   ✓ 部署成功!")
                break
        except:
            pass
        
        time.sleep(5)
        waited += 5
        print(f"   ... 已等待 {waited} 秒")
    
    # 9. 获取部署URL
    print(f"9. 获取部署URL...")
    try:
        # 查找部署URL
        url_element = page.locator("a[href*='pages.dev'], text='*.pages.dev'").first
        deploy_url = url_element.get_attribute("href") or url_element.inner_text()
        print(f"   ✓ 部署URL: {deploy_url}")
        return deploy_url
    except Exception as e:
        # 构造默认URL
        default_url = f"https://{site['name']}.pages.dev"
        print(f"   ⚠ 无法获取URL，使用默认: {default_url}")
        return default_url

def main():
    """主函数"""
    print("="*60)
    print("Cloudflare Pages 多站点部署工具")
    print("="*60)
    print("\n请先确保:")
    print("1. 已登录 Cloudflare 账号")
    print("2. GitHub 账号已连接")
    print("3. recipe-matrix 仓库可访问")
    print("\n按 Enter 开始部署...")
    input()
    
    results = []
    
    with sync_playwright() as p:
        # 启动浏览器（有头模式，方便观察）
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()
        
        # 按顺序部署每个站点
        for index, site in enumerate(SITES, 1):
            url = deploy_site(page, site, index)
            results.append({
                "name": site["name"],
                "display_name": site["display_name"],
                "url": url
            })
            
            if index < len(SITES):
                print(f"\n等待 5 秒后继续部署下一个站点...")
                time.sleep(5)
        
        browser.close()
    
    # 输出部署结果
    print("\n" + "="*60)
    print("部署完成! 结果汇总:")
    print("="*60)
    for result in results:
        status = "✓" if result["url"] else "✗"
        print(f"{status} {result['display_name']} ({result['name']})")
        if result["url"]:
            print(f"  URL: {result['url']}")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    main()
