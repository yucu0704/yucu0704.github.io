---
title: 给 Hexo 博客添加 Google Analytics 统计访问量
date: 2026-05-23 16:00:00
tags: [Hexo, Google Analytics, 博客, 统计分析, 教程]
categories: [技术教程]
---

## 为什么要加统计？

写了文章发到网上，总想知道有没有人在看——哪篇最受欢迎、读者从哪来、用什么设备。Google Analytics（GA）免费、强大，几行代码就能给博客装上。

## 第一步：注册 Google Analytics

1. 打开 https://analytics.google.com
2. 用 Google 账号登录（没有的话去 mail.google.com 注册一个）
3. 点击「创建账号」→「创建媒体资源」

```
账号名称：我的博客
媒体资源名称：暖墨小栈
时区：中国 (GMT+08:00)
货币：人民币 (CNY)
```

4. 选择「网站」平台
5. 填写网址 `https://你的域名.github.io`
6. 创建后会得到一个 **Measurement ID**，格式 `G-XXXXXXXXXX`

## 第二步：在 Hexo 主题中集成

以我的暖墨主题为例，在主题 `_config.yml` 中添加：

```yaml
google_analytics:
  tracking_id: G-YG72B0J9WX
```

然后在主题的 `layout/_partial/` 目录下创建 `ga.ejs`：

```ejs
<% if (theme.google_analytics && theme.google_analytics.tracking_id) { %>
<script async src="https://www.googletagmanager.com/gtag/js?id=<%= theme.google_analytics.tracking_id %>"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '<%= theme.google_analytics.tracking_id %>');
</script>
<% } %>
```

在 `head.ejs` 的 `<head>` 标签内引入：

```ejs
<%- partial('_partial/ga') %>
```

## 第三步：重新构建部署

```bash
npx hexo clean && npx hexo generate && npx hexo deploy
```

部署后用浏览器打开自己的博客，回到 GA 页面查看「实时」报告——如果看到 1 个活跃用户，说明配置成功 ✓

## GA 能看什么？

### 📊 实时报告

```
当前在线用户数
当前在浏览哪个页面
来自哪个城市
```

### 📈 生命周期报告

| 指标 | 说明 |
|------|------|
| 用户数 | 有多少独立访客 |
| 会话数 | 访问了多少次 |
| 页面浏览量 | 总共看了多少页 |
| 平均互动时长 | 每次停留多久 |
| 跳出率 | 看了一眼就走的比例 |

### 🌍 受众分析

```
国家/城市分布
设备类型（手机/电脑/平板）
浏览器和操作系统
```

### 📝 内容分析

```
哪篇文章阅读量最高
读者从哪篇文章进来
又在哪篇文章离开
```

## 进阶技巧

### 排除自己的访问

在 GA 管理 → 数据流 → 配置代码设置 → 定义内部流量，添加规则：

```
匹配类型：IP 地址
值：你家的 IP
```

这样你自己的浏览就不会污染数据了。

### 自定义事件

在文章里加按钮点击追踪：

```html
<button onclick="gtag('event', 'download', { event_category: 'resource' })">
  下载文件
</button>
```

### 目标事件追踪

可以设置「访问关于页」、「停留超过 2 分钟」等作为转化目标，衡量博客的互动质量。

## 总结

```
注册 GA → 拿 ID → 加配置 → 重新部署
```

五分钟搞定，换来的是对自己博客读者群体的清晰认知。知道读者喜欢什么，你才知道该写什么。

> 数据不说谎，它让你写出更受欢迎的内容。
