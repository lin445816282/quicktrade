/**
 * AI 确认卡片
 * 展示语音解析结果，允许编辑后确认保存
 */
import { AIParseResult } from '../../model/AIParseResult'
import { localISO } from '../../common/utils/DateUtils'
import { Transaction, TransactionType } from '../../model/Transaction'
import { Category, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../../model/Category'
import { CategoryPicker } from './CategoryPicker'

@ComponentV2
export struct ConfirmCard {
  @Param parseResult: AIParseResult = new AIParseResult()
  @Event onConfirm?: (tx: Transaction) => void
  @Event onCancel?: () => void

  @Local editType: TransactionType = TransactionType.EXPENSE
  @Local editAmount: string = ''
  @Local editCategory: string = '其他'
  @Local editNote: string = ''
  @Local showCategoryPicker: boolean = false

  aboutToAppear(): void {
    this.editType = this.parseResult.type
    this.editAmount = this.parseResult.amount > 0 ? this.parseResult.amount.toString() : ''
    this.editCategory = this.parseResult.category
    this.editNote = this.parseResult.note
  }

  /** 当前可选的品类列表 */
  private get categories(): Category[] {
    return this.editType === TransactionType.INCOME
      ? DEFAULT_INCOME_CATEGORIES
      : DEFAULT_EXPENSE_CATEGORIES
  }

  /** 置信度标签 */
  private get confidenceLabel(): string {
    if (this.parseResult.confidence >= 0.8) return '高置信'
    if (this.parseResult.confidence >= 0.6) return '中置信'
    return '低置信'
  }

  private get confidenceColor(): string {
    if (this.parseResult.confidence >= 0.8) return '#27ae60'
    if (this.parseResult.confidence >= 0.6) return '#f39c12'
    return '#e74c3c'
  }

  build() {
    Column() {
      // 标题栏
      Row() {
        Text('确认记账')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
        Blank()
        // 置信度
        Text(`${this.confidenceLabel} ${Math.round(this.parseResult.confidence * 100)}%`)
          .fontSize(12)
          .fontColor(this.confidenceColor)
          .padding({ left: 8, right: 8, top: 2, bottom: 2 })
          .backgroundColor(this.confidenceColor + '18')
          .borderRadius(4)
      }
      .width('100%')
      .padding({ bottom: 12 })

      // 语音原文
      if (this.parseResult.raw_text) {
        Text(`"${this.parseResult.raw_text}"`)
          .fontSize(13)
          .fontColor('#aaa')
          .fontStyle(FontStyle.Italic)
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .width('100%')
          .margin({ bottom: 12 })
      }

      // 收入/支出切换
      Row() {
        Button('支出')
          .fontSize(14)
          .fontColor(this.editType === TransactionType.EXPENSE ? '#fff' : '#666')
          .backgroundColor(this.editType === TransactionType.EXPENSE ? '#e74c3c' : '#f0f0f0')
          .borderRadius(8)
          .height(32)
          .layoutWeight(1)
          .onClick(() => {
            this.editType = TransactionType.EXPENSE
            // 切换类型时检查品类是否在新列表中
            const found = DEFAULT_EXPENSE_CATEGORIES.find(c => c.name === this.editCategory)
            if (!found) this.editCategory = '其他'
          })
        Button('收入')
          .fontSize(14)
          .fontColor(this.editType === TransactionType.INCOME ? '#fff' : '#666')
          .backgroundColor(this.editType === TransactionType.INCOME ? '#27ae60' : '#f0f0f0')
          .borderRadius(8)
          .height(32)
          .layoutWeight(1)
          .margin({ left: 8 })
          .onClick(() => {
            this.editType = TransactionType.INCOME
            const found = DEFAULT_INCOME_CATEGORIES.find(c => c.name === this.editCategory)
            if (!found) this.editCategory = '其他'
          })
      }
      .width('100%')
      .margin({ bottom: 12 })

      // 金额输入
      Row() {
        Text('¥')
          .fontSize(28)
          .fontWeight(FontWeight.Bold)
          .fontColor('#e74c3c')
          .margin({ right: 4 })
        TextInput({ text: this.editAmount, placeholder: '0.00' })
          .fontSize(28)
          .fontWeight(FontWeight.Bold)
          .type(InputType.Number)
          .placeholderColor('#ccc')
          .backgroundColor('#f8f8f8')
          .borderRadius(8)
          .layoutWeight(1)
          .onChange((value: string) => {
            this.editAmount = value
          })
      }
      .width('100%')
      .margin({ bottom: 12 })

      // 品类选择
      Row() {
        Text('品类')
          .fontSize(15)
          .fontColor('#666')
          .margin({ right: 12 })
        Text(CategoryPicker.getCategoryLabel(this.editCategory, this.editType))
          .fontSize(15)
        Blank()
        Image($r('sys.symbol.chevron_right'))
          .width(16)
          .height(16)
          .fillColor('#999')
      }
      .width('100%')
      .height(44)
      .padding({ left: 12, right: 12 })
      .backgroundColor('#f8f8f8')
      .borderRadius(8)
      .onClick(() => {
        this.showCategoryPicker = true
      })
      .margin({ bottom: 12 })

      // 品类选择弹窗
      if (this.showCategoryPicker) {
        Column() {
          ForEach(this.categories, (cat: Category) => {
            Row() {
              Text(`${cat.icon} ${cat.name}`)
                .fontSize(15)
                .fontColor(this.editCategory === cat.name ? '#3498db' : '#333')
                .fontWeight(this.editCategory === cat.name ? FontWeight.Bold : FontWeight.Regular)
            }
            .width('100%')
            .padding(12)
            .onClick(() => {
              this.editCategory = cat.name
              this.showCategoryPicker = false
            })
          })
        }
        .width('100%')
        .backgroundColor('#fff')
        .border({ width: 1, color: '#eee' })
        .borderRadius(8)
        .margin({ bottom: 12 })
      }

      // 备注
      TextInput({ text: this.editNote, placeholder: '添加备注...' })
        .fontSize(14)
        .placeholderColor('#ccc')
        .backgroundColor('#f8f8f8')
        .borderRadius(8)
        .height(40)
        .padding({ left: 12, right: 12 })
        .width('100%')
        .onChange((value: string) => {
          this.editNote = value
        })
        .margin({ bottom: 16 })

      // 操作按钮
      Row() {
        Button('取消')
          .fontSize(15)
          .fontColor('#999')
          .backgroundColor('#f0f0f0')
          .borderRadius(8)
          .height(44)
          .layoutWeight(1)
          .onClick(() => this.onCancel?.())

        Button('确认记账')
          .fontSize(15)
          .fontColor('#fff')
          .backgroundColor('#3498db')
          .borderRadius(8)
          .height(44)
          .layoutWeight(2)
          .margin({ left: 12 })
          .onClick(() => {
            const tx = new Transaction({
              type: this.editType,
              amount: parseFloat(this.editAmount) || 0,
              category: this.editCategory,
              note: this.editNote,
              created_at: localISO()
            })
            this.onConfirm?.(tx)
          })
      }
      .width('100%')
    }
    .padding(16)
    .backgroundColor('#fff')
    .borderRadius(12)
    .shadow({ radius: 8, color: '#00000015', offsetY: 2 })
  }
}
