/**
 * AI 服务 — DeepSeek API 调用 — API 24 适配
 */
import http from '@ohos.net.http'
import { AppConstants } from '../common/constants/AppConstants'
import { AIParseResult } from '../model/AIParseResult'
import { TransactionType } from '../model/Transaction'

interface ChatMessage {
  role: string
  content: string
}

interface ChatRequest {
  model: string
  messages: ChatMessage[]
  temperature: number
  max_tokens: number
  response_format: Record<string, string>
}

interface ChoiceMessage {
  content: string
}

interface Choice {
  message: ChoiceMessage
}

interface ChatResponse {
  choices: Choice[]
}

interface ParsedResult {
  type: string
  amount: number
  category: string
  note: string
  confidence: number
}

const SYSTEM_PROMPT = `你是一个记账助手。将用户的语音文本解析为交易记录 JSON。

规则：
1. 判断是收入(income)还是支出(expense)
2. 提取金额（数字）
3. 匹配品类：餐饮/交通/购物/日用品/娱乐/通讯/居住/医疗/教育/工资/投资/兼职/退款/其他
4. 提取备注（去掉金额和品类后的内容）
5. confidence 表示你对解析结果的置信度(0-1)

返回严格 JSON 格式：
{"type":"expense","amount":35.5,"category":"餐饮","note":"午餐","confidence":0.95}`

export class AIService {
  static async parse(text: string): Promise<AIParseResult> {
    if (!text || text.trim().length === 0) {
      return AIParseResult.create(TransactionType.EXPENSE, 0, '其他', '', text, 0)
    }

    const httpRequest = http.createHttp()
    try {
      const sysMsg: ChatMessage = { role: 'system', content: SYSTEM_PROMPT }
      const userMsg: ChatMessage = { role: 'user', content: text }
      const fmt: Record<string, string> = { 'type': 'json_object' }
      const reqBody: ChatRequest = {
        model: 'deepseek-chat',
        messages: [sysMsg, userMsg],
        temperature: 0.1,
        max_tokens: 200,
        response_format: fmt
      }

      const response = await httpRequest.request(
        AppConstants.DEEPSEEK_API_URL,
        {
          method: http.RequestMethod.POST,
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AppConstants.DEEPSEEK_API_KEY}`
          },
          extraData: JSON.stringify(reqBody) as string,
          connectTimeout: 10000,
          readTimeout: 15000
        }
      )

      const rawData: string = response.result as string
      const data: ChatResponse = JSON.parse(rawData) as ChatResponse
      const content: string = data.choices[0]?.message?.content || ''

      if (!content) {
        return AIService.fallbackResult(text)
      }

      const parsed: ParsedResult = JSON.parse(content) as ParsedResult
      return AIParseResult.create(
        parsed.type === 'income' ? TransactionType.INCOME : TransactionType.EXPENSE,
        parsed.amount,
        parsed.category || '其他',
        parsed.note || '',
        text,
        parsed.confidence || 0.5
      )
    } catch (err) {
      console.error(`[AIService] API failed: ${JSON.stringify(err)}`)
      return AIService.fallbackResult(text)
    } finally {
      httpRequest.destroy()
    }
  }

  private static fallbackResult(text: string): AIParseResult {
    return AIParseResult.create(TransactionType.EXPENSE, 0, '其他', text, text, 0)
  }
}
