/**
 * 语音按钮 — 权限申请 + CoreSpeechKit ASR
 */
import { AIParseResult } from '../../model/AIParseResult'
import { abilityAccessCtrl, Permissions } from '@kit.AbilityKit'
import { common } from '@kit.AbilityKit'

@Component
export struct VoiceButton {
  onResult?: (result: AIParseResult) => void
  onError?: (message: string) => void

  @State listening: boolean = false
  @State statusText: string = '按住说话'
  private voiceService: Object | null = null
  private pressed: boolean = false
  private timer: number = -1
  private initialized: boolean = false
  private permGranted: boolean = false  // 记住权限状态，避免重复弹窗

  async requestMicPermission(): Promise<boolean> {
    if (this.permGranted) return true
    try {
      const ctx = getContext(this) as common.UIAbilityContext
      const atManager = abilityAccessCtrl.createAtManager()
      const result = await atManager.requestPermissionsFromUser(ctx, ['ohos.permission.MICROPHONE'])
      const granted = result.authResults[0] === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED
      if (!granted) {
        if (this.onError) this.onError('需要麦克风权限才能使用语音记账')
        return false
      }
      this.permGranted = true
      return true
    } catch (e) {
      console.error('[VoiceButton] requestPermission failed:', JSON.stringify(e))
      if (this.onError) this.onError('权限申请失败，请在设置中手动开启麦克风权限')
      return false
    }
  }

  async initService(): Promise<boolean> {
    if (this.initialized) return true
    try {
      const mod = await import('../../service/VoiceService')
      this.voiceService = new mod.VoiceService()
      this.initialized = true
      return true
    } catch (e) {
      const err = e as Record<string, string>
      const msg = err.message || 'unknown'
      console.error('[VoiceButton] ASR init failed: ' + msg)
      return false
    }
  }

  async onDown(): Promise<void> {
    this.pressed = true
    this.timer = setTimeout(async () => {
      if (!this.pressed) return

      // 1. 先申请麦克风权限
      const permOk = await this.requestMicPermission()
      if (!permOk) {
        this.pressed = false
        this.statusText = '按住说话'
        return
      }

      // 2. 初始化 ASR 引擎
      const ok = await this.initService()
      if (!ok) {
        this.pressed = false
        this.statusText = '按住说话'
        if (this.onError) this.onError('语音模块加载失败')
        return
      }

      // 3. 开始监听
      this.listening = true
      this.statusText = '正在听...'
      try {
        const vs = this.voiceService as Record<string, Function>
        await vs['startListening']()
      } catch (e) {
        const err = e as Record<string, string>
        const msg = err.message || err.name || 'unknown error'
        console.error('[VoiceButton] start failed: ' + msg)
        this.reset()
        if (this.onError) this.onError('录音启动失败: ' + msg)
      }
    }, 200)
  }

  async onUp(): Promise<void> {
    this.pressed = false
    clearTimeout(this.timer)
    if (!this.listening) return
    this.listening = false
    this.statusText = '识别中...'

    try {
      const vs2 = this.voiceService as Record<string, Function>
      const text: string = await vs2['stopListening']() as string

      if (!text || text.trim().length === 0) {
        this.statusText = '按住说话'
        if (this.onError) this.onError('未识别到语音，请靠近麦克风再说一次')
        return
      }

      this.statusText = 'AI 解析中...'
      const aiMod = await import('../../service/AIService')
      const result: AIParseResult = await aiMod.AIService.parse(text)
      this.statusText = '按住说话'
      if (this.onResult) this.onResult(result)
    } catch (e) {
      console.error('[VoiceButton] recognize failed:', JSON.stringify(e))
      this.statusText = '按住说话'
      if (this.onError) this.onError('识别失败，请检查网络后重试')
    }
  }

  reset(): void {
    this.listening = false
    this.pressed = false
    this.statusText = '按住说话'
    clearTimeout(this.timer)
  }

  build() {
    Button() {
      Column() {
        Text(this.listening ? '🎤' : '🎙️').fontSize(28)
        Text(this.statusText).fontSize(14).margin({ top: 4 })
      }
    }
    .width(120).height(120)
    .borderRadius(60)
    .backgroundColor(this.listening ? '#e74c3c' : '#3498db')
    .fontColor('#fff')
    .onTouch((e: TouchEvent) => {
      if (e.type === TouchType.Down) this.onDown()
      else if (e.type === TouchType.Up || e.type === TouchType.Cancel) this.onUp()
    })
  }
}
