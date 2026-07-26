/**
 * 登录/注册页
 */
import { AuthService } from '../service/AuthService'
import router from '@ohos.router'
import promptAction from '@ohos.promptAction'

@Entry
@Component
struct LoginPage {
  @State username: string = ''
  @State password: string = ''
  @State isRegister: boolean = false
  @State loading: boolean = false

  get title(): string {
    return this.isRegister ? '📝 注册' : '🔐 登录'
  }

  get buttonText(): string {
    return this.isRegister ? '注册' : '登录'
  }

  async submit() {
    const u = this.username.trim()
    const p = this.password.trim()
    if (!u || !p) {
      promptAction.showToast({ message: '请输入用户名和密码', duration: 1500 })
      return
    }
    if (u.length < 2) {
      promptAction.showToast({ message: '用户名至少2个字符', duration: 1500 })
      return
    }
    if (p.length < 4) {
      promptAction.showToast({ message: '密码至少4位', duration: 1500 })
      return
    }

    this.loading = true
    try {
      if (this.isRegister) {
        await AuthService.register(u, p)
        promptAction.showToast({ message: '注册成功', duration: 1500 })
      } else {
        await AuthService.login(u, p)
      }
      router.replaceUrl({ url: 'pages/Index' })
    } catch (e) {
      const msg = e instanceof Error ? e.message : '操作失败'
      promptAction.showToast({ message: msg, duration: 2000 })
    }
    this.loading = false
  }

  build() {
    Column() {
      Column() {
        Text('快记交易').fontSize(28).fontWeight(FontWeight.Bold).fontColor('#27ae60').margin({ top: 60, bottom: 8 })
        Text('AI 语音记账').fontSize(14).fontColor('#999').margin({ bottom: 40 })

        TextInput({ placeholder: '用户名', text: this.username })
          .onChange((v: string) => this.username = v)
          .width('100%').height(48).margin({ bottom: 16 })
          .borderRadius(8).backgroundColor('#f5f5f5')

        TextInput({ placeholder: '密码', text: this.password })
          .type(InputType.Password)
          .onChange((v: string) => this.password = v)
          .width('100%').height(48).margin({ bottom: 24 })
          .borderRadius(8).backgroundColor('#f5f5f5')

        Button(this.buttonText)
          .width('100%').height(48).fontSize(16)
          .backgroundColor('#27ae60').borderRadius(8)
          .enabled(!this.loading)
          .onClick(() => this.submit())

        Row() {
          Text(this.isRegister ? '已有账号？' : '没有账号？').fontSize(13).fontColor('#999')
          Text(this.isRegister ? '去登录' : '去注册').fontSize(13).fontColor('#27ae60')
            .onClick(() => { this.isRegister = !this.isRegister })
        }
        .margin({ top: 20 })
      }
      .width('80%')
    }
    .width('100%').height('100%')
    .justifyContent(FlexAlign.Center)
    .backgroundColor('#fff')
  }
}
