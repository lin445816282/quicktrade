/**
 * CSV 导出服务 — Phase 2
 * 将交易记录导出为 CSV 文件，保存到应用文档目录
 */
import { DatabaseService } from './DatabaseService'
import { Transaction } from '../model/Transaction'
import fs from '@ohos.file.fs'

export class ExportService {
  /** 导出全部交易为 CSV，返回文件路径 */
  static async exportAll(context: Context): Promise<string> {
    const txs = await DatabaseService.getAll(10000)
    return ExportService.exportTransactions(txs, 'all', context)
  }

  /** 按日期范围导出 */
  static async exportByDateRange(start: string, end: string, label: string, context: Context): Promise<string> {
    const txs = await DatabaseService.getByDateRange(start, end)
    return ExportService.exportTransactions(txs, label, context)
  }

  /** 核心导出逻辑 */
  private static async exportTransactions(txs: Transaction[], label: string, context: Context): Promise<string> {
    // CSV BOM（兼容 Excel 中文）
    let csv = '\uFEFF'
    csv += '日期,类型,金额,品类,备注\n'

    for (const tx of txs) {
      const date = tx.created_at ? tx.created_at.slice(0, 10) : ''
      const type = tx.isIncome ? '收入' : '支出'
      // 金额不加引号，Excel 能正确识别
      const note = tx.note ? tx.note.replace(/,/g, '，').replace(/\n/g, ' ') : ''
      csv += `${date},${type},${tx.amount.toFixed(2)},${tx.category},${note}\n`
    }

    // 保存文件
    const dir = context.filesDir
    const now = new Date()
    const ts = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`
    const fileName = `快记交易_${label}_${ts}.csv`
    const filePath = `${dir}/${fileName}`

    // 确保目录存在
    try { fs.mkdirSync(dir, true) } catch (_) {}

    const file = fs.openSync(filePath, fs.OpenMode.CREATE | fs.OpenMode.WRITE_ONLY | fs.OpenMode.TRUNC)
    fs.writeSync(file.fd, csv)
    fs.closeSync(file)

    return filePath
  }
}
