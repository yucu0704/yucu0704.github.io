# 我的博客

一个基于Hexo的个人技术博客，记录生活，分享技术。

## 📝 项目简介

这是我的个人技术博客，使用Hexo静态博客框架搭建，主题为Next。博客主要分享编程经验、技术教程和生活感悟。

## 🚀 技术栈

- **框架**: [Hexo](https://hexo.io/) (v8.1.1)
- **主题**: [Hexo Theme Next](https://theme-next.js.org/) (v8.26.0)
- **部署**: GitHub Pages
- **语言**: 简体中文

## ✨ 功能特性

- 📱 响应式设计，支持移动端浏览
- 🔍 内置搜索功能
- 📂 文章分类和标签系统
- 📄 RSS订阅支持
- 🗺️ 站点地图生成
- 💬 评论系统支持
- 🌙 支持暗色模式

## 📦 安装与运行

### 环境要求

- Node.js (建议 v14 或更高版本)
- Git

### 本地运行

1. 克隆项目
```bash
git clone https://github.com/yucu666/yucu666.github.io.git
cd yucu666.github.io
```

2. 安装依赖
```bash
npm install
```

3. 启动本地服务器
```bash
npm run server
```

4. 访问博客
打开浏览器访问 `http://localhost:4000`

### 常用命令

```bash
# 新建文章
hexo new "文章标题"

# 清理缓存
npm run clean

# 生成静态文件
npm run build

# 部署到GitHub Pages
npm run deploy
```

## 📁 项目结构

```
MyBlog/
├── _config.yml          # Hexo主配置文件
├── _config.next.yml     # Next主题配置文件
├── source/              # 源文件目录
│   ├── _posts/         # 文章目录
│   ├── about/          # 关于页面
│   ├── categories/     # 分类页面
│   └── tags/           # 标签页面
├── themes/             # 主题目录
├── public/             # 生成的静态文件
└── scaffolds/          # 文章模板
```

## 📝 文章编写

### 新建文章

```bash
hexo new "文章标题"
```

### 文章格式

文章采用Markdown格式，头部包含元信息：

```markdown
---
title: 文章标题
date: 2026-03-02 12:00:00
categories: 分类名称
tags: [标签1, 标签2]
---

文章内容...
```

## 🌐 部署

本项目使用GitHub Pages进行部署，配置信息在`_config.yml`中：

```yaml
deploy:
  type: git
  repository: git@github.com:yucu666/yucu666.github.io.git
  branch: main
```

## 📊 统计信息

- 文章数量: 2篇
- 分类数量: 1个
- 标签数量: 3个

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个博客项目。

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Hexo官方文档](https://hexo.io/docs/)
- [Next主题文档](https://theme-next.js.org/)
- [在线博客](https://yucu666.github.io)

---

**作者**: yucu  
**邮箱**: [your-email@example.com]  
**GitHub**: [@yucu666](https://github.com/yucu666)