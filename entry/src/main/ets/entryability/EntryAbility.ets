/**
 * App 入口 — 隐私同意 → 登录判断 → 路由
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
        // 同意过隐私 → 直接进首页（游客状态，右上角可登录）
        startPage = 'pages/Index'
      }
    } catch (e) {
      // preferences 读取失败 → 保守起见显示隐私页
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
