if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PolicySection_Params {
    title?: string;
    content?: string;
}
interface Index_Params {
    transactions?: Transaction[];
    todayIncome?: number;
    todayExpense?: number;
    todayNet?: string;
    groups?: TransactionGroup[];
    loading?: boolean;
    showLoginDialog?: boolean;
    loginUsername?: string;
    loginPassword?: string;
    loginLoading?: boolean;
    loginIsRegister?: boolean;
    loginError?: string;
    loginAgreed?: boolean;
    showPrivacyContent?: string;
    loggedIn?: boolean;
    showDeleteDialog?: boolean;
    deleteTargetId?: number;
    currentTime?: string;
}
import type { Transaction } from '../model/Transaction';
import { DatabaseService } from "@bundle:com.xiaolin.quicktrade/entry/ets/service/DatabaseService";
import { DateUtils } from "@bundle:com.xiaolin.quicktrade/entry/ets/common/utils/DateUtils";
import { NumberUtils } from "@bundle:com.xiaolin.quicktrade/entry/ets/common/utils/NumberUtils";
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { AuthService } from "@bundle:com.xiaolin.quicktrade/entry/ets/service/AuthService";
interface TransactionGroup {
    label: string;
    items: Transaction[];
}
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__transactions = new ObservedPropertyObjectPU([], this, "transactions");
        this.__todayIncome = new ObservedPropertySimplePU(0, this, "todayIncome");
        this.__todayExpense = new ObservedPropertySimplePU(0, this, "todayExpense");
        this.__todayNet = new ObservedPropertySimplePU('¥0.00', this, "todayNet");
        this.__groups = new ObservedPropertyObjectPU([], this, "groups");
        this.__loading = new ObservedPropertySimplePU(true, this, "loading");
        this.__showLoginDialog = new ObservedPropertySimplePU(false, this, "showLoginDialog");
        this.__loginUsername = new ObservedPropertySimplePU('', this, "loginUsername");
        this.__loginPassword = new ObservedPropertySimplePU('', this, "loginPassword");
        this.__loginLoading = new ObservedPropertySimplePU(false, this, "loginLoading");
        this.__loginIsRegister = new ObservedPropertySimplePU(false, this, "loginIsRegister");
        this.__loginError = new ObservedPropertySimplePU('', this, "loginError");
        this.__loginAgreed = new ObservedPropertySimplePU(false, this, "loginAgreed");
        this.__showPrivacyContent = new ObservedPropertySimplePU('', this, "showPrivacyContent");
        this.__loggedIn = new ObservedPropertySimplePU(false, this, "loggedIn");
        this.__showDeleteDialog = new ObservedPropertySimplePU(false, this, "showDeleteDialog");
        this.__deleteTargetId = new ObservedPropertySimplePU(0, this, "deleteTargetId");
        this.__currentTime = new ObservedPropertySimplePU('', this, "currentTime");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.transactions !== undefined) {
            this.transactions = params.transactions;
        }
        if (params.todayIncome !== undefined) {
            this.todayIncome = params.todayIncome;
        }
        if (params.todayExpense !== undefined) {
            this.todayExpense = params.todayExpense;
        }
        if (params.todayNet !== undefined) {
            this.todayNet = params.todayNet;
        }
        if (params.groups !== undefined) {
            this.groups = params.groups;
        }
        if (params.loading !== undefined) {
            this.loading = params.loading;
        }
        if (params.showLoginDialog !== undefined) {
            this.showLoginDialog = params.showLoginDialog;
        }
        if (params.loginUsername !== undefined) {
            this.loginUsername = params.loginUsername;
        }
        if (params.loginPassword !== undefined) {
            this.loginPassword = params.loginPassword;
        }
        if (params.loginLoading !== undefined) {
            this.loginLoading = params.loginLoading;
        }
        if (params.loginIsRegister !== undefined) {
            this.loginIsRegister = params.loginIsRegister;
        }
        if (params.loginError !== undefined) {
            this.loginError = params.loginError;
        }
        if (params.loginAgreed !== undefined) {
            this.loginAgreed = params.loginAgreed;
        }
        if (params.showPrivacyContent !== undefined) {
            this.showPrivacyContent = params.showPrivacyContent;
        }
        if (params.loggedIn !== undefined) {
            this.loggedIn = params.loggedIn;
        }
        if (params.showDeleteDialog !== undefined) {
            this.showDeleteDialog = params.showDeleteDialog;
        }
        if (params.deleteTargetId !== undefined) {
            this.deleteTargetId = params.deleteTargetId;
        }
        if (params.currentTime !== undefined) {
            this.currentTime = params.currentTime;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__transactions.purgeDependencyOnElmtId(rmElmtId);
        this.__todayIncome.purgeDependencyOnElmtId(rmElmtId);
        this.__todayExpense.purgeDependencyOnElmtId(rmElmtId);
        this.__todayNet.purgeDependencyOnElmtId(rmElmtId);
        this.__groups.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__showLoginDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__loginUsername.purgeDependencyOnElmtId(rmElmtId);
        this.__loginPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__loginLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__loginIsRegister.purgeDependencyOnElmtId(rmElmtId);
        this.__loginError.purgeDependencyOnElmtId(rmElmtId);
        this.__loginAgreed.purgeDependencyOnElmtId(rmElmtId);
        this.__showPrivacyContent.purgeDependencyOnElmtId(rmElmtId);
        this.__loggedIn.purgeDependencyOnElmtId(rmElmtId);
        this.__showDeleteDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__deleteTargetId.purgeDependencyOnElmtId(rmElmtId);
        this.__currentTime.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__transactions.aboutToBeDeleted();
        this.__todayIncome.aboutToBeDeleted();
        this.__todayExpense.aboutToBeDeleted();
        this.__todayNet.aboutToBeDeleted();
        this.__groups.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__showLoginDialog.aboutToBeDeleted();
        this.__loginUsername.aboutToBeDeleted();
        this.__loginPassword.aboutToBeDeleted();
        this.__loginLoading.aboutToBeDeleted();
        this.__loginIsRegister.aboutToBeDeleted();
        this.__loginError.aboutToBeDeleted();
        this.__loginAgreed.aboutToBeDeleted();
        this.__showPrivacyContent.aboutToBeDeleted();
        this.__loggedIn.aboutToBeDeleted();
        this.__showDeleteDialog.aboutToBeDeleted();
        this.__deleteTargetId.aboutToBeDeleted();
        this.__currentTime.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __transactions: ObservedPropertyObjectPU<Transaction[]>;
    get transactions() {
        return this.__transactions.get();
    }
    set transactions(newValue: Transaction[]) {
        this.__transactions.set(newValue);
    }
    private __todayIncome: ObservedPropertySimplePU<number>;
    get todayIncome() {
        return this.__todayIncome.get();
    }
    set todayIncome(newValue: number) {
        this.__todayIncome.set(newValue);
    }
    private __todayExpense: ObservedPropertySimplePU<number>;
    get todayExpense() {
        return this.__todayExpense.get();
    }
    set todayExpense(newValue: number) {
        this.__todayExpense.set(newValue);
    }
    private __todayNet: ObservedPropertySimplePU<string>;
    get todayNet() {
        return this.__todayNet.get();
    }
    set todayNet(newValue: string) {
        this.__todayNet.set(newValue);
    }
    private __groups: ObservedPropertyObjectPU<TransactionGroup[]>;
    get groups() {
        return this.__groups.get();
    }
    set groups(newValue: TransactionGroup[]) {
        this.__groups.set(newValue);
    }
    private __loading: ObservedPropertySimplePU<boolean>;
    get loading() {
        return this.__loading.get();
    }
    set loading(newValue: boolean) {
        this.__loading.set(newValue);
    }
    private __showLoginDialog: ObservedPropertySimplePU<boolean>;
    get showLoginDialog() {
        return this.__showLoginDialog.get();
    }
    set showLoginDialog(newValue: boolean) {
        this.__showLoginDialog.set(newValue);
    }
    private __loginUsername: ObservedPropertySimplePU<string>;
    get loginUsername() {
        return this.__loginUsername.get();
    }
    set loginUsername(newValue: string) {
        this.__loginUsername.set(newValue);
    }
    private __loginPassword: ObservedPropertySimplePU<string>;
    get loginPassword() {
        return this.__loginPassword.get();
    }
    set loginPassword(newValue: string) {
        this.__loginPassword.set(newValue);
    }
    private __loginLoading: ObservedPropertySimplePU<boolean>;
    get loginLoading() {
        return this.__loginLoading.get();
    }
    set loginLoading(newValue: boolean) {
        this.__loginLoading.set(newValue);
    }
    private __loginIsRegister: ObservedPropertySimplePU<boolean>;
    get loginIsRegister() {
        return this.__loginIsRegister.get();
    }
    set loginIsRegister(newValue: boolean) {
        this.__loginIsRegister.set(newValue);
    }
    private __loginError: ObservedPropertySimplePU<string>;
    get loginError() {
        return this.__loginError.get();
    }
    set loginError(newValue: string) {
        this.__loginError.set(newValue);
    }
    private __loginAgreed: ObservedPropertySimplePU<boolean>;
    get loginAgreed() {
        return this.__loginAgreed.get();
    }
    set loginAgreed(newValue: boolean) {
        this.__loginAgreed.set(newValue);
    }
    private __showPrivacyContent: ObservedPropertySimplePU<string>;
    get showPrivacyContent() {
        return this.__showPrivacyContent.get();
    }
    set showPrivacyContent(newValue: string) {
        this.__showPrivacyContent.set(newValue);
    }
    private __loggedIn: ObservedPropertySimplePU<boolean>;
    get loggedIn() {
        return this.__loggedIn.get();
    }
    set loggedIn(newValue: boolean) {
        this.__loggedIn.set(newValue);
    }
    private __showDeleteDialog: ObservedPropertySimplePU<boolean>;
    get showDeleteDialog() {
        return this.__showDeleteDialog.get();
    }
    set showDeleteDialog(newValue: boolean) {
        this.__showDeleteDialog.set(newValue);
    }
    private __deleteTargetId: ObservedPropertySimplePU<number>;
    get deleteTargetId() {
        return this.__deleteTargetId.get();
    }
    set deleteTargetId(newValue: number) {
        this.__deleteTargetId.set(newValue);
    }
    private __currentTime: ObservedPropertySimplePU<string>;
    get currentTime() {
        return this.__currentTime.get();
    }
    set currentTime(newValue: string) {
        this.__currentTime.set(newValue);
    }
    aboutToAppear() {
        this.loggedIn = AuthService.isLoggedIn();
        this.updateTime();
        this.loadData();
    }
    onPageShow() {
        this.loggedIn = AuthService.isLoggedIn();
        this.updateTime();
        this.loadData();
    }
    updateTime(): void {
        const now = new Date();
        const p = (n: number): string => String(n).padStart(2, '0');
        this.currentTime = `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())} ${p(now.getHours())}:${p(now.getMinutes())}`;
    }
    async loadData() {
        this.loading = true;
        try {
            const txs = await DatabaseService.getAll();
            this.transactions = txs;
            this.groups = this.groupByDate(txs);
            const summary = await DatabaseService.getTodaySummary();
            this.todayIncome = summary.income;
            this.todayExpense = summary.expense;
            this.todayNet = NumberUtils.formatMoney(this.todayIncome - this.todayExpense);
        }
        catch (e) {
            console.error('Index loadData failed:', JSON.stringify(e));
        }
        this.loading = false;
    }
    groupByDate(list: Transaction[]): TransactionGroup[] {
        const map = new Map<string, Transaction[]>();
        for (const item of list) {
            const label = DateUtils.formatGroupLabel(item.created_at);
            if (!map.has(label))
                map.set(label, []);
            map.get(label)!.push(item);
        }
        const result: TransactionGroup[] = [];
        map.forEach((items, label) => result.push({ label, items }));
        return result;
    }
    goToRecord() {
        if (!this.loggedIn) {
            this.showLoginDialog = true;
            return;
        }
        router.pushUrl({ url: 'pages/RecordPage' });
    }
    goToStats() {
        router.pushUrl({ url: 'pages/StatsPage' });
    }
    async deleteTransaction(id: number) {
        await DatabaseService.delete(id);
        this.loadData();
    }
    async logout() {
        await AuthService.logout();
        this.loggedIn = false;
        this.showLoginDialog = false;
        this.loadData();
    }
    async doLogin() {
        if (!this.loginAgreed) {
            this.loginError = '请先阅读并同意隐私政策和用户条款';
            return;
        }
        const u = this.loginUsername.trim();
        const p = this.loginPassword.trim();
        if (!u || !p) {
            this.loginError = '请输入用户名和密码';
            return;
        }
        this.loginLoading = true;
        this.loginError = '';
        console.info('QuickTrade doLogin:', u, 'isRegister:', this.loginIsRegister);
        try {
            if (this.loginIsRegister) {
                await AuthService.register(u, p);
                console.info('QuickTrade register success:', u);
                promptAction.showToast({ message: '注册成功', duration: 1500 });
            }
            else {
                await AuthService.login(u, p);
                console.info('QuickTrade login success:', u);
                promptAction.showToast({ message: '登录成功', duration: 1500 });
            }
            this.showLoginDialog = false;
            this.loginUsername = '';
            this.loginPassword = '';
            this.loginIsRegister = false;
            this.loginAgreed = false;
            this.loginLoading = false;
            this.loggedIn = true;
        }
        catch (e) {
            let msg = '操作失败';
            try {
                const errObj = e as Record<string, string>;
                if (errObj && errObj.message) {
                    msg = String(errObj.message);
                }
            }
            catch (_) {
                msg = String(e || '操作失败');
            }
            console.error('QuickTrade login failed:', msg, JSON.stringify(e));
            this.loginError = msg;
            this.loginLoading = false;
            return;
        }
        try {
            await this.loadData();
        }
        catch (e) {
            console.error('QuickTrade loadData after login:', JSON.stringify(e));
        }
    }
    openLogin() {
        this.loginUsername = '';
        this.loginPassword = '';
        this.loginError = '';
        this.loginAgreed = false;
        this.loginIsRegister = false;
        this.showLoginDialog = true;
    }
    cancelLogin() {
        this.showLoginDialog = false;
        this.loginUsername = '';
        this.loginPassword = '';
        this.loginError = '';
        this.loginAgreed = false;
    }
    toggleAgreed() {
        this.loginAgreed = !this.loginAgreed;
        if (this.loginAgreed) {
            this.loginError = '';
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/Index.ets(190:5)", "entry");
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(191:7)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Index.ets(192:9)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
            Row.backgroundColor('#fff');
            Row.border({ width: { bottom: 0.5 }, color: '#f0f0f0' });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.loggedIn) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`👤 ${AuthService.getCurrentUsername()}`);
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(194:13)", "entry");
                        Text.fontSize(13);
                        Text.fontColor('#666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/Index.ets(195:13)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 金色边框日期时间
                        Text.create(this.currentTime);
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(197:13)", "entry");
                        // 金色边框日期时间
                        Text.fontSize(12);
                        // 金色边框日期时间
                        Text.fontColor('#333');
                        // 金色边框日期时间
                        Text.padding({ left: 10, right: 10, top: 4, bottom: 4 });
                        // 金色边框日期时间
                        Text.border({ width: 1.5, color: '#d4a017', radius: 6 });
                        // 金色边框日期时间
                        Text.margin({ right: 6 });
                    }, Text);
                    // 金色边框日期时间
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('退出');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(201:13)", "entry");
                        Text.fontSize(13);
                        Text.fontColor('#e74c3c');
                        Text.onClick(() => this.logout());
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('👤 游客');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(203:13)", "entry");
                        Text.fontSize(13);
                        Text.fontColor('#999');
                        Text.layoutWeight(1);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('登录');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(204:13)", "entry");
                        Text.fontSize(13);
                        Text.fontColor('#27ae60');
                        Text.fontWeight(FontWeight.Medium);
                        Text.padding({ left: 12, right: 4, top: 4, bottom: 4 });
                        Text.onClick(() => { this.openLogin(); });
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Index.ets(212:9)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceAround);
            Row.padding({ top: 16, bottom: 16 });
            Row.backgroundColor('#fff');
            Row.borderRadius(12);
            Row.margin({ left: 16, right: 16, top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(213:11)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('今日支出');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(213:22)", "entry");
            Text.fontSize(12);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(NumberUtils.formatMoney(this.todayExpense));
            Text.debugLine("entry/src/main/ets/pages/Index.ets(214:13)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#e74c3c');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(215:11)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('今日收入');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(215:22)", "entry");
            Text.fontSize(12);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(NumberUtils.formatMoney(this.todayIncome));
            Text.debugLine("entry/src/main/ets/pages/Index.ets(216:13)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#27ae60');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(217:11)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('今日净额');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(217:22)", "entry");
            Text.fontSize(12);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.todayNet);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(218:13)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333');
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.loading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/pages/Index.ets(224:11)", "entry");
                        LoadingProgress.margin({ top: 60 });
                    }, LoadingProgress);
                });
            }
            else if (this.groups.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(226:11)", "entry");
                        Column.width('100%');
                        Column.margin({ top: 60 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📝');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(227:13)", "entry");
                        Text.fontSize(48);
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('还没有记录');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(228:13)", "entry");
                        Text.fontSize(16);
                        Text.fontColor('#999');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('点击下方 + 号开始记账');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(229:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#ccc');
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create();
                        List.debugLine("entry/src/main/ets/pages/Index.ets(232:11)", "entry");
                        List.layoutWeight(1);
                        List.scrollBar(BarState.Off);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const group = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                    ListItem.debugLine("entry/src/main/ets/pages/Index.ets(234:15)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.debugLine("entry/src/main/ets/pages/Index.ets(235:17)", "entry");
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(group.label);
                                        Text.debugLine("entry/src/main/ets/pages/Index.ets(236:19)", "entry");
                                        Text.fontSize(13);
                                        Text.fontColor('#999');
                                        Text.padding({ left: 16, top: 12, bottom: 4 });
                                        Text.width('100%');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        ForEach.create();
                                        const forEachItemGenFunction = _item => {
                                            const item = _item;
                                            {
                                                const itemCreation = (elmtId, isInitialRender) => {
                                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                                    ListItem.create(deepRenderFunction, true);
                                                    if (!isInitialRender) {
                                                        ListItem.pop();
                                                    }
                                                    ViewStackProcessor.StopGetAccessRecording();
                                                };
                                                const itemCreation2 = (elmtId, isInitialRender) => {
                                                    ListItem.create(deepRenderFunction, true);
                                                    ListItem.debugLine("entry/src/main/ets/pages/Index.ets(239:21)", "entry");
                                                };
                                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                                    itemCreation(elmtId, isInitialRender);
                                                    this.TransactionItem.bind(this)(item);
                                                    ListItem.pop();
                                                };
                                                this.observeComponentCreation2(itemCreation2, ListItem);
                                                ListItem.pop();
                                            }
                                        };
                                        this.forEachUpdateFunction(elmtId, group.items, forEachItemGenFunction);
                                    }, ForEach);
                                    ForEach.pop();
                                    Column.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.groups, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Index.ets(248:9)", "entry");
            Row.width('100%');
            Row.height(64);
            Row.justifyContent(FlexAlign.SpaceAround);
            Row.backgroundColor('#fff');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/pages/Index.ets(249:11)", "entry");
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => this.goToStats());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📊');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(249:22)", "entry");
            Text.fontSize(20);
        }, Text);
        Text.pop();
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/pages/Index.ets(250:11)", "entry");
            Button.width(56);
            Button.height(56);
            Button.borderRadius(28);
            Button.backgroundColor('#e74c3c');
            Button.fontColor(Color.White);
            Button.shadow({ radius: 8, color: '#e74c3c40' });
            Button.onClick(() => this.goToRecord());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('+');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(250:22)", "entry");
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Lighter);
        }, Text);
        Text.pop();
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/pages/Index.ets(253:11)", "entry");
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => router.pushUrl({ url: 'pages/SettingsPage' }));
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('⚙️');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(253:22)", "entry");
            Text.fontSize(20);
        }, Text);
        Text.pop();
        Button.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showLoginDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(261:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#00000040');
                    }, Column);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(262:9)", "entry");
                        Column.width('100%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(263:11)", "entry");
                        Column.width('85%');
                        Column.padding(20);
                        Column.backgroundColor('#fff');
                        Column.borderRadius(16);
                        Column.border({ width: 2, color: '#d4a017' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Index.ets(264:13)", "entry");
                        Row.width('100%');
                        Row.margin({ bottom: 16 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.loginIsRegister ? '📝 注册' : '🔐 登录');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(265:15)", "entry");
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/Index.ets(266:15)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✕');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(267:15)", "entry");
                        Text.fontSize(20);
                        Text.fontColor('#999');
                        Text.onClick(() => this.cancelLogin());
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '用户名', text: this.loginUsername });
                        TextInput.debugLine("entry/src/main/ets/pages/Index.ets(270:13)", "entry");
                        TextInput.onChange((v: string) => this.loginUsername = v);
                        TextInput.width('100%');
                        TextInput.height(44);
                        TextInput.margin({ bottom: 12 });
                        TextInput.borderRadius(8);
                        TextInput.backgroundColor('#f5f5f5');
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '密码', text: this.loginPassword });
                        TextInput.debugLine("entry/src/main/ets/pages/Index.ets(274:13)", "entry");
                        TextInput.type(InputType.Password);
                        TextInput.onChange((v: string) => this.loginPassword = v);
                        TextInput.width('100%');
                        TextInput.height(44);
                        TextInput.margin({ bottom: 12 });
                        TextInput.borderRadius(8);
                        TextInput.backgroundColor('#f5f5f5');
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.loginError) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.loginError);
                                    Text.debugLine("entry/src/main/ets/pages/Index.ets(279:15)", "entry");
                                    Text.fontSize(12);
                                    Text.fontColor('#e74c3c');
                                    Text.margin({ bottom: 8 });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.loginIsRegister ? '注册' : '登录');
                        Button.debugLine("entry/src/main/ets/pages/Index.ets(282:13)", "entry");
                        Button.width('100%');
                        Button.height(44);
                        Button.fontSize(15);
                        Button.borderRadius(8);
                        Button.backgroundColor(this.loginAgreed ? '#27ae60' : '#ccc');
                        Button.fontColor(this.loginAgreed ? '#fff' : '#999');
                        Button.enabled(this.loginAgreed && !this.loginLoading);
                        Button.onClick(() => this.doLogin());
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Index.ets(288:13)", "entry");
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.Center);
                        Row.margin({ top: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.loginIsRegister ? '已有账号？' : '没有账号？');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(289:15)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#999');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.loginIsRegister ? '去登录' : '去注册');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(290:15)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#27ae60');
                        Text.onClick(() => { this.loginIsRegister = !this.loginIsRegister; this.loginError = ''; });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Index.ets(294:13)", "entry");
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.Center);
                        Row.margin({ top: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.loginAgreed ? '☑' : '☐');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(295:15)", "entry");
                        Text.fontSize(16);
                        Text.fontColor('#666');
                        Text.onClick(() => this.toggleAgreed());
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(' 已阅读并同意 ');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(296:15)", "entry");
                        Text.fontSize(11);
                        Text.fontColor('#999');
                        Text.onClick(() => this.toggleAgreed());
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('隐私政策');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(297:15)", "entry");
                        Text.fontSize(11);
                        Text.fontColor('#2d6be0');
                        Text.decoration({ type: TextDecorationType.Underline });
                        Text.onClick(() => { this.showPrivacyContent = 'privacy'; });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(' 和 ');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(299:15)", "entry");
                        Text.fontSize(11);
                        Text.fontColor('#999');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('用户条款');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(300:15)", "entry");
                        Text.fontSize(11);
                        Text.fontColor('#2d6be0');
                        Text.decoration({ type: TextDecorationType.Underline });
                        Text.onClick(() => { this.showPrivacyContent = 'terms'; });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    Column.pop();
                    Column.pop();
                });
            }
            // 删除确认弹窗
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 删除确认弹窗
            if (this.showDeleteDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(312:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#00000040');
                    }, Column);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(313:9)", "entry");
                        Column.width('100%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(314:11)", "entry");
                        Column.width('80%');
                        Column.padding(24);
                        Column.backgroundColor('#fff');
                        Column.borderRadius(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('⚠️ 确认删除');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(315:13)", "entry");
                        Text.fontSize(17);
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('删除后无法恢复，确定要删除这条记录吗？');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(316:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#666');
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Index.ets(317:13)", "entry");
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.debugLine("entry/src/main/ets/pages/Index.ets(318:15)", "entry");
                        Button.fontSize(14);
                        Button.height(40);
                        Button.layoutWeight(1);
                        Button.backgroundColor('#f0f0f0');
                        Button.fontColor('#666');
                        Button.borderRadius(8);
                        Button.onClick((): void => { this.showDeleteDialog = false; });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('删除');
                        Button.debugLine("entry/src/main/ets/pages/Index.ets(321:15)", "entry");
                        Button.fontSize(14);
                        Button.height(40);
                        Button.layoutWeight(1);
                        Button.backgroundColor('#e74c3c');
                        Button.fontColor('#fff');
                        Button.borderRadius(8);
                        Button.margin({ left: 12 });
                        Button.onClick((): void => {
                            this.showDeleteDialog = false;
                            this.deleteTransaction(this.deleteTargetId);
                        });
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showPrivacyContent !== '') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(336:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#00000050');
                        Column.onClick(() => { this.showPrivacyContent = ''; });
                    }, Column);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(338:9)", "entry");
                        Column.width('100%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(339:11)", "entry");
                        Column.width('85%');
                        Column.height('70%');
                        Column.padding(20);
                        Column.backgroundColor('#fff');
                        Column.borderRadius(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Index.ets(340:13)", "entry");
                        Row.width('100%');
                        Row.margin({ bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.showPrivacyContent === 'privacy' ? '📄 隐私政策' : '📄 用户条款');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(341:15)", "entry");
                        Text.fontSize(17);
                        Text.fontWeight(FontWeight.Bold);
                        Text.layoutWeight(1);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✕');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(343:15)", "entry");
                        Text.fontSize(20);
                        Text.fontColor('#999');
                        Text.onClick(() => { this.showPrivacyContent = ''; });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.debugLine("entry/src/main/ets/pages/Index.ets(346:13)", "entry");
                        Scroll.layoutWeight(1);
                        Scroll.scrollBar(BarState.Off);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(347:15)", "entry");
                        Column.width('100%');
                        Column.padding({ bottom: 8 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.showPrivacyContent === 'privacy') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicySection(this, { title: '1. 信息收集', content: '本应用仅收集您主动提供的信息：\n• 用户名和密码（加密存储，仅用于登录验证）\n• 您录入的交易记录（金额、品类、备注等）\n\n我们不会收集您的设备标识、位置、通讯录或其他敏感信息。' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 349, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '1. 信息收集',
                                                    content: '本应用仅收集您主动提供的信息：\n• 用户名和密码（加密存储，仅用于登录验证）\n• 您录入的交易记录（金额、品类、备注等）\n\n我们不会收集您的设备标识、位置、通讯录或其他敏感信息。'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '1. 信息收集', content: '本应用仅收集您主动提供的信息：\n• 用户名和密码（加密存储，仅用于登录验证）\n• 您录入的交易记录（金额、品类、备注等）\n\n我们不会收集您的设备标识、位置、通讯录或其他敏感信息。'
                                            });
                                        }
                                    }, { name: "PolicySection" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicySection(this, { title: '2. 信息使用', content: '您的所有数据仅存储在设备本地数据库中。我们不向任何第三方传输您的数据。' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 350, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '2. 信息使用',
                                                    content: '您的所有数据仅存储在设备本地数据库中。我们不向任何第三方传输您的数据。'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '2. 信息使用', content: '您的所有数据仅存储在设备本地数据库中。我们不向任何第三方传输您的数据。'
                                            });
                                        }
                                    }, { name: "PolicySection" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicySection(this, { title: '3. 信息存储', content: '数据存储在设备本地 SQLite 数据库中。删除应用或清除数据将永久删除所有记录。建议您定期通过设置页的"数据导出"功能备份数据。' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 351, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '3. 信息存储',
                                                    content: '数据存储在设备本地 SQLite 数据库中。删除应用或清除数据将永久删除所有记录。建议您定期通过设置页的"数据导出"功能备份数据。'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '3. 信息存储', content: '数据存储在设备本地 SQLite 数据库中。删除应用或清除数据将永久删除所有记录。建议您定期通过设置页的"数据导出"功能备份数据。'
                                            });
                                        }
                                    }, { name: "PolicySection" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicySection(this, { title: '4. 第三方服务', content: '本应用不接入任何第三方服务，所有功能均为本地离线运行。' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 352, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '4. 第三方服务',
                                                    content: '本应用不接入任何第三方服务，所有功能均为本地离线运行。'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '4. 第三方服务', content: '本应用不接入任何第三方服务，所有功能均为本地离线运行。'
                                            });
                                        }
                                    }, { name: "PolicySection" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicySection(this, { title: '5. 用户权利', content: '您可以随时：\n• 在设置中导出您的全部数据\n• 删除单条或全部交易记录\n• 注销账号（删除所有数据）' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 353, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '5. 用户权利',
                                                    content: '您可以随时：\n• 在设置中导出您的全部数据\n• 删除单条或全部交易记录\n• 注销账号（删除所有数据）'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '5. 用户权利', content: '您可以随时：\n• 在设置中导出您的全部数据\n• 删除单条或全部交易记录\n• 注销账号（删除所有数据）'
                                            });
                                        }
                                    }, { name: "PolicySection" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicySection(this, { title: '6. 联系方式', content: '如有任何隐私相关问题，请通过以下方式联系我们：\n邮箱：445816282@qq.com' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 354, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '6. 联系方式',
                                                    content: '如有任何隐私相关问题，请通过以下方式联系我们：\n邮箱：445816282@qq.com'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '6. 联系方式', content: '如有任何隐私相关问题，请通过以下方式联系我们：\n邮箱：445816282@qq.com'
                                            });
                                        }
                                    }, { name: "PolicySection" });
                                }
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicySection(this, { title: '1. 服务说明', content: '本应用（"快记交易"）提供个人记账功能。您使用本应用即表示同意本条款。' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 356, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '1. 服务说明',
                                                    content: '本应用（"快记交易"）提供个人记账功能。您使用本应用即表示同意本条款。'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '1. 服务说明', content: '本应用（"快记交易"）提供个人记账功能。您使用本应用即表示同意本条款。'
                                            });
                                        }
                                    }, { name: "PolicySection" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicySection(this, { title: '2. 用户责任', content: '• 您对录入数据的准确性和合法性负责\n• 不得利用本应用从事违法违规活动\n• 应妥善保管账号密码，因密码泄露导致的损失由您自行承担' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 357, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '2. 用户责任',
                                                    content: '• 您对录入数据的准确性和合法性负责\n• 不得利用本应用从事违法违规活动\n• 应妥善保管账号密码，因密码泄露导致的损失由您自行承担'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '2. 用户责任', content: '• 您对录入数据的准确性和合法性负责\n• 不得利用本应用从事违法违规活动\n• 应妥善保管账号密码，因密码泄露导致的损失由您自行承担'
                                            });
                                        }
                                    }, { name: "PolicySection" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicySection(this, { title: '3. 免责声明', content: '• 本应用按"现状"提供服务，不保证服务不会中断\n• 因不可抗力导致的数据丢失，开发者不承担责任' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 358, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '3. 免责声明',
                                                    content: '• 本应用按"现状"提供服务，不保证服务不会中断\n• 因不可抗力导致的数据丢失，开发者不承担责任'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '3. 免责声明', content: '• 本应用按"现状"提供服务，不保证服务不会中断\n• 因不可抗力导致的数据丢失，开发者不承担责任'
                                            });
                                        }
                                    }, { name: "PolicySection" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicySection(this, { title: '4. 知识产权', content: '本应用的所有权利（包括但不限于软件著作权、商标权）归开发者所有。未经许可，不得复制、修改、分发本应用。' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 359, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '4. 知识产权',
                                                    content: '本应用的所有权利（包括但不限于软件著作权、商标权）归开发者所有。未经许可，不得复制、修改、分发本应用。'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '4. 知识产权', content: '本应用的所有权利（包括但不限于软件著作权、商标权）归开发者所有。未经许可，不得复制、修改、分发本应用。'
                                            });
                                        }
                                    }, { name: "PolicySection" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicySection(this, { title: '5. 条款变更', content: '我们可能会不时更新本条款。重大变更将通过应用内通知告知您。继续使用即表示接受变更后的条款。' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 360, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '5. 条款变更',
                                                    content: '我们可能会不时更新本条款。重大变更将通过应用内通知告知您。继续使用即表示接受变更后的条款。'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '5. 条款变更', content: '我们可能会不时更新本条款。重大变更将通过应用内通知告知您。继续使用即表示接受变更后的条款。'
                                            });
                                        }
                                    }, { name: "PolicySection" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicySection(this, { title: '6. 联系我们', content: '如有任何问题，请发送邮件至：\n445816282@qq.com' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 361, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '6. 联系我们',
                                                    content: '如有任何问题，请发送邮件至：\n445816282@qq.com'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '6. 联系我们', content: '如有任何问题，请发送邮件至：\n445816282@qq.com'
                                            });
                                        }
                                    }, { name: "PolicySection" });
                                }
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                    Scroll.pop();
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
    TransactionItem(item: Transaction, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Index.ets(377:5)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
            Row.backgroundColor('#fff');
            Row.border({ width: { bottom: 0.5 }, color: '#f0f0f0' });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getCategoryIcon(item));
            Text.debugLine("entry/src/main/ets/pages/Index.ets(378:7)", "entry");
            Text.fontSize(28);
            Text.width(44);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(379:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
            Column.margin({ left: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.category);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(380:9)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (item.note) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(item.note);
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(382:11)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#999');
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                    }, Text);
                    Text.pop();
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
            Text.create(item.amountDisplay);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(385:7)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(item.isIncome ? '#27ae60' : '#333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🗑️');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(387:7)", "entry");
            Text.fontSize(14);
            Text.fontColor('#e74c3c');
            Text.padding({ left: 8, right: 8, top: 6, bottom: 6 });
            Text.border({ width: 1, color: '#e74c3c', radius: 6 });
            Text.onClick((): void => {
                this.deleteTargetId = item.id;
                this.showDeleteDialog = true;
            });
        }, Text);
        Text.pop();
        Row.pop();
    }
    getCategoryIcon(item: Transaction): string {
        const iconMap: Record<string, string> = {
            '餐饮': '🍜', '交通': '🚗', '购物': '🛍️', '日用品': '🧴',
            '娱乐': '🎮', '通讯': '📱', '居住': '🏠', '医疗': '💊',
            '教育': '📚', '工资': '💵', '投资': '📈', '兼职': '💼',
            '退款': '↩️', '其他': '📌'
        };
        return iconMap[item.category] || '📌';
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
class PolicySection extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__title = new SynchedPropertySimpleOneWayPU(params.title, this, "title");
        this.__content = new SynchedPropertySimpleOneWayPU(params.content, this, "content");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PolicySection_Params) {
        if (params.title === undefined) {
            this.__title.set('');
        }
        if (params.content === undefined) {
            this.__content.set('');
        }
    }
    updateStateVars(params: PolicySection_Params) {
        this.__title.reset(params.title);
        this.__content.reset(params.content);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__title.purgeDependencyOnElmtId(rmElmtId);
        this.__content.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__content.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: SynchedPropertySimpleOneWayPU<string>;
    get title() {
        return this.__title.get();
    }
    set title(newValue: string) {
        this.__title.set(newValue);
    }
    private __content: SynchedPropertySimpleOneWayPU<string>;
    get content() {
        return this.__content.get();
    }
    set content(newValue: string) {
        this.__content.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(416:5)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(417:7)", "entry");
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333');
            Text.width('100%');
            Text.margin({ bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.content);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(418:7)", "entry");
            Text.fontSize(13);
            Text.fontColor('#666');
            Text.lineHeight(20);
            Text.width('100%');
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.xiaolin.quicktrade", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
