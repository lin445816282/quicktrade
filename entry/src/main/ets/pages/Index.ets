/**
 * 首页 — 交易列表 + 记账入口
 * 未登录（游客）可查看功能，但点击+号弹出登录
 */
import { Transaction, TransactionType } from '../model/Transaction'
import { DatabaseService } from '../service/DatabaseService'
import { DateUtils } from '../common/utils/DateUtils'
import { NumberUtils } from '../common/utils/NumberUtils'
import router from '@ohos.router'
import promptAction from '@ohos.promptAction'

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
  @State todayNet: string = '¥0.00'
  @State groups: TransactionGroup[] = []
  @State loading: boolean = true
  @State showLoginDialog: boolean = false
  @State loginUsername: string = ''
  @State loginPassword: string = ''
  @State loginLoading: boolean = false
  @State loginIsRegister: boolean = false
  @State loginError: string = ''
  @State loginAgreed: boolean = false
  @State showPrivacyContent: string = ''
  @State loggedIn: boolean = false

  @State showDeleteDialog: boolean = false
  @State deleteTargetId: number = 0
  @State currentTime: string = ''

  aboutToAppear() {
    this.loggedIn = AuthService.isLoggedIn()
    this.updateTime()
    this.loadData()
  }

  onPageShow() {
    this.loggedIn = AuthService.isLoggedIn()
    this.updateTime()
    this.loadData()
  }

  updateTime(): void {
    const now = new Date()
    const p = (n: number): string => String(n).padStart(2, '0')
    this.currentTime = `${now.getFullYear()}-${p(now.getMonth()+1)}-${p(now.getDate())} ${p(now.getHours())}:${p(now.getMinutes())}`
  }

  async loadData() {
    this.loading = true
    try {
      const txs = await DatabaseService.getAll()
      this.transactions = txs
      this.groups = this.groupByDate(txs)
      const summary = await DatabaseService.getTodaySummary()
      this.todayIncome = summary.income
      this.todayExpense = summary.expense
      this.todayNet = NumberUtils.formatMoney(this.todayIncome - this.todayExpense)
    } catch (e) {
      console.error('Index loadData failed:', JSON.stringify(e))
    }
    this.loading = false
  }

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

  goToRecord() {
    if (!this.loggedIn) {
      this.showLoginDialog = true
      return
    }
    router.pushUrl({ url: 'pages/RecordPage' })
  }

  goToStats() {
    router.pushUrl({ url: 'pages/StatsPage' })
  }

  async deleteTransaction(id: number) {
    await DatabaseService.delete(id)
    this.loadData()
  }

  async logout() {
    await AuthService.logout()
    this.loggedIn = false
    this.showLoginDialog = false
    this.loadData()
  }

  async doLogin() {
    if (!this.loginAgreed) {
      this.loginError = '请先阅读并同意隐私政策和用户条款'
      return
    }
    const u = this.loginUsername.trim()
    const p = this.loginPassword.trim()
    if (!u || !p) {
      this.loginError = '请输入用户名和密码'
      return
    }
    this.loginLoading = true
    this.loginError = ''
    console.info('QuickTrade doLogin:', u, 'isRegister:', this.loginIsRegister)
    try {
      if (this.loginIsRegister) {
        await AuthService.register(u, p)
        console.info('QuickTrade register success:', u)
        promptAction.showToast({ message: '注册成功', duration: 1500 })
      } else {
        await AuthService.login(u, p)
        console.info('QuickTrade login success:', u)
        promptAction.showToast({ message: '登录成功', duration: 1500 })
      }
      this.showLoginDialog = false
      this.loginUsername = ''
      this.loginPassword = ''
      this.loginIsRegister = false
      this.loginAgreed = false
      this.loginLoading = false
      this.loggedIn = true
    } catch (e) {
      let msg = '操作失败'
      try {
        const errObj = e as Record<string, string>
        if (errObj && errObj.message) {
          msg = String(errObj.message)
        }
      } catch (_) {
        msg = String(e || '操作失败')
      }
      console.error('QuickTrade login failed:', msg, JSON.stringify(e))
      this.loginError = msg
      this.loginLoading = false
      return
    }
    try {
      await this.loadData()
    } catch (e) {
      console.error('QuickTrade loadData after login:', JSON.stringify(e))
    }
  }

  openLogin() {
    this.loginUsername = ''
    this.loginPassword = ''
    this.loginError = ''
    this.loginAgreed = false
    this.loginIsRegister = false
    this.showLoginDialog = true
  }

  cancelLogin() {
    this.showLoginDialog = false
    this.loginUsername = ''
    this.loginPassword = ''
    this.loginError = ''
    this.loginAgreed = false
  }

  toggleAgreed() {
    this.loginAgreed = !this.loginAgreed
    if (this.loginAgreed) {
      this.loginError = ''
    }
  }

  build() {
    Stack() {
      Column() {
        Row() {
          if (this.loggedIn) {
            Text(`👤 ${AuthService.getCurrentUsername()}`).fontSize(13).fontColor('#666')
            Blank()
            // 金色边框日期时间
            Text(this.currentTime).fontSize(12).fontColor('#333')
              .padding({ left: 10, right: 10, top: 4, bottom: 4 })
              .border({ width: 1.5, color: '#d4a017', radius: 6 })
              .margin({ right: 6 })
            Text('退出').fontSize(13).fontColor('#e74c3c').onClick(() => this.logout())
          } else {
            Text('👤 游客').fontSize(13).fontColor('#999').layoutWeight(1)
            Text('登录').fontSize(13).fontColor('#27ae60').fontWeight(FontWeight.Medium)
              .padding({ left: 12, right: 4, top: 4, bottom: 4 })
              .onClick(() => { this.openLogin() })
          }
        }
        .width('100%').padding({ left: 16, right: 16, top: 8, bottom: 8 })
        .backgroundColor('#fff').border({ width: { bottom: 0.5 }, color: '#f0f0f0' })

        Row() {
          Column() { Text('今日支出').fontSize(12).fontColor('#999')
            Text(NumberUtils.formatMoney(this.todayExpense)).fontSize(22).fontWeight(FontWeight.Bold).fontColor('#e74c3c') }
          Column() { Text('今日收入').fontSize(12).fontColor('#999')
            Text(NumberUtils.formatMoney(this.todayIncome)).fontSize(22).fontWeight(FontWeight.Bold).fontColor('#27ae60') }
          Column() { Text('今日净额').fontSize(12).fontColor('#999')
            Text(this.todayNet).fontSize(22).fontWeight(FontWeight.Bold).fontColor('#333') }
        }
        .width('100%').justifyContent(FlexAlign.SpaceAround).padding({ top: 16, bottom: 16 })
        .backgroundColor('#fff').borderRadius(12).margin({ left: 16, right: 16, top: 8 })

        if (this.loading) {
          LoadingProgress().margin({ top: 60 })
        } else if (this.groups.length === 0) {
          Column() {
            Text('📝').fontSize(48).margin({ bottom: 12 })
            Text('还没有记录').fontSize(16).fontColor('#999')
            Text('点击下方 + 号开始记账').fontSize(14).fontColor('#ccc').margin({ top: 4 })
          }.width('100%').margin({ top: 60 })
        } else {
          List() {
            ForEach(this.groups, (group: TransactionGroup) => {
              ListItem() {
                Column() {
                  Text(group.label).fontSize(13).fontColor('#999')
                    .padding({ left: 16, top: 12, bottom: 4 }).width('100%')
                  ForEach(group.items, (item: Transaction) => {
                    ListItem() { this.TransactionItem(item) }
                  })
                }
              }
            })
          }
          .layoutWeight(1).scrollBar(BarState.Off)
        }

        Row() {
          Button() { Text('📊').fontSize(20) }.backgroundColor(Color.Transparent).onClick(() => this.goToStats())
          Button() { Text('+').fontSize(28).fontWeight(FontWeight.Lighter) }
            .width(56).height(56).borderRadius(28).backgroundColor('#e74c3c').fontColor(Color.White)
            .shadow({ radius: 8, color: '#e74c3c40' }).onClick(() => this.goToRecord())
          Button() { Text('⚙️').fontSize(20) }.backgroundColor(Color.Transparent)
            .onClick(() => router.pushUrl({ url: 'pages/SettingsPage' }))
        }
        .width('100%').height(64).justifyContent(FlexAlign.SpaceAround).backgroundColor('#fff')
      }
      .width('100%').height('100%').backgroundColor('#f5f5f5')

      if (this.showLoginDialog) {
        Column() {}.width('100%').height('100%').backgroundColor('#00000040')
        Column() {
          Column() {
            Row() {
              Text(this.loginIsRegister ? '📝 注册' : '🔐 登录').fontSize(18).fontWeight(FontWeight.Bold)
              Blank()
              Text('✕').fontSize(20).fontColor('#999').onClick(() => this.cancelLogin())
            }.width('100%').margin({ bottom: 16 })

            TextInput({ placeholder: '用户名', text: this.loginUsername })
              .onChange((v: string) => this.loginUsername = v)
              .width('100%').height(44).margin({ bottom: 12 }).borderRadius(8).backgroundColor('#f5f5f5')

            TextInput({ placeholder: '密码', text: this.loginPassword })
              .type(InputType.Password).onChange((v: string) => this.loginPassword = v)
              .width('100%').height(44).margin({ bottom: 12 }).borderRadius(8).backgroundColor('#f5f5f5')

            if (this.loginError) {
              Text(this.loginError).fontSize(12).fontColor('#e74c3c').margin({ bottom: 8 })
            }

            Button(this.loginIsRegister ? '注册' : '登录')
              .width('100%').height(44).fontSize(15).borderRadius(8)
              .backgroundColor(this.loginAgreed ? '#27ae60' : '#ccc')
              .fontColor(this.loginAgreed ? '#fff' : '#999')
              .enabled(this.loginAgreed && !this.loginLoading).onClick(() => this.doLogin())

            Row() {
              Text(this.loginIsRegister ? '已有账号？' : '没有账号？').fontSize(12).fontColor('#999')
              Text(this.loginIsRegister ? '去登录' : '去注册').fontSize(12).fontColor('#27ae60')
                .onClick(() => { this.loginIsRegister = !this.loginIsRegister; this.loginError = '' })
            }.width('100%').justifyContent(FlexAlign.Center).margin({ top: 12 })

            Row() {
              Text(this.loginAgreed ? '☑' : '☐').fontSize(16).fontColor('#666').onClick(() => this.toggleAgreed())
              Text(' 已阅读并同意 ').fontSize(11).fontColor('#999').onClick(() => this.toggleAgreed())
              Text('隐私政策').fontSize(11).fontColor('#2d6be0').decoration({ type: TextDecorationType.Underline })
                .onClick(() => { this.showPrivacyContent = 'privacy' })
              Text(' 和 ').fontSize(11).fontColor('#999')
              Text('用户条款').fontSize(11).fontColor('#2d6be0').decoration({ type: TextDecorationType.Underline })
                .onClick(() => { this.showPrivacyContent = 'terms' })
            }.width('100%').justifyContent(FlexAlign.Center).margin({ top: 12 })
          }
          .width('85%').padding(20).backgroundColor('#fff').borderRadius(16)
          .border({ width: 2, color: '#d4a017' })
        }
        .width('100%').justifyContent(FlexAlign.Center)
      }

      // 删除确认弹窗
      if (this.showDeleteDialog) {
        Column() {}.width('100%').height('100%').backgroundColor('#00000040')
        Column() {
          Column() {
            Text('⚠️ 确认删除').fontSize(17).fontWeight(FontWeight.Bold).margin({ bottom: 12 })
            Text('删除后无法恢复，确定要删除这条记录吗？').fontSize(14).fontColor('#666').margin({ bottom: 20 })
            Row() {
              Button('取消').fontSize(14).height(40).layoutWeight(1)
                .backgroundColor('#f0f0f0').fontColor('#666').borderRadius(8)
                .onClick((): void => { this.showDeleteDialog = false })
              Button('删除').fontSize(14).height(40).layoutWeight(1)
                .backgroundColor('#e74c3c').fontColor('#fff').borderRadius(8)
                .margin({ left: 12 })
                .onClick((): void => {
                  this.showDeleteDialog = false
                  this.deleteTransaction(this.deleteTargetId)
                })
            }.width('100%')
          }
          .width('80%').padding(24).backgroundColor('#fff').borderRadius(16)
        }
        .width('100%').justifyContent(FlexAlign.Center)
      }

      if (this.showPrivacyContent !== '') {
        Column() {}.width('100%').height('100%').backgroundColor('#00000050')
          .onClick(() => { this.showPrivacyContent = '' })
        Column() {
          Column() {
            Row() {
              Text(this.showPrivacyContent === 'privacy' ? '📄 隐私政策' : '📄 用户条款')
                .fontSize(17).fontWeight(FontWeight.Bold).layoutWeight(1)
              Text('✕').fontSize(20).fontColor('#999').onClick(() => { this.showPrivacyContent = '' })
            }.width('100%').margin({ bottom: 12 })

            Scroll() {
              Column() {
                if (this.showPrivacyContent === 'privacy') {
                  PolicySection({ title: '1. 信息收集', content: '本应用仅收集您主动提供的信息：\n• 用户名和密码（加密存储，仅用于登录验证）\n• 您录入的交易记录（金额、品类、备注等）\n\n我们不会收集您的设备标识、位置、通讯录或其他敏感信息。' })
                  PolicySection({ title: '2. 信息使用', content: '您的所有数据仅存储在设备本地数据库中。我们不向任何第三方传输您的数据。' })
                  PolicySection({ title: '3. 信息存储', content: '数据存储在设备本地 SQLite 数据库中。删除应用或清除数据将永久删除所有记录。建议您定期通过设置页的"数据导出"功能备份数据。' })
                  PolicySection({ title: '4. 第三方服务', content: '本应用不接入任何第三方服务，所有功能均为本地离线运行。' })
                  PolicySection({ title: '5. 用户权利', content: '您可以随时：\n• 在设置中导出您的全部数据\n• 删除单条或全部交易记录\n• 注销账号（删除所有数据）' })
                  PolicySection({ title: '6. 联系方式', content: '如有任何隐私相关问题，请通过以下方式联系我们：\n邮箱：445816282@qq.com' })
                } else {
                  PolicySection({ title: '1. 服务说明', content: '本应用（"快记交易"）提供个人记账功能。您使用本应用即表示同意本条款。' })
                  PolicySection({ title: '2. 用户责任', content: '• 您对录入数据的准确性和合法性负责\n• 不得利用本应用从事违法违规活动\n• 应妥善保管账号密码，因密码泄露导致的损失由您自行承担' })
                  PolicySection({ title: '3. 免责声明', content: '• 本应用按"现状"提供服务，不保证服务不会中断\n• 因不可抗力导致的数据丢失，开发者不承担责任' })
                  PolicySection({ title: '4. 知识产权', content: '本应用的所有权利（包括但不限于软件著作权、商标权）归开发者所有。未经许可，不得复制、修改、分发本应用。' })
                  PolicySection({ title: '5. 条款变更', content: '我们可能会不时更新本条款。重大变更将通过应用内通知告知您。继续使用即表示接受变更后的条款。' })
                  PolicySection({ title: '6. 联系我们', content: '如有任何问题，请发送邮件至：\n445816282@qq.com' })
                }
              }.width('100%').padding({ bottom: 8 })
            }.layoutWeight(1).scrollBar(BarState.Off)
          }
          .width('85%').height('70%').padding(20).backgroundColor('#fff').borderRadius(16)
        }
        .width('100%').justifyContent(FlexAlign.Center)
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  TransactionItem(item: Transaction) {
    Row() {
      Text(this.getCategoryIcon(item)).fontSize(28).width(44).textAlign(TextAlign.Center)
      Column() {
        Text(item.category).fontSize(16).fontWeight(FontWeight.Medium)
        if (item.note) {
          Text(item.note).fontSize(12).fontColor('#999').maxLines(1).textOverflow({ overflow: TextOverflow.Ellipsis })
        }
      }.alignItems(HorizontalAlign.Start).layoutWeight(1).margin({ left: 8 })
      Text(item.amountDisplay).fontSize(18).fontWeight(FontWeight.Medium)
        .fontColor(item.isIncome ? '#27ae60' : '#333')
      Text('🗑️').fontSize(14).fontColor('#e74c3c')
        .padding({ left: 8, right: 8, top: 6, bottom: 6 })
        .border({ width: 1, color: '#e74c3c', radius: 6 })
        .onClick((): void => {
          this.deleteTargetId = item.id
          this.showDeleteDialog = true
        })
    }
    .width('100%').padding({ left: 16, right: 16, top: 12, bottom: 12 }).backgroundColor('#fff')
    .border({ width: { bottom: 0.5 }, color: '#f0f0f0' })
  }

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

@Component
struct PolicySection {
  @Prop title: string = ''
  @Prop content: string = ''

  build() {
    Column() {
      Text(this.title).fontSize(14).fontWeight(FontWeight.Medium).fontColor('#333').width('100%').margin({ bottom: 6 })
      Text(this.content).fontSize(13).fontColor('#666').lineHeight(20).width('100%')
    }.width('100%').alignItems(HorizontalAlign.Start).margin({ bottom: 16 })
  }
}
