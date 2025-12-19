const path = require('path')
const mammoth = require("mammoth");
const pretty = require('pretty');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const fs = require('fs');
const tempGenerator = require('./template')

// 使用 /tmp 目录（Netlify Functions 环境）或 ./temp（本地开发）
// 检测 Netlify 环境：检查 AWS_LAMBDA_FUNCTION_NAME 或 NETLIFY 环境变量
const isNetlify = process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY || process.env.NETLIFY_DEV
const tempDir = isNetlify ? '/tmp' : path.resolve(__dirname, '../temp')

const parse = (raw) => {
    const doc = new dom().parseFromString(raw)
    const begin = xpath.select("//*[text()[contains(.,'#begin#')]]/ancestor-or-self:: p", doc)
    const end = xpath.select("//*[text()[contains(.,'#end#')]]/ancestor-or-self:: p", doc)
    const className = 'p-list'
    if (begin.length > 0 && end.length > 0) {
        raw = raw
            .replace(begin[0].toString(), `<br/><div class="${className}">`)
            .replace(end[0].toString(), '<br/></div>')
    }
    return raw
}


class Agreement {
    constructor() {}

    async upload(file){
        const options = {
            styleMap: [
                "b => b"
            ]
        };
        let template
        try{
            const inputFilePath = path.join(tempDir, file.filename)
            const result = await mammoth.convertToHtml({path: inputFilePath}, options)
            let raw = parse(result.value)
                .replace(/\t/g, '&nbsp;')
                .replace(/(\n|\r|\r\n)/g,'')
            raw = raw.replace(/\{\{(?!agreement\.).*\}\}/, '')
            template = pretty(tempGenerator(raw))
            if (!template) return ''
            const nameArr = file.filename.split('.')
            nameArr.pop()
            const fileName = nameArr.join('')
            const filePath = path.join(tempDir, `${fileName}.${Date.parse(new Date())}.vue`)
            fs.writeFileSync(filePath, template)
            return {
                fileName,
                filePath
            }
        } catch(err) {
            return {
                msg: err
            }
        }
    }
}

module.exports = Agreement