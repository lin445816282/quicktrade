/**
 * 语音识别服务
 * 封装 @ohos.ai.speech.SpeechRecognizer，提供长按说话→松手识别
 */
import speech from '@ohos.ai.speech'
import { AppConstants } from '../common/constants/AppConstants'

export interface VoiceResult {
  text: string        // 识别文本
  isFinal: boolean    // 是否最终结果
}

export class VoiceService {
  private recognizer: speech.SpeechRecognizer | null = null
  private resolvePromise: ((value: string) => void) | null = null
  private finalText: string = ''

  /** 开始监听（按住说话时调用） */
  async startListening(): Promise<void> {
    this.recognizer = speech.createSpeechRecognizer()
    this.finalText = ''
    this.resolvePromise = null

    // 识别参数
    const extraParams: Record<string, Object> = {
      'language': AppConstants.ASR_LANGUAGE,
      'vadBegin': 3000,   // 静音检测开始时间 ms
      'vadEnd': 800       // 静音检测结束时间 ms
    }

    // 监听识别结果
    this.recognizer.on('result', (result: speech.SpeechRecognizerResult) => {
      if (result.result) {
        this.finalText = result.result
      }
    })

    // 监听识别结束
    this.recognizer.on('end', () => {
      if (this.resolvePromise) {
        this.resolvePromise(this.finalText)
        this.resolvePromise = null
      }
    })

    // 监听错误
    this.recognizer.on('error', (err: string) => {
      console.error(`[VoiceService] ASR 错误: ${err}`)
      if (this.resolvePromise) {
        // 错误时返回已有文本或空
        this.resolvePromise(this.finalText || '')
        this.resolvePromise = null
      }
    })

    // 开始识别
    await this.recognizer.startListening({
      language: AppConstants.ASR_LANGUAGE,
      extraParams: JSON.stringify(extraParams)
    })
  }

  /** 停止监听并返回识别文本（松手时调用） */
  async stopListening(): Promise<string> {
    if (!this.recognizer) return ''

    return new Promise<string>((resolve) => {
      this.resolvePromise = resolve

      // 设置超时（最长等待 3 秒）
      setTimeout(() => {
        if (this.resolvePromise) {
          this.resolvePromise(this.finalText || '')
          this.resolvePromise = null
        }
      }, 3000)

      this.recognizer!.stopListening()
    })
  }

  /** 释放资源 */
  destroy(): void {
    if (this.recognizer) {
      this.recognizer.off('result')
      this.recognizer.off('end')
      this.recognizer.off('error')
      this.recognizer.destroy()
      this.recognizer = null
    }
  }
}
