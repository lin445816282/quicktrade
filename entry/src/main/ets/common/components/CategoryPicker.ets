/**
 * 品类选择器 — V1 兼容版，if/else 直接渲染
 */
import { TransactionType } from '../../model/Transaction'

const EXPENSE_CATS: [string, string][] = [
  ['餐饮', '🍜'], ['交通', '🚗'], ['购物', '🛍️'], ['日用品', '🧴'],
  ['娱乐', '🎮'], ['通讯', '📱'], ['居住', '🏠'], ['医疗', '💊'],
  ['教育', '📚'], ['其他', '📌']
]

const INCOME_CATS: [string, string][] = [
  ['工资', '💵'], ['投资', '📈'], ['兼职', '💼'],
  ['退款', '↩️'], ['其他', '📌']
]

@Component
export struct CategoryPicker {
  @Prop type: TransactionType = TransactionType.EXPENSE
  @Prop selected: string = '餐饮'
  onChange?: (category: string) => void

  selectCat(cat: string) {
    if (this.onChange) {
      this.onChange(cat)
    }
  }

  build() {
    Column() {
      Text('选择品类').fontSize(14).fontColor('#999').padding({ left: 4, bottom: 8 })

      if (this.type === TransactionType.EXPENSE) {
        Grid() {
          ForEach(EXPENSE_CATS, (item: [string, string]) => {
            GridItem() {
              Column() {
                Text(item[1]).fontSize(24)
                Text(item[0]).fontSize(12).margin({ top: 4 })
              }
              .width('100%')
              .padding({ top: 10, bottom: 10 })
              .borderRadius(8)
              .backgroundColor(this.selected === item[0] ? '#e74c3c15' : '#fff')
              .border({
                width: this.selected === item[0] ? 1.5 : 0.5,
                color: this.selected === item[0] ? '#e74c3c' : '#eee'
              })
              .onClick(() => this.selectCat(item[0]))
            }
          })
        }
        .columnsTemplate('1fr 1fr 1fr 1fr 1fr')
        .columnsGap(8).rowsGap(8)
      } else {
        Grid() {
          ForEach(INCOME_CATS, (item: [string, string]) => {
            GridItem() {
              Column() {
                Text(item[1]).fontSize(24)
                Text(item[0]).fontSize(12).margin({ top: 4 })
              }
              .width('100%')
              .padding({ top: 10, bottom: 10 })
              .borderRadius(8)
              .backgroundColor(this.selected === item[0] ? '#27ae6015' : '#fff')
              .border({
                width: this.selected === item[0] ? 1.5 : 0.5,
                color: this.selected === item[0] ? '#27ae60' : '#eee'
              })
              .onClick(() => this.selectCat(item[0]))
            }
          })
        }
        .columnsTemplate('1fr 1fr 1fr 1fr 1fr')
        .columnsGap(8).rowsGap(8)
      }
    }
  }
}
