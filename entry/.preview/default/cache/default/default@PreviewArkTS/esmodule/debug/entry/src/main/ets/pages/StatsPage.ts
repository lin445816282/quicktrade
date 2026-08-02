if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface StatsPage_Params {
    totalIncome?: number;
    totalExpense?: number;
    dayTotals?: DailyTotal[];
    expenseCats?: CatStat[];
    incomeCats?: CatStat[];
    listTab?: number;
    loading?: boolean;
    startDate?: Date;
    endDate?: Date;
    startLabel?: string;
    endLabel?: string;
    activePreset?: number;
    chartSettings?: RenderingContextSettings;
    chartCtx?: CanvasRenderingContext2D;
}
import { DatabaseService } from "@bundle:com.xiaolin.quicktrade/entry/ets/service/DatabaseService";
import { TransactionType } from "@bundle:com.xiaolin.quicktrade/entry/ets/model/Transaction";
import type { Transaction } from "@bundle:com.xiaolin.quicktrade/entry/ets/model/Transaction";
import { NumberUtils } from "@bundle:com.xiaolin.quicktrade/entry/ets/common/utils/NumberUtils";
import router from "@ohos:router";
class CatStat {
    category: string = '';
    total: number = 0;
    icon: string = '';
}
interface MonthInfo {
    year: number;
    month: number;
}
interface DailyTotal {
    date: string;
    income: number;
    expense: number;
}
const CAT_ICONS: Record<string, string> = {
    '餐饮': '🍜', '交通': '🚗', '购物': '🛍️', '日用品': '🧴',
    '娱乐': '🎮', '通讯': '📱', '居住': '🏠', '医疗': '💊',
    '教育': '📚', '工资': '💵', '投资': '📈', '兼职': '💼',
    '退款': '↩️', '其他': '📌'
};
class Preset {
    label: string = '';
    days: number = 0;
}
const PRESETS: Preset[] = [
    { label: '今天', days: 0 } as Preset,
    { label: '本周', days: -6 } as Preset,
    { label: '本月', days: -29 } as Preset,
    { label: '本年', days: -364 } as Preset,
    { label: '全部', days: -9999 } as Preset
];
class StatsPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__totalIncome = new ObservedPropertySimplePU(0, this, "totalIncome");
        this.__totalExpense = new ObservedPropertySimplePU(0, this, "totalExpense");
        this.__dayTotals = new ObservedPropertyObjectPU([], this, "dayTotals");
        this.__expenseCats = new ObservedPropertyObjectPU([], this, "expenseCats");
        this.__incomeCats = new ObservedPropertyObjectPU([], this, "incomeCats");
        this.__listTab = new ObservedPropertySimplePU(0, this, "listTab");
        this.__loading = new ObservedPropertySimplePU(true
        // 日期范围
        , this, "loading");
        this.__startDate = new ObservedPropertyObjectPU(new Date(), this, "startDate");
        this.__endDate = new ObservedPropertyObjectPU(new Date(), this, "endDate");
        this.__startLabel = new ObservedPropertySimplePU('', this, "startLabel");
        this.__endLabel = new ObservedPropertySimplePU('', this, "endLabel");
        this.__activePreset = new ObservedPropertySimplePU(0 // -1=自定义, 0=今天, 1=本周...
        , this, "activePreset");
        this.chartSettings = new RenderingContextSettings(true);
        this.chartCtx = new CanvasRenderingContext2D(this.chartSettings);
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: StatsPage_Params) {
        if (params.totalIncome !== undefined) {
            this.totalIncome = params.totalIncome;
        }
        if (params.totalExpense !== undefined) {
            this.totalExpense = params.totalExpense;
        }
        if (params.dayTotals !== undefined) {
            this.dayTotals = params.dayTotals;
        }
        if (params.expenseCats !== undefined) {
            this.expenseCats = params.expenseCats;
        }
        if (params.incomeCats !== undefined) {
            this.incomeCats = params.incomeCats;
        }
        if (params.listTab !== undefined) {
            this.listTab = params.listTab;
        }
        if (params.loading !== undefined) {
            this.loading = params.loading;
        }
        if (params.startDate !== undefined) {
            this.startDate = params.startDate;
        }
        if (params.endDate !== undefined) {
            this.endDate = params.endDate;
        }
        if (params.startLabel !== undefined) {
            this.startLabel = params.startLabel;
        }
        if (params.endLabel !== undefined) {
            this.endLabel = params.endLabel;
        }
        if (params.activePreset !== undefined) {
            this.activePreset = params.activePreset;
        }
        if (params.chartSettings !== undefined) {
            this.chartSettings = params.chartSettings;
        }
        if (params.chartCtx !== undefined) {
            this.chartCtx = params.chartCtx;
        }
    }
    updateStateVars(params: StatsPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__totalIncome.purgeDependencyOnElmtId(rmElmtId);
        this.__totalExpense.purgeDependencyOnElmtId(rmElmtId);
        this.__dayTotals.purgeDependencyOnElmtId(rmElmtId);
        this.__expenseCats.purgeDependencyOnElmtId(rmElmtId);
        this.__incomeCats.purgeDependencyOnElmtId(rmElmtId);
        this.__listTab.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__startDate.purgeDependencyOnElmtId(rmElmtId);
        this.__endDate.purgeDependencyOnElmtId(rmElmtId);
        this.__startLabel.purgeDependencyOnElmtId(rmElmtId);
        this.__endLabel.purgeDependencyOnElmtId(rmElmtId);
        this.__activePreset.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__totalIncome.aboutToBeDeleted();
        this.__totalExpense.aboutToBeDeleted();
        this.__dayTotals.aboutToBeDeleted();
        this.__expenseCats.aboutToBeDeleted();
        this.__incomeCats.aboutToBeDeleted();
        this.__listTab.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__startDate.aboutToBeDeleted();
        this.__endDate.aboutToBeDeleted();
        this.__startLabel.aboutToBeDeleted();
        this.__endLabel.aboutToBeDeleted();
        this.__activePreset.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __totalIncome: ObservedPropertySimplePU<number>;
    get totalIncome() {
        return this.__totalIncome.get();
    }
    set totalIncome(newValue: number) {
        this.__totalIncome.set(newValue);
    }
    private __totalExpense: ObservedPropertySimplePU<number>;
    get totalExpense() {
        return this.__totalExpense.get();
    }
    set totalExpense(newValue: number) {
        this.__totalExpense.set(newValue);
    }
    private __dayTotals: ObservedPropertyObjectPU<DailyTotal[]>;
    get dayTotals() {
        return this.__dayTotals.get();
    }
    set dayTotals(newValue: DailyTotal[]) {
        this.__dayTotals.set(newValue);
    }
    private __expenseCats: ObservedPropertyObjectPU<CatStat[]>;
    get expenseCats() {
        return this.__expenseCats.get();
    }
    set expenseCats(newValue: CatStat[]) {
        this.__expenseCats.set(newValue);
    }
    private __incomeCats: ObservedPropertyObjectPU<CatStat[]>;
    get incomeCats() {
        return this.__incomeCats.get();
    }
    set incomeCats(newValue: CatStat[]) {
        this.__incomeCats.set(newValue);
    }
    private __listTab: ObservedPropertySimplePU<number>;
    get listTab() {
        return this.__listTab.get();
    }
    set listTab(newValue: number) {
        this.__listTab.set(newValue);
    }
    private __loading: ObservedPropertySimplePU<boolean>;
    get loading() {
        return this.__loading.get();
    }
    set loading(newValue: boolean) {
        this.__loading.set(newValue);
    }
    // 日期范围
    private __startDate: ObservedPropertyObjectPU<Date>;
    get startDate() {
        return this.__startDate.get();
    }
    set startDate(newValue: Date) {
        this.__startDate.set(newValue);
    }
    private __endDate: ObservedPropertyObjectPU<Date>;
    get endDate() {
        return this.__endDate.get();
    }
    set endDate(newValue: Date) {
        this.__endDate.set(newValue);
    }
    private __startLabel: ObservedPropertySimplePU<string>;
    get startLabel() {
        return this.__startLabel.get();
    }
    set startLabel(newValue: string) {
        this.__startLabel.set(newValue);
    }
    private __endLabel: ObservedPropertySimplePU<string>;
    get endLabel() {
        return this.__endLabel.get();
    }
    set endLabel(newValue: string) {
        this.__endLabel.set(newValue);
    }
    private __activePreset: ObservedPropertySimplePU<number>; // -1=自定义, 0=今天, 1=本周...
    get activePreset() {
        return this.__activePreset.get();
    }
    set activePreset(newValue: number) {
        this.__activePreset.set(newValue);
    }
    private chartSettings: RenderingContextSettings;
    private chartCtx: CanvasRenderingContext2D;
    aboutToAppear(): void {
        const now = new Date();
        this.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        this.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        this.startLabel = this.fmtDate(this.startDate);
        this.endLabel = this.fmtDate(this.endDate);
        this.activePreset = 0;
        this.loadData();
    }
    fmtDate(d: Date): string {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }
    /** ---- 日期预设 ---- */
    applyPreset(idx: number): void {
        this.activePreset = idx;
        const now = new Date();
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let start: Date;
        if (PRESETS[idx].days === 0) {
            start = new Date(end);
        }
        else if (PRESETS[idx].days < 0) {
            start = new Date(end);
            start.setDate(start.getDate() + PRESETS[idx].days);
            if (idx === 3) { // 本月
                start = new Date(now.getFullYear(), now.getMonth(), 1);
            }
            if (idx === 4) { // 本年
                start = new Date(now.getFullYear(), 0, 1);
            }
        }
        else { // 全部
            start = new Date(2000, 0, 1);
        }
        this.startDate = start;
        this.endDate = end;
        this.startLabel = this.fmtDate(start);
        this.endLabel = this.fmtDate(end);
        this.loadData();
    }
    openStartPicker(): void {
        this.getUIContext().showDatePickerDialog({
            start: new Date('2020-01-01'),
            end: new Date('2030-12-31'),
            selected: this.startDate,
            showTime: false,
            onDateAccept: (val: Date): void => {
                this.startDate = new Date(val.getFullYear(), val.getMonth(), val.getDate());
                this.startLabel = this.fmtDate(this.startDate);
                if (this.startDate.getTime() > this.endDate.getTime()) {
                    this.endDate = new Date(this.startDate);
                    this.endLabel = this.fmtDate(this.endDate);
                }
                this.activePreset = -1;
                this.loadData();
            }
        });
    }
    openEndPicker(): void {
        this.getUIContext().showDatePickerDialog({
            start: this.startDate,
            end: new Date('2030-12-31'),
            selected: this.endDate,
            showTime: false,
            onDateAccept: (val: Date): void => {
                this.endDate = new Date(val.getFullYear(), val.getMonth(), val.getDate());
                this.endLabel = this.fmtDate(this.endDate);
                if (this.endDate.getTime() < this.startDate.getTime()) {
                    this.startDate = new Date(this.endDate);
                    this.startLabel = this.fmtDate(this.startDate);
                }
                this.activePreset = -1;
                this.loadData();
            }
        });
    }
    /** ---- 数据 ---- */
    getQueryStart(): string {
        const d = this.startDate;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00`;
    }
    getQueryEnd(): string {
        const d = this.endDate;
        const nd = new Date(d);
        nd.setDate(nd.getDate() + 1);
        return `${nd.getFullYear()}-${String(nd.getMonth() + 1).padStart(2, '0')}-${String(nd.getDate()).padStart(2, '0')}T00:00:00`;
    }
    async loadData(): Promise<void> {
        this.loading = true;
        try {
            const start = this.getQueryStart();
            const end = this.getQueryEnd();
            const txs: Transaction[] = await DatabaseService.getByDateRange(start, end);
            let inc = 0;
            let exp = 0;
            const expMap = new Map<string, CatStat>();
            const incMap = new Map<string, CatStat>();
            for (let i = 0; i < txs.length; i++) {
                const tx = txs[i];
                if (tx.type === TransactionType.INCOME || String(tx.type) === 'income') {
                    inc += tx.amount;
                    this.accMap(incMap, tx);
                }
                else {
                    exp += tx.amount;
                    this.accMap(expMap, tx);
                }
            }
            this.totalIncome = inc;
            this.totalExpense = exp;
            this.expenseCats = this.sortMap(expMap);
            this.incomeCats = this.sortMap(incMap);
            const daily: DailyTotal[] = await DatabaseService.getDailyTotals(start, end);
            this.dayTotals = daily;
            this.loading = false;
            setTimeout((): void => { this.drawChart(); }, 300);
        }
        catch (e) {
            this.loading = false;
        }
    }
    accMap(map: Map<string, CatStat>, tx: Transaction): void {
        const cat = tx.category || '其他';
        if (!map.has(cat)) {
            const cs = new CatStat();
            cs.category = cat;
            cs.total = 0;
            cs.icon = CAT_ICONS[cat] || '📌';
            map.set(cat, cs);
        }
        const entry = map.get(cat);
        if (entry)
            entry.total += tx.amount;
    }
    sortMap(map: Map<string, CatStat>): CatStat[] {
        const arr: CatStat[] = [];
        map.forEach((v: CatStat): void => {
            const cs = new CatStat();
            cs.category = v.category;
            cs.total = v.total;
            cs.icon = v.icon;
            arr.push(cs);
        });
        arr.sort((a: CatStat, b: CatStat): number => b.total - a.total);
        return arr;
    }
    /** ---- Canvas ---- */
    drawChart(): void {
        const ctx = this.chartCtx;
        const W = ctx.width;
        const H = 220;
        if (W <= 0 || this.dayTotals.length === 0)
            return;
        ctx.clearRect(0, 0, W, H);
        const padL = 42;
        const padR = 14;
        const padT = 14;
        const padB = 26;
        const cw = W - padL - padR;
        const ch = H - padT - padB;
        const n = this.dayTotals.length;
        const step = Math.max(cw / n, 8);
        let maxVal = 0;
        for (let i = 0; i < n; i++)
            maxVal = Math.max(maxVal, this.dayTotals[i].income, this.dayTotals[i].expense);
        if (maxVal === 0)
            maxVal = 100;
        const yMax = Math.ceil(maxVal * 1.15);
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 0.5;
        for (let v = 0; v <= yMax; v += Math.ceil(yMax / 4)) {
            const y = padT + ch - (v / yMax) * ch;
            ctx.beginPath();
            ctx.moveTo(padL, y);
            ctx.lineTo(W - padR, y);
            ctx.stroke();
            ctx.fillStyle = '#999';
            ctx.font = '9px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(String(v), padL - 4, y + 3);
        }
        ctx.fillStyle = '#999';
        ctx.font = '8px sans-serif';
        ctx.textAlign = 'center';
        const step6 = Math.max(Math.floor(n / 6), 1);
        for (let i = 0; i < n; i++) {
            if (i % step6 === 0 || i === n - 1) {
                const x = padL + i * step;
                const lbl = this.dayTotals[i].date.length >= 10 ? this.dayTotals[i].date.slice(5) : this.dayTotals[i].date;
                ctx.fillText(lbl, x, H - 6);
            }
        }
        this.paintLine(ctx, padL, padT, cw, ch, n, step, true, yMax);
        this.paintLine(ctx, padL, padT, cw, ch, n, step, false, yMax);
    }
    paintLine(ctx: CanvasRenderingContext2D, x0: number, y0: number, cw: number, ch: number, n: number, step: number, isIncome: boolean, yMax: number): void {
        const color = isIncome ? '#27ae60' : '#e74c3c';
        const fillA = isIncome ? 'rgba(39,174,96,0.10)' : 'rgba(231,76,60,0.10)';
        ctx.beginPath();
        ctx.moveTo(x0, y0 + ch);
        let lastV = 0;
        let lastX = x0;
        let lastY = y0 + ch;
        for (let i = 0; i < n; i++) {
            const v = isIncome ? this.dayTotals[i].income : this.dayTotals[i].expense;
            const x = x0 + i * step;
            const y = y0 + ch - (v / yMax) * ch;
            ctx.lineTo(x, y);
            if (v > 0) {
                lastV = v;
                lastX = x;
                lastY = y;
            }
        }
        ctx.lineTo(x0 + (n - 1) * step, y0 + ch);
        ctx.closePath();
        ctx.fillStyle = fillA;
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < n; i++) {
            const v = isIncome ? this.dayTotals[i].income : this.dayTotals[i].expense;
            const x = x0 + i * step;
            const y = y0 + ch - (v / yMax) * ch;
            if (i === 0)
                ctx.moveTo(x, y);
            else
                ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.fillStyle = color;
        for (let i = 0; i < n; i++) {
            const v = isIncome ? this.dayTotals[i].income : this.dayTotals[i].expense;
            if (v > 0) {
                const x = x0 + i * step;
                const y = y0 + ch - (v / yMax) * ch;
                ctx.beginPath();
                ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        if (lastV > 0) {
            ctx.font = '15px sans-serif';
            ctx.fillStyle = color;
            ctx.textAlign = 'left';
            ctx.fillText(isIncome ? '收入' : '支出', lastX + 8, lastY + 5);
        }
    }
    /** ---- UI ---- */
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/StatsPage.ets(289:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 导航
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/StatsPage.ets(291:7)", "entry");
            // 导航
            Row.width('100%');
            // 导航
            Row.height(48);
            // 导航
            Row.padding({ left: 16, right: 16 });
            // 导航
            Row.backgroundColor('#fff');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('←');
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(292:9)", "entry");
            Text.fontSize(18);
            Text.fontColor('#999');
            Text.onClick((): void => { router.back(); });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/StatsPage.ets(293:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📊 统计');
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(294:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/StatsPage.ets(295:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('  ');
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(296:9)", "entry");
            Text.fontSize(18);
        }, Text);
        Text.pop();
        // 导航
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期范围卡片
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/StatsPage.ets(301:7)", "entry");
            // 日期范围卡片
            Column.width('100%');
            // 日期范围卡片
            Column.backgroundColor('#fff');
            // 日期范围卡片
            Column.border({ width: { bottom: 0.5 }, color: '#f0f0f0' });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 预设按钮
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/StatsPage.ets(303:9)", "entry");
            // 预设按钮
            Scroll.scrollable(ScrollDirection.Horizontal);
            // 预设按钮
            Scroll.scrollBar(BarState.Off);
            // 预设按钮
            Scroll.width('100%');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/StatsPage.ets(304:11)", "entry");
            Row.padding({ left: 16, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, idx: number) => {
                const p = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(p.label);
                    Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(306:15)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(idx === this.activePreset ? '#fff' : '#666');
                    Text.padding({ left: 12, right: 12, top: 5, bottom: 5 });
                    Text.borderRadius(12);
                    Text.backgroundColor(idx === this.activePreset ? '#27ae60' : '#f0f0f0');
                    Text.margin({ right: 8 });
                    Text.onClick((): void => { this.applyPreset(idx); });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, PRESETS, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        // 预设按钮
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期范围选择行
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/StatsPage.ets(321:9)", "entry");
            // 日期范围选择行
            Row.width('100%');
            // 日期范围选择行
            Row.padding({ left: 16, right: 16, top: 8, bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📅');
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(322:11)", "entry");
            Text.fontSize(14);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/StatsPage.ets(323:11)", "entry");
            Row.padding({ left: 10, right: 10, top: 6, bottom: 6 });
            Row.border({ width: 1, color: '#e0e0e0', radius: 6 });
            Row.backgroundColor('#fff');
            Row.onClick((): void => { this.openStartPicker(); });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.startLabel);
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(324:13)", "entry");
            Text.fontSize(14);
            Text.fontColor('#27ae60');
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(' ▾');
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(325:13)", "entry");
            Text.fontSize(10);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('→');
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(332:11)", "entry");
            Text.fontSize(14);
            Text.fontColor('#999');
            Text.margin({ left: 6, right: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/StatsPage.ets(334:11)", "entry");
            Row.padding({ left: 10, right: 10, top: 6, bottom: 6 });
            Row.border({ width: 1, color: '#e0e0e0', radius: 6 });
            Row.backgroundColor('#fff');
            Row.onClick((): void => { this.openEndPicker(); });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.endLabel);
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(335:13)", "entry");
            Text.fontSize(14);
            Text.fontColor('#e74c3c');
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(' ▾');
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(336:13)", "entry");
            Text.fontSize(10);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        Row.pop();
        // 日期范围选择行
        Row.pop();
        // 日期范围卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 汇总卡片
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/StatsPage.ets(349:7)", "entry");
            // 汇总卡片
            Row.width('100%');
            // 汇总卡片
            Row.padding({ left: 16, right: 16, top: 14, bottom: 14 });
            // 汇总卡片
            Row.backgroundColor('#fff');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/StatsPage.ets(350:9)", "entry");
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('支出');
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(351:11)", "entry");
            Text.fontSize(11);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(NumberUtils.formatMoney(this.totalExpense));
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(352:11)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#e74c3c');
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/StatsPage.ets(355:9)", "entry");
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('收入');
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(356:11)", "entry");
            Text.fontSize(11);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(NumberUtils.formatMoney(this.totalIncome));
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(357:11)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#27ae60');
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/StatsPage.ets(360:9)", "entry");
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('结余');
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(361:11)", "entry");
            Text.fontSize(11);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(NumberUtils.formatMoney(this.totalIncome - this.totalExpense));
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(362:11)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333');
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        // 汇总卡片
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 滚动区
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/StatsPage.ets(370:7)", "entry");
            // 滚动区
            Scroll.layoutWeight(1);
            // 滚动区
            Scroll.scrollBar(BarState.Off);
            // 滚动区
            Scroll.edgeEffect(EdgeEffect.None);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/StatsPage.ets(371:9)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 每日趋势
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/StatsPage.ets(373:11)", "entry");
            // 每日趋势
            Column.width('100%');
            // 每日趋势
            Column.backgroundColor('#fff');
            // 每日趋势
            Column.borderRadius(10);
            // 每日趋势
            Column.margin({ left: 12, right: 12, top: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📈 每日趋势');
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(374:13)", "entry");
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.width('100%');
            Text.padding({ left: 12, right: 12, top: 10, bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.dayTotals.length === 0 && !this.loading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无数据');
                        Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(378:15)", "entry");
                        Text.fontSize(13);
                        Text.fontColor('#ccc');
                        Text.width('100%');
                        Text.textAlign(TextAlign.Center);
                        Text.padding({ top: 30, bottom: 30 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Canvas.create(this.chartCtx);
                        Canvas.debugLine("entry/src/main/ets/pages/StatsPage.ets(381:15)", "entry");
                        Canvas.width('100%');
                        Canvas.height(220);
                        Canvas.onReady((): void => { setTimeout((): void => { this.drawChart(); }, 100); });
                    }, Canvas);
                    Canvas.pop();
                });
            }
        }, If);
        If.pop();
        // 每日趋势
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 收支明细
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/StatsPage.ets(389:11)", "entry");
            // 收支明细
            Column.width('100%');
            // 收支明细
            Column.backgroundColor('#fff');
            // 收支明细
            Column.borderRadius(10);
            // 收支明细
            Column.margin({ left: 12, right: 12, top: 8, bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/StatsPage.ets(390:13)", "entry");
            Row.width('100%');
            Row.padding({ left: 12, right: 12, top: 10, bottom: 6 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('💸 收支明细');
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(391:15)", "entry");
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/StatsPage.ets(392:15)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('支出');
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(393:15)", "entry");
            Text.fontSize(12);
            Text.fontColor(this.listTab === 0 ? '#fff' : '#999');
            Text.padding({ left: 10, right: 10, top: 3, bottom: 3 });
            Text.borderRadius(10);
            Text.backgroundColor(this.listTab === 0 ? '#e74c3c' : '#f0f0f0');
            Text.onClick((): void => { this.listTab = 0; });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('收入');
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(398:15)", "entry");
            Text.fontSize(12);
            Text.fontColor(this.listTab === 1 ? '#fff' : '#999');
            Text.padding({ left: 10, right: 10, top: 3, bottom: 3 });
            Text.borderRadius(10);
            Text.backgroundColor(this.listTab === 1 ? '#27ae60' : '#f0f0f0');
            Text.margin({ left: 6 });
            Text.onClick((): void => { this.listTab = 1; });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.listTab === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.expenseCats.length === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('暂无支出');
                                    Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(409:17)", "entry");
                                    Text.fontSize(13);
                                    Text.fontColor('#ccc');
                                    Text.width('100%');
                                    Text.textAlign(TextAlign.Center);
                                    Text.padding({ top: 20, bottom: 20 });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = (_item, idx: number) => {
                                        const cs = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Row.create();
                                            Row.debugLine("entry/src/main/ets/pages/StatsPage.ets(413:19)", "entry");
                                            Row.width('100%');
                                            Row.padding({ left: 16, right: 16, top: 9, bottom: 9 });
                                            Row.border({ width: { bottom: idx < this.expenseCats.length - 1 ? 0.5 : 0 }, color: '#f0f0f0' });
                                        }, Row);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(cs.icon);
                                            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(414:21)", "entry");
                                            Text.fontSize(16);
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(cs.category);
                                            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(415:21)", "entry");
                                            Text.fontSize(14);
                                            Text.fontColor('#333');
                                            Text.margin({ left: 8 });
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Blank.create();
                                            Blank.debugLine("entry/src/main/ets/pages/StatsPage.ets(416:21)", "entry");
                                        }, Blank);
                                        Blank.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('-' + NumberUtils.formatMoney(cs.total));
                                            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(417:21)", "entry");
                                            Text.fontSize(14);
                                            Text.fontWeight(FontWeight.Medium);
                                            Text.fontColor('#e74c3c');
                                        }, Text);
                                        Text.pop();
                                        Row.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, this.expenseCats, forEachItemGenFunction, undefined, true, false);
                                }, ForEach);
                                ForEach.pop();
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.incomeCats.length === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('暂无收入');
                                    Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(427:17)", "entry");
                                    Text.fontSize(13);
                                    Text.fontColor('#ccc');
                                    Text.width('100%');
                                    Text.textAlign(TextAlign.Center);
                                    Text.padding({ top: 20, bottom: 20 });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = (_item, idx: number) => {
                                        const cs = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Row.create();
                                            Row.debugLine("entry/src/main/ets/pages/StatsPage.ets(431:19)", "entry");
                                            Row.width('100%');
                                            Row.padding({ left: 16, right: 16, top: 9, bottom: 9 });
                                            Row.border({ width: { bottom: idx < this.incomeCats.length - 1 ? 0.5 : 0 }, color: '#f0f0f0' });
                                        }, Row);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(cs.icon);
                                            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(432:21)", "entry");
                                            Text.fontSize(16);
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(cs.category);
                                            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(433:21)", "entry");
                                            Text.fontSize(14);
                                            Text.fontColor('#333');
                                            Text.margin({ left: 8 });
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Blank.create();
                                            Blank.debugLine("entry/src/main/ets/pages/StatsPage.ets(434:21)", "entry");
                                        }, Blank);
                                        Blank.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('+' + NumberUtils.formatMoney(cs.total));
                                            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(435:21)", "entry");
                                            Text.fontSize(14);
                                            Text.fontWeight(FontWeight.Medium);
                                            Text.fontColor('#27ae60');
                                        }, Text);
                                        Text.pop();
                                        Row.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, this.incomeCats, forEachItemGenFunction, undefined, true, false);
                                }, ForEach);
                                ForEach.pop();
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/StatsPage.ets(444:13)", "entry");
            Row.height(20);
        }, Row);
        Row.pop();
        // 收支明细
        Column.pop();
        Column.pop();
        // 滚动区
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "StatsPage";
    }
}
registerNamedRoute(() => new StatsPage(undefined, {}), "", { bundleName: "com.xiaolin.quicktrade", moduleName: "entry", pagePath: "pages/StatsPage", pageFullPath: "entry/src/main/ets/pages/StatsPage", integratedHsp: "false", moduleType: "followWithHap" });
