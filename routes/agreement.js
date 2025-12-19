const express = require('express')
const router = express.Router()
const Agreement = require('../server/agreement')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const os = require('os')

// 使用 /tmp 目录（Netlify Functions 环境）或 ./temp（本地开发）
// 检测 Netlify 环境：检查 AWS_LAMBDA_FUNCTION_NAME 或 NETLIFY 环境变量
const isNetlify = process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY || process.env.NETLIFY_DEV
const tempDir = isNetlify ? '/tmp' : './temp'

// 确保临时目录存在
if (!process.env.NETLIFY && !fs.existsSync('./temp')) {
    fs.mkdirSync('./temp', { recursive: true })
}

const storage = multer.diskStorage({
    destination: tempDir,
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const uploader = multer({ storage: storage })

const agreementServer = new Agreement()

router.post('/upload', async (req, res) => {
    return uploader.single('agreement')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            res.send({ msg: err })
            return
        } else if (err) {
            res.send({ msg: err })
            return
        }
        const file = await agreementServer.upload(req.file)
        if (file && file.msg) {
            res.send({ msg: err })
            return
        }
        res.sendFile(file.filePath, {
            headers: {
                "Content-disposition": `attachment; filename=${encodeURIComponent(file.fileName)}`
            }
        }, () => {
            // 清理临时文件
            try {
                if (fs.existsSync(file.filePath)) {
                    fs.unlinkSync(file.filePath)
                }
                const uploadedFilePath = path.join(tempDir, req.file.filename)
                if (fs.existsSync(uploadedFilePath)) {
                    fs.unlinkSync(uploadedFilePath)
                }
            } catch (cleanupErr) {
                console.error('清理临时文件时出错:', cleanupErr)
            }
        })
    })
})


module.exports = router
