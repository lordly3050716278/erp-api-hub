import { Router } from 'express'
import ExcelJS from 'exceljs'
import fs from 'fs'
import { broadcastFeiShuMessage } from '@/utils/feishu'

const router = Router()

router.post('/exportInTransitComprehensiveCost', async (req, resp) => {
    const { valid: { fileName, excelData, userId } } = req.paramsInclude('fileName', 'excelData', 'userId')
    try {
        if (!fs.existsSync(process.env.EXCEL_PATH)) {
            fs.mkdirSync(process.env.EXCEL_PATH)
        }

        broadcastFeiShuMessage(`你的在途成本数据导出任务已经开始，请注意后续消息提醒`, [userId]);

        (async () => {
            const workbook = new ExcelJS.Workbook()
            const worksheet = workbook.addWorksheet('Report')

            worksheet.mergeCells('A1:A3')
            worksheet.getCell('A1').value = '货品编码sku'

            worksheet.mergeCells('B1:B3')
            worksheet.getCell('B1').value = '货品名称'

            worksheet.mergeCells('C1:C3')
            worksheet.getCell('C1').value = '在途仓'

            worksheet.mergeCells('D1:D3')
            worksheet.getCell('D1').value = '一级分类'

            worksheet.mergeCells('E1:E3')
            worksheet.getCell('E1').value = '二级分类'

            worksheet.mergeCells('F1:J1')
            worksheet.getCell('F1').value = '期初'
            worksheet.mergeCells('F2:F3')
            worksheet.getCell('F2').value = '数量'
            worksheet.mergeCells('G2:G3')
            worksheet.getCell('G2').value = '单价'
            worksheet.mergeCells('H2:J2')
            worksheet.getCell('H2').value = '金额'
            worksheet.getCell('H3').value = '采购价'
            worksheet.getCell('I3').value = '头程'
            worksheet.getCell('J3').value = '关税'

            worksheet.mergeCells('K1:O1')
            worksheet.getCell('K1').value = '本期入库'
            worksheet.mergeCells('K2:K3')
            worksheet.getCell('K2').value = '数量'
            worksheet.mergeCells('L2:L3')
            worksheet.getCell('L2').value = '单价'
            worksheet.mergeCells('M2:O2')
            worksheet.getCell('M2').value = '金额'
            worksheet.getCell('M3').value = '采购价'
            worksheet.getCell('N3').value = '头程'
            worksheet.getCell('O3').value = '关税'

            worksheet.mergeCells('P1:T1')
            worksheet.getCell('P1').value = '本期出库'
            worksheet.mergeCells('P2:P3')
            worksheet.getCell('P2').value = '数量'
            worksheet.mergeCells('Q2:Q3')
            worksheet.getCell('Q2').value = '单价'
            worksheet.mergeCells('R2:T2')
            worksheet.getCell('R2').value = '金额'
            worksheet.getCell('R3').value = '采购价'
            worksheet.getCell('S3').value = '头程'
            worksheet.getCell('T3').value = '关税'

            worksheet.mergeCells('U1:Y1')
            worksheet.getCell('U1').value = '期末'
            worksheet.mergeCells('U2:U3')
            worksheet.getCell('U2').value = '数量'
            worksheet.mergeCells('V2:V3')
            worksheet.getCell('V2').value = '单价'
            worksheet.mergeCells('W2:Y2')
            worksheet.getCell('W2').value = '金额'
            worksheet.getCell('W3').value = '采购价'
            worksheet.getCell('X3').value = '头程'
            worksheet.getCell('Y3').value = '关税'

            worksheet.mergeCells('Z1:Z3')
            worksheet.getCell('Z1').value = '月份'

            excelData.forEach((row: any) => worksheet.addRow(row))

            const file = `${process.env.EXCEL_PATH}/${fileName}.xlsx`
            if (fs.existsSync(file)) {
                fs.unlinkSync(file)
            }
            await workbook.xlsx.writeFile(file)
        })()

        broadcastFeiShuMessage(`你的在途成本数据导出任务已经完成，下载链接 -> ${process.env.EXCEL_URL}/${fileName}.xlsx`, [userId])

        resp.success('任务已开始，请稍后查看飞书消息')
    } catch (error) {
        broadcastFeiShuMessage(`你的在途成本数据导出任务失败`, [userId])
        throw error
    }

})

export default router