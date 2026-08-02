if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RecordPage_Params {
    type?: TransactionType;
    amount?: string;
    category?: string;
    note?: string;
    recordDate?: Date;
    dateLabel?: string;
    saving?: boolean;
}
import { Transaction, TransactionType } from "@bundle:com.xiaolin.quicktrade/entry/ets/model/Transaction";
import { CategoryPicker } from "@bundle:com.xiaolin.quicktrade/entry/ets/common/components/CategoryPicker";
import { AmountInput } from "@bundle:com.xiaolin.quicktrade/entry/ets/common/components/AmountInput";
import { DatabaseService } from "@bundle:com.xiaolin.quicktrade/entry/ets/service/DatabaseService";
import { AuthService } from "@bundle:com.xiaolin.quicktrade/entry/ets/service/AuthService";
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
class RecordPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__type = new ObservedPropertySimplePU(TransactionType.EXPENSE, this, "type");
        this.__amount = new ObservedPropertySimplePU('0', this, "amount");
        this.__category = new ObservedPropertySimplePU('餐饮', this, "category");
        this.__note = new ObservedPropertySimplePU('', this, "note");
        this.__recordDate = new ObservedPropertyObjectPU(new Date(), this, "recordDate");
        this.__dateLabel = new ObservedPropertySimplePU('', this, "dateLabel");
        this.__saving = new ObservedPropertySimplePU(false, this, "saving");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RecordPage_Params) {
        if (params.type !== undefined) {
            this.type = params.type;
        }
        if (params.amount !== undefined) {
            this.amount = params.amount;
        }
        if (params.category !== undefined) {
            this.category = params.category;
        }
        if (params.note !== undefined) {
            this.note = params.note;
        }
        if (params.recordDate !== undefined) {
            this.recordDate = params.recordDate;
        }
        if (params.dateLabel !== undefined) {
            this.dateLabel = params.dateLabel;
        }
        if (params.saving !== undefined) {
            this.saving = params.saving;
        }
    }
    updateStateVars(params: RecordPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__type.purgeDependencyOnElmtId(rmElmtId);
        this.__amount.purgeDependencyOnElmtId(rmElmtId);
        this.__category.purgeDependencyOnElmtId(rmElmtId);
        this.__note.purgeDependencyOnElmtId(rmElmtId);
        this.__recordDate.purgeDependencyOnElmtId(rmElmtId);
        this.__dateLabel.purgeDependencyOnElmtId(rmElmtId);
        this.__saving.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__type.aboutToBeDeleted();
        this.__amount.aboutToBeDeleted();
        this.__category.aboutToBeDeleted();
        this.__note.aboutToBeDeleted();
        this.__recordDate.aboutToBeDeleted();
        this.__dateLabel.aboutToBeDeleted();
        this.__saving.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __type: ObservedPropertySimplePU<TransactionType>;
    get type() {
        return this.__type.get();
    }
    set type(newValue: TransactionType) {
        this.__type.set(newValue);
    }
    private __amount: ObservedPropertySimplePU<string>;
    get amount() {
        return this.__amount.get();
    }
    set amount(newValue: string) {
        this.__amount.set(newValue);
    }
    private __category: ObservedPropertySimplePU<string>;
    get category() {
        return this.__category.get();
    }
    set category(newValue: string) {
        this.__category.set(newValue);
    }
    private __note: ObservedPropertySimplePU<string>;
    get note() {
        return this.__note.get();
    }
    set note(newValue: string) {
        this.__note.set(newValue);
    }
    private __recordDate: ObservedPropertyObjectPU<Date>;
    get recordDate() {
        return this.__recordDate.get();
    }
    set recordDate(newValue: Date) {
        this.__recordDate.set(newValue);
    }
    private __dateLabel: ObservedPropertySimplePU<string>;
    get dateLabel() {
        return this.__dateLabel.get();
    }
    set dateLabel(newValue: string) {
        this.__dateLabel.set(newValue);
    }
    private __saving: ObservedPropertySimplePU<boolean>;
    get saving() {
        return this.__saving.get();
    }
    set saving(newValue: boolean) {
        this.__saving.set(newValue);
    }
    aboutToAppear() {
        if (!AuthService.isLoggedIn()) {
            router.replaceUrl({ url: 'pages/Index' });
            return;
        }
        this.type = TransactionType.EXPENSE;
        this.amount = '0';
        this.category = '餐饮';
        this.note = '';
        this.recordDate = new Date();
        this.dateLabel = this.formatDate(new Date());
        this.saving = false;
    }
    inputDigit(digit: string): void {
        if (this.amount === '0' && digit !== '.') {
            this.amount = digit;
        }
        else if (digit === '.' && this.amount.includes('.')) {
            return;
        }
        else if (this.amount.includes('.') && this.amount.split('.')[1].length >= 2) {
            return;
        }
        else {
            this.amount += digit;
        }
    }
    deleteDigit(): void {
        if (this.amount.length <= 1) {
            this.amount = '0';
        }
        else {
            this.amount = this.amount.slice(0, -1);
        }
    }
    /** 格式化日期 */
    formatDate(d: Date): string {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }
    /** 日期选择器 */
    openDatePicker() {
        this.getUIContext().showDatePickerDialog({
            start: new Date("2020-01-01"),
            end: new Date("2030-12-31"),
            selected: this.recordDate,
            showTime: false,
            onDateAccept: (val: Date) => {
                this.recordDate = val;
                this.dateLabel = this.formatDate(val);
            }
        });
    }
    async save() {
        if (!AuthService.isLoggedIn()) {
            promptAction.showToast({ message: '请先登录', duration: 1500 });
            router.replaceUrl({ url: 'pages/Index' });
            return;
        }
        const amt = parseFloat(this.amount) || 0;
        if (amt <= 0) {
            AlertDialog.show({ message: '请输入金额' });
            return;
        }
        if (this.saving)
            return;
        this.saving = true;
        try {
            const tx = new Transaction();
            tx.type = this.type;
            tx.amount = amt;
            tx.category = this.category;
            tx.note = this.note;
            const d = this.recordDate;
            const p = (n: number): string => String(n).padStart(2, '0');
            tx.created_at = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
            await DatabaseService.insert(tx);
            promptAction.showToast({ message: '保存成功', duration: 1500 });
            router.back();
        }
        catch (e) {
            console.error('RecordPage save failed:', JSON.stringify(e));
            promptAction.showToast({ message: '保存失败', duration: 2000 });
        }
        this.saving = false;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/RecordPage.ets(112:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#fff');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 导航栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/RecordPage.ets(114:7)", "entry");
            // 导航栏
            Row.width('100%');
            // 导航栏
            Row.height(48);
            // 导航栏
            Row.padding({ left: 16, right: 16 });
            // 导航栏
            Row.backgroundColor('#fff');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/pages/RecordPage.ets(115:9)", "entry");
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => router.back());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('取消');
            Text.debugLine("entry/src/main/ets/pages/RecordPage.ets(115:20)", "entry");
            Text.fontSize(16);
            Text.fontColor('#333');
        }, Text);
        Text.pop();
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/RecordPage.ets(118:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('记一笔');
            Text.debugLine("entry/src/main/ets/pages/RecordPage.ets(119:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/RecordPage.ets(120:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/pages/RecordPage.ets(121:9)", "entry");
            Button.backgroundColor(Color.Transparent);
            Button.enabled((parseFloat(this.amount) || 0) > 0 && !this.saving);
            Button.onClick(() => this.save());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('保存');
            Text.debugLine("entry/src/main/ets/pages/RecordPage.ets(122:11)", "entry");
            Text.fontSize(16);
            Text.fontColor((parseFloat(this.amount) || 0) > 0 ? '#e74c3c' : '#ccc');
        }, Text);
        Text.pop();
        Button.pop();
        // 导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/RecordPage.ets(130:7)", "entry");
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 可滚动内容
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/RecordPage.ets(133:7)", "entry");
            // 可滚动内容
            Scroll.layoutWeight(1);
            // 可滚动内容
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/RecordPage.ets(134:9)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 收入/支出切换
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/RecordPage.ets(136:11)", "entry");
            // 收入/支出切换
            Row.width('100%');
            // 收入/支出切换
            Row.justifyContent(FlexAlign.Center);
            // 收入/支出切换
            Row.padding({ top: 12, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/pages/RecordPage.ets(137:13)", "entry");
            Button.height(36);
            Button.borderRadius(18);
            Button.backgroundColor(this.type === TransactionType.EXPENSE ? '#e74c3c' : '#f5f5f5');
            Button.onClick(() => { this.type = TransactionType.EXPENSE; });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📤 支出');
            Text.debugLine("entry/src/main/ets/pages/RecordPage.ets(138:15)", "entry");
            Text.fontSize(14);
            Text.fontColor(this.type === TransactionType.EXPENSE ? '#fff' : '#666');
        }, Text);
        Text.pop();
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/pages/RecordPage.ets(145:13)", "entry");
            Button.height(36);
            Button.borderRadius(18);
            Button.backgroundColor(this.type === TransactionType.INCOME ? '#27ae60' : '#f5f5f5');
            Button.margin({ left: 12 });
            Button.onClick(() => { this.type = TransactionType.INCOME; });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📥 收入');
            Text.debugLine("entry/src/main/ets/pages/RecordPage.ets(146:15)", "entry");
            Text.fontSize(14);
            Text.fontColor(this.type === TransactionType.INCOME ? '#fff' : '#666');
        }, Text);
        Text.pop();
        Button.pop();
        // 收入/支出切换
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.padding({ left: 16, right: 16 });
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 品类选择
                    CategoryPicker(this, {
                        type: this.type,
                        selected: this.category,
                        onChange: (cat: string) => { this.category = cat; }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/RecordPage.ets", line: 157, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            type: this.type,
                            selected: this.category,
                            onChange: (cat: string) => { this.category = cat; }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        type: this.type,
                        selected: this.category
                    });
                }
            }, { name: "CategoryPicker" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期选择
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/RecordPage.ets(165:11)", "entry");
            // 日期选择
            Row.width('100%');
            // 日期选择
            Row.height(44);
            // 日期选择
            Row.padding({ left: 16, right: 16 });
            // 日期选择
            Row.borderRadius(8);
            // 日期选择
            Row.backgroundColor('#f5f5f5');
            // 日期选择
            Row.margin({ left: 16, right: 16, top: 12 });
            // 日期选择
            Row.onClick(() => this.openDatePicker());
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📅 日期');
            Text.debugLine("entry/src/main/ets/pages/RecordPage.ets(166:13)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/RecordPage.ets(167:13)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.dateLabel);
            Text.debugLine("entry/src/main/ets/pages/RecordPage.ets(168:13)", "entry");
            Text.fontSize(14);
            Text.fontColor('#333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(' ▸');
            Text.debugLine("entry/src/main/ets/pages/RecordPage.ets(169:13)", "entry");
            Text.fontSize(14);
            Text.fontColor('#ccc');
        }, Text);
        Text.pop();
        // 日期选择
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 备注
            TextInput.create({ placeholder: '备注（选填）', text: this.note });
            TextInput.debugLine("entry/src/main/ets/pages/RecordPage.ets(180:11)", "entry");
            // 备注
            TextInput.height(44);
            // 备注
            TextInput.fontSize(15);
            // 备注
            TextInput.backgroundColor('#f5f5f5');
            // 备注
            TextInput.borderRadius(8);
            // 备注
            TextInput.margin({ left: 16, right: 16, top: 12, bottom: 12 });
            // 备注
            TextInput.onChange((value: string) => { this.note = value; });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.padding({ left: 16, right: 16, bottom: 16 });
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 数字键盘
                    AmountInput(this, {
                        value: this.amount,
                        onDigit: (d: string) => this.inputDigit(d),
                        onDelete: () => this.deleteDigit()
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/RecordPage.ets", line: 187, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            value: this.amount,
                            onDigit: (d: string) => this.inputDigit(d),
                            onDelete: () => this.deleteDigit()
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        value: this.amount
                    });
                }
            }, { name: "AmountInput" });
        }
        __Common__.pop();
        Column.pop();
        // 可滚动内容
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "RecordPage";
    }
}
registerNamedRoute(() => new RecordPage(undefined, {}), "", { bundleName: "com.xiaolin.quicktrade", moduleName: "entry", pagePath: "pages/RecordPage", pageFullPath: "entry/src/main/ets/pages/RecordPage", integratedHsp: "false", moduleType: "followWithHap" });
