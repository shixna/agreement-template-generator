const path = require('path')
const mammoth = require("mammoth");
const pretty = require('pretty');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const fs = require('fs');
const tempGenerator = require('./template')

const parse = (raw, type) => {
    const doc = new dom().parseFromString(raw)
    const begin = xpath.select("//*[text()[contains(.,'#begin#')]]/ancestor-or-self:: p", doc)
    const end = xpath.select("//*[text()[contains(.,'#end#')]]/ancestor-or-self:: p", doc)
    const className = type === 'avalon' ? 'protocol-content' : 'p-list'
    if (begin.length > 0 && end.length > 0) {
        raw = raw
            .replace(begin[0].toString(), `<br/><div class="${className}">`)
            .replace(end[0].toString(), '<br/></div>')
    }
    return raw
}
const avalonFillBack = ["storeName", "operatorName", "loanAmount", "loanPeriod", "loanRate", "mail", "repaymentDay", "cardUserName", "cardNo", "bankName", "monthRepaymentAmount", "hbAccountName", "hbAccountBank", "hbAccount", "loanEndDate", "goodsName", "orderNo", "userName", "signDate", "idNo", "mobileNo", "totalLoanAmount", "alipayFee", "alipayCharge", "otherLoanPeriod", "alipayCode", "userAddress", "departmentAddress", "agrOrgName", "principalAmount", "lprValue", "freezeAmount", "pledgeCardNo", "bonusAmount", "feeAmount", "lastPayAmount", "daylyRate", "lprYearlyRate", "lprCompare", "lprDesc", "firstRepayAmount", "provinceName", "packageAmount", "lastRepayAmount"].join('|')


class Agreement {
    constructor() {}

    async upload(file, type){
        const options = {
            styleMap: [
                "b => b"
            ]
        };
        let template
        try{
            const result = await mammoth.convertToHtml({path: path.resolve(__dirname, `../temp/${file.filename}`)}, options)
            const raw = parse(result.value, type)
                .replace(/\t/g, '&nbsp;')
                .replace(/(\n|\r|\r\n)/g,'')
            if (type === 'vue') raw.replace(/\{\{(?!agreement\.).*\}\}/, '')
            if (type === 'avalon') {
                const reg = new RegExp(`{{(\\s)*(${avalonFillBack})?(\\s)*}}`)
                raw.replace(reg, function(match, $1, $2) {
                    if ($2) {
                        return `conVar.${$2}`
                    }
                })
            }
            template = pretty(tempGenerator(raw, type))
            if (!template) return ''
            const nameArr = file.filename.split('.')
            nameArr.pop()
            const fileType = type === 'vue' ? '.vue' : '.html'
            const fileName = nameArr.join('')
            const filePath = path.resolve(__dirname, `../temp/${fileName}.${Date.parse(new Date())}${fileType}`)
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