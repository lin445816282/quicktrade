if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SettingsPage_Params {
    categories?: Category[];
    loading?: boolean;
    showAddDialog?: boolean;
    showEditDialog?: boolean;
    editingCategory?: Category | null;
    grouped?: CategoryGroup[];
    exportFiles?: ExportFile[];
    exporting?: boolean;
    expenseExpanded?: boolean;
    incomeExpanded?: boolean;
    showAddIconPicker?: boolean;
    showEditIconPicker?: boolean;
    newName?: string;
    newIcon?: string;
    newType?: string;
    editName?: string;
    editIcon?: string;
    iconList?: string[];
}
import { DatabaseService } from "@bundle:com.xiaolin.quicktrade/entry/ets/service/DatabaseService";
import { ExportService } from "@bundle:com.xiaolin.quicktrade/entry/ets/service/ExportService";
import type { Category } from '../model/Category';
import { TransactionType } from "@bundle:com.xiaolin.quicktrade/entry/ets/model/Transaction";
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import type common from "@ohos:app.ability.common";
interface CategoryGroup {
    type: TransactionType;
    label: string;
    items: Category[];
}
class ExportFile {
    path: string = '';
    name: string = '';
}
class SettingsPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__categories = new ObservedPropertyObjectPU([], this, "categories");
        this.__loading = new ObservedPropertySimplePU(true, this, "loading");
        this.__showAddDialog = new ObservedPropertySimplePU(false, this, "showAddDialog");
        this.__showEditDialog = new ObservedPropertySimplePU(false, this, "showEditDialog");
        this.__editingCategory = new ObservedPropertyObjectPU(null, this, "editingCategory");
        this.__grouped = new ObservedPropertyObjectPU([], this, "grouped");
        this.__exportFiles = new ObservedPropertyObjectPU([], this, "exportFiles");
        this.__exporting = new ObservedPropertySimplePU(false, this, "exporting");
        this.__expenseExpanded = new ObservedPropertySimplePU(false, this, "expenseExpanded");
        this.__incomeExpanded = new ObservedPropertySimplePU(false, this, "incomeExpanded");
        this.__showAddIconPicker = new ObservedPropertySimplePU(false, this, "showAddIconPicker");
        this.__showEditIconPicker = new ObservedPropertySimplePU(false, this, "showEditIconPicker");
        this.__newName = new ObservedPropertySimplePU('', this, "newName");
        this.__newIcon = new ObservedPropertySimplePU('💰', this, "newIcon");
        this.__newType = new ObservedPropertySimplePU(TransactionType.EXPENSE, this, "newType");
        this.__editName = new ObservedPropertySimplePU('', this, "editName");
        this.__editIcon = new ObservedPropertySimplePU('', this, "editIcon");
        this.iconList = ['🍜', '🚗', '🛍️', '🧴', '🎮', '📱', '🏠', '💊', '📚',
            '💵', '📈', '💼', '↩️', '✨', '🎁', '🏥', '✈️', '🐱',
            '💰', '📌', '⭐', '💡', '🎯', '🔥', '🌈', '🌍', '🏆'];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SettingsPage_Params) {
        if (params.categories !== undefined) {
            this.categories = params.categories;
        }
        if (params.loading !== undefined) {
            this.loading = params.loading;
        }
        if (params.showAddDialog !== undefined) {
            this.showAddDialog = params.showAddDialog;
        }
        if (params.showEditDialog !== undefined) {
            this.showEditDialog = params.showEditDialog;
        }
        if (params.editingCategory !== undefined) {
            this.editingCategory = params.editingCategory;
        }
        if (params.grouped !== undefined) {
            this.grouped = params.grouped;
        }
        if (params.exportFiles !== undefined) {
            this.exportFiles = params.exportFiles;
        }
        if (params.exporting !== undefined) {
            this.exporting = params.exporting;
        }
        if (params.expenseExpanded !== undefined) {
            this.expenseExpanded = params.expenseExpanded;
        }
        if (params.incomeExpanded !== undefined) {
            this.incomeExpanded = params.incomeExpanded;
        }
        if (params.showAddIconPicker !== undefined) {
            this.showAddIconPicker = params.showAddIconPicker;
        }
        if (params.showEditIconPicker !== undefined) {
            this.showEditIconPicker = params.showEditIconPicker;
        }
        if (params.newName !== undefined) {
            this.newName = params.newName;
        }
        if (params.newIcon !== undefined) {
            this.newIcon = params.newIcon;
        }
        if (params.newType !== undefined) {
            this.newType = params.newType;
        }
        if (params.editName !== undefined) {
            this.editName = params.editName;
        }
        if (params.editIcon !== undefined) {
            this.editIcon = params.editIcon;
        }
        if (params.iconList !== undefined) {
            this.iconList = params.iconList;
        }
    }
    updateStateVars(params: SettingsPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__categories.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__showAddDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__showEditDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__editingCategory.purgeDependencyOnElmtId(rmElmtId);
        this.__grouped.purgeDependencyOnElmtId(rmElmtId);
        this.__exportFiles.purgeDependencyOnElmtId(rmElmtId);
        this.__exporting.purgeDependencyOnElmtId(rmElmtId);
        this.__expenseExpanded.purgeDependencyOnElmtId(rmElmtId);
        this.__incomeExpanded.purgeDependencyOnElmtId(rmElmtId);
        this.__showAddIconPicker.purgeDependencyOnElmtId(rmElmtId);
        this.__showEditIconPicker.purgeDependencyOnElmtId(rmElmtId);
        this.__newName.purgeDependencyOnElmtId(rmElmtId);
        this.__newIcon.purgeDependencyOnElmtId(rmElmtId);
        this.__newType.purgeDependencyOnElmtId(rmElmtId);
        this.__editName.purgeDependencyOnElmtId(rmElmtId);
        this.__editIcon.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__categories.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__showAddDialog.aboutToBeDeleted();
        this.__showEditDialog.aboutToBeDeleted();
        this.__editingCategory.aboutToBeDeleted();
        this.__grouped.aboutToBeDeleted();
        this.__exportFiles.aboutToBeDeleted();
        this.__exporting.aboutToBeDeleted();
        this.__expenseExpanded.aboutToBeDeleted();
        this.__incomeExpanded.aboutToBeDeleted();
        this.__showAddIconPicker.aboutToBeDeleted();
        this.__showEditIconPicker.aboutToBeDeleted();
        this.__newName.aboutToBeDeleted();
        this.__newIcon.aboutToBeDeleted();
        this.__newType.aboutToBeDeleted();
        this.__editName.aboutToBeDeleted();
        this.__editIcon.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __categories: ObservedPropertyObjectPU<Category[]>;
    get categories() {
        return this.__categories.get();
    }
    set categories(newValue: Category[]) {
        this.__categories.set(newValue);
    }
    private __loading: ObservedPropertySimplePU<boolean>;
    get loading() {
        return this.__loading.get();
    }
    set loading(newValue: boolean) {
        this.__loading.set(newValue);
    }
    private __showAddDialog: ObservedPropertySimplePU<boolean>;
    get showAddDialog() {
        return this.__showAddDialog.get();
    }
    set showAddDialog(newValue: boolean) {
        this.__showAddDialog.set(newValue);
    }
    private __showEditDialog: ObservedPropertySimplePU<boolean>;
    get showEditDialog() {
        return this.__showEditDialog.get();
    }
    set showEditDialog(newValue: boolean) {
        this.__showEditDialog.set(newValue);
    }
    private __editingCategory: ObservedPropertyObjectPU<Category | null>;
    get editingCategory() {
        return this.__editingCategory.get();
    }
    set editingCategory(newValue: Category | null) {
        this.__editingCategory.set(newValue);
    }
    private __grouped: ObservedPropertyObjectPU<CategoryGroup[]>;
    get grouped() {
        return this.__grouped.get();
    }
    set grouped(newValue: CategoryGroup[]) {
        this.__grouped.set(newValue);
    }
    private __exportFiles: ObservedPropertyObjectPU<ExportFile[]>;
    get exportFiles() {
        return this.__exportFiles.get();
    }
    set exportFiles(newValue: ExportFile[]) {
        this.__exportFiles.set(newValue);
    }
    private __exporting: ObservedPropertySimplePU<boolean>;
    get exporting() {
        return this.__exporting.get();
    }
    set exporting(newValue: boolean) {
        this.__exporting.set(newValue);
    }
    private __expenseExpanded: ObservedPropertySimplePU<boolean>;
    get expenseExpanded() {
        return this.__expenseExpanded.get();
    }
    set expenseExpanded(newValue: boolean) {
        this.__expenseExpanded.set(newValue);
    }
    private __incomeExpanded: ObservedPropertySimplePU<boolean>;
    get incomeExpanded() {
        return this.__incomeExpanded.get();
    }
    set incomeExpanded(newValue: boolean) {
        this.__incomeExpanded.set(newValue);
    }
    private __showAddIconPicker: ObservedPropertySimplePU<boolean>;
    get showAddIconPicker() {
        return this.__showAddIconPicker.get();
    }
    set showAddIconPicker(newValue: boolean) {
        this.__showAddIconPicker.set(newValue);
    }
    private __showEditIconPicker: ObservedPropertySimplePU<boolean>;
    get showEditIconPicker() {
        return this.__showEditIconPicker.get();
    }
    set showEditIconPicker(newValue: boolean) {
        this.__showEditIconPicker.set(newValue);
    }
    private __newName: ObservedPropertySimplePU<string>;
    get newName() {
        return this.__newName.get();
    }
    set newName(newValue: string) {
        this.__newName.set(newValue);
    }
    private __newIcon: ObservedPropertySimplePU<string>;
    get newIcon() {
        return this.__newIcon.get();
    }
    set newIcon(newValue: string) {
        this.__newIcon.set(newValue);
    }
    private __newType: ObservedPropertySimplePU<string>;
    get newType() {
        return this.__newType.get();
    }
    set newType(newValue: string) {
        this.__newType.set(newValue);
    }
    private __editName: ObservedPropertySimplePU<string>;
    get editName() {
        return this.__editName.get();
    }
    set editName(newValue: string) {
        this.__editName.set(newValue);
    }
    private __editIcon: ObservedPropertySimplePU<string>;
    get editIcon() {
        return this.__editIcon.get();
    }
    set editIcon(newValue: string) {
        this.__editIcon.set(newValue);
    }
    aboutToAppear() { this.loadData(); }
    onPageShow() { this.loadData(); }
    async loadData() {
        this.loading = true;
        try {
            this.categories = await DatabaseService.getCategories();
            this.buildGroups();
            const ctx = getContext(this) as common.UIAbilityContext;
            const files = ExportService.listFiles(ctx);
            this.exportFiles = [];
            for (let i = 0; i < files.length; i++) {
                const p: string = files[i];
                const idx: number = p.lastIndexOf('/');
                const ef: ExportFile = new ExportFile();
                ef.path = p;
                ef.name = idx >= 0 ? p.slice(idx + 1) : p;
                this.exportFiles.push(ef);
            }
        }
        catch (e) {
            console.error('SettingsPage loadData:', JSON.stringify(e));
        }
        this.loading = false;
    }
    buildGroups() {
        const expenseItems = this.categories.filter(c => c.type === TransactionType.EXPENSE || String(c.type) === 'expense');
        const incomeItems = this.categories.filter(c => c.type === TransactionType.INCOME || String(c.type) === 'income');
        this.grouped = [
            { type: TransactionType.EXPENSE, label: '💸 支出品类', items: expenseItems },
            { type: TransactionType.INCOME, label: '💰 收入品类', items: incomeItems }
        ];
    }
    deleteCategory(cat: Category) {
        AlertDialog.show({
            title: '确认删除', message: `确定删除「${cat.name}」吗？`, autoCancel: true,
            primaryButton: { value: '取消', action: () => { } },
            secondaryButton: { value: '删除', fontColor: '#e74c3c', action: () => { this.doDelete(cat); } }
        });
    }
    async doDelete(cat: Category) {
        try {
            await DatabaseService.deleteCategory(cat.id);
            promptAction.showToast({ message: `已删除「${cat.name}」`, duration: 1500 });
            this.loadData();
        }
        catch (e) {
            promptAction.showToast({ message: '删除失败', duration: 1500 });
        }
    }
    openEdit(cat: Category) { this.editingCategory = cat; this.editName = cat.name; this.editIcon = cat.icon; this.showEditIconPicker = false; this.showEditDialog = true; }
    async saveEdit() {
        if (!this.editingCategory)
            return;
        if (!this.editName.trim()) {
            promptAction.showToast({ message: '请输入类别名称', duration: 1500 });
            return;
        }
        try {
            await DatabaseService.updateCategory(this.editingCategory.id, this.editName.trim(), this.editIcon || '💰');
            promptAction.showToast({ message: '修改成功', duration: 1500 });
            this.showEditDialog = false;
            this.loadData();
        }
        catch (e) {
            promptAction.showToast({ message: '修改失败', duration: 1500 });
        }
    }
    async addCategory() {
        if (!this.newName.trim()) {
            promptAction.showToast({ message: '请输入类别名称', duration: 1500 });
            return;
        }
        try {
            await DatabaseService.addCategory(this.newName.trim(), this.newIcon || '💰', this.newType as TransactionType);
            promptAction.showToast({ message: '添加成功', duration: 1500 });
            this.showAddDialog = false;
            this.newName = '';
            this.newIcon = '💰';
            this.loadData();
        }
        catch (e) {
            promptAction.showToast({ message: '添加失败', duration: 1500 });
        }
    }
    async exportAndShare() {
        this.exporting = true;
        try {
            const ctx = getContext(this) as common.UIAbilityContext;
            const path = await ExportService.exportAll(ctx);
            const shared = await ExportService.shareFile(path, ctx);
            if (shared) {
                promptAction.showToast({ message: '已分享', duration: 1500 });
            }
            else {
                await ExportService.copyToClipboard(path);
                promptAction.showToast({ message: '已导出并复制到剪贴板', duration: 2000 });
            }
            this.loadData();
        }
        catch (e) {
            promptAction.showToast({ message: '导出失败', duration: 1500 });
        }
        finally {
            this.exporting = false;
        }
    }
    async shareFileItem(path: string) {
        try {
            const ctx = getContext(this) as common.UIAbilityContext;
            const shared = await ExportService.shareFile(path, ctx);
            if (!shared) {
                await ExportService.copyToClipboard(path);
                promptAction.showToast({ message: '已复制到剪贴板', duration: 1500 });
            }
        }
        catch (e) {
            promptAction.showToast({ message: '分享失败', duration: 1500 });
        }
    }
    async copyFile(path: string) {
        try {
            await ExportService.copyToClipboard(path);
            promptAction.showToast({ message: '已复制到剪贴板', duration: 1500 });
        }
        catch (e) {
            promptAction.showToast({ message: '复制失败', duration: 1500 });
        }
    }
    deleteExportFile(path: string) {
        const name = path.slice(path.lastIndexOf('/') + 1);
        AlertDialog.show({
            title: '确认删除', message: `确定删除「${name}」吗？`, autoCancel: true,
            primaryButton: { value: '取消', action: () => { } },
            secondaryButton: { value: '删除', fontColor: '#e74c3c', action: () => { ExportService.deleteFile(path); this.loadData(); } }
        });
    }
    private iconList: string[];
    toggleExpense() { this.expenseExpanded = !this.expenseExpanded; }
    toggleIncome() { this.incomeExpanded = !this.incomeExpanded; }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/SettingsPage.ets(144:5)", "entry");
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/SettingsPage.ets(145:7)", "entry");
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(146:9)", "entry");
            Row.width('100%');
            Row.height(48);
            Row.padding({ left: 16, right: 16 });
            Row.backgroundColor('#fff');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('←');
            Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(147:11)", "entry");
            Text.fontSize(18);
            Text.fontColor('#999');
            Text.onClick(() => router.back());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/SettingsPage.ets(148:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('⚙️ 设置');
            Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(149:11)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/SettingsPage.ets(150:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('  ');
            Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(151:11)", "entry");
            Text.fontSize(18);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/SettingsPage.ets(154:9)", "entry");
            Column.width('100%');
            Column.layoutWeight(1);
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // === 支出品类 ===
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/SettingsPage.ets(156:11)", "entry");
            // === 支出品类 ===
            Column.width('100%');
            // === 支出品类 ===
            Column.backgroundColor('#fff');
            // === 支出品类 ===
            Column.borderRadius(12);
            // === 支出品类 ===
            Column.margin({ left: 16, right: 16, top: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(157:13)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 10, bottom: this.expenseExpanded ? 4 : 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.expenseExpanded ? '▼ 收起' : '▶ 展开');
            Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(158:15)", "entry");
            Button.fontSize(11);
            Button.height(26);
            Button.padding({ left: 8, right: 8 });
            Button.backgroundColor('#f5f5f5');
            Button.fontColor('#666');
            Button.borderRadius(4);
            Button.onClick(() => this.toggleExpense());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('💸 支出品类');
            Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(160:15)", "entry");
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/SettingsPage.ets(161:15)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('+ 添加');
            Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(162:15)", "entry");
            Button.fontSize(11);
            Button.height(26);
            Button.padding({ left: 10, right: 10 });
            Button.backgroundColor('#27ae60');
            Button.fontColor('#fff');
            Button.borderRadius(4);
            Button.onClick(() => { this.newType = TransactionType.EXPENSE; this.newName = ''; this.newIcon = '💰'; this.showAddIconPicker = false; this.showAddDialog = true; });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.expenseExpanded) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const cat = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(168:17)", "entry");
                                Row.width('100%');
                                Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                                Row.border({ width: { bottom: 0.5 }, color: '#f5f5f5' });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(cat.icon);
                                Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(169:19)", "entry");
                                Text.fontSize(18);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(cat.name);
                                Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(170:19)", "entry");
                                Text.fontSize(15);
                                Text.fontColor('#333');
                                Text.margin({ left: 8 });
                                Text.layoutWeight(1);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel('✏️ 编辑');
                                Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(171:19)", "entry");
                                Button.fontSize(10);
                                Button.height(26);
                                Button.padding({ left: 6, right: 6 });
                                Button.backgroundColor('#f5f5f5');
                                Button.fontColor('#666');
                                Button.borderRadius(4);
                                Button.onClick(() => this.openEdit(cat));
                            }, Button);
                            Button.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel('🗑 删除');
                                Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(172:19)", "entry");
                                Button.fontSize(10);
                                Button.height(26);
                                Button.padding({ left: 6, right: 6 });
                                Button.backgroundColor('#fff');
                                Button.fontColor('#e74c3c');
                                Button.borderRadius(4);
                                Button.border({ width: 1, color: '#e74c3c' });
                                Button.margin({ left: 4 });
                                Button.onClick(() => this.deleteCategory(cat));
                            }, Button);
                            Button.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.grouped[0].items, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // === 支出品类 ===
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // === 收入品类 ===
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/SettingsPage.ets(179:11)", "entry");
            // === 收入品类 ===
            Column.width('100%');
            // === 收入品类 ===
            Column.backgroundColor('#fff');
            // === 收入品类 ===
            Column.borderRadius(12);
            // === 收入品类 ===
            Column.margin({ left: 16, right: 16, top: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(180:13)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 10, bottom: this.incomeExpanded ? 4 : 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.incomeExpanded ? '▼ 收起' : '▶ 展开');
            Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(181:15)", "entry");
            Button.fontSize(11);
            Button.height(26);
            Button.padding({ left: 8, right: 8 });
            Button.backgroundColor('#f5f5f5');
            Button.fontColor('#666');
            Button.borderRadius(4);
            Button.onClick(() => this.toggleIncome());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('💰 收入品类');
            Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(183:15)", "entry");
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/SettingsPage.ets(184:15)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('+ 添加');
            Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(185:15)", "entry");
            Button.fontSize(11);
            Button.height(26);
            Button.padding({ left: 10, right: 10 });
            Button.backgroundColor('#27ae60');
            Button.fontColor('#fff');
            Button.borderRadius(4);
            Button.onClick(() => { this.newType = TransactionType.INCOME; this.newName = ''; this.newIcon = '💰'; this.showAddIconPicker = false; this.showAddDialog = true; });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.incomeExpanded) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const cat = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(191:17)", "entry");
                                Row.width('100%');
                                Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                                Row.border({ width: { bottom: 0.5 }, color: '#f5f5f5' });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(cat.icon);
                                Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(192:19)", "entry");
                                Text.fontSize(18);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(cat.name);
                                Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(193:19)", "entry");
                                Text.fontSize(15);
                                Text.fontColor('#333');
                                Text.margin({ left: 8 });
                                Text.layoutWeight(1);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel('✏️ 编辑');
                                Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(194:19)", "entry");
                                Button.fontSize(10);
                                Button.height(26);
                                Button.padding({ left: 6, right: 6 });
                                Button.backgroundColor('#f5f5f5');
                                Button.fontColor('#666');
                                Button.borderRadius(4);
                                Button.onClick(() => this.openEdit(cat));
                            }, Button);
                            Button.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel('🗑 删除');
                                Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(195:19)", "entry");
                                Button.fontSize(10);
                                Button.height(26);
                                Button.padding({ left: 6, right: 6 });
                                Button.backgroundColor('#fff');
                                Button.fontColor('#e74c3c');
                                Button.borderRadius(4);
                                Button.border({ width: 1, color: '#e74c3c' });
                                Button.margin({ left: 4 });
                                Button.onClick(() => this.deleteCategory(cat));
                            }, Button);
                            Button.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.grouped[1].items, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // === 收入品类 ===
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // === 数据导出 ===
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/SettingsPage.ets(202:11)", "entry");
            // === 数据导出 ===
            Column.width('100%');
            // === 数据导出 ===
            Column.backgroundColor('#fff');
            // === 数据导出 ===
            Column.borderRadius(12);
            // === 数据导出 ===
            Column.margin({ left: 16, right: 16, top: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(203:13)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 14, bottom: 14 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📎 数据导出');
            Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(204:15)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/SettingsPage.ets(205:15)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('导出CSV');
            Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(206:15)", "entry");
            Button.fontSize(12);
            Button.height(28);
            Button.backgroundColor('#27ae60');
            Button.fontColor('#fff');
            Button.borderRadius(14);
            Button.padding({ left: 12, right: 12 });
            Button.enabled(!this.exporting);
            Button.onClick(() => this.exportAndShare());
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.exportFiles.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const f = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(211:17)", "entry");
                                Row.width('100%');
                                Row.padding({ left: 16, right: 8, top: 6, bottom: 6 });
                                Row.border({ width: { top: 0.5 }, color: '#f0f0f0' });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('📄 ' + f.name);
                                Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(212:19)", "entry");
                                Text.fontSize(12);
                                Text.fontColor('#333');
                                Text.layoutWeight(1);
                                Text.maxLines(1);
                                Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel('📤 分享');
                                Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(213:19)", "entry");
                                Button.fontSize(10);
                                Button.height(26);
                                Button.padding({ left: 8, right: 8 });
                                Button.backgroundColor('#e8f4fd');
                                Button.fontColor('#1989fa');
                                Button.borderRadius(4);
                                Button.onClick(() => this.shareFileItem(f.path));
                            }, Button);
                            Button.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel('📋 复制');
                                Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(214:19)", "entry");
                                Button.fontSize(10);
                                Button.height(26);
                                Button.padding({ left: 8, right: 8 });
                                Button.backgroundColor('#f5f5f5');
                                Button.fontColor('#666');
                                Button.borderRadius(4);
                                Button.margin({ left: 4 });
                                Button.onClick(() => this.copyFile(f.path));
                            }, Button);
                            Button.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel('🗑 删除');
                                Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(215:19)", "entry");
                                Button.fontSize(10);
                                Button.height(26);
                                Button.padding({ left: 8, right: 8 });
                                Button.backgroundColor('#fff');
                                Button.fontColor('#e74c3c');
                                Button.borderRadius(4);
                                Button.border({ width: 1, color: '#e74c3c' });
                                Button.margin({ left: 4 });
                                Button.onClick(() => this.deleteExportFile(f.path));
                            }, Button);
                            Button.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.exportFiles, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // === 数据导出 ===
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // === 关于 ===
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/SettingsPage.ets(222:11)", "entry");
            // === 关于 ===
            Column.width('100%');
            // === 关于 ===
            Column.backgroundColor('#fff');
            // === 关于 ===
            Column.borderRadius(12);
            // === 关于 ===
            Column.margin({ left: 16, right: 16, top: 12, bottom: 24 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('ℹ️ 关于');
            Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(223:13)", "entry");
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.width('100%');
            Text.padding({ left: 16, top: 12, bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(224:13)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('版本');
            Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(224:21)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('1.0.0');
            Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(224:80)", "entry");
            Text.fontSize(14);
            Text.fontColor('#333');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(225:13)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 8, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Phase');
            Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(225:21)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('2 — 统计看板');
            Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(225:83)", "entry");
            Text.fontSize(14);
            Text.fontColor('#333');
        }, Text);
        Text.pop();
        Row.pop();
        // === 关于 ===
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/SettingsPage.ets(228:11)", "entry");
        }, Blank);
        Blank.pop();
        Column.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // === 添加品类弹窗 ===
            if (this.showAddDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/SettingsPage.ets(234:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                        Column.backgroundColor('#00000050');
                        Column.onClick(() => { });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/SettingsPage.ets(235:11)", "entry");
                        Column.width('88%');
                        Column.padding({ left: 16, right: 16, top: 14, bottom: 14 });
                        Column.backgroundColor('#fff');
                        Column.borderRadius(12);
                        Column.border({ width: 2, color: '#d4a017' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(236:13)", "entry");
                        Row.width('100%');
                        Row.margin({ bottom: 10 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('添加品类');
                        Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(237:15)", "entry");
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/SettingsPage.ets(237:72)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✕');
                        Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(238:15)", "entry");
                        Text.fontSize(18);
                        Text.fontColor('#999');
                        Text.onClick(() => this.showAddDialog = false);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '品类名称', text: this.newName });
                        TextInput.debugLine("entry/src/main/ets/pages/SettingsPage.ets(240:13)", "entry");
                        TextInput.onChange((v: string) => this.newName = v);
                        TextInput.width('100%');
                        TextInput.height(36);
                        TextInput.margin({ bottom: 10 });
                        TextInput.borderRadius(6);
                        TextInput.backgroundColor('#f5f5f5');
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('选择图标');
                        Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(242:13)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#999');
                        Text.margin({ bottom: 4 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/SettingsPage.ets(243:13)", "entry");
                        Column.width('100%');
                        Column.margin({ bottom: 10 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(244:15)", "entry");
                        Row.padding({ left: 12, right: 12, top: 8, bottom: 8 });
                        Row.border({ width: 1, color: '#ddd' });
                        Row.borderRadius(6);
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.Center);
                        Row.onClick(() => { this.showAddIconPicker = !this.showAddIconPicker; });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.newIcon);
                        Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(245:17)", "entry");
                        Text.fontSize(24);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.showAddIconPicker ? '▲' : '▼');
                        Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(246:17)", "entry");
                        Text.fontSize(11);
                        Text.fontColor('#999');
                        Text.margin({ left: 6 });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.showAddIconPicker) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Scroll.create();
                                    Scroll.debugLine("entry/src/main/ets/pages/SettingsPage.ets(250:17)", "entry");
                                    Scroll.scrollable(ScrollDirection.Horizontal);
                                    Scroll.scrollBar(BarState.Off);
                                    Scroll.height(40);
                                }, Scroll);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(251:19)", "entry");
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const icon = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(icon);
                                            Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(253:23)", "entry");
                                            Text.fontSize(22);
                                            Text.padding({ left: 6, right: 6 });
                                            Text.onClick(() => { this.newIcon = icon; this.showAddIconPicker = false; });
                                            Text.backgroundColor(this.newIcon === icon ? '#e8f5e9' : 'transparent');
                                            Text.borderRadius(4);
                                        }, Text);
                                        Text.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, this.iconList, forEachItemGenFunction);
                                }, ForEach);
                                ForEach.pop();
                                Row.pop();
                                Scroll.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(261:13)", "entry");
                        Row.width('100%');
                        Row.margin({ top: 4 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(262:15)", "entry");
                        Button.fontSize(13);
                        Button.height(36);
                        Button.backgroundColor('#f5f5f5');
                        Button.fontColor('#666');
                        Button.onClick(() => this.showAddDialog = false);
                        Button.layoutWeight(1);
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('确定');
                        Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(263:15)", "entry");
                        Button.fontSize(13);
                        Button.height(36);
                        Button.backgroundColor('#27ae60');
                        Button.fontColor('#fff');
                        Button.onClick(() => this.addCategory());
                        Button.layoutWeight(1);
                        Button.margin({ left: 10 });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                    Column.pop();
                });
            }
            // === 编辑品类弹窗 ===
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // === 编辑品类弹窗 ===
            if (this.showEditDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/SettingsPage.ets(271:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                        Column.backgroundColor('#00000050');
                        Column.onClick(() => { });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/SettingsPage.ets(272:11)", "entry");
                        Column.width('88%');
                        Column.padding({ left: 16, right: 16, top: 14, bottom: 14 });
                        Column.backgroundColor('#fff');
                        Column.borderRadius(12);
                        Column.border({ width: 2, color: '#d4a017' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(273:13)", "entry");
                        Row.width('100%');
                        Row.margin({ bottom: 10 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('编辑品类');
                        Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(274:15)", "entry");
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/SettingsPage.ets(274:72)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✕');
                        Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(275:15)", "entry");
                        Text.fontSize(18);
                        Text.fontColor('#999');
                        Text.onClick(() => this.showEditDialog = false);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '品类名称', text: this.editName });
                        TextInput.debugLine("entry/src/main/ets/pages/SettingsPage.ets(277:13)", "entry");
                        TextInput.onChange((v: string) => this.editName = v);
                        TextInput.width('100%');
                        TextInput.height(36);
                        TextInput.margin({ bottom: 10 });
                        TextInput.borderRadius(6);
                        TextInput.backgroundColor('#f5f5f5');
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('选择图标');
                        Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(279:13)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#999');
                        Text.margin({ bottom: 4 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/SettingsPage.ets(280:13)", "entry");
                        Column.width('100%');
                        Column.margin({ bottom: 10 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(281:15)", "entry");
                        Row.padding({ left: 12, right: 12, top: 8, bottom: 8 });
                        Row.border({ width: 1, color: '#ddd' });
                        Row.borderRadius(6);
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.Center);
                        Row.onClick(() => { this.showEditIconPicker = !this.showEditIconPicker; });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.editIcon);
                        Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(282:17)", "entry");
                        Text.fontSize(24);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.showEditIconPicker ? '▲' : '▼');
                        Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(283:17)", "entry");
                        Text.fontSize(11);
                        Text.fontColor('#999');
                        Text.margin({ left: 6 });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.showEditIconPicker) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Scroll.create();
                                    Scroll.debugLine("entry/src/main/ets/pages/SettingsPage.ets(287:17)", "entry");
                                    Scroll.scrollable(ScrollDirection.Horizontal);
                                    Scroll.scrollBar(BarState.Off);
                                    Scroll.height(40);
                                }, Scroll);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(288:19)", "entry");
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const icon = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(icon);
                                            Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(290:23)", "entry");
                                            Text.fontSize(22);
                                            Text.padding({ left: 6, right: 6 });
                                            Text.onClick(() => { this.editIcon = icon; this.showEditIconPicker = false; });
                                            Text.backgroundColor(this.editIcon === icon ? '#e8f5e9' : 'transparent');
                                            Text.borderRadius(4);
                                        }, Text);
                                        Text.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, this.iconList, forEachItemGenFunction);
                                }, ForEach);
                                ForEach.pop();
                                Row.pop();
                                Scroll.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/SettingsPage.ets(298:13)", "entry");
                        Row.width('100%');
                        Row.margin({ top: 4 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(299:15)", "entry");
                        Button.fontSize(13);
                        Button.height(36);
                        Button.backgroundColor('#f5f5f5');
                        Button.fontColor('#666');
                        Button.onClick(() => this.showEditDialog = false);
                        Button.layoutWeight(1);
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('保存');
                        Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(300:15)", "entry");
                        Button.fontSize(13);
                        Button.height(36);
                        Button.backgroundColor('#27ae60');
                        Button.fontColor('#fff');
                        Button.onClick(() => this.saveEdit());
                        Button.layoutWeight(1);
                        Button.margin({ left: 10 });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "SettingsPage";
    }
}
registerNamedRoute(() => new SettingsPage(undefined, {}), "", { bundleName: "com.xiaolin.quicktrade", moduleName: "entry", pagePath: "pages/SettingsPage", pageFullPath: "entry/src/main/ets/pages/SettingsPage", integratedHsp: "false", moduleType: "followWithHap" });
