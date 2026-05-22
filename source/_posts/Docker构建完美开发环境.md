---
title: 用 Docker 构建完美开发环境
date: 2026-05-10 16:00:00
tags: [Docker, DevOps, 开发环境, 容器化]
categories: [技术教程]
---

## 告别"在我电脑上能跑"

每个开发者都听过这句话。Docker 从根本上解决了环境一致性问题——将应用及其依赖打包到一个**容器**中，实现"构建一次，到处运行"。

## 🐳 Docker 核心概念

```
┌─────────────────────────────────────┐
│           Docker 镜像               │
│  ┌─────────────────────────────┐   │
│  │   应用代码 + 运行时 + 依赖    │   │
│  └─────────────────────────────┘   │
│              ▼ 运行                  │
│  ┌─────────────────────────────┐   │
│  │       Docker 容器            │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 📦 实战：Node.js 开发环境

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# 利用缓存层
COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
```

### Docker Compose 编排

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  pgdata:
```

## 🚀 多阶段构建优化

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段（仅保留必要文件）
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

**效果**: 最终镜像从 800MB 缩小到 120MB !

## 📋 最佳实践清单

| ✅ | 实践 | 说明 |
|----|------|------|
| ✅ | 使用 `.dockerignore` | 排除 node_modules, .git 等 |
| ✅ | 多阶段构建 | 大幅减小镜像体积 |
| ✅ | Alpine 基础镜像 | 安全 + 体积极小 (~5MB) |
| ✅ | 固定版本号 | 避免 `latest` 标签 |
| ✅ | 非 root 用户 | 提升安全性 |
| ✅ | HEALTHCHECK | 自动检测容器健康状态 |

## 🔐 安全加固

```dockerfile
# 创建非 root 用户
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

USER appuser

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
```

## 🎯 Docker + 开发工作流

```bash
# 启动完整开发环境
docker compose up -d

# 查看日志
docker compose logs -f app

# 进入容器调试
docker compose exec app sh

# 运行一次性命令
docker compose run --rm app npm test
```

## 总结

Docker 不仅仅是一个工具，它是一种**开发哲学**——环境即代码。将你的开发环境写进 Dockerfile，从此告别"环境问题"，专注于真正重要的事情：**写代码**。

> 好的开发环境应该是隐形的——它安静地工作，从不打扰你的创造。
