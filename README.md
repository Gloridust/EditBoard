# 留言板系统 MVP

一个极简的留言板系统，支持管理员编辑内容和用户查看，完全基于 serverless 架构。

## 功能特性

- 🎯 **极简设计**：扁平化 UI，专注核心功能
- 🔐 **管理员系统**：安全的登录认证和内容管理
- 📱 **响应式布局**：适配各种设备和屏幕尺寸
- 🔄 **实时刷新**：一键刷新获取最新内容
- 📋 **一键复制**：方便分享留言板内容
- 🌐 **社交分享**：优化的 meta 标签，支持微信等平台预览
- ☁️ **Serverless**：基于 Vercel 和 Vercel Postgres

## 页面结构

### 用户页面 (/)
- 显示管理员设置的标题和消息内容
- 刷新按钮：重新获取最新内容
- 复制按钮：一键复制全部内容
- 动态 meta 标签：支持社交媒体预览

### 管理员页面 (/admin)
- 登录界面：用户名密码验证
- 编辑界面：修改标题和消息内容
- 安全认证：基于 JWT 的身份验证

## 技术栈

- **前端**: Next.js 15 + React 19 + TypeScript
- **样式**: Tailwind CSS
- **数据库**: Vercel Postgres
- **认证**: JWT + bcryptjs
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
yarn install
```

### 2. 环境变量配置

创建 `.env.local` 文件，添加以下配置：

```env
# 数据库配置 (从 Vercel Postgres 获取)
POSTGRES_URL=your_vercel_postgres_url
POSTGRES_PRISMA_URL=your_vercel_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_vercel_postgres_non_pooling_url
POSTGRES_USER=your_postgres_user
POSTGRES_HOST=your_postgres_host
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database

# 管理员账号配置
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# JWT密钥
JWT_SECRET=your_jwt_secret_key_here
```

### 3. 初始化数据库

启动开发服务器后，访问以下 API 初始化数据库：

```bash
curl -X POST http://localhost:3000/api/init
```

### 4. 本地开发

```bash
yarn dev
```

访问 `http://localhost:3000` 查看用户页面
访问 `http://localhost:3000/admin` 进入管理员后台

## 部署到 Vercel

### 1. 创建 Vercel 项目

```bash
npx vercel
```

### 2. 配置 Vercel Postgres

1. 在 Vercel 控制台创建 Postgres 数据库
2. 将数据库连接信息添加到环境变量

### 3. 设置环境变量

在 Vercel 项目设置中添加以下环境变量：

- `ADMIN_USERNAME`: 管理员用户名
- `ADMIN_PASSWORD`: 管理员密码
- `JWT_SECRET`: JWT 签名密钥
- 以及所有 Postgres 相关的环境变量

### 4. 初始化生产数据库

部署完成后，访问 `https://your-domain.vercel.app/api/init` 初始化数据库。

## 使用说明

### 管理员操作

1. 访问 `/admin` 页面
2. 使用环境变量中设置的用户名和密码登录
3. 编辑标题和消息内容
4. 点击"更新留言板"保存更改

### 用户操作

1. 访问首页查看留言板内容
2. 点击"刷新"按钮获取最新内容
3. 点击"复制"按钮复制全部内容
4. 分享链接时，微信等平台会显示动态的预览信息

## 项目结构

```
src/
├── lib/
│   ├── db.ts          # 数据库操作
│   └── auth.ts        # 认证相关
├── pages/
│   ├── index.tsx      # 用户页面
│   ├── admin.tsx      # 管理员页面
│   └── api/
│       ├── message.ts     # 留言板内容 API
│       ├── init.ts        # 数据库初始化 API
│       └── auth/
│           └── login.ts   # 登录 API
└── styles/
    └── globals.css    # 全局样式
```

## 安全注意事项

- 请使用强密码作为管理员密码
- JWT_SECRET 应该是一个随机生成的强密钥
- 生产环境中不要使用默认的管理员账号
- 定期更换密码和密钥

## 许可证

MIT License
