const serverless = require('serverless-http');
const express = require('express');
const routes = require('../../routes');
const path = require('path');
require('../../helpers/promiseSafe');

const app = express();

// 配置路由
app.use('/agreement', routes.agreement);
app.use('/view', routes.view);

// 添加根路径重定向到 /view
app.get('/', (req, res) => {
  res.redirect('/view');
});

// 配置视图引擎
// 在 Netlify Functions 环境中，included_files 会把 views 复制到函数根目录
// 使用 fs 检查文件是否存在，自动适配不同环境
const fs = require('fs');
function findViewsDir() {
  // 尝试多个可能的路径
  const possiblePaths = [
    path.join(__dirname, 'views'),           // Netlify: /var/task/views
    path.join(__dirname, '../../views'),     // 本地开发或某些打包方式
    path.join(process.cwd(), 'views'),       // 备用方案
  ];
  
  for (const viewsPath of possiblePaths) {
    if (fs.existsSync(viewsPath)) {
      return viewsPath;
    }
  }
  // 如果都找不到，返回第一个作为默认值（让 Express 报错更清晰）
  return possiblePaths[0];
}

app.set('views', findViewsDir());
app.set('view engine', 'ejs');

// 配置静态文件
function findPublicDir() {
  const possiblePaths = [
    path.join(__dirname, 'public'),          // Netlify: /var/task/public
    path.join(__dirname, '../../public'),    // 本地开发或某些打包方式
    path.join(process.cwd(), 'public'),      // 备用方案
  ];
  
  for (const publicPath of possiblePaths) {
    if (fs.existsSync(publicPath)) {
      return publicPath;
    }
  }
  return possiblePaths[0];
}

app.use("/static/", express.static(findPublicDir()));

// 导出 serverless 包装的 Express 应用
module.exports.handler = serverless(app);

