/**
 * 品类选择器组件
 * 从数据库动态加载品类
 */
import { Category, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../../model/Category'
import { TransactionType } from '../../model/Transaction'
import { DatabaseService } from '../../service/DatabaseService'

@ComponentV2
export struct CategoryPicker {
  /** 根据品类名获取图标（快速同步版：缓存命中用数据库，否则回退模板） */
  static getIcon(categoryName: string): string {
    // 读静态缓存（DatabaseService.getCategoryIconMap 加载后填充全局 iconMapCache）
    // 直接访问模块内的 iconMapCache 不可行（跨模块），改用 DatabaseService 暴露
    // 这里保留模板兜底，DatabaseService.getCategoryIconMap 异步预热后会覆盖
    const templateIcons: Record<string, string> = {
      '餐饮': '🍜', '交通': '🚗', '购物': '🛍️', '日用品': '🧴',
      '娱乐': '🎮', '通讯': '📱', '居住': '🏠', '医疗': '💊',
      '教育': '📚', '工资': '💵', '投资': '📈', '兼职': '💼',
      '退款': '↩️', '其他': '📌'
    }
    return templateIcons[categoryName] || '📌'
  }

  /** 根据品类名和类型获取带图标的标签（兼容旧接口，供 ConfirmCard 使用） */
  static getCategoryLabel(categoryName: string, type: TransactionType): string {
    return `${CategoryPicker.getIcon(categoryName)} ${categoryName}`
  }

  @Param type: TransactionType = TransactionType.EXPENSE
  @Param selected: string = '餐饮'
  @Event onChange?: (category: string) => void

  @Local categories: Category[] = []
  @Local catIconMap: Record<string, string> = {}

  aboutToAppear(): void {
    this.loadCategories()
  }

  @Monitor('type')
  onTypeChange(): void {
    this.loadCategories()
  }

  async loadCategories(): Promise<void> {
    try {
      const list = await DatabaseService.getCategories(this.type)
      this.categories = list.length > 0 ? list : (
        this.type === TransactionType.INCOME ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES
      )
      // 预加载图标缓存
      this.catIconMap = await DatabaseService.getCategoryIconMap()
    } catch (_e) {
      // 兜底用模板
      this.categories = this.type === TransactionType.INCOME
        ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES
    }
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
            .backgroundColor(this.selected === cat.name ? '#e74c3c15' : '#fff')
            .border({
              width: this.selected === cat.name ? 1.5 : 0.5,
              color: this.selected === cat.name ? '#e74c3c' : '#eee'
            })
            .onClick(() => {
              this.onChange?.(cat.name)
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
