# Netlify 部署指南

本指南将帮助您将这个项目部署到 Netlify。

## 前置要求

1. GitHub 账户
2. Netlify 账户（可在 [netlify.com](https://www.netlify.com) 免费注册）
3. 项目已推送到 GitHub 仓库

## 部署步骤

### 方法一：通过 Netlify 网站部署（推荐）

1. **登录 Netlify**
   - 访问 [app.netlify.com](https://app.netlify.com)
   - 使用 GitHub 账户登录

2. **创建新站点**
   - 点击 "Add new site" → "Import an existing project"
   - 选择 "Deploy with GitHub"
   - 授权 Netlify 访问您的 GitHub 仓库

3. **配置部署设置**
   - 选择您的仓库：`agreement-template-generator`
   - 分支：`main` 或 `master`（根据您的默认分支）
   - 构建命令：留空（项目已配置在 `netlify.toml` 中）
   - 发布目录：`public`（已配置在 `netlify.toml` 中）

4. **环境变量（可选）**
   - 在 "Site settings" → "Environment variables" 中可以添加环境变量
   - 如果需要，可以设置 `NETLIFY=true`（但代码会自动检测）

5. **部署**
   - 点击 "Deploy site"
   - 等待部署完成

### 方法二：使用 Netlify CLI

1. **安装 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **登录 Netlify**
   ```bash
   netlify login
   ```

3. **初始化项目**
   ```bash
   netlify init
   ```
   - 选择 "Create & configure a new site"
   - 输入站点名称（或使用默认）
   - 选择团队（如果有）

4. **部署**
   ```bash
   netlify deploy --prod
   ```

## 项目配置说明

### netlify.toml
- 配置了 Netlify Functions 目录：`netlify/functions`
- 配置了重定向规则，将所有请求转发到 serverless function
- 静态文件从 `public` 目录提供

### Netlify Function
- 位置：`netlify/functions/server.js`
- 使用 `serverless-http` 包装 Express 应用
- 自动处理所有路由

### 文件路径适配
- 代码已自动检测 Netlify 环境
- 在 Netlify 中使用 `/tmp` 目录存储临时文件
- 在本地开发中使用 `./temp` 目录

## 验证部署

部署完成后，您将获得一个 Netlify 提供的 URL（例如：`https://your-site-name.netlify.app`）。

访问该 URL，应该能看到应用正常运行。

## 常见问题

### 1. 文件上传失败
- 确保 Netlify Function 有足够的执行时间（默认 10 秒，可在 `netlify.toml` 中配置）
- 检查文件大小限制（Netlify 默认限制为 6MB）

### 2. 临时文件问题
- Netlify Functions 使用 `/tmp` 目录，有 512MB 空间限制
- 文件在处理后会自动清理

### 3. 路由问题
- 所有路由都通过 `netlify/functions/server.js` 处理
- 如果遇到 404，检查 `netlify.toml` 中的重定向配置

## 更新部署

每次推送到 GitHub 的默认分支（main/master）时，Netlify 会自动重新部署。

您也可以手动触发部署：
- 在 Netlify 控制台点击 "Trigger deploy"
- 或使用 CLI：`netlify deploy --prod`

## 本地测试 Netlify Functions

可以使用 Netlify CLI 在本地测试：

```bash
netlify dev
```

这将启动本地开发服务器，模拟 Netlify 环境。

## 注意事项

1. **文件大小限制**：Netlify Functions 有 6MB 的请求体大小限制
2. **执行时间限制**：默认 10 秒，最大可配置为 26 秒
3. **临时存储**：`/tmp` 目录在每次函数调用后可能被清理
4. **并发限制**：免费计划有并发限制

## 相关资源

- [Netlify 文档](https://docs.netlify.com/)
- [Netlify Functions 文档](https://docs.netlify.com/functions/overview/)
- [serverless-http 文档](https://github.com/dougmoscrop/serverless-http)

