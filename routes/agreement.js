const express = require('express')
const router = express.Router()
const Agreement = require('../server/agreement')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const storage = multer.diskStorage({
    destination:'./temp',
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const uploader = multer({ storage: storage })

const agreementServer = new Agreement()

router.post('/upload', async (req, res) => {
    return uploader.single('agreement')(req, res, async (err) => {
        const { type } = req.body;
        if (err instanceof multer.MulterError) {
            // 发生错误
            console.log(err)
            res.send({ msg: err })
            return
        } else if (err) {
            res.send({ msg: err })
            return
        }
        const file = await agreementServer.upload(req.file, type || 'vue')
        if (file && file.msg) {
            res.send({ msg: err })
            return
        }
        res.sendFile(file.filePath, {
            headers: {
                "Content-disposition": `attachment; filename=${encodeURIComponent(file.fileName)}`
            }
        }, () => {
            fs.unlinkSync(file.filePath)
            fs.unlinkSync(path.resolve(__dirname, `../temp/${req.file.filename}`))
        })
    })
})


module.exports = router
