/**
 * CSV 导出服务
 *
 * 三层分享策略：
 *   ① 首选：ShareKit 系统分享面板（微信/WPS）
 *   ② 兜底：粘贴板复制，ShareKit 失败时自动降级
 *   ③ 保留：文件列表在设置页，可重分享/删除/一键清空
 */
import { DatabaseService } from './DatabaseService'
import { Transaction } from '../model/Transaction'
import fs from '@ohos.file.fs'
import { common } from '@kit.AbilityKit'
import { pasteboard } from '@kit.BasicServicesKit'
import { systemShare } from '@kit.ShareKit'
import { fileUri } from '@kit.CoreFileKit'
import { BusinessError } from '@kit.BasicServicesKit'
import util from '@ohos.util'

export class ExportService {
  /** 导出全部交易为 CSV，返回文件路径 */
  static async exportAll(context: common.UIAbilityContext): Promise<string> {
    const txs: Transaction[] = await DatabaseService.getAll(10000)
    return ExportService.exportTransactions(txs, 'all', context)
  }

  /** 按日期范围导出 */
  static async exportByDateRange(start: string, end: string, label: string, context: common.UIAbilityContext): Promise<string> {
    const txs: Transaction[] = await DatabaseService.getByDateRange(start, end)
    return ExportService.exportTransactions(txs, label, context)
  }

  /** ① 通过 ShareKit 弹出系统分享面板（微信/WPS 等）。成功返回 true，失败返回 false */
  static async shareFile(filePath: string, context: common.UIAbilityContext): Promise<boolean> {
    try {
      const uri: string = fileUri.getUriFromPath(filePath)
      const data: systemShare.SharedData = new systemShare.SharedData({
        utd: 'general.comma-separated-values',
        uri: uri
      })
      const controller: systemShare.ShareController = new systemShare.ShareController(data)
      await controller.show(context, {})
      // 用户完成分享后 resolve → 返回 true
      return true
    } catch (err) {
      const e = err as BusinessError
      console.error('ShareKit failed:', e.code, e.message)
      return false
    }
  }

  /** ② 兜底：复制 CSV 内容到剪贴板 */
  static async copyToClipboard(filePath: string): Promise<void> {
    const f = fs.openSync(filePath, fs.OpenMode.READ_ONLY)
    const fileSize: number = fs.statSync(filePath).size
    const buf = new ArrayBuffer(fileSize)
    fs.readSync(f.fd, buf)
    fs.closeSync(f)
    const decoder = util.TextDecoder.create('utf-8')
    const text: string = decoder.decodeWithStream(new Uint8Array(buf))
    const data = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text)
    pasteboard.getSystemPasteboard().setData(data)
  }

  /** 列出导出目录下所有文件（按时间倒序） */
  static listFiles(context: common.UIAbilityContext): string[] {
    const dir: string = context.filesDir + '/export'
    try {
      const names: string[] = fs.listFileSync(dir)
      names.sort((a: string, b: string) => b.localeCompare(a))
      return names.map((n: string) => `${dir}/${n}`)
    } catch (_e) {
      return []
    }
  }

  /** 删除导出文件 */
  static deleteFile(filePath: string): void {
    try { fs.unlinkSync(filePath) }
    catch (_e) {}
  }

  /** 核心导出逻辑 */
  private static async exportTransactions(txs: Transaction[], label: string, context: common.UIAbilityContext): Promise<string> {
    let csv: string = '\uFEFF'  // BOM 兼容 Excel 中文
    csv += '日期,类型,金额,品类,备注\n'

    for (const tx of txs) {
      const date: string = tx.created_at ? tx.created_at.slice(0, 10) : ''
      const type: string = tx.isIncome ? '收入' : '支出'
      const note: string = tx.note ? tx.note.replace(/,/g, '，').replace(/\n/g, ' ') : ''
      csv += `${date},${type},${tx.amount.toFixed(2)},${tx.category},${note}\n`
    }

    const now: Date = new Date()
    const ts: string = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`
    const fileName: string = `快记交易_${label}_${ts}.csv`

    const dir: string = context.filesDir + '/export'
    try { fs.mkdirSync(dir, true) } catch (_e) {}
    const filePath: string = `${dir}/${fileName}`

    const file: fs.File = fs.openSync(filePath, fs.OpenMode.CREATE | fs.OpenMode.WRITE_ONLY | fs.OpenMode.TRUNC)
    fs.writeSync(file.fd, csv)
    fs.closeSync(file)

    return filePath
  }
}
