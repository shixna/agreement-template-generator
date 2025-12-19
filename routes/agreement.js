const express = require('express')
const router = express.Router()
const Agreement = require('../server/agreement')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

// 使用 /tmp 目录（Netlify Functions 环境）或 ./temp（本地开发）
// 检测 Netlify 环境：检查多个环境变量和路径
const isNetlify = !!(
  process.env.AWS_LAMBDA_FUNCTION_NAME || 
  process.env.NETLIFY || 
  process.env.NETLIFY_DEV ||
  process.env.NETLIFY_FUNCTION_NAME ||
  // 检查是否在 Lambda 环境中（Netlify Functions 基于 Lambda）
  (process.env.LAMBDA_TASK_ROOT && process.env.LAMBDA_RUNTIME_DIR)
)
const tempDir = isNetlify ? '/tmp' : './temp'

// 确保临时目录存在（仅在非 Netlify 环境中创建本地 temp 目录）
if (!isNetlify && !fs.existsSync('./temp')) {
    try {
        fs.mkdirSync('./temp', { recursive: true })
    } catch (err) {
        console.error('创建临时目录失败:', err)
    }
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
