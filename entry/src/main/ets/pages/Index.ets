/**
 * 首页 — 交易列表 + 语音记账入口
 * Phase 1 MVP：手动记账入口 + 语音按钮 + 今日概览 + 交易列表
 */
import { Transaction, TransactionType } from '../model/Transaction'
import { DatabaseService } from '../service/DatabaseService'
import { DateUtils } from '../common/utils/DateUtils'
import { NumberUtils } from '../common/utils/NumberUtils'
import router from '@ohos.router'

import { AuthService } from '../service/AuthService'

interface TransactionGroup {
  label: string
  items: Transaction[]
}

@Entry
@Component
struct Index {
  @State transactions: Transaction[] = []
  @State todayIncome: number = 0
  @State todayExpense: number = 0
  @State groups: TransactionGroup[] = []
  @State loading: boolean = true

  aboutToAppear() {
    // 未登录 → 跳回登录页
    if (!AuthService.isLoggedIn()) {
      router.replaceUrl({ url: 'pages/LoginPage' })
      return
    }
    this.loadData()
  }

  onPageShow() {
    if (!AuthService.isLoggedIn()) {
      router.replaceUrl({ url: 'pages/LoginPage' })
      return
    }
    this.loadData()
  }

  /** 加载数据 */
  async loadData() {
    this.loading = true
    try {
      const txs = await DatabaseService.getAll()
      this.transactions = txs
      this.groups = this.groupByDate(txs)

      const summary = await DatabaseService.getTodaySummary()
      this.todayIncome = summary.income
      this.todayExpense = summary.expense
    } catch (e) {
      console.error('Index loadData failed:', JSON.stringify(e))
    }
    this.loading = false
  }

  /** 按日期分组 */
  groupByDate(list: Transaction[]): TransactionGroup[] {
    const map = new Map<string, Transaction[]>()
    for (const item of list) {
      const label = DateUtils.formatGroupLabel(item.created_at)
      if (!map.has(label)) map.set(label, [])
      map.get(label)!.push(item)
    }
    const result: TransactionGroup[] = []
    map.forEach((items, label) => result.push({ label, items }))
    return result
  }

  /** 跳转手动记账 */
  goToRecord() {
    router.pushUrl({ url: 'pages/RecordPage' })
  }

  /** 跳转统计 */
  goToStats() {
    router.pushUrl({ url: 'pages/StatsPage' })
  }

  /** 删除交易 */
  async deleteTransaction(id: number) {
    await DatabaseService.delete(id)
    this.loadData()
  }

  /** 今日净额 */
  get netAmount(): string {
    const net = this.todayIncome - this.todayExpense
    return NumberUtils.formatMoney(net)
  }

  /** 登出 */
  logout() {
    AuthService.logout()
    router.replaceUrl({ url: 'pages/LoginPage' })
  }

  build() {
    Column() {
      // === 用户信息 ===
      Row() {
        Text(`👤 ${AuthService.getCurrentUsername()}`).fontSize(13).fontColor('#666').layoutWeight(1)
        Text('退出').fontSize(13).fontColor('#e74c3c').onClick(() => this.logout())
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 8, bottom: 8 })
      .backgroundColor('#fff')
      .border({ width: { bottom: 0.5 }, color: '#f0f0f0' })

      // === 顶部概览卡片 ===
      Row() {
        Column() { Text('今日支出').fontSize(12).fontColor('#999')
          Text(NumberUtils.formatMoney(this.todayExpense))
            .fontSize(22).fontWeight(FontWeight.Bold).fontColor('#e74c3c')
        }
        Column() { Text('今日收入').fontSize(12).fontColor('#999')
          Text(NumberUtils.formatMoney(this.todayIncome))
            .fontSize(22).fontWeight(FontWeight.Bold).fontColor('#27ae60')
        }
        Column() { Text('今日净额').fontSize(12).fontColor('#999')
          Text(this.netAmount)
            .fontSize(22).fontWeight(FontWeight.Bold).fontColor('#333')
        }
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceAround)
      .padding({ top: 16, bottom: 16 })
      .backgroundColor('#fff')
      .borderRadius(12)
      .margin({ left: 16, right: 16, top: 8 })

      // === 占位：语音按钮（Sprint 1.3 实现）===
      Row() {
        Text('🎤 按住说话记账')
          .fontSize(16).fontColor('#ccc')
      }
      .width('90%')
      .height(48)
      .justifyContent(FlexAlign.Center)
      .backgroundColor('#f5f5f5')
      .borderRadius(24)
      .margin({ top: 16, bottom: 8 })

      // === 交易列表 ===
      if (this.loading) {
        LoadingProgress().margin({ top: 60 })
      } else if (this.groups.length === 0) {
        Column() {
          Text('📝').fontSize(48).margin({ bottom: 12 })
          Text('还没有记录').fontSize(16).fontColor('#999')
          Text('点击下方 + 号开始记账').fontSize(14).fontColor('#ccc').margin({ top: 4 })
        }
        .width('100%')
        .margin({ top: 60 })
      } else {
        List() {
          ForEach(this.groups, (group: TransactionGroup) => {
            ListItem() {
              Column() {
                // 日期标签
                Text(group.label)
                  .fontSize(13)
                  .fontColor('#999')
                  .padding({ left: 16, top: 12, bottom: 4 })
                  .width('100%')

                // 该组内的交易项
                ForEach(group.items, (item: Transaction) => {
                  ListItem() {
                    this.TransactionItem(item)
                  }
                })
              }
            }
          })
        }
        .layoutWeight(1)
        .scrollBar(BarState.Off)
      }

      // === 底部操作栏 ===
      Row() {
        Button() {
          Text('📊').fontSize(20)
        }
        .backgroundColor(Color.Transparent)
        .onClick(() => this.goToStats())

        Button() {
          Text('+')
            .fontSize(28)
            .fontWeight(FontWeight.Lighter)
        }
        .width(56)
        .height(56)
        .borderRadius(28)
        .backgroundColor('#e74c3c')
        .fontColor(Color.White)
        .shadow({ radius: 8, color: '#e74c3c40' })
        .onClick(() => this.goToRecord())

        Button() {
          Text('⚙️').fontSize(20)
        }
        .backgroundColor(Color.Transparent)
        .onClick(() => router.pushUrl({ url: 'pages/SettingsPage' }))
      }
      .width('100%')
      .height(64)
      .justifyContent(FlexAlign.SpaceAround)
      .backgroundColor('#fff')
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f5f5f5')
  }

  /** 单个交易项组件 */
  @Builder
  TransactionItem(item: Transaction) {
    Row() {
      // 品类图标
      Text(this.getCategoryIcon(item))
        .fontSize(28)
        .width(44)
        .textAlign(TextAlign.Center)

      // 信息
      Column() {
        Text(item.category).fontSize(16).fontWeight(FontWeight.Medium)
        if (item.note) {
          Text(item.note).fontSize(12).fontColor('#999').maxLines(1).textOverflow({ overflow: TextOverflow.Ellipsis })
        }
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)
      .margin({ left: 8 })

      // 金额
      Text(item.amountDisplay)
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .fontColor(item.isIncome ? '#27ae60' : '#333')
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 12, bottom: 12 })
    .backgroundColor('#fff')
    .border({ width: { bottom: 0.5 }, color: '#f0f0f0' })
    .gesture(
      LongPressGesture({ duration: 500 })
        .onAction(() => {
          AlertDialog.show({
            title: '删除确认',
            message: `确定要删除这条记录吗？`,
            autoCancel: true,
            primaryButton: { value: '取消', action: () => {} },
            secondaryButton: {
              value: '删除',
              fontColor: '#e74c3c',
              action: () => this.deleteTransaction(item.id)
            }
          })
        })
    )
  }

  /** 品类图标映射 */
  getCategoryIcon(item: Transaction): string {
    const iconMap: Record<string, string> = {
      '餐饮': '🍜', '交通': '🚗', '购物': '🛍️', '日用品': '🧴',
      '娱乐': '🎮', '通讯': '📱', '居住': '🏠', '医疗': '💊',
      '教育': '📚', '工资': '💵', '投资': '📈', '兼职': '💼',
      '退款': '↩️', '其他': '📌'
    }
    return iconMap[item.category] || '📌'
  }
}
