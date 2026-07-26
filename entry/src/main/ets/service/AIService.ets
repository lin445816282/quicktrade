/**
 * AI 服务 — DeepSeek API 调用 — API 24 适配
 */
import http from '@ohos.net.http'
import { AppConstants } from '../common/constants/AppConstants'
import { AIParseResult } from '../model/AIParseResult'
import { TransactionType } from '../model/Transaction'

const SYSTEM_PROMPT = `你是一个记账助手。将用户的语音文本解析为交易记录 JSON。

规则：
1. 判断是收入(income)还是支出(expense)
2. 提取金额（数字）
3. 匹配品类：餐饮/交通/购物/日用品/娱乐/通讯/居住/医疗/教育/工资/投资/兼职/退款/其他
4. 提取备注（去掉金额和品类后的内容）
5. confidence 表示你对解析结果的置信度(0-1)

返回严格 JSON 格式，不要额外文字：
{"type":"expense","amount":35.5,"category":"餐饮","note":"午餐","confidence":0.95}

示例输入 → 输出：
"买了杯奶茶18块" → {"type":"expense","amount":18,"category":"餐饮","note":"奶茶","confidence":0.95}
"收到工资8000" → {"type":"income","amount":8000,"category":"工资","note":"","confidence":0.98}
"打车去公司花了25" → {"type":"expense","amount":25,"category":"交通","note":"去公司","confidence":0.95}
"今天吃饭" → {"type":"expense","amount":0,"category":"餐饮","note":"","confidence":0.3}`

export class AIService {
  static async parse(text: string): Promise<AIParseResult> {
    if (!text || text.trim().length === 0) {
      return AIParseResult.create(TransactionType.EXPENSE, 0, '其他', '', text, 0)
    }

    const httpRequest = http.createHttp()
    try {
      const response = await httpRequest.request(
        AppConstants.DEEPSEEK_API_URL,
        {
          method: http.RequestMethod.POST,
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AppConstants.DEEPSEEK_API_KEY}`
          },
          extraData: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT } as Record<string, Object>,
              { role: 'user', content: text } as Record<string, Object>
            ],
            temperature: 0.1,
            max_tokens: 200,
            response_format: { type: 'json_object' } as Record<string, Object>
          }),
          connectTimeout: 10000,
          readTimeout: 15000
        }
      )

      const data = JSON.parse(response.result as string)
      const content = data.choices?.[0]?.message?.content

      if (!content) {
        return AIService.fallbackResult(text)
      }

      const parsed = JSON.parse(content)
      return AIParseResult.create(
        parsed.type === 'income' ? TransactionType.INCOME : TransactionType.EXPENSE,
        typeof parsed.amount === 'number' ? parsed.amount : 0,
        parsed.category || '其他',
        parsed.note || '',
        text,
        typeof parsed.confidence === 'number' ? parsed.confidence : 0.5
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
