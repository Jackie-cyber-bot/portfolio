---
name: check
description: Pre-deploy check for Jiaqi's portfolio — verifies JS syntax, CSS balance, navbar sync, and lists files to upload to hosting.
argument-hint: (no arguments needed)
---

Run the following checks on the portfolio at /Users/jiaqigu/Desktop/portfolio/ and report results clearly in Chinese:

## 1. JS 语法检查
Run: `node --check /Users/jiaqigu/Desktop/portfolio/script.js`
- ✅ 通过 or ❌ 报错（显示错误信息）

## 2. CSS 括号平衡检查
Count `{` and `}` in styles.css — they must match exactly.
Run a python3 one-liner to count and compare.
- ✅ 平衡 or ❌ 不平衡（显示数量差）

## 3. Navbar 同步检查
Compare the `<ul class="nav-menu">` block between navbar.html and the `insertNavbarHTML` function in script.js — they must be identical.
Extract the nav-menu HTML from both files and diff them.
- ✅ 同步 or ❌ 不同步（显示差异）

## 4. Sun icon 同步检查
The sun icon HTML inside `.sun-scene` must be identical between navbar.html and the `insertNavbarHTML` fallback in script.js.
- ✅ 同步 or ❌ 不同步

## 5. 需要上传的文件清单
Always list these core files that must be uploaded to jiaqigu.com hosting after any changes:
- index.html
- about.html
- navbar.html
- styles.css
- script.js

Then check if any project HTML files (project-1.html through project-4.html) were mentioned or modified in this session and flag those too.

## 输出格式
用简洁的列表展示每项结果，最后给出一句总结：是否可以上传。
如果有任何 ❌，先修复再上传。
