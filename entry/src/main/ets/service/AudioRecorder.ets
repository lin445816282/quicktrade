/**
 * 音频录制服务
 * 使用 @ohos.multimedia.audio.AudioCapturer 录制 PCM
 * 为未来功能预留（保存录音文件等）
 */
import audio from '@ohos.multimedia.audio'
import { AppConstants } from '../common/constants/AppConstants'

export class AudioRecorder {
  private capturer: audio.AudioCapturer | null = null
  private isRecording_: boolean = false
  private pcmBuffer: ArrayBuffer[] = []
  private streamId: number = 0

  get isRecording(): boolean {
    return this.isRecording_
  }

  /** 开始录制 */
  async start(): Promise<void> {
    if (this.isRecording_) return

    const audioStreamInfo: audio.AudioStreamInfo = {
      samplingRate: audio.AudioSamplingRate.SAMPLE_RATE_16000,
      channels: audio.AudioChannel.CHANNEL_1,
      sampleFormat: audio.AudioSampleFormat.SAMPLE_FORMAT_S16LE,
      encodingType: audio.AudioEncodingType.ENCODING_TYPE_RAW
    }

    const capturerInfo: audio.AudioCapturerInfo = {
      source: audio.SourceType.SOURCE_TYPE_MIC,
      capturerFlags: 0
    }

    const capturerOptions: audio.AudioCapturerOptions = {
      streamInfo: audioStreamInfo,
      capturerInfo: capturerInfo
    }

    this.capturer = await audio.createAudioCapturer(capturerOptions)
    this.pcmBuffer = []

    this.capturer.on('readData', (buffer: ArrayBuffer) => {
      this.pcmBuffer.push(buffer)
    })

    await this.capturer.start()
    this.isRecording_ = true
  }

  /** 停止录制，返回 PCM 数据 */
  async stop(): Promise<ArrayBuffer[]> {
    if (!this.isRecording_ || !this.capturer) return []

    await this.capturer.stop()
    this.capturer.off('readData')
    await this.capturer.release()
    this.capturer = null
    this.isRecording_ = false

    return [...this.pcmBuffer]
  }
}
