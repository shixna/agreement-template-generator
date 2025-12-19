# 项目名称：协议模板生成系统 (Agreement Template Generator)

## 项目描述
这是一个基于Express.js的后端服务，用于将Word文档（.docx）转换为Vue组件或Avalon模板。系统提供了简单的Web界面，允许用户上传协议文档并选择生成的模板类型，生成的模板文件会自动下载。

## 核心功能
1. Word文档（.docx）上传与解析
2. 协议内容提取与格式化
3. Vue组件模板生成
4. Avalon模板生成
5. 生成的模板文件自动下载

## 技术栈
- Express.js - 后端框架
- Mammoth - Word文档解析
- EJS - 模板引擎
- Vue.js - 前端界面
- Element UI - UI组件库

## 项目结构
```
├── routes/         # 路由配置
├── server/         # 核心业务逻辑
├── views/          # 前端视图
├── public/         # 静态资源
├── temp/           # 临时文件存储
└── helpers/        # 辅助工具
```