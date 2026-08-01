/**
 * 手动记账页
 */
import { Transaction, TransactionType } from '../model/Transaction'
import { CategoryPicker } from '../common/components/CategoryPicker'
import { AmountInput } from '../common/components/AmountInput'
import { DatabaseService } from '../service/DatabaseService'
import { AuthService } from '../service/AuthService'
import router from '@ohos.router'
import promptAction from '@ohos.promptAction'

@Entry
@Component
struct RecordPage {
  @State type: TransactionType = TransactionType.EXPENSE
  @State amount: string = '0'
  @State category: string = '餐饮'
  @State note: string = ''
  @State recordDate: Date = new Date()
  @State dateLabel: string = ''
  @State saving: boolean = false

  aboutToAppear() {
    if (!AuthService.isLoggedIn()) {
      router.replaceUrl({ url: 'pages/Index' })
      return
    }
    this.type = TransactionType.EXPENSE
    this.amount = '0'
    this.category = '餐饮'
    this.note = ''
    this.recordDate = new Date()
    this.dateLabel = this.formatDate(new Date())
    this.saving = false
  }

  inputDigit(digit: string): void {
    if (this.amount === '0' && digit !== '.') {
      this.amount = digit
    } else if (digit === '.' && this.amount.includes('.')) {
      return
    } else if (this.amount.includes('.') && this.amount.split('.')[1].length >= 2) {
      return
    } else {
      this.amount += digit
    }
  }

  deleteDigit(): void {
    if (this.amount.length <= 1) {
      this.amount = '0'
    } else {
      this.amount = this.amount.slice(0, -1)
    }
  }

  /** 格式化日期 */
  formatDate(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  /** 日期选择器 */
  openDatePicker() {
    this.getUIContext().showDatePickerDialog({
      start: new Date("2020-01-01"),
      end: new Date("2030-12-31"),
      selected: this.recordDate,
      showTime: false,
      onDateAccept: (val: Date) => {
        this.recordDate = val
        this.dateLabel = this.formatDate(val)
      }
    })
  }

  async save() {
    if (!AuthService.isLoggedIn()) {
      promptAction.showToast({ message: '请先登录', duration: 1500 })
      router.replaceUrl({ url: 'pages/Index' })
      return
    }
    const amt = parseFloat(this.amount) || 0
    if (amt <= 0) {
      AlertDialog.show({ message: '请输入金额' })
      return
    }
    if (this.saving) return
    this.saving = true
    try {
      const tx = new Transaction()
      tx.type = this.type
      tx.amount = amt
      tx.category = this.category
      tx.note = this.note
      tx.created_at = this.recordDate.toISOString()
      await DatabaseService.insert(tx)
      promptAction.showToast({ message: '保存成功', duration: 1500 })
      router.back()
    } catch (e) {
      console.error('RecordPage save failed:', JSON.stringify(e))
      promptAction.showToast({ message: '保存失败', duration: 2000 })
    }
    this.saving = false
  }

  build() {
    Column() {
      // 导航栏
      Row() {
        Button() { Text('取消').fontSize(16).fontColor('#333') }
          .backgroundColor(Color.Transparent)
          .onClick(() => router.back())
        Blank()
        Text('记一笔').fontSize(18).fontWeight(FontWeight.Medium)
        Blank()
        Button() {
          Text('保存').fontSize(16)
            .fontColor((parseFloat(this.amount) || 0) > 0 ? '#e74c3c' : '#ccc')
        }
        .backgroundColor(Color.Transparent)
        .enabled((parseFloat(this.amount) || 0) > 0 && !this.saving)
        .onClick(() => this.save())
      }
      .width('100%').height(48).padding({ left: 16, right: 16 }).backgroundColor('#fff')
      Divider()

      // 可滚动内容
      Scroll() {
        Column() {
          // 收入/支出切换
          Row() {
            Button() {
              Text('📤 支出').fontSize(14)
                .fontColor(this.type === TransactionType.EXPENSE ? '#fff' : '#666')
            }
            .height(36).borderRadius(18)
            .backgroundColor(this.type === TransactionType.EXPENSE ? '#e74c3c' : '#f5f5f5')
            .onClick(() => { this.type = TransactionType.EXPENSE })

            Button() {
              Text('📥 收入').fontSize(14)
                .fontColor(this.type === TransactionType.INCOME ? '#fff' : '#666')
            }
            .height(36).borderRadius(18)
            .backgroundColor(this.type === TransactionType.INCOME ? '#27ae60' : '#f5f5f5')
            .margin({ left: 12 })
            .onClick(() => { this.type = TransactionType.INCOME })
          }
          .width('100%').justifyContent(FlexAlign.Center).padding({ top: 12, bottom: 8 })

          // 品类选择
          CategoryPicker({
            type: this.type,
            selected: this.category,
            onChange: (cat: string) => { this.category = cat }
          })
          .padding({ left: 16, right: 16 })

          // 日期选择
          Row() {
            Text('📅 日期').fontSize(14).fontColor('#666')
            Blank()
            Text(this.dateLabel).fontSize(14).fontColor('#333')
            Text(' ▸').fontSize(14).fontColor('#ccc')
          }
          .width('100%')
          .height(44)
          .padding({ left: 16, right: 16 })
          .borderRadius(8)
          .backgroundColor('#f5f5f5')
          .margin({ left: 16, right: 16, top: 12 })
          .onClick(() => this.openDatePicker())

          // 备注
          TextInput({ placeholder: '备注（选填）', text: this.note })
            .height(44).fontSize(15)
            .backgroundColor('#f5f5f5').borderRadius(8)
            .margin({ left: 16, right: 16, top: 12, bottom: 12 })
            .onChange((value: string) => { this.note = value })

          // 数字键盘
          AmountInput({
            value: this.amount,
            onDigit: (d: string) => this.inputDigit(d),
            onDelete: () => this.deleteDigit()
          })
          .padding({ left: 16, right: 16, bottom: 16 })
        }
        .width('100%')
      }
      .layoutWeight(1).scrollBar(BarState.Off)
    }
    .width('100%').height('100%').backgroundColor('#fff')
  }
}
