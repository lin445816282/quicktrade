/**
 * 手动记账页
 * 金额输入 + 品类选择 + 备注 + 保存
 */
import { TransactionType } from '../model/Transaction'
import { RecordViewModel } from '../viewmodel/RecordViewModel'
import { CategoryPicker } from '../common/components/CategoryPicker'
import { AmountInput } from '../common/components/AmountInput'
import { DatabaseService } from '../service/DatabaseService'
import router from '@ohos.router'

@Entry
@Component
struct RecordPage {
  private vm: RecordViewModel = new RecordViewModel()

  aboutToAppear() {
    this.vm.reset()
  }

  async save() {
    if (!this.vm.canSave) {
      AlertDialog.show({ message: '请输入金额' })
      return
    }
    const tx = this.vm.buildTransaction()
    await DatabaseService.insert(tx)
    router.back()
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
          Text('保存')
            .fontSize(16)
            .fontColor(this.vm.canSave ? '#e74c3c' : '#ccc')
        }
        .backgroundColor(Color.Transparent)
        .enabled(this.vm.canSave)
        .onClick(() => this.save())
      }
      .width('100%')
      .height(48)
      .padding({ left: 16, right: 16 })
      .backgroundColor('#fff')

      Divider()

      // 收入/支出切换
      Row() {
        Button() {
          Text('📤 支出')
            .fontSize(12)
            .fontColor(this.vm.type === TransactionType.EXPENSE ? '#fff' : '#666')
        }
        .height(32)
        .borderRadius(16)
        .backgroundColor(this.vm.type === TransactionType.EXPENSE ? '#e74c3c' : '#f5f5f5')
        .onClick(() => this.vm.type = TransactionType.EXPENSE)

        Button() {
          Text('📥 收入')
            .fontSize(12)
            .fontColor(this.vm.type === TransactionType.INCOME ? '#fff' : '#666')
        }
        .height(32)
        .borderRadius(16)
        .backgroundColor(this.vm.type === TransactionType.INCOME ? '#27ae60' : '#f5f5f5')
        .onClick(() => this.vm.type = TransactionType.INCOME)
      }
      .width('100%')
      .justifyContent(FlexAlign.Center)
      .padding({ top: 8, bottom: 8 })

      // 品类选择
      CategoryPicker({
        type: this.vm.type,
        selected: this.vm.category,
        onChange: (cat: string) => { this.vm.category = cat }
      })
      .padding({ left: 16, right: 16, top: 12 })

      // 备注输入
      TextInput({ placeholder: '备注（选填）', text: this.vm.note })
        .height(44)
        .fontSize(15)
        .backgroundColor('#f5f5f5')
        .borderRadius(8)
        .margin({ left: 16, right: 16, top: 16 })
        .onChange((value: string) => { this.vm.note = value })

      Blank()

      // 数字键盘
      AmountInput({
        value: this.vm.amount,
        onDigit: (d: string) => this.vm.inputDigit(d),
        onDelete: () => this.vm.deleteDigit()
      })
      .padding({ left: 16, right: 16, bottom: 8 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#fff')
  }
}
