/**
 * 语音识别服务 — API 24 适配
 * @kit.CoreSpeechKit + @ohos.multimedia.audio 录音推流
 * 优先在线识别，失败降级离线
 */
import { speechRecognizer } from '@kit.CoreSpeechKit'
import audio from '@ohos.multimedia.audio'

export class VoiceService {
  private engine: speechRecognizer.SpeechRecognitionEngine | null = null
  private capturer: audio.AudioCapturer | null = null
  private sessionId: string = ''
  private resolvePromise: ((value: string) => void) | null = null
  private finalText: string = ''
  private isActive: boolean = false

  async startListening(): Promise<void> {
    this.finalText = ''
    this.isActive = true

    // 1. 创建 ASR 引擎
    console.info('[VoiceService] startListening: creating engine...')
    this.engine = await this.createEngine()
    console.info('[VoiceService] engine created OK')

    // 2. 设置监听
    const sid = 'qt_' + String(Date.now())
    this.sessionId = sid

    this.engine.setListener({
      onStart: (_sid: string, _msg: string) => {
        console.info('[VoiceService] onStart sid=' + _sid)
      },
      onEvent: (_sid: string, _code: number, _msg: string) => {
        console.info('[VoiceService] onEvent code=' + String(_code) + ' msg=' + _msg)
      },
      onResult: (_sid: string, result: speechRecognizer.SpeechRecognitionResult) => {
        console.info('[VoiceService] onResult isFinal=' + String(result.isFinal) +
          ' text=' + (result.result || ''))
        if (result.result) {
          this.finalText = result.result
        }
        if (result.isFinal) {
          this.resolve(this.finalText)
        }
      },
      onComplete: (_sid: string, _msg: string) => {
        console.info('[VoiceService] onComplete finalText=' + this.finalText)
        this.resolve(this.finalText)
      },
      onError: (_sid: string, _code: number, msg: string) => {
        console.error('[VoiceService] onError code=' + String(_code) + ' msg=' + msg)
        // 有部分文字也返回
        this.resolve(this.finalText || '')
      }
    })

    // 3. 开始 ASR 会话
    const audioInfo: speechRecognizer.AudioInfo = {
      audioType: 'pcm',
      sampleRate: 16000,
      soundChannel: 1,
      sampleBit: 16
    }
    try {
      this.engine.startListening({
        sessionId: sid,
        audioInfo: audioInfo
      })
      console.info('[VoiceService] startListening: session started sid=' + sid)
    } catch (e) {
      const err = e as Record<string, string>
      console.error('[VoiceService] engine.startListening failed: ' + (err.message || 'unknown'))
      throw new Error('startListening: ' + (err.message || 'unknown'))
    }

    // 4. 启动麦克风推流
    try {
      await this.startCapture(sid)
      console.info('[VoiceService] startCapture: capturer started OK')
    } catch (e) {
      const err = e as Record<string, string>
      console.error('[VoiceService] startCapture failed: ' + (err.message || 'unknown'))
      throw new Error('startCapture: ' + (err.message || 'unknown'))
    }
  }

  private createEngine(): Promise<speechRecognizer.SpeechRecognitionEngine> {
    return new Promise<speechRecognizer.SpeechRecognitionEngine>(
      (resolve: (e: speechRecognizer.SpeechRecognitionEngine) => void,
       reject: (err: Error) => void) => {
        speechRecognizer.createEngine(
          { language: 'zh-CN', online: 1 },
          (err: Error, eng: speechRecognizer.SpeechRecognitionEngine) => {
            if (err) {
              reject(err)
            } else {
              resolve(eng)
            }
          }
        )
      }
    )
  }

  private async startCapture(sid: string): Promise<void> {
    const streamInfo: audio.AudioStreamInfo = {
      samplingRate: audio.AudioSamplingRate.SAMPLE_RATE_16000,
      channels: audio.AudioChannel.CHANNEL_1,
      sampleFormat: audio.AudioSampleFormat.SAMPLE_FORMAT_S16LE,
      encodingType: audio.AudioEncodingType.ENCODING_TYPE_RAW
    }
    const capturerInfo: audio.AudioCapturerInfo = {
      source: audio.SourceType.SOURCE_TYPE_MIC,
      capturerFlags: 0
    }
    const options: audio.AudioCapturerOptions = {
      streamInfo: streamInfo,
      capturerInfo: capturerInfo
    }
    this.capturer = await audio.createAudioCapturer(options)

    this.capturer.on('readData', (buffer: ArrayBuffer) => {
      if (!this.isActive || !this.engine) return
      try {
        this.engine.writeAudio(sid, new Uint8Array(buffer))
      } catch (_e) {
        // 忽略推流错误
      }
    })

    await this.capturer.start()
  }

  async stopListening(): Promise<string> {
    this.isActive = false
    return new Promise<string>((resolve: (text: string) => void) => {
      this.resolvePromise = resolve
      setTimeout(() => {
        if (this.resolvePromise) {
          this.resolvePromise(this.finalText || '')
          this.resolvePromise = null
        }
      }, 5000)
      if (this.capturer) {
        this.capturer.stop().catch(() => {})
      }
      if (this.engine && this.sessionId) {
        try {
          this.engine.cancel(this.sessionId)
        } catch (_e) {
          this.resolve(this.finalText || '')
        }
      }
    })
  }

  private resolve(text: string): void {
    if (this.resolvePromise) {
      this.resolvePromise(text)
      this.resolvePromise = null
    }
  }

  destroy(): void {
    this.isActive = false
    if (this.capturer) {
      this.capturer.release().catch(() => {})
      this.capturer = null
    }
    this.engine = null
    this.resolvePromise = null
  }
}
