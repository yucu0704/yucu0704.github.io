---
title: 用 GitHub Actions 自动化博客构建与部署
date: 2026-05-23 14:00:00
tags: [GitHub Actions, CI/CD, Hexo, DevOps, 自动化]
categories: [技术教程]
---

## 为什么要自动化？

之前我更新博客需要手动执行两条命令：

```powershell
npx hexo generate; npx hexo deploy
```

每次写完文章都要重复这几步，偶尔还会忘记。于是我用 GitHub Actions 把这一切自动化了——**推送源码，自动构建部署**。

## 最终效果

```
git push → GitHub Actions 自动运行 → 博客自动更新
```

不需要手动 hexo generate，不需要 hexo deploy，甚至不需要打开终端。手机上改个 .md 然后 push，博客就更新了。

## 工作流设计

```
┌────────────────────────────────────┐
│         GitHub Actions CI          │
│                                    │
│  ① Checkout my-blog-source         │
│       ↓                            │
│  ② Setup Node.js 20                │
│       ↓                            │
│  ③ npm ci                          │
│       ↓                            │
│  ④ Configure SSH Key               │
│       ↓                            │
│  ⑤ hexo generate + hexo deploy     │
│       ↓                            │
│  ✅ 部署到 yucu666.github.io       │
└────────────────────────────────────┘
```

## 工作流文件

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Build & Deploy Blog

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 8 * * *'   # 每天北京时间 16:00
  workflow_dispatch:       # 支持手动触发

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Setup SSH for deploy
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.DEPLOY_KEY }}

      - name: Generate & Deploy
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          npx hexo clean
          npx hexo generate
          npx hexo deploy
```

## 三个触发条件

| 触发方式 | 说明 |
|---------|------|
| `push` | 推送 main 分支时自动运行 |
| `schedule` | 每天定时运行（cron 表达式） |
| `workflow_dispatch` | 手动在 GitHub 页面点按钮运行 |

### Cron 时间换算

`0 8 * * *` 是 UTC 时间 8:00，对应北京时间 16:00。

其他常用时间段：

```yaml
cron: '0 0 * * *'     # 每天北京时间 08:00
cron: '0 12 * * *'    # 每天北京时间 20:00
cron: '0 8 * * 1'     # 每周一北京时间 16:00
```

## SSH 密钥配置

因为 Hexo deploy 用 SSH 推送到 GitHub Pages，GitHub Actions 需要能访问目标仓库。

### 步骤

1. 查看本地已有的 SSH 私钥
2. 在 GitHub 的 `my-blog-source` 仓库 Settings → Secrets → Actions
3. 新建 `DEPLOY_KEY`，粘贴私钥内容
4. 工作流中通过 `${{ secrets.DEPLOY_KEY }}` 读取

## 完整发布流程

```
写文章 .md
   │
   ├─ git add .
   ├─ git commit -m "新文章"
   └─ git push
          │
          ▼
   GitHub Actions 自动运行
          │
          ├─ npm ci
          ├─ hexo generate
          └─ hexo deploy
                 │
                 ▼
          ✅ 博客已更新
```

一次 push，全自动完成。

## 优化建议

### 1. 缓存依赖

```yaml
- name: Cache node_modules
  uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
```

### 2. 失败通知

可以在工作流末尾添加 Telegram 或邮件通知：

```yaml
- name: Notify on failure
  if: failure()
  uses: appleboy/telegram-action@master
  with:
    to: ${{ secrets.TELEGRAM_TO }}
    token: ${{ secrets.TELEGRAM_TOKEN }}
    message: "博客部署失败，请检查！"
```

### 3. 预览链接

使用 `peaceiris/actions-gh-pages` 替代 `hexo deploy` 可以直接在 Action 日志中看到部署预览。

## 总结

GitHub Actions 让博客维护变得轻松。现在我的工作流是：

> 打开编辑器 → 写文章 → git push → 完事

不用关心构建、部署、缓存、环境——全部交给 CI。

如果你也有个人博客，强烈推荐加上这套自动化流程。一次配置，永久受益。
