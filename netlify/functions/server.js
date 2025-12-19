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
app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'ejs');

// 配置静态文件
app.use("/static/", express.static(path.join(__dirname, '../../public')));

// 导出 serverless 包装的 Express 应用
module.exports.handler = serverless(app);

