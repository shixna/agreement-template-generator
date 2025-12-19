const express = require('express')
const routes = require('./routes')
const app = express()
const path = require('path')
require('./helpers/promiseSafe')

app.use('/agreement', routes.agreement)
app.use('/view', routes.view)

// 添加根路径重定向到 /view
app.get('/', (req, res) => {
  res.redirect('/view');
});

app.set('views', './views')
app.set('view engine','ejs')
app.use("/static/",express.static(path.join(__dirname, 'public')))

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${3000}`)
})