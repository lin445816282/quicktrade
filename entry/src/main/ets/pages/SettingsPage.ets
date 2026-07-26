/**
 * 设置页 — Phase 2
 * 品类管理（增删改）+ CSV 导出
 */
import { DatabaseService } from '../service/DatabaseService'
import { ExportService } from '../service/ExportService'
import { Category } from '../model/Category'
import { TransactionType } from '../model/Transaction'
import { AuthService } from '../service/AuthService'
import router from '@ohos.router'
import promptAction from '@ohos.promptAction'

interface CategoryGroup {
  type: TransactionType
  label: string
  items: Category[]
}

@Entry
@Component
struct SettingsPage {
  @State categories: Category[] = []
  @State loading: boolean = true
  @State showAddDialog: boolean = false
  @State showEditDialog: boolean = false
  @State editingCategory: Category | null = null
  // 新增表单字段
  @State newName: string = ''
  @State newIcon: string = '💰'
  @State newType: string = TransactionType.EXPENSE
  // 编辑表单字段
  @State editName: string = ''
  @State editIcon: string = ''

  aboutToAppear() {
    this.loadData()
  }

  onPageShow() {
    this.loadData()
  }

  async loadData() {
    this.loading = true
    try {
      this.categories = await DatabaseService.getCategories()
    } catch (e) {
      console.error('SettingsPage loadData:', JSON.stringify(e))
    }
    this.loading = false
  }

  /** 分组 */
  get grouped(): CategoryGroup[] {
    const expenseItems = this.categories.filter(c => c.type === TransactionType.EXPENSE)
    const incomeItems = this.categories.filter(c => c.type === TransactionType.INCOME)
    return [
      { type: TransactionType.EXPENSE, label: '💸 支出品类', items: expenseItems },
      { type: TransactionType.INCOME, label: '💰 收入品类', items: incomeItems }
    ]
  }

  /** 删除品类 */
  async deleteCategory(cat: Category) {
    try {
      await DatabaseService.deleteCategory(cat.id)
      promptAction.showToast({ message: `已删除「${cat.name}」`, duration: 1500 })
      this.loadData()
    } catch (e) {
      promptAction.showToast({ message: '删除失败', duration: 1500 })
    }
  }

  /** 打开编辑弹窗 */
  openEdit(cat: Category) {
    this.editingCategory = cat
    this.editName = cat.name
    this.editIcon = cat.icon
    this.showEditDialog = true
  }

  /** 保存编辑 */
  async saveEdit() {
    if (!this.editingCategory) return
    const name = this.editName.trim()
    if (!name) {
      promptAction.showToast({ message: '请输入品类名称', duration: 1500 })
      return
    }
    try {
      await DatabaseService.updateCategory(this.editingCategory.id, name, this.editIcon || '💰')
      promptAction.showToast({ message: '修改成功', duration: 1500 })
      this.showEditDialog = false
      this.loadData()
    } catch (e) {
      promptAction.showToast({ message: '修改失败', duration: 1500 })
    }
  }

  /** 添加品类 */
  async addCategory() {
    const name = this.newName.trim()
    if (!name) {
      promptAction.showToast({ message: '请输入品类名称', duration: 1500 })
      return
    }
    try {
      await DatabaseService.addCategory(name, this.newIcon || '💰', this.newType as TransactionType)
      promptAction.showToast({ message: '添加成功', duration: 1500 })
      this.showAddDialog = false
      this.newName = ''
      this.newIcon = '💰'
      this.loadData()
    } catch (e) {
      promptAction.showToast({ message: '添加失败', duration: 1500 })
    }
  }

  /** CSV 导出 */
  async exportCSV() {
    try {
      const ctx = getContext(this)
      const path = await ExportService.exportAll(ctx)
      promptAction.showToast({ message: `已导出到 ${path.slice(0, 40)}...`, duration: 2500 })
    } catch (e) {
      console.error('Export failed:', JSON.stringify(e))
      promptAction.showToast({ message: '导出失败', duration: 1500 })
    }
  }

  /** 预定义图标列表 */
  get iconOptions(): string[] {
    return ['🍜','🚗','🛍️','🧴','🎮','📱','🏠','💊','📚',
            '💵','📈','💼','↩️','✨','🎁','🏥','✈️','🐱',
            '💰','📌','⭐','💡','🎯','🔥','🌈','🌍','🏆']
  }

  build() {
    Stack() {
      Column() {
        // === 顶部导航 ===
        Row() {
          Text('←').fontSize(18).fontColor('#999').onClick(() => router.back())
          Blank()
          Text('⚙️ 设置').fontSize(18).fontWeight(FontWeight.Medium)
          Blank()
          Text('  ').fontSize(18)
        }
        .width('100%')
        .height(48)
        .padding({ left: 16, right: 16 })
        .backgroundColor('#fff')

        Scroll() {
          Column() {
            // === CSV 导出 ===
            Column() {
              Row() {
                Text('📎 数据导出').fontSize(16).fontWeight(FontWeight.Medium)
                Blank()
                Text('导出 →').fontSize(13).fontColor('#666')
              }
              .width('100%')
              .padding({ left: 16, right: 16, top: 14, bottom: 14 })
              .onClick(() => this.exportCSV())
              .border({ width: { bottom: 0.5 }, color: '#f0f0f0' })
            }
            .width('100%')
            .backgroundColor('#fff')
            .borderRadius(12)
            .margin({ left: 16, right: 16, top: 12 })

            // === 品类管理 ===
            ForEach(this.grouped, (group: CategoryGroup) => {
              Column() {
                Row() {
                  Text(group.label).fontSize(15).fontWeight(FontWeight.Medium)
                  Blank()
                  Text('+ 添加').fontSize(13).fontColor('#27ae60')
                    .onClick(() => {
                      this.newType = group.type
                      this.newName = ''
                      this.newIcon = '💰'
                      this.showAddDialog = true
                    })
                }
                .width('100%')
                .padding({ left: 16, right: 16, top: 12, bottom: 4 })

                ForEach(group.items, (cat: Category) => {
                  Row() {
                    Text(cat.icon).fontSize(18)
                    Text(cat.name).fontSize(15).fontColor('#333').margin({ left: 8 }).layoutWeight(1)
                    // 预设品类不可删除（通过 sort_order 判断）
                    if (cat.sort_order >= 100) {
                      Text('✏️').fontSize(14).fontColor('#999')
                        .padding(6).onClick(() => this.openEdit(cat))
                      Text('🗑️').fontSize(14).fontColor('#e74c3c')
                        .padding(6).onClick(() => this.deleteCategory(cat))
                    }
                  }
                  .width('100%')
                  .padding({ left: 16, right: 16, top: 8, bottom: 8 })
                  .border({ width: { bottom: 0.5 }, color: '#f5f5f5' })
                })
              }
              .width('100%')
              .backgroundColor('#fff')
              .borderRadius(12)
              .margin({ left: 16, right: 16, top: 12 })
            })

            // === 关于 ===
            Column() {
              Text('ℹ️ 关于').fontSize(15).fontWeight(FontWeight.Medium)
                .width('100%').padding({ left: 16, top: 12, bottom: 8 })

              Row() {
                Text('用户').fontSize(14).fontColor('#666').layoutWeight(1)
                Text(AuthService.getCurrentUsername()).fontSize(14).fontColor('#333')
              }
              .width('100%').padding({ left: 16, right: 16, top: 8, bottom: 8 })

              Row() {
                Text('版本').fontSize(14).fontColor('#666').layoutWeight(1)
                Text('1.0.0').fontSize(14).fontColor('#333')
              }
              .width('100%').padding({ left: 16, right: 16, top: 8, bottom: 8 })

              Row() {
                Text('Phase').fontSize(14).fontColor('#666').layoutWeight(1)
                Text('3 — 用户系统').fontSize(14).fontColor('#333')
              }
              .width('100%').padding({ left: 16, right: 16, top: 8, bottom: 12 })

              // 登出
              Row() {
                Text('退出登录').fontSize(15).fontColor('#e74c3c').fontWeight(FontWeight.Medium)
              }
              .width('100%')
              .padding({ left: 16, top: 14, bottom: 14 })
              .onClick(() => { AuthService.logout(); router.replaceUrl({ url: 'pages/LoginPage' }) })
              .border({ width: { top: 0.5 }, color: '#f0f0f0' })
            }
            .width('100%')
            .backgroundColor('#fff')
            .borderRadius(12)
            .margin({ left: 16, right: 16, top: 12, bottom: 24 })
          }
          .width('100%')
        }
        .layoutWeight(1)
        .scrollBar(BarState.Off)
      }
      .width('100%')
      .height('100%')
      .backgroundColor('#f5f5f5')

      // === 添加品类弹窗 ===
      if (this.showAddDialog) {
        Column() {
          Column() {
            Text('添加品类').fontSize(17).fontWeight(FontWeight.Medium)
              .width('100%').textAlign(TextAlign.Center).margin({ top: 16, bottom: 12 })

            // 品类名输入
            TextInput({ placeholder: '品类名称', text: this.newName })
              .onChange((v: string) => this.newName = v)
              .width('100%').height(40).margin({ bottom: 12 })

            // 图标选择
            Text('选择图标').fontSize(13).fontColor('#999').margin({ bottom: 6 })
            Grid() {
              ForEach(this.iconOptions, (icon: string) => {
                GridItem() {
                  Text(icon).fontSize(22).textAlign(TextAlign.Center)
                    .width('100%')
                    .onClick(() => { this.newIcon = icon })
                    .borderRadius(4)
                    .backgroundColor(this.newIcon === icon ? '#e8f5e9' : 'transparent')
                }
              })
            }
            .columnsTemplate('1fr 1fr 1fr 1fr 1fr 1fr 1fr')
            .rowsGap(6)
            .columnsGap(4)
            .width('100%')
            .margin({ bottom: 12 })

            Row() {
              Button('取消').fontSize(14)
                .backgroundColor('#f5f5f5').fontColor('#666')
                .onClick(() => this.showAddDialog = false)
                .layoutWeight(1)
              Button('确定').fontSize(14)
                .backgroundColor('#27ae60').fontColor('#fff')
                .onClick(() => this.addCategory())
                .layoutWeight(1)
                .margin({ left: 12 })
            }
            .width('100%')
          }
          .width('80%')
          .padding({ left: 20, right: 20, bottom: 16 })
          .backgroundColor('#fff')
          .borderRadius(12)
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
        .backgroundColor('#00000050')
        .onClick(() => {}) // 阻止穿透
      }

      // === 编辑品类弹窗 ===
      if (this.showEditDialog) {
        Column() {
          Column() {
            Text('编辑品类').fontSize(17).fontWeight(FontWeight.Medium)
              .width('100%').textAlign(TextAlign.Center).margin({ top: 16, bottom: 12 })

            TextInput({ placeholder: '品类名称', text: this.editName })
              .onChange((v: string) => this.editName = v)
              .width('100%').height(40).margin({ bottom: 12 })

            Text('选择图标').fontSize(13).fontColor('#999').margin({ bottom: 6 })
            Grid() {
              ForEach(this.iconOptions, (icon: string) => {
                GridItem() {
                  Text(icon).fontSize(22).textAlign(TextAlign.Center)
                    .width('100%')
                    .onClick(() => { this.editIcon = icon })
                    .borderRadius(4)
                    .backgroundColor(this.editIcon === icon ? '#e8f5e9' : 'transparent')
                }
              })
            }
            .columnsTemplate('1fr 1fr 1fr 1fr 1fr 1fr 1fr')
            .rowsGap(6)
            .columnsGap(4)
            .width('100%')
            .margin({ bottom: 12 })

            Row() {
              Button('取消').fontSize(14)
                .backgroundColor('#f5f5f5').fontColor('#666')
                .onClick(() => this.showEditDialog = false)
                .layoutWeight(1)
              Button('保存').fontSize(14)
                .backgroundColor('#27ae60').fontColor('#fff')
                .onClick(() => this.saveEdit())
                .layoutWeight(1)
                .margin({ left: 12 })
            }
            .width('100%')
          }
          .width('80%')
          .padding({ left: 20, right: 20, bottom: 16 })
          .backgroundColor('#fff')
          .borderRadius(12)
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
        .backgroundColor('#00000050')
        .onClick(() => {})
      }
    }
    .width('100%')
    .height('100%')
  }
}
