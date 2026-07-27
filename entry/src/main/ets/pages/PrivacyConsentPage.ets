/**
 * 隐私政策同意页面 — 首次启动时弹出
 * 用户必须同意才能使用App
 */
import router from '@ohos.router'
import { common, Want } from '@kit.AbilityKit'
import { preferences } from '@kit.ArkData'

const PREFS_NAME = 'quicktrade_settings'

@Entry
@Component
struct PrivacyConsentPage {
  @State agreed: boolean = false

  async agree() {
    // 保存同意状态
    try {
      const ctx = getContext(this) as common.UIAbilityContext
      const prefs = await preferences.getPreferences(ctx, PREFS_NAME)
      await prefs.put('privacy_agreed', true)
      await prefs.flush()
    } catch (e) {
      console.error('Privacy prefs save error:', JSON.stringify(e))
    }

    // 跳转到首页（游客模式）
    router.replaceUrl({ url: 'pages/Index' })
  }

  disagree() {
    // 退出应用
    const ctx = getContext(this) as common.UIAbilityContext
    ctx.terminateSelf()
  }

  build() {
    Column() {
      // 顶部图标区
      Column() {
        Text('📒')
          .fontSize(56)
          .margin({ bottom: 12 })

        Text('快记交易')
          .fontSize(22)
          .fontWeight(FontWeight.Bold)
          .fontColor('#1a1a2e')

        Text('AI语音记账 · 简单高效')
          .fontSize(14)
          .fontColor('#888')
          .margin({ top: 6 })
      }
      .width('100%')
      .padding({ top: 48, bottom: 32 })
      .alignItems(HorizontalAlign.Center)

      // 隐私政策内容
      Scroll() {
        Column() {
          Text('隐私政策概要')
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .fontColor('#333')
            .margin({ bottom: 16 })
            .alignSelf(ItemAlign.Start)

          PrivacyItem({ icon: '📱', label: '账户信息', desc: '您注册时提供的用户名和密码（加密存储）' })
          PrivacyItem({ icon: '💰', label: '交易记录', desc: '您录入的收入/支出金额、品类、备注等' })
          PrivacyItem({ icon: '🎤', label: '麦克风权限', desc: '用于语音记账，仅在您主动触发时使用' })
          PrivacyItem({ icon: '🌐', label: '网络权限', desc: '用于调用AI接口解析语音内容' })

          Text()
            .height(16)

          Text('您的所有数据均存储在设备本地，不会自动上传云端。\n您可以在设置中随时注销账号并删除全部数据。')
            .fontSize(13)
            .fontColor('#888')
            .lineHeight(20)
            .width('100%')

          Text()
            .height(8)

          Text('查看完整隐私政策 →')
            .fontSize(13)
            .fontColor('#2d6be0')
            .decoration({ type: TextDecorationType.Underline })
            .onClick(() => {
              // 打开浏览器查看隐私政策
              const ctx = getContext(this) as common.UIAbilityContext
              const want: Want = {
                action: 'ohos.want.action.viewData',
                entities: ['entity.system.browsable'],
                uri: 'https://www.ct256.cn/privacy-quicktrade'
              }
              ctx.startAbility(want).catch((err: Error) => {
                console.error('Open browser failed:', JSON.stringify(err))
              })
            })
        }
        .width('100%')
        .padding({ left: 4, right: 4 })
      }
      .layoutWeight(1)
      .scrollBar(BarState.Off)

      // 底部按钮
      Column() {
        Button('同意并继续')
          .width('100%')
          .height(48)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .backgroundColor('#2d6be0')
          .fontColor('#fff')
          .borderRadius(24)
          .onClick(() => this.agree())

        Button('不同意并退出')
          .width('100%')
          .height(48)
          .fontSize(15)
          .fontWeight(FontWeight.Normal)
          .backgroundColor(Color.Transparent)
          .fontColor('#999')
          .margin({ top: 12 })
          .onClick(() => this.disagree())
      }
      .width('100%')
      .padding({ left: 28, right: 28, bottom: 36 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f8f9fc')
  }
}

@Component
struct PrivacyItem {
  @Prop icon: string = ''
  @Prop label: string = ''
  @Prop desc: string = ''

  build() {
    Row() {
      Text(this.icon)
        .fontSize(18)
        .margin({ right: 10 })

      Column() {
        Text(this.label)
          .fontSize(14)
          .fontWeight(FontWeight.Medium)
          .fontColor('#333')
        Text(this.desc)
          .fontSize(12)
          .fontColor('#999')
          .margin({ top: 2 })
      }
      .alignItems(HorizontalAlign.Start)
    }
    .width('100%')
    .padding({ top: 12, bottom: 12 })
    .alignItems(VerticalAlign.Top)
  }
}
