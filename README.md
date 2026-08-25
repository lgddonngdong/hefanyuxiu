# 黄河流域（河南段）自生植物数据库

自生植物多样性调查数据库查询系统 - 参考 [appmiaoda.com](https://app-dvp8ph5jxl35.appmiaoda.com/) 制作

## 技术栈

| 组件 | 技术 | 部署平台 | 免费方案 |
|------|------|----------|----------|
| 前端 | Next.js 14 + React + Tailwind CSS | Vercel | ✅ 免费 |
| 后端 | Node.js + Express + Supabase JS | Render | ✅ 免费 |
| 数据库 | PostgreSQL (Supabase) | Supabase | ✅ 免费 |

## 功能特性

- **首页展示**：Hero区域 + 统计数据 + 功能导航 + 最近记录
- **数据浏览**：分页浏览全部植物记录，支持按科、本土/外来筛选
- **数据查询**：按中文名、拉丁学名、科、属多字段搜索
- **植物详情**：展示植物完整信息 + Wikipedia图片 + 维基百科链接
- **数据录入**：添加新的植物调查记录到数据库
- **图片获取**：植物图片从Wikipedia API实时获取并缓存

## 项目结构

```
.
├── frontend/          # Next.js 前端 (Vercel)
│   ├── src/
│   │   ├── app/               # 页面
│   │   │   ├── page.tsx        # 首页
│   │   │   ├── browse/         # 数据浏览
│   │   │   ├── search/         # 数据查询
│   │   │   ├── plant/[id]/     # 植物详情
│   │   │   └── add/           # 录入数据
│   │   ├── components/        # 组件
│   │   └── lib/api.ts          # API客户端
│   ├── package.json
│   └── vercel.json
│
├── backend/           # Express 后端 (Render)
│   ├── src/
│   │   ├── index.js           # 入口
│   │   ├── routes/
│   │   │   ├── plants.js       # 植物API路由
│   │   │   └── stats.js        # 统计API路由
│   │   ├── lib/
│   │   │   ├── supabase.js     # Supabase客户端
│   │   │   └── wikipedia.js    # Wikipedia图片获取
│   │   └── seed.js             # 数据导入脚本
│   ├── package.json
│   └── render.yaml
│
└── database/
    ├── schema.sql              # 数据库表结构
    └── seed.sql                # 种子数据SQL
```

## 部署指南

### 第1步：创建 Supabase 数据库

1. 访问 [supabase.com](https://supabase.com) 注册账号
2. 创建新项目（Free方案即可）
3. 记录以下信息：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon key**: `eyJhbGciOi...`（在 Settings > API 中找到）
4. 在 Supabase 的 SQL Editor 中执行 `database/schema.sql`
5. 在 Supabase 的 SQL Editor 中执行 `database/seed.sql`（或使用后端种子脚本）

### 第2步：部署后端到 Render

1. 访问 [render.com](https://render.com) 注册账号
2. 创建新的 Web Service（选择 "Build and deploy from a Git repository"）
3. 连接你的 GitHub 仓库（先将项目推送到 GitHub）
4. 配置：
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     SUPABASE_URL=https://xxxxx.supabase.co
     SUPABASE_ANON_KEY=eyJhbGciOi...
     CORS_ORIGIN=https://your-app.vercel.app
     ```
5. 部署后获得后端URL：`https://plant-database-api.onrender.com`
6. 运行种子脚本导入数据：
   ```
   # 在Render的Shell中执行
   node src/seed.js
   ```

### 第3步：部署前端到 Vercel

1. 访问 [vercel.com](https://vercel.com) 注册账号
2. 导入 GitHub 仓库
3. 配置：
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Environment Variables**:
     ```
     NEXT_PUBLIC_API_URL=https://plant-database-api.onrender.com
     ```
4. 部署！获得前端URL：`https://your-app.vercel.app`

### 第4步：更新后端 CORS

在后端 Render 环境变量中更新：
```
CORS_ORIGIN=https://your-app.vercel.app
```

## 本地开发

### 后端

```bash
cd backend
cp .env.example .env
# 编辑 .env 填入 Supabase 配置
npm install
npm run dev
# 后端运行在 http://localhost:3001
```

### 前端

```bash
cd frontend
cp .env.local.example .env.local
# 编辑 .env.local 填入后端URL
npm install
npm run dev
# 前端运行在 http://localhost:3000
```

### 导入种子数据

```bash
cd backend
node src/seed.js
```

## API 文档

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/stats` | 获取统计数据 |
| GET | `/api/plants?page=1&limit=20` | 分页获取植物列表 |
| GET | `/api/plants/:id` | 获取单个植物详情 |
| GET | `/api/plants/search?q=蒲公英&type=all` | 搜索植物 |
| GET | `/api/plants/recent?limit=6` | 获取最近记录 |
| GET | `/api/plants/families` | 获取所有科及统计 |
| POST | `/api/plants` | 添加新植物记录 |
| PUT | `/api/plants/:id` | 更新植物记录 |
| DELETE | `/api/plants/:id` | 删除植物记录 |

## 数据来源

- 植物数据：黄河流域（河南段）自生植物数据库（241条记录）
- 植物图片：[Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) 实时获取

## 免费方案说明

| 服务 | 免费额度 | 限制 |
|------|----------|------|
| Vercel | 100GB 带宽/月 | 个人项目免费 |
| Render | 750 小时/月 | 服务15分钟无请求会休眠 |
| Supabase | 500MB 数据库 + 1GB 存储 | 适合演示用途 |

> Render 免费方案会在15分钟无请求后休眠，首次请求需要等待约30秒唤醒。
