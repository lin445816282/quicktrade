/**
 * 品类选择器 — 数据库动态加载 + 硬编码兜底
 */
import { TransactionType } from '../../model/Transaction'
import { DatabaseService } from '../../service/DatabaseService'

interface CatItem {
  name: string
  icon: string
}

const FALLBACK_EXPENSE: CatItem[] = [
  { name: '餐饮', icon: '🍜' }, { name: '交通', icon: '🚗' }, { name: '购物', icon: '🛍️' },
  { name: '日用品', icon: '🧴' }, { name: '娱乐', icon: '🎮' }, { name: '通讯', icon: '📱' },
  { name: '居住', icon: '🏠' }, { name: '医疗', icon: '💊' }, { name: '教育', icon: '📚' },
  { name: '其他', icon: '📌' }
]

const FALLBACK_INCOME: CatItem[] = [
  { name: '工资', icon: '💵' }, { name: '投资', icon: '📈' }, { name: '兼职', icon: '💼' },
  { name: '退款', icon: '↩️' }, { name: '其他', icon: '📌' }
]

@Component
export struct CategoryPicker {
  @Prop type: TransactionType = TransactionType.EXPENSE
  @Prop selected: string = '餐饮'
  onChange?: (category: string) => void

  @State expenseItems: CatItem[] = FALLBACK_EXPENSE
  @State incomeItems: CatItem[] = FALLBACK_INCOME

  aboutToAppear(): void {
    this.loadCategories()
  }

  async loadCategories(): Promise<void> {
    try {
      const cats = await DatabaseService.getCategories()
      if (cats.length === 0) return
      const exp: CatItem[] = []
      const inc: CatItem[] = []
      for (let i = 0; i < cats.length; i++) {
        const c = cats[i]
        const item: CatItem = { name: c.name, icon: c.icon || '📌' }
        if (c.type === TransactionType.EXPENSE || String(c.type) === 'expense') {
          exp.push(item)
        } else {
          inc.push(item)
        }
      }
      if (exp.length > 0) this.expenseItems = exp
      if (inc.length > 0) this.incomeItems = inc
    } catch (e) {
      // fallback to hardcoded
    }
  }

  selectCat(cat: string): void {
    if (this.onChange) this.onChange(cat)
  }

  static getCategoryLabel(name: string, _type: TransactionType): string {
    const all = [...FALLBACK_EXPENSE, ...FALLBACK_INCOME]
    for (let i = 0; i < all.length; i++) {
      if (all[i].name === name) return `${all[i].icon} ${name}`
    }
    return `📌 ${name}`
  }

  get activeColor(): string {
    return this.type === TransactionType.EXPENSE ? '#e74c3c' : '#27ae60'
  }

  build() {
    Column() {
      Text('选择品类').fontSize(14).fontColor('#999').padding({ left: 4, bottom: 8 })

      if (this.type === TransactionType.EXPENSE) {
        Grid() {
          ForEach(this.expenseItems, (item: CatItem): void => {
            GridItem() {
              Column() {
                Text(item.icon).fontSize(24)
                Text(item.name).fontSize(12).margin({ top: 4 })
              }
              .width('100%').padding({ top: 10, bottom: 10 }).borderRadius(8)
              .backgroundColor(this.selected === item.name ? '#e74c3c15' : '#fff')
              .border({
                width: this.selected === item.name ? 1.5 : 0.5,
                color: this.selected === item.name ? '#e74c3c' : '#eee'
              })
              .onClick((): void => { this.selectCat(item.name) })
            }
          })
        }
        .columnsTemplate('1fr 1fr 1fr 1fr 1fr').columnsGap(8).rowsGap(8)
      } else {
        Grid() {
          ForEach(this.incomeItems, (item: CatItem): void => {
            GridItem() {
              Column() {
                Text(item.icon).fontSize(24)
                Text(item.name).fontSize(12).margin({ top: 4 })
              }
              .width('100%').padding({ top: 10, bottom: 10 }).borderRadius(8)
              .backgroundColor(this.selected === item.name ? '#27ae6015' : '#fff')
              .border({
                width: this.selected === item.name ? 1.5 : 0.5,
                color: this.selected === item.name ? '#27ae60' : '#eee'
              })
              .onClick((): void => { this.selectCat(item.name) })
            }
          })
        }
        .columnsTemplate('1fr 1fr 1fr 1fr 1fr').columnsGap(8).rowsGap(8)
      }
    }
  }
}
