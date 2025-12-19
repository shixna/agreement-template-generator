const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index', { title: '协议生成系统' });
})

module.exports = router
