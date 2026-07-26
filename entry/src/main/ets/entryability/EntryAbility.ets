/**
 * App 入口 — 登录判断 + 路由
 */
import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit'
import { hilog } from '@kit.PerformanceAnalysisKit'
import { window } from '@kit.ArkUI'
import { initDB } from '../service/DatabaseService'
import { AuthService } from '../service/AuthService'

const TAG = 'EntryAbility'

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
    // 已登录 → 首页，未登录 → 登录页
    const startPage = AuthService.isLoggedIn() ? 'pages/Index' : 'pages/LoginPage'
    windowStage.loadContent(startPage, (err) => {
      if (err.code) {
        hilog.error(0x0000, TAG, `Failed to load content: ${JSON.stringify(err)}`)
        return
      }
      hilog.info(0x0000, TAG, 'Succeeded in loading content')
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
