/**
 * App 入口 — 隐私同意 → 恢复登录态 → 路由
 */
import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit'
import { hilog } from '@kit.PerformanceAnalysisKit'
import { window } from '@kit.ArkUI'
import { preferences } from '@kit.ArkData'
import { initDB } from '../service/DatabaseService'
import { AuthService } from '../service/AuthService'

const TAG = 'EntryAbility'
const PREFS_NAME = 'quicktrade_settings'

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    hilog.info(0x0000, TAG, 'QuickTrade onCreate')
    AuthService.init(this.context)  // 设置 context 用于 preferences
    initDB(this.context)
  }

  onDestroy(): void {
    hilog.info(0x0000, TAG, 'QuickTrade onDestroy')
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    hilog.info(0x0000, TAG, 'onWindowStageCreate')
    this.loadWithPrivacyCheck(windowStage)
  }

  async loadWithPrivacyCheck(windowStage: window.WindowStage): Promise<void> {
    let startPage = 'pages/PrivacyConsentPage'

    try {
      const prefs = await preferences.getPreferences(this.context, PREFS_NAME)
      const agreed: boolean = await prefs.get('privacy_agreed', false) as boolean
      if (agreed) {
        // 同意过隐私 → 恢复登录态 → 进首页
        await AuthService.restoreLogin()
        startPage = 'pages/Index'
      }
    } catch (e) {
      hilog.warn(0x0000, TAG, `Privacy prefs read failed: ${JSON.stringify(e)}`)
    }

    windowStage.loadContent(startPage, (err) => {
      if (err.code) {
        hilog.error(0x0000, TAG, `Failed to load content: ${JSON.stringify(err)}`)
        return
      }
      hilog.info(0x0000, TAG, `Succeeded in loading: ${startPage}`)
    })
  }

  onWindowStageDestroy(): void {
    hilog.info(0x0000, TAG, 'onWindowStageDestroy')
  }

  onForeground(): void {
    hilog.info(0x0000, TAG, 'onForeground')
  }

  onBackground(): void {
    hilog.info(0x0000, TAG, 'onBackground')
  }
}
