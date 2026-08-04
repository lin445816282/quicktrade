/**
 * 登录/注册页 — 支持密码登录 + 华为帐号一键登录
 * 可关闭模式：从隐私页同意后直接跳首页，登录页作为可选入口
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
  @State huaweiLoading: boolean = false
  @State agreed: boolean = false
  @State privacyView: string = ''

  get title(): string {
    return this.isRegister ? '📝 注册' : '🔐 登录'
  }

  get buttonText(): string {
    return this.isRegister ? '注册' : '登录'
  }

  aboutToAppear() {
    this.agreed = false
  }

  async submit() {
    if (!this.agreed) {
      promptAction.showToast({ message: '请先阅读并同意隐私政策和用户条款', duration: 2000 })
      return
    }
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

  /** 华为帐号一键登录 */
  async huaweiLogin() {
    if (!this.agreed) {
      promptAction.showToast({ message: '请先阅读并同意隐私政策和用户条款', duration: 2000 })
      return
    }
    this.huaweiLoading = true
    try {
      await AuthService.huaweiLogin()
      promptAction.showToast({ message: '登录成功', duration: 1500 })
      router.replaceUrl({ url: 'pages/Index' })
    } catch (e) {
      const msg = e instanceof Error ? e.message : '华为登录失败'
      promptAction.showToast({ message: msg, duration: 2000 })
    }
    this.huaweiLoading = false
  }

  /** 以游客身份进入 */
  goAsGuest() {
    router.replaceUrl({ url: 'pages/Index' })
  }

  /** 显示隐私/条款悬浮窗 */
  showPrivacyView(type: string) {
    this.privacyView = type
  }

  build() {
    Stack() {
      Column() {
        Scroll() {
          Column() {
            Text('').height(40)

            Text('快记交易').fontSize(28).fontWeight(FontWeight.Bold).fontColor('#27ae60').margin({ bottom: 8 })
            Text('AI 语音记账').fontSize(14).fontColor('#777').margin({ bottom: 32 })

            // === 华为帐号一键登录 ===
            Button() {
              if (this.huaweiLoading) {
                LoadingProgress().width(20).height(20).color('#fff')
              } else {
                Row() {
                  Text('🔑').fontSize(20).margin({ right: 8 })
                  Text('华为帐号一键登录').fontSize(16).fontColor('#fff')
                }
              }
            }
            .width('100%').height(48)
            .backgroundColor('#cf0a2c')
            .borderRadius(8)
            .enabled(this.agreed && !this.huaweiLoading)
            .onClick(() => this.huaweiLogin())
            .margin({ bottom: 24 })

            // === 分割线 ===
            Row() {
              Divider().width('30%')
              Text('  或使用密码  ').fontSize(13).fontColor('#999')
              Divider().width('30%')
            }
            .width('100%')
            .margin({ bottom: 16 })

            // === 密码登录/注册表单 ===
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
              .enabled(this.agreed && !this.loading)
              .onClick(() => this.submit())

            // === 切换登录/注册 ===
            Row() {
              Text(this.isRegister ? '已有账号？' : '没有账号？').fontSize(13).fontColor('#777')
              Text(this.isRegister ? '去登录' : '去注册').fontSize(13).fontColor('#27ae60')
                .onClick(() => { this.isRegister = !this.isRegister })
            }
            .margin({ top: 16 })
            .width('100%')
            .justifyContent(FlexAlign.Center)

            // === 隐私条款（可勾选）===
            Row() {
              Text(this.agreed ? '☑' : '☐').fontSize(16).fontColor('#666')
                .onClick(() => { this.agreed = !this.agreed })
              Text(' 已阅读并同意 ').fontSize(12).fontColor('#777')
                .onClick(() => { this.agreed = !this.agreed })
              Text('隐私政策').fontSize(12).fontColor('#2d6be0')
                .decoration({ type: TextDecorationType.Underline })
                .onClick(() => { this.showPrivacyView('privacy') })
              Text(' 和 ').fontSize(12).fontColor('#777')
              Text('用户条款').fontSize(12).fontColor('#2d6be0')
                .decoration({ type: TextDecorationType.Underline })
                .onClick(() => { this.showPrivacyView('terms') })
            }
            .margin({ top: 20 })
            .width('100%')
            .justifyContent(FlexAlign.Center)

            // === 跳过，先看看 ===
            Text('跳过，先看看')
              .fontSize(14).fontColor('#777')
              .margin({ top: 24, bottom: 36 })
              .onClick(() => this.goAsGuest())
          }
          .width('80%')
          .alignSelf(ItemAlign.Center)
        }
        .layoutWeight(1)
        .scrollBar(BarState.Off)
      }
      .width('100%')
      .height('100%')
      .backgroundColor('#fff')

      // === 隐私/条款悬浮窗 ===
      if (this.privacyView !== '') {
        Column() {
        }
        .width('100%').height('100%')
        .backgroundColor('#00000050')
        .onClick(() => { this.privacyView = '' })

        Column() {
          Column() {
            Row() {
              Text(this.privacyView === 'privacy' ? '📄 隐私政策' : '📄 用户条款')
                .fontSize(17).fontWeight(FontWeight.Bold).layoutWeight(1)
              Text('✕').fontSize(20).fontColor('#999')
                .onClick(() => { this.privacyView = '' })
            }
            .width('100%')
            .margin({ bottom: 12 })

            Scroll() {
              Column() {
                if (this.privacyView === 'privacy') {
                  PolicyItem({ title: '1. 信息收集', content: '本应用仅收集您主动提供的信息：\n• 用户名和密码（加密存储，仅用于登录验证）\n• 您录入的交易记录（金额、品类、备注等）\n• 麦克风权限（仅用于语音记账功能，需您主动触发）\n\n我们不会收集您的设备标识、位置、通讯录或其他敏感信息。' })
                  PolicyItem({ title: '2. 信息使用', content: '您的所有数据仅存储在设备本地数据库中。我们不向任何第三方传输您的数据。语音识别通过您指定的 AI 接口处理，不会用于模型训练。' })
                  PolicyItem({ title: '3. 信息存储', content: '数据存储在设备本地 SQLite 数据库中。删除应用或清除数据将永久删除所有记录。建议您定期通过设置页的"数据导出"功能备份数据。' })
                  PolicyItem({ title: '4. 第三方服务', content: '语音识别功能可能调用第三方 AI 接口。这些接口仅接收您上传的语音数据，不会获取您的账户信息或其他数据。' })
                  PolicyItem({ title: '5. 用户权利', content: '您可以随时：\n• 在设置中导出您的全部数据\n• 删除单条或全部交易记录\n• 注销账号（删除所有数据）\n• 撤回麦克风权限授权' })
                  PolicyItem({ title: '6. 联系方式', content: '如有任何隐私相关问题，请通过以下方式联系我们：\n邮箱：445816282@qq.com' })
                } else {
                  PolicyItem({ title: '1. 服务说明', content: '本应用（"快记交易"）提供个人记账及 AI 语音记账功能。您使用本应用即表示同意本条款。' })
                  PolicyItem({ title: '2. 用户责任', content: '• 您对录入数据的准确性和合法性负责\n• 不得利用本应用从事违法违规活动\n• 应妥善保管账号密码，因密码泄露导致的损失由您自行承担' })
                  PolicyItem({ title: '3. 免责声明', content: '• 本应用按"现状"提供服务，不保证服务不会中断\n• AI 语音识别结果仅供参考，不构成财务建议\n• 因不可抗力导致的数据丢失，开发者不承担责任' })
                  PolicyItem({ title: '4. 知识产权', content: '本应用的所有权利（包括但不限于软件著作权、商标权）归开发者所有。未经许可，不得复制、修改、分发本应用。' })
                  PolicyItem({ title: '5. 条款变更', content: '我们可能会不时更新本条款。重大变更将通过应用内通知告知您。继续使用即表示接受变更后的条款。' })
                  PolicyItem({ title: '6. 联系我们', content: '如有任何问题，请发送邮件至：\n445816282@qq.com' })
                }
              }
              .width('100%')
              .padding({ bottom: 8 })
            }
            .layoutWeight(1)
            .scrollBar(BarState.Off)
          }
          .width('85%')
          .height('70%')
          .padding(20)
          .backgroundColor('#fff')
          .borderRadius(16)
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
      }
    }
    .width('100%')
    .height('100%')
  }
}

/** 隐私/条款段落组件 */
@Component
struct PolicyItem {
  @Prop title: string = ''
  @Prop content: string = ''

  build() {
    Column() {
      Text(this.title)
        .fontSize(14)
        .fontWeight(FontWeight.Medium)
        .fontColor('#333')
        .width('100%')
        .margin({ bottom: 6 })

      Text(this.content)
        .fontSize(13)
        .fontColor('#666')
        .lineHeight(20)
        .width('100%')
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .margin({ bottom: 16 })
  }
}
