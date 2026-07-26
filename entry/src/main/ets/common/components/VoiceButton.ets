/**
 * 语音按钮组件
 * 按住说话 → 松手 → ASR 识别 → AI 解析 → 回调结果
 */
import { VoiceService } from '../../service/VoiceService'
import { AIService } from '../../service/AIService'
import { AIParseResult } from '../../model/AIParseResult'

/** 语音按钮状态 */
enum VoiceState {
  IDLE = 'idle',             // 待命
  LISTENING = 'listening',   // 正在听
  RECOGNIZING = 'recognizing', // 识别中
  PARSING = 'parsing'        // AI 解析中
}

@ComponentV2
export struct VoiceButton {
  @Param size: number = 80
  @Event onResult?: (result: AIParseResult) => void
  @Event onError?: (message: string) => void

  @Local state: VoiceState = VoiceState.IDLE
  @Local scaleValue: number = 1.0
  @Local pulseOpacity: number = 0

  private voiceService: VoiceService = new VoiceService()

  /** 按住开始录音 */
  private async onPressStart(): Promise<void> {
    this.state = VoiceState.LISTENING
    this.scaleValue = 1.15
    this.pulseOpacity = 0.6

    try {
      await this.voiceService.startListening()
    } catch (err) {
      console.error(`[VoiceButton] 录音启动失败: ${err}`)
      this.state = VoiceState.IDLE
      this.scaleValue = 1.0
      this.pulseOpacity = 0
      this.onError?.('麦克风权限未授权或在模拟器上')
    }
  }

  /** 松手 → 识别 + 解析 */
  private async onPressEnd(): Promise<void> {
    if (this.state !== VoiceState.LISTENING) return

    this.state = VoiceState.RECOGNIZING
    this.scaleValue = 1.0
    this.pulseOpacity = 0

    const text = await this.voiceService.stopListening()

    if (!text || text.trim().length === 0) {
      this.state = VoiceState.IDLE
      this.onError?.('未识别到语音')
      return
    }

    // AI 解析
    this.state = VoiceState.PARSING
    const result = await AIService.parse(text)

    this.state = VoiceState.IDLE
    this.onResult?.(result)
  }

  /** 状态文字 */
  private get statusText(): string {
    switch (this.state) {
      case VoiceState.IDLE: return '按住说话'
      case VoiceState.LISTENING: return '正在听...'
      case VoiceState.RECOGNIZING: return '识别中...'
      case VoiceState.PARSING: return '解析中...'
    }
  }

  /** 按钮颜色 */
  private get buttonColor(): string {
    switch (this.state) {
      case VoiceState.LISTENING: return '#e74c3c'
      case VoiceState.RECOGNIZING:
      case VoiceState.PARSING: return '#f39c12'
      default: return '#3498db'
    }
  }

  build() {
    Column() {
      Stack({ alignContent: Alignment.Center }) {
        // 波纹扩散
        if (this.pulseOpacity > 0) {
          Circle()
            .width(this.size * 1.5)
            .height(this.size * 1.5)
            .fill('#e74c3c')
            .opacity(this.pulseOpacity)
            .animation({
              duration: 1000,
              curve: Curve.EaseOut,
              iterations: -1,
              playMode: PlayMode.Alternate
            })
        }

        // 主按钮
        Circle()
          .width(this.size)
          .height(this.size)
          .fill(this.buttonColor)
          .shadow({
            radius: 12,
            color: this.state === VoiceState.LISTENING ? '#e74c3c40' : '#00000020',
            offsetY: 4
          })
          .scale({ x: this.scaleValue, y: this.scaleValue })
          .animation({ duration: 200, curve: Curve.EaseInOut })

        // 麦克风图标（文字模拟）
        Text(this.state === VoiceState.LISTENING ? '🎤' : '🎙️')
          .fontSize(this.size * 0.4)
      }
      .width(this.size * 1.5)
      .height(this.size * 1.5)

      // 状态文字
      Text(this.statusText)
        .fontSize(13)
        .fontColor(this.state === VoiceState.IDLE ? '#999' : '#333')
        .margin({ top: 8 })
    }
    .gesture(
      LongPressGesture({ repeat: false, duration: 200 }) // 200ms 长按触发
        .onAction(() => this.onPressStart())
        .onActionEnd(() => this.onPressEnd())
    )
  }
}
