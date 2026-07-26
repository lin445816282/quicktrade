/**
 * AI 语音解析结果 — API 24 适配
 */
import { TransactionType } from './Transaction'

export class AIParseResult {
  type: TransactionType = TransactionType.EXPENSE
  amount: number = 0
  category: string = '其他'
  note: string = ''
  raw_text: string = ''
  confidence: number = 0

  get isHighConfidence(): boolean {
    return this.confidence >= 0.8
  }

  get isLowConfidence(): boolean {
    return this.confidence < 0.6
  }

  static create(type: TransactionType, amount: number, category: string, note: string, rawText: string, confidence: number): AIParseResult {
    const r = new AIParseResult()
    r.type = type
    r.amount = amount
    r.category = category
    r.note = note
    r.raw_text = rawText
    r.confidence = confidence
    return r
  }
}
