# 简单留言板系统

一个基于 Next.js 和 Supabase 的简单留言板系统，支持管理员内容管理和用户展示。

## 功能特性

- 📝 **用户页面**：展示管理员设置的标题和消息内容
- 🔄 **一键刷新**：实时获取最新内容
- 📋 **一键复制**：快速复制消息内容
- 🔐 **管理员后台**：安全的登录和内容管理
- 📱 **响应式设计**：完美适配移动端和桌面端
- 🌐 **微信分享优化**：支持微信链接预览

## 技术栈

- **前端**: Next.js 15 + React 19 + TypeScript
- **样式**: Tailwind CSS
- **数据库**: Supabase
- **部署**: Vercel

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd edit_board
```

### 2. 安装依赖

```bash
yarn install
```

### 3. 配置环境变量

在项目根目录创建 .env.local 文件：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# 管理员登录凭据
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
```

### 4. 配置 Supabase 数据库

在 Supabase 中创建以下表：

```sql
CREATE TABLE message_board (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. 运行项目

```bash
yarn dev
```

访问 http://localhost:3000 查看用户页面
访问 http://localhost:3000/admin 进入管理员后台

## 部署到 Vercel

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. 配置环境变量（与本地相同）
4. 部署完成

## 页面说明

### 用户页面 (/)
- 显示管理员设置的标题和消息
- 提供刷新和复制功能
- 支持微信分享预览

### 管理员页面 (/admin)
- 管理员登录界面
- 内容编辑和更新功能
- 简单的会话管理

## 环境变量说明

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | 是 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | 是 |
| `ADMIN_USERNAME` | 管理员用户名 | 是 |
| `ADMIN_PASSWORD` | 管理员密码 | 是 |

## 安全说明

- 管理员密码建议使用强密码
- 生产环境中应该使用更安全的认证方式（如 JWT）
- 建议定期更换管理员密码

## 许可证

MIT License
