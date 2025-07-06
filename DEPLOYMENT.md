# 部署指南

## 部署到 Vercel

### 步骤 1: 准备项目

1. 确保所有代码已提交到 Git 仓库
2. 项目已成功构建：`yarn build`

### 步骤 2: 创建 Vercel 项目

1. 登录 [Vercel 控制台](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 Git 仓库
4. 选择 "Next.js" 框架
5. 点击 "Deploy"

### 步骤 3: 配置 Vercel Postgres 数据库

1. 在项目控制台中，进入 "Storage" 标签
2. 点击 "Create Database"
3. 选择 "Postgres"
4. 创建数据库后，复制所有连接信息

### 步骤 4: 设置环境变量

在项目设置的 "Environment Variables" 中添加：

#### 数据库配置
- `POSTGRES_URL`: 从 Vercel Postgres 获取
- `POSTGRES_PRISMA_URL`: 从 Vercel Postgres 获取
- `POSTGRES_URL_NON_POOLING`: 从 Vercel Postgres 获取
- `POSTGRES_USER`: 从 Vercel Postgres 获取
- `POSTGRES_HOST`: 从 Vercel Postgres 获取
- `POSTGRES_PASSWORD`: 从 Vercel Postgres 获取
- `POSTGRES_DATABASE`: 从 Vercel Postgres 获取

#### 管理员配置
- `ADMIN_USERNAME`: 设置管理员用户名（如：admin）
- `ADMIN_PASSWORD`: 设置强密码（建议使用密码生成器）

#### JWT 配置
- `JWT_SECRET`: 生成一个随机密钥（建议64位随机字符串）

### 步骤 5: 重新部署

1. 设置完环境变量后，触发重新部署
2. 等待部署完成

### 步骤 6: 初始化数据库

1. 部署完成后，访问：`https://your-domain.vercel.app/api/init`
2. 应该看到 `{"message":"数据库初始化成功"}` 的响应

### 步骤 7: 测试功能

1. 访问主页：`https://your-domain.vercel.app`
2. 访问管理后台：`https://your-domain.vercel.app/admin`
3. 使用设置的管理员账号登录
4. 测试编辑和保存功能

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查所有 Postgres 环境变量是否正确设置
   - 确保 Vercel Postgres 数据库已创建并运行

2. **管理员登录失败**
   - 检查 `ADMIN_USERNAME` 和 `ADMIN_PASSWORD` 环境变量
   - 确保密码没有特殊字符导致的转义问题

3. **JWT 错误**
   - 检查 `JWT_SECRET` 是否设置
   - 确保密钥足够长（建议至少32字符）

4. **API 超时**
   - 检查 `vercel.json` 中的 `maxDuration` 设置
   - 确保数据库查询效率

### 查看日志

1. 在 Vercel 控制台的 "Functions" 标签中查看 API 调用日志
2. 检查是否有错误信息

## 安全建议

1. **强密码**: 使用复杂的管理员密码
2. **定期更换**: 定期更换密码和 JWT 密钥
3. **HTTPS**: Vercel 自动提供 HTTPS，确保不要禁用
4. **监控**: 定期检查访问日志，发现异常访问

## 自定义域名

1. 在 Vercel 项目设置中的 "Domains" 标签
2. 添加你的自定义域名
3. 按照指示配置 DNS 记录

## 备份

1. 定期备份 Vercel Postgres 数据库
2. 保存环境变量配置的副本
3. 确保代码仓库有完整的提交历史 