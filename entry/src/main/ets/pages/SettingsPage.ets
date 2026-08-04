/**
 * 设置页 — 品类管理 + CSV 导出 + 文件管理 + 分享
 */
import { DatabaseService } from '../service/DatabaseService'
import { ExportService } from '../service/ExportService'
import { AuthService } from '../service/AuthService'
import { Category } from '../model/Category'
import { TransactionType } from '../model/Transaction'
import router from '@ohos.router'
import promptAction from '@ohos.promptAction'
import { common } from '@kit.AbilityKit'

interface CategoryGroup {
  type: TransactionType
  label: string
  items: Category[]
}

class ExportFile {
  path: string = ''
  name: string = ''
}

@Entry
@Component
struct SettingsPage {
  @State categories: Category[] = []
  @State loading: boolean = true
  @State showAddDialog: boolean = false
  @State showEditDialog: boolean = false
  @State editingCategory: Category | null = null
  @State grouped: CategoryGroup[] = []
  @State exportFiles: ExportFile[] = []
  @State exporting: boolean = false
  @State expenseExpanded: boolean = false
  @State incomeExpanded: boolean = false
  @State isLoggedIn: boolean = false
  @State showAddIconPicker: boolean = false
  @State showEditIconPicker: boolean = false
  @State newName: string = ''
  @State newIcon: string = '💰'
  @State newType: string = TransactionType.EXPENSE
  @State editName: string = ''
  @State editIcon: string = ''

  aboutToAppear() { this.loadData() }
  onPageShow() { this.loadData() }

  async loadData() {
    this.loading = true
    this.isLoggedIn = AuthService.isLoggedIn()
    try {
      this.categories = await DatabaseService.getCategories()
      this.buildGroups()
      const ctx = getContext(this) as common.UIAbilityContext
      const files = ExportService.listFiles(ctx)
      const newFiles: ExportFile[] = []
      for (let i = 0; i < files.length; i++) {
        const p: string = files[i]
        const idx: number = p.lastIndexOf('/')
        const ef: ExportFile = new ExportFile()
        ef.path = p; ef.name = idx >= 0 ? p.slice(idx + 1) : p
        newFiles.push(ef)
      }
      this.exportFiles = newFiles
    } catch (e) { console.error('SettingsPage loadData:', JSON.stringify(e)) }
    this.loading = false
  }

  buildGroups() {
    const expenseItems = this.categories.filter(c => c.type === TransactionType.EXPENSE || String(c.type) === 'expense')
    const incomeItems = this.categories.filter(c => c.type === TransactionType.INCOME || String(c.type) === 'income')
    this.grouped = [
      { type: TransactionType.EXPENSE, label: '💸 支出品类', items: expenseItems },
      { type: TransactionType.INCOME, label: '💰 收入品类', items: incomeItems }
    ]
  }

  deleteCategory(cat: Category) {
    AlertDialog.show({
      title: '确认删除', message: `确定删除「${cat.name}」吗？`, autoCancel: true,
      primaryButton: { value: '取消', action: () => {} },
      secondaryButton: { value: '删除', fontColor: '#e74c3c', action: () => { this.doDelete(cat) } }
    })
  }
  async doDelete(cat: Category) {
    try { await DatabaseService.deleteCategory(cat.id); promptAction.showToast({ message: `已删除「${cat.name}」`, duration: 1500 }); this.loadData() }
    catch (e) { promptAction.showToast({ message: '删除失败', duration: 1500 }) }
  }

  openEdit(cat: Category) { this.editingCategory = cat; this.editName = cat.name; this.editIcon = cat.icon; this.showEditIconPicker = false; this.showEditDialog = true }
  async saveEdit() {
    if (!this.editingCategory) return
    if (!this.editName.trim()) { promptAction.showToast({ message: '请输入类别名称', duration: 1500 }); return }
    try {
      await DatabaseService.updateCategory(this.editingCategory.id, this.editName.trim(), this.editIcon || '💰')
      // 本地更新
      this.categories = this.categories.map(c => {
        if (c.id === this.editingCategory!.id) {
          const u = new Category()
          u.id = c.id; u.name = this.editName.trim(); u.icon = this.editIcon || '💰'
          u.type = c.type; u.sort_order = c.sort_order
          return u
        }
        return c
      })
      this.buildGroups()
      // ArkUI ForEach 同 key 不刷新 — 折叠再展开强制重绘
      const isExpense = this.editingCategory!.type === TransactionType.EXPENSE || String(this.editingCategory!.type) === 'expense'
      if (isExpense) {
        this.expenseExpanded = false
        setTimeout(() => { this.expenseExpanded = true }, 50)
      } else {
        this.incomeExpanded = false
        setTimeout(() => { this.incomeExpanded = true }, 50)
      }
      promptAction.showToast({ message: '修改成功', duration: 1500 })
      this.showEditDialog = false
    }
    catch (e) { promptAction.showToast({ message: '修改失败', duration: 1500 }) }
  }

  async addCategory() {
    if (!this.newName.trim()) { promptAction.showToast({ message: '请输入类别名称', duration: 1500 }); return }
    try { await DatabaseService.addCategory(this.newName.trim(), this.newIcon || '💰', this.newType as TransactionType); promptAction.showToast({ message: '添加成功', duration: 1500 }); this.showAddDialog = false; this.newName = ''; this.newIcon = '💰'; this.loadData() }
    catch (e) { promptAction.showToast({ message: '添加失败', duration: 1500 }) }
  }

  async exportAndShare() {
    if (this.exporting) { promptAction.showToast({ message: '正在导出，请稍候', duration: 1000 }); return }
    this.exporting = true
    try {
      const ctx = getContext(this) as common.UIAbilityContext
      const path = await ExportService.exportAll(ctx)
      promptAction.showToast({ message: '导出成功', duration: 1500 })
      // 导出后立即分享
      const shared = await ExportService.shareFile(path, ctx)
      if (!shared) { await ExportService.copyToClipboard(path) }
      await this.loadData()
    } catch (e) { promptAction.showToast({ message: '导出失败', duration: 1500 }) }
    finally { this.exporting = false }
  }

  async shareFileItem(path: string) {
    try {
      const ctx = getContext(this) as common.UIAbilityContext
      const shared = await ExportService.shareFile(path, ctx)
      if (!shared) { await ExportService.copyToClipboard(path); promptAction.showToast({ message: '已复制到剪贴板', duration: 1500 }) }
    } catch (e) { promptAction.showToast({ message: '分享失败', duration: 1500 }) }
  }

  async copyFile(path: string) {
    try { await ExportService.copyToClipboard(path); promptAction.showToast({ message: '已复制到剪贴板', duration: 1500 }) }
    catch (e) { promptAction.showToast({ message: '复制失败', duration: 1500 }) }
  }

  deleteExportFile(path: string) {
    const name = path.slice(path.lastIndexOf('/') + 1)
    AlertDialog.show({
      title: '确认删除', message: `确定删除「${name}」吗？`, autoCancel: true,
      primaryButton: { value: '取消', action: () => {} },
      secondaryButton: { value: '删除', fontColor: '#e74c3c', action: () => { ExportService.deleteFile(path); this.loadData() } }
    })
  }

  private iconList: string[] = ['🍜','🚗','🛍️','🧴','🎮','📱','🏠','💊','📚',
    '💵','📈','💼','↩️','✨','🎁','🏥','✈️','🐱',
    '💰','📌','⭐','💡','🎯','🔥','🌈','🌍','🏆']

  toggleExpense() { this.expenseExpanded = !this.expenseExpanded }
  toggleIncome() { this.incomeExpanded = !this.incomeExpanded }

  build() {
    Stack() {
      Column() {
        Row() {
          Text('←').fontSize(18).fontColor('#999').onClick(() => router.back())
          Blank()
          Text('⚙️ 设置').fontSize(18).fontWeight(FontWeight.Medium)
          Blank()
          Text('  ').fontSize(18)
        }.width('100%').height(48).padding({ left: 16, right: 16 }).backgroundColor('#fff')

        Scroll() {
        Column() {
          // === 支出品类 ===
          Column() {
            Row() {
              Button(this.expenseExpanded ? '▼ 收起' : '▶ 展开').fontSize(11).height(26).padding({ left: 8, right: 8 })
                .backgroundColor('#f5f5f5').fontColor('#666').borderRadius(4).onClick(() => this.toggleExpense())
              Text('💸 支出品类').fontSize(15).fontWeight(FontWeight.Medium).margin({ left: 8 })
              Blank()
              Button('+ 添加').fontSize(11).height(26).padding({ left: 10, right: 10 })
                .backgroundColor('#27ae60').fontColor('#fff').borderRadius(4)
                .onClick(() => { this.newType = TransactionType.EXPENSE; this.newName = ''; this.newIcon = '💰'; this.showAddIconPicker = false; this.showAddDialog = true })
            }.width('100%').padding({ left: 16, right: 16, top: 10, bottom: this.expenseExpanded ? 4 : 10 })
            if (this.expenseExpanded && this.grouped.length > 0) {
              ForEach(this.grouped[0].items, (cat: Category) => {
                Row() {
                  Text(cat.icon).fontSize(18)
                  Text(cat.name).fontSize(15).fontColor('#333').margin({ left: 8 }).layoutWeight(1)
                  Button('✏️ 编辑').fontSize(10).height(26).padding({ left: 6, right: 6 }).backgroundColor('#f5f5f5').fontColor('#666').borderRadius(4).onClick(() => this.openEdit(cat))
                  Button('🗑 删除').fontSize(10).height(26).padding({ left: 6, right: 6 }).backgroundColor('#fff').fontColor('#e74c3c').borderRadius(4).border({ width: 1, color: '#e74c3c' }).margin({ left: 4 }).onClick(() => this.deleteCategory(cat))
                }.width('100%').padding({ left: 16, right: 16, top: 8, bottom: 8 }).border({ width: { bottom: 0.5 }, color: '#f5f5f5' })
              }, (cat: Category): string => String(cat.id))
            }
          }.width('100%').backgroundColor('#fff').borderRadius(12).margin({ left: 16, right: 16, top: 12 })

          // === 收入品类 ===
          Column() {
            Row() {
              Button(this.incomeExpanded ? '▼ 收起' : '▶ 展开').fontSize(11).height(26).padding({ left: 8, right: 8 })
                .backgroundColor('#f5f5f5').fontColor('#666').borderRadius(4).onClick(() => this.toggleIncome())
              Text('💰 收入品类').fontSize(15).fontWeight(FontWeight.Medium).margin({ left: 8 })
              Blank()
              Button('+ 添加').fontSize(11).height(26).padding({ left: 10, right: 10 })
                .backgroundColor('#27ae60').fontColor('#fff').borderRadius(4)
                .onClick(() => { this.newType = TransactionType.INCOME; this.newName = ''; this.newIcon = '💰'; this.showAddIconPicker = false; this.showAddDialog = true })
            }.width('100%').padding({ left: 16, right: 16, top: 10, bottom: this.incomeExpanded ? 4 : 10 })
            if (this.incomeExpanded && this.grouped.length > 1) {
              ForEach(this.grouped[1].items, (cat: Category) => {
                Row() {
                  Text(cat.icon).fontSize(18)
                  Text(cat.name).fontSize(15).fontColor('#333').margin({ left: 8 }).layoutWeight(1)
                  Button('✏️ 编辑').fontSize(10).height(26).padding({ left: 6, right: 6 }).backgroundColor('#f5f5f5').fontColor('#666').borderRadius(4).onClick(() => this.openEdit(cat))
                  Button('🗑 删除').fontSize(10).height(26).padding({ left: 6, right: 6 }).backgroundColor('#fff').fontColor('#e74c3c').borderRadius(4).border({ width: 1, color: '#e74c3c' }).margin({ left: 4 }).onClick(() => this.deleteCategory(cat))
                }.width('100%').padding({ left: 16, right: 16, top: 8, bottom: 8 }).border({ width: { bottom: 0.5 }, color: '#f5f5f5' })
              }, (cat: Category): string => String(cat.id))
            }
          }.width('100%').backgroundColor('#fff').borderRadius(12).margin({ left: 16, right: 16, top: 12 })

          // === 数据导出（仅登录用户可见）===
          if (this.isLoggedIn) {
          Column() {
            Row() {
              Text('📎 数据导出').fontSize(16).fontWeight(FontWeight.Medium)
              Blank()
              Button('导出CSV').fontSize(12).height(28).backgroundColor('#27ae60').fontColor('#fff')
                .borderRadius(14).padding({ left: 12, right: 12 }).enabled(!this.exporting).onClick(() => this.exportAndShare())
            }.width('100%').padding({ left: 16, right: 16, top: 14, bottom: 14 })
            if (this.exportFiles.length > 0) {
              ForEach(this.exportFiles, (f: ExportFile) => {
                Row() {
                  Text('📄 ' + f.name).fontSize(12).fontColor('#333').layoutWeight(1).maxLines(1).textOverflow({ overflow: TextOverflow.Ellipsis })
                  Button('📤 分享').fontSize(10).height(26).padding({ left: 8, right: 8 }).backgroundColor('#e8f4fd').fontColor('#1989fa').borderRadius(4).onClick(() => this.shareFileItem(f.path))
                  Button('📋 复制').fontSize(10).height(26).padding({ left: 8, right: 8 }).backgroundColor('#f5f5f5').fontColor('#666').borderRadius(4).margin({ left: 4 }).onClick(() => this.copyFile(f.path))
                  Button('🗑 删除').fontSize(10).height(26).padding({ left: 8, right: 8 }).backgroundColor('#fff').fontColor('#e74c3c').borderRadius(4).border({ width: 1, color: '#e74c3c' }).margin({ left: 4 }).onClick(() => this.deleteExportFile(f.path))
                }.width('100%').padding({ left: 16, right: 8, top: 6, bottom: 6 }).border({ width: { top: 0.5 }, color: '#f0f0f0' })
              }, (f: ExportFile): string => f.path)
            }
          }.width('100%').backgroundColor('#fff').borderRadius(12).margin({ left: 16, right: 16, top: 12 })
          }

          // === 关于 ===
          Column() {
            Text('ℹ️ 关于').fontSize(15).fontWeight(FontWeight.Medium).width('100%').padding({ left: 16, top: 12, bottom: 8 })
            Row() { Text('版本').fontSize(14).fontColor('#666').layoutWeight(1); Text('1.0.0').fontSize(14).fontColor('#333') }.width('100%').padding({ left: 16, right: 16, top: 8, bottom: 8 })
            Row() { Text('Phase').fontSize(14).fontColor('#666').layoutWeight(1); Text('2 — 统计看板').fontSize(14).fontColor('#333') }.width('100%').padding({ left: 16, right: 16, top: 8, bottom: 12 })
          }.width('100%').backgroundColor('#fff').borderRadius(12).margin({ left: 16, right: 16, top: 12, bottom: 24 })
        }.width('100%').justifyContent(FlexAlign.Start)
        }.layoutWeight(1).scrollBar(BarState.Off).edgeEffect(EdgeEffect.None).backgroundColor('#fff').align(Alignment.Top)
      }.width('100%').height('100%')

      // === 添加品类弹窗 ===
      if (this.showAddDialog) {
        Column() {
          Column() {
            Row() {
              Text('添加品类').fontSize(16).fontWeight(FontWeight.Medium); Blank()
              Text('✕').fontSize(18).fontColor('#999').onClick(() => this.showAddDialog = false)
            }.width('100%').margin({ bottom: 10 })
            TextInput({ placeholder: '品类名称', text: this.newName }).onChange((v: string) => this.newName = v)
              .width('100%').height(36).margin({ bottom: 10 }).borderRadius(6).backgroundColor('#f5f5f5')
            Text('选择图标').fontSize(12).fontColor('#999').margin({ bottom: 4 })
            Column() {
              Row() {
                Text(this.newIcon).fontSize(24)
                Text(this.showAddIconPicker ? '▲' : '▼').fontSize(11).fontColor('#999').margin({ left: 6 })
              }.padding({ left: 12, right: 12, top: 8, bottom: 8 }).border({ width: 1, color: '#ddd' }).borderRadius(6).width('100%').justifyContent(FlexAlign.Center)
              .onClick(() => { this.showAddIconPicker = !this.showAddIconPicker })
              if (this.showAddIconPicker) {
                Scroll() {
                  Row() {
                    ForEach(this.iconList, (icon: string) => {
                      Text(icon).fontSize(22).padding({ left: 6, right: 6 })
                        .onClick(() => { this.newIcon = icon; this.showAddIconPicker = false })
                        .backgroundColor(this.newIcon === icon ? '#e8f5e9' : 'transparent').borderRadius(4)
                    })
                  }
                }.scrollable(ScrollDirection.Horizontal).scrollBar(BarState.Off).height(40)
              }
            }.width('100%').margin({ bottom: 10 })
            Row() {
              Button('取消').fontSize(13).height(36).backgroundColor('#f5f5f5').fontColor('#666').onClick(() => this.showAddDialog = false).layoutWeight(1)
              Button('确定').fontSize(13).height(36).backgroundColor('#27ae60').fontColor('#fff').onClick(() => this.addCategory()).layoutWeight(1).margin({ left: 10 })
            }.width('100%').margin({ top: 4 })
          }.width('88%').padding({ left: 16, right: 16, top: 14, bottom: 14 }).backgroundColor('#fff').borderRadius(12).border({ width: 2, color: '#d4a017' })
        }.width('100%').height('100%').justifyContent(FlexAlign.Center).backgroundColor('#00000050').onClick(() => {})
      }

      // === 编辑品类弹窗 ===
      if (this.showEditDialog) {
        Column() {
          Column() {
            Row() {
              Text('编辑品类').fontSize(16).fontWeight(FontWeight.Medium); Blank()
              Text('✕').fontSize(18).fontColor('#999').onClick(() => this.showEditDialog = false)
            }.width('100%').margin({ bottom: 10 })
            TextInput({ placeholder: '品类名称', text: this.editName }).onChange((v: string) => this.editName = v)
              .width('100%').height(36).margin({ bottom: 10 }).borderRadius(6).backgroundColor('#f5f5f5')
            Text('选择图标').fontSize(12).fontColor('#999').margin({ bottom: 4 })
            Column() {
              Row() {
                Text(this.editIcon).fontSize(24)
                Text(this.showEditIconPicker ? '▲' : '▼').fontSize(11).fontColor('#999').margin({ left: 6 })
              }.padding({ left: 12, right: 12, top: 8, bottom: 8 }).border({ width: 1, color: '#ddd' }).borderRadius(6).width('100%').justifyContent(FlexAlign.Center)
              .onClick(() => { this.showEditIconPicker = !this.showEditIconPicker })
              if (this.showEditIconPicker) {
                Scroll() {
                  Row() {
                    ForEach(this.iconList, (icon: string) => {
                      Text(icon).fontSize(22).padding({ left: 6, right: 6 })
                        .onClick(() => { this.editIcon = icon; this.showEditIconPicker = false })
                        .backgroundColor(this.editIcon === icon ? '#e8f5e9' : 'transparent').borderRadius(4)
                    })
                  }
                }.scrollable(ScrollDirection.Horizontal).scrollBar(BarState.Off).height(40)
              }
            }.width('100%').margin({ bottom: 10 })
            Row() {
              Button('取消').fontSize(13).height(36).backgroundColor('#f5f5f5').fontColor('#666').onClick(() => this.showEditDialog = false).layoutWeight(1)
              Button('保存').fontSize(13).height(36).backgroundColor('#27ae60').fontColor('#fff').onClick(() => this.saveEdit()).layoutWeight(1).margin({ left: 10 })
            }.width('100%').margin({ top: 4 })
          }.width('88%').padding({ left: 16, right: 16, top: 14, bottom: 14 }).backgroundColor('#fff').borderRadius(12).border({ width: 2, color: '#d4a017' })
        }.width('100%').height('100%').justifyContent(FlexAlign.Center).backgroundColor('#00000050').onClick(() => {})
      }
    }.width('100%').height('100%')
  }
}
