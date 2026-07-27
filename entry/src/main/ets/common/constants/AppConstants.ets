/**
 * 应用全局常量
 */
export class AppConstants {
  // DeepSeek API
  static readonly DEEPSEEK_API_KEY: string = 'sk-d2853ed81f354e52bf9d1c7d15ea4277'
  static readonly DEEPSEEK_API_URL: string = 'https://api.deepseek.com/v1/chat/completions'

  // 数据库
  static readonly DB_NAME: string = 'QuickTrade.db'
  static readonly DB_VERSION: number = 1

  // 语音
  static readonly ASR_LANGUAGE: string = 'zh-CN'
  static readonly MAX_RECORD_DURATION: number = 30000 // 最长录音 30 秒

  // UI
  static readonly PAGE_SIZE: number = 50
  static readonly AMOUNT_MAX: number = 99999999.99
}
