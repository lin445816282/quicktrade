if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CategoryPicker_Params {
    type?: TransactionType;
    selected?: string;
    onChange?: (category: string) => void;
    expenseItems?: CatItem[];
    incomeItems?: CatItem[];
}
import { TransactionType } from "@bundle:com.xiaolin.quicktrade/entry/ets/model/Transaction";
import { DatabaseService } from "@bundle:com.xiaolin.quicktrade/entry/ets/service/DatabaseService";
interface CatItem {
    name: string;
    icon: string;
}
const FALLBACK_EXPENSE: CatItem[] = [
    { name: '餐饮', icon: '🍜' }, { name: '交通', icon: '🚗' }, { name: '购物', icon: '🛍️' },
    { name: '日用品', icon: '🧴' }, { name: '娱乐', icon: '🎮' }, { name: '通讯', icon: '📱' },
    { name: '居住', icon: '🏠' }, { name: '医疗', icon: '💊' }, { name: '教育', icon: '📚' },
    { name: '其他', icon: '📌' }
];
const FALLBACK_INCOME: CatItem[] = [
    { name: '工资', icon: '💵' }, { name: '投资', icon: '📈' }, { name: '兼职', icon: '💼' },
    { name: '退款', icon: '↩️' }, { name: '其他', icon: '📌' }
];
export class CategoryPicker extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__type = new SynchedPropertySimpleOneWayPU(params.type, this, "type");
        this.__selected = new SynchedPropertySimpleOneWayPU(params.selected, this, "selected");
        this.onChange = undefined;
        this.__expenseItems = new ObservedPropertyObjectPU(FALLBACK_EXPENSE, this, "expenseItems");
        this.__incomeItems = new ObservedPropertyObjectPU(FALLBACK_INCOME, this, "incomeItems");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CategoryPicker_Params) {
        if (params.type === undefined) {
            this.__type.set(TransactionType.EXPENSE);
        }
        if (params.selected === undefined) {
            this.__selected.set('餐饮');
        }
        if (params.onChange !== undefined) {
            this.onChange = params.onChange;
        }
        if (params.expenseItems !== undefined) {
            this.expenseItems = params.expenseItems;
        }
        if (params.incomeItems !== undefined) {
            this.incomeItems = params.incomeItems;
        }
    }
    updateStateVars(params: CategoryPicker_Params) {
        this.__type.reset(params.type);
        this.__selected.reset(params.selected);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__type.purgeDependencyOnElmtId(rmElmtId);
        this.__selected.purgeDependencyOnElmtId(rmElmtId);
        this.__expenseItems.purgeDependencyOnElmtId(rmElmtId);
        this.__incomeItems.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__type.aboutToBeDeleted();
        this.__selected.aboutToBeDeleted();
        this.__expenseItems.aboutToBeDeleted();
        this.__incomeItems.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __type: SynchedPropertySimpleOneWayPU<TransactionType>;
    get type() {
        return this.__type.get();
    }
    set type(newValue: TransactionType) {
        this.__type.set(newValue);
    }
    private __selected: SynchedPropertySimpleOneWayPU<string>;
    get selected() {
        return this.__selected.get();
    }
    set selected(newValue: string) {
        this.__selected.set(newValue);
    }
    private onChange?: (category: string) => void;
    private __expenseItems: ObservedPropertyObjectPU<CatItem[]>;
    get expenseItems() {
        return this.__expenseItems.get();
    }
    set expenseItems(newValue: CatItem[]) {
        this.__expenseItems.set(newValue);
    }
    private __incomeItems: ObservedPropertyObjectPU<CatItem[]>;
    get incomeItems() {
        return this.__incomeItems.get();
    }
    set incomeItems(newValue: CatItem[]) {
        this.__incomeItems.set(newValue);
    }
    aboutToAppear(): void {
        this.loadCategories();
    }
    async loadCategories(): Promise<void> {
        try {
            const cats = await DatabaseService.getCategories();
            if (cats.length === 0)
                return;
            const exp: CatItem[] = [];
            const inc: CatItem[] = [];
            for (let i = 0; i < cats.length; i++) {
                const c = cats[i];
                const item: CatItem = { name: c.name, icon: c.icon || '📌' };
                if (c.type === TransactionType.EXPENSE || String(c.type) === 'expense') {
                    exp.push(item);
                }
                else {
                    inc.push(item);
                }
            }
            if (exp.length > 0)
                this.expenseItems = exp;
            if (inc.length > 0)
                this.incomeItems = inc;
        }
        catch (e) {
            // fallback to hardcoded
        }
    }
    selectCat(cat: string): void {
        if (this.onChange)
            this.onChange(cat);
    }
    static getCategoryLabel(name: string, _type: TransactionType): string {
        const all = [...FALLBACK_EXPENSE, ...FALLBACK_INCOME];
        for (let i = 0; i < all.length; i++) {
            if (all[i].name === name)
                return `${all[i].icon} ${name}`;
        }
        return `📌 ${name}`;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/common/components/CategoryPicker.ets(76:5)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('选择品类');
            Text.debugLine("entry/src/main/ets/common/components/CategoryPicker.ets(77:7)", "entry");
            Text.fontSize(14);
            Text.fontColor('#999');
            Text.padding({ left: 4, bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.type === TransactionType.EXPENSE) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Grid.create();
                        Grid.debugLine("entry/src/main/ets/common/components/CategoryPicker.ets(80:9)", "entry");
                        Grid.columnsTemplate('1fr 1fr 1fr 1fr 1fr');
                        Grid.columnsGap(8);
                        Grid.rowsGap(8);
                    }, Grid);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    GridItem.create(() => { }, false);
                                    GridItem.debugLine("entry/src/main/ets/common/components/CategoryPicker.ets(82:13)", "entry");
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, GridItem);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.debugLine("entry/src/main/ets/common/components/CategoryPicker.ets(83:15)", "entry");
                                        Column.width('100%');
                                        Column.padding({ top: 10, bottom: 10 });
                                        Column.borderRadius(8);
                                        Column.backgroundColor(this.selected === item.name ? '#e74c3c15' : '#fff');
                                        Column.border({
                                            width: this.selected === item.name ? 1.5 : 0.5,
                                            color: this.selected === item.name ? '#e74c3c' : '#eee'
                                        });
                                        Column.onClick((): void => { this.selectCat(item.name); });
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.icon);
                                        Text.debugLine("entry/src/main/ets/common/components/CategoryPicker.ets(84:17)", "entry");
                                        Text.fontSize(24);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.name);
                                        Text.debugLine("entry/src/main/ets/common/components/CategoryPicker.ets(85:17)", "entry");
                                        Text.fontSize(12);
                                        Text.margin({ top: 4 });
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    GridItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.expenseItems, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Grid.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Grid.create();
                        Grid.debugLine("entry/src/main/ets/common/components/CategoryPicker.ets(99:9)", "entry");
                        Grid.columnsTemplate('1fr 1fr 1fr 1fr 1fr');
                        Grid.columnsGap(8);
                        Grid.rowsGap(8);
                    }, Grid);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    GridItem.create(() => { }, false);
                                    GridItem.debugLine("entry/src/main/ets/common/components/CategoryPicker.ets(101:13)", "entry");
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, GridItem);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.debugLine("entry/src/main/ets/common/components/CategoryPicker.ets(102:15)", "entry");
                                        Column.width('100%');
                                        Column.padding({ top: 10, bottom: 10 });
                                        Column.borderRadius(8);
                                        Column.backgroundColor(this.selected === item.name ? '#27ae6015' : '#fff');
                                        Column.border({
                                            width: this.selected === item.name ? 1.5 : 0.5,
                                            color: this.selected === item.name ? '#27ae60' : '#eee'
                                        });
                                        Column.onClick((): void => { this.selectCat(item.name); });
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.icon);
                                        Text.debugLine("entry/src/main/ets/common/components/CategoryPicker.ets(103:17)", "entry");
                                        Text.fontSize(24);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.name);
                                        Text.debugLine("entry/src/main/ets/common/components/CategoryPicker.ets(104:17)", "entry");
                                        Text.fontSize(12);
                                        Text.margin({ top: 4 });
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    GridItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.incomeItems, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Grid.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
