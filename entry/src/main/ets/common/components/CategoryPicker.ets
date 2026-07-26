/**
 * 品类选择器组件 — API 11 兼容版
 */
import { Category } from '../../model/Category'
import { TransactionType } from '../../model/Transaction'

@Component
export struct CategoryPicker {
  @Prop type: TransactionType = TransactionType.EXPENSE
  @Prop selected: string = '餐饮'
  onChange?: (category: string) => void

  @State localSelected: string = ''

  private expenseCategories: Category[] = []
  private incomeCategories: Category[] = []

  aboutToAppear() {
    this.localSelected = this.selected
    this.buildCategories()
  }

  buildCategories(): void {
    const ec: [string, string][] = [
      ['餐饮', '🍜'], ['交通', '🚗'], ['购物', '🛍️'], ['日用品', '🧴'],
      ['娱乐', '🎮'], ['通讯', '📱'], ['居住', '🏠'], ['医疗', '💊'],
      ['教育', '📚'], ['其他', '📌']
    ]
    for (let i = 0; i < ec.length; i++) {
      this.expenseCategories.push(Category.create(ec[i][0], ec[i][1], TransactionType.EXPENSE, 1))
    }
    const ic: [string, string][] = [
      ['工资', '💵'], ['投资', '📈'], ['兼职', '💼'],
      ['退款', '↩️'], ['其他', '📌']
    ]
    for (let i = 0; i < ic.length; i++) {
      this.incomeCategories.push(Category.create(ic[i][0], ic[i][1], TransactionType.INCOME, 1))
    }
  }

  get categories(): Category[] {
    return this.type === TransactionType.EXPENSE
      ? this.expenseCategories
      : this.incomeCategories
  }

  static getCategoryLabel(categoryName: string, type: TransactionType): string {
    const expenseIcons: Record<string, string> = {
      '餐饮': '🍜', '交通': '🚗', '购物': '🛍️', '日用品': '🧴',
      '娱乐': '🎮', '通讯': '📱', '居住': '🏠', '医疗': '💊',
      '教育': '📚', '其他': '📌'
    }
    const incomeIcons: Record<string, string> = {
      '工资': '💵', '投资': '📈', '兼职': '💼', '退款': '↩️', '其他': '📌'
    }
    const map = type === TransactionType.INCOME ? incomeIcons : expenseIcons
    const icon = map[categoryName]
    return icon ? `${icon} ${categoryName}` : `📌 ${categoryName}`
  }

  build() {
    Column() {
      Text('选择品类').fontSize(14).fontColor('#999').padding({ left: 4, bottom: 8 })
      Grid() {
        ForEach(this.categories, (cat: Category) => {
          GridItem() {
            Column() {
              Text(cat.icon).fontSize(24)
              Text(cat.name).fontSize(12).margin({ top: 4 })
            }
            .width('100%')
            .padding({ top: 10, bottom: 10 })
            .borderRadius(8)
            .backgroundColor(this.localSelected === cat.name ? '#e74c3c15' : '#fff')
            .border({
              width: this.localSelected === cat.name ? 1.5 : 0.5,
              color: this.localSelected === cat.name ? '#e74c3c' : '#eee'
            })
            .onClick(() => {
              this.localSelected = cat.name
              if (this.onChange) this.onChange(cat.name)
            })
          }
        })
      }
      .columnsTemplate('1fr 1fr 1fr 1fr 1fr')
      .columnsGap(8)
      .rowsGap(8)
    }
  }
}
