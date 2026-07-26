/**
 * 日期工具函数 — API 24 适配
 */

interface DateRange { start: string; end: string }

export class DateUtils {
  static formatGroupLabel(isoString: string): string {
    const date = new Date(isoString)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const diff = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

    if (diff === 0) return '今天'
    if (diff === 1) return '昨天'
    if (diff === 2) return '前天'
    if (diff < 7) return `${diff}天前`
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  static formatTime(isoString: string): string {
    const date = new Date(isoString)
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  static getTodayRange(): DateRange {
    const today = new Date().toISOString().split('T')[0]
    const result: DateRange = { start: `${today}T00:00:00.000Z`, end: `${today}T23:59:59.999Z` }
    return result
  }

  static getMonthRange(): DateRange {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    const result: DateRange = { start: start.toISOString(), end: end.toISOString() }
    return result
  }
}
