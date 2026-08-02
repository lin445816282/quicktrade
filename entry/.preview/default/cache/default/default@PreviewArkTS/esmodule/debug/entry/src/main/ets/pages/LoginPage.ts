if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PolicyItem_Params {
    title?: string;
    content?: string;
}
interface LoginPage_Params {
    username?: string;
    password?: string;
    isRegister?: boolean;
    loading?: boolean;
    huaweiLoading?: boolean;
    agreed?: boolean;
    privacyView?: string;
}
import { AuthService } from "@bundle:com.xiaolin.quicktrade/entry/ets/service/AuthService";
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
class LoginPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__isRegister = new ObservedPropertySimplePU(false, this, "isRegister");
        this.__loading = new ObservedPropertySimplePU(false, this, "loading");
        this.__huaweiLoading = new ObservedPropertySimplePU(false, this, "huaweiLoading");
        this.__agreed = new ObservedPropertySimplePU(false, this, "agreed");
        this.__privacyView = new ObservedPropertySimplePU('', this, "privacyView");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LoginPage_Params) {
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.isRegister !== undefined) {
            this.isRegister = params.isRegister;
        }
        if (params.loading !== undefined) {
            this.loading = params.loading;
        }
        if (params.huaweiLoading !== undefined) {
            this.huaweiLoading = params.huaweiLoading;
        }
        if (params.agreed !== undefined) {
            this.agreed = params.agreed;
        }
        if (params.privacyView !== undefined) {
            this.privacyView = params.privacyView;
        }
    }
    updateStateVars(params: LoginPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__isRegister.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__huaweiLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__agreed.purgeDependencyOnElmtId(rmElmtId);
        this.__privacyView.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__isRegister.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__huaweiLoading.aboutToBeDeleted();
        this.__agreed.aboutToBeDeleted();
        this.__privacyView.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __username: ObservedPropertySimplePU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __isRegister: ObservedPropertySimplePU<boolean>;
    get isRegister() {
        return this.__isRegister.get();
    }
    set isRegister(newValue: boolean) {
        this.__isRegister.set(newValue);
    }
    private __loading: ObservedPropertySimplePU<boolean>;
    get loading() {
        return this.__loading.get();
    }
    set loading(newValue: boolean) {
        this.__loading.set(newValue);
    }
    private __huaweiLoading: ObservedPropertySimplePU<boolean>;
    get huaweiLoading() {
        return this.__huaweiLoading.get();
    }
    set huaweiLoading(newValue: boolean) {
        this.__huaweiLoading.set(newValue);
    }
    private __agreed: ObservedPropertySimplePU<boolean>;
    get agreed() {
        return this.__agreed.get();
    }
    set agreed(newValue: boolean) {
        this.__agreed.set(newValue);
    }
    private __privacyView: ObservedPropertySimplePU<string>;
    get privacyView() {
        return this.__privacyView.get();
    }
    set privacyView(newValue: string) {
        this.__privacyView.set(newValue);
    }
    aboutToAppear() {
        this.agreed = false;
    }
    async submit() {
        if (!this.agreed) {
            promptAction.showToast({ message: '请先阅读并同意隐私政策和用户条款', duration: 2000 });
            return;
        }
        const u = this.username.trim();
        const p = this.password.trim();
        if (!u || !p) {
            promptAction.showToast({ message: '请输入用户名和密码', duration: 1500 });
            return;
        }
        if (u.length < 2) {
            promptAction.showToast({ message: '用户名至少2个字符', duration: 1500 });
            return;
        }
        if (p.length < 4) {
            promptAction.showToast({ message: '密码至少4位', duration: 1500 });
            return;
        }
        this.loading = true;
        try {
            if (this.isRegister) {
                await AuthService.register(u, p);
                promptAction.showToast({ message: '注册成功', duration: 1500 });
            }
            else {
                await AuthService.login(u, p);
            }
            router.replaceUrl({ url: 'pages/Index' });
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : '操作失败';
            promptAction.showToast({ message: msg, duration: 2000 });
        }
        this.loading = false;
    }
    /** 华为帐号一键登录 */
    async huaweiLogin() {
        if (!this.agreed) {
            promptAction.showToast({ message: '请先阅读并同意隐私政策和用户条款', duration: 2000 });
            return;
        }
        this.huaweiLoading = true;
        try {
            await AuthService.huaweiLogin();
            promptAction.showToast({ message: '登录成功', duration: 1500 });
            router.replaceUrl({ url: 'pages/Index' });
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : '华为登录失败';
            promptAction.showToast({ message: msg, duration: 2000 });
        }
        this.huaweiLoading = false;
    }
    /** 以游客身份进入 */
    goAsGuest() {
        router.replaceUrl({ url: 'pages/Index' });
    }
    /** 显示隐私/条款悬浮窗 */
    showPrivacyView(type: string) {
        this.privacyView = type;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/LoginPage.ets(97:5)", "entry");
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/LoginPage.ets(98:7)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#fff');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/LoginPage.ets(99:9)", "entry");
            Scroll.layoutWeight(1);
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/LoginPage.ets(100:11)", "entry");
            Column.width('80%');
            Column.alignSelf(ItemAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(101:13)", "entry");
            Text.height(40);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('快记交易');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(103:13)", "entry");
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#27ae60');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI 语音记账');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(104:13)", "entry");
            Text.fontSize(14);
            Text.fontColor('#999');
            Text.margin({ bottom: 32 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // === 华为帐号一键登录 ===
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/pages/LoginPage.ets(107:13)", "entry");
            // === 华为帐号一键登录 ===
            Button.width('100%');
            // === 华为帐号一键登录 ===
            Button.height(48);
            // === 华为帐号一键登录 ===
            Button.backgroundColor('#cf0a2c');
            // === 华为帐号一键登录 ===
            Button.borderRadius(8);
            // === 华为帐号一键登录 ===
            Button.enabled(this.agreed && !this.huaweiLoading);
            // === 华为帐号一键登录 ===
            Button.onClick(() => this.huaweiLogin());
            // === 华为帐号一键登录 ===
            Button.margin({ bottom: 24 });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.huaweiLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/pages/LoginPage.ets(109:17)", "entry");
                        LoadingProgress.width(20);
                        LoadingProgress.height(20);
                        LoadingProgress.color('#fff');
                    }, LoadingProgress);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/LoginPage.ets(111:17)", "entry");
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🔑');
                        Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(112:19)", "entry");
                        Text.fontSize(20);
                        Text.margin({ right: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('华为帐号一键登录');
                        Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(113:19)", "entry");
                        Text.fontSize(16);
                        Text.fontColor('#fff');
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
        }, If);
        If.pop();
        // === 华为帐号一键登录 ===
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // === 分割线 ===
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/LoginPage.ets(125:13)", "entry");
            // === 分割线 ===
            Row.width('100%');
            // === 分割线 ===
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/LoginPage.ets(126:15)", "entry");
            Divider.width('30%');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('  或使用密码  ');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(127:15)", "entry");
            Text.fontSize(13);
            Text.fontColor('#ccc');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/LoginPage.ets(128:15)", "entry");
            Divider.width('30%');
        }, Divider);
        // === 分割线 ===
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // === 密码登录/注册表单 ===
            TextInput.create({ placeholder: '用户名', text: this.username });
            TextInput.debugLine("entry/src/main/ets/pages/LoginPage.ets(134:13)", "entry");
            // === 密码登录/注册表单 ===
            TextInput.onChange((v: string) => this.username = v);
            // === 密码登录/注册表单 ===
            TextInput.width('100%');
            // === 密码登录/注册表单 ===
            TextInput.height(48);
            // === 密码登录/注册表单 ===
            TextInput.margin({ bottom: 16 });
            // === 密码登录/注册表单 ===
            TextInput.borderRadius(8);
            // === 密码登录/注册表单 ===
            TextInput.backgroundColor('#f5f5f5');
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '密码', text: this.password });
            TextInput.debugLine("entry/src/main/ets/pages/LoginPage.ets(139:13)", "entry");
            TextInput.type(InputType.Password);
            TextInput.onChange((v: string) => this.password = v);
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.margin({ bottom: 24 });
            TextInput.borderRadius(8);
            TextInput.backgroundColor('#f5f5f5');
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.buttonText);
            Button.debugLine("entry/src/main/ets/pages/LoginPage.ets(145:13)", "entry");
            Button.width('100%');
            Button.height(48);
            Button.fontSize(16);
            Button.backgroundColor('#27ae60');
            Button.borderRadius(8);
            Button.enabled(this.agreed && !this.loading);
            Button.onClick(() => this.submit());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // === 切换登录/注册 ===
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/LoginPage.ets(152:13)", "entry");
            // === 切换登录/注册 ===
            Row.margin({ top: 16 });
            // === 切换登录/注册 ===
            Row.width('100%');
            // === 切换登录/注册 ===
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.isRegister ? '已有账号？' : '没有账号？');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(153:15)", "entry");
            Text.fontSize(13);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.isRegister ? '去登录' : '去注册');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(154:15)", "entry");
            Text.fontSize(13);
            Text.fontColor('#27ae60');
            Text.onClick(() => { this.isRegister = !this.isRegister; });
        }, Text);
        Text.pop();
        // === 切换登录/注册 ===
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // === 隐私条款（可勾选）===
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/LoginPage.ets(162:13)", "entry");
            // === 隐私条款（可勾选）===
            Row.margin({ top: 20 });
            // === 隐私条款（可勾选）===
            Row.width('100%');
            // === 隐私条款（可勾选）===
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.agreed ? '☑' : '☐');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(163:15)", "entry");
            Text.fontSize(16);
            Text.fontColor('#666');
            Text.onClick(() => { this.agreed = !this.agreed; });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(' 已阅读并同意 ');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(165:15)", "entry");
            Text.fontSize(12);
            Text.fontColor('#999');
            Text.onClick(() => { this.agreed = !this.agreed; });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('隐私政策');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(167:15)", "entry");
            Text.fontSize(12);
            Text.fontColor('#2d6be0');
            Text.decoration({ type: TextDecorationType.Underline });
            Text.onClick(() => { this.showPrivacyView('privacy'); });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(' 和 ');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(170:15)", "entry");
            Text.fontSize(12);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户条款');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(171:15)", "entry");
            Text.fontSize(12);
            Text.fontColor('#2d6be0');
            Text.decoration({ type: TextDecorationType.Underline });
            Text.onClick(() => { this.showPrivacyView('terms'); });
        }, Text);
        Text.pop();
        // === 隐私条款（可勾选）===
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // === 跳过，先看看 ===
            Text.create('跳过，先看看');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(180:13)", "entry");
            // === 跳过，先看看 ===
            Text.fontSize(14);
            // === 跳过，先看看 ===
            Text.fontColor('#999');
            // === 跳过，先看看 ===
            Text.margin({ top: 24, bottom: 36 });
            // === 跳过，先看看 ===
            Text.onClick(() => this.goAsGuest());
        }, Text);
        // === 跳过，先看看 ===
        Text.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // === 隐私/条款悬浮窗 ===
            if (this.privacyView !== '') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/LoginPage.ets(197:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#00000050');
                        Column.onClick(() => { this.privacyView = ''; });
                    }, Column);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/LoginPage.ets(203:9)", "entry");
                        Column.width('100%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/LoginPage.ets(204:11)", "entry");
                        Column.width('85%');
                        Column.height('70%');
                        Column.padding(20);
                        Column.backgroundColor('#fff');
                        Column.borderRadius(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/LoginPage.ets(205:13)", "entry");
                        Row.width('100%');
                        Row.margin({ bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.privacyView === 'privacy' ? '📄 隐私政策' : '📄 用户条款');
                        Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(206:15)", "entry");
                        Text.fontSize(17);
                        Text.fontWeight(FontWeight.Bold);
                        Text.layoutWeight(1);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✕');
                        Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(208:15)", "entry");
                        Text.fontSize(20);
                        Text.fontColor('#999');
                        Text.onClick(() => { this.privacyView = ''; });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.debugLine("entry/src/main/ets/pages/LoginPage.ets(214:13)", "entry");
                        Scroll.layoutWeight(1);
                        Scroll.scrollBar(BarState.Off);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/LoginPage.ets(215:15)", "entry");
                        Column.width('100%');
                        Column.padding({ bottom: 8 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.privacyView === 'privacy') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicyItem(this, { title: '1. 信息收集', content: '本应用仅收集您主动提供的信息：\n• 用户名和密码（加密存储，仅用于登录验证）\n• 您录入的交易记录（金额、品类、备注等）\n• 麦克风权限（仅用于语音记账功能，需您主动触发）\n\n我们不会收集您的设备标识、位置、通讯录或其他敏感信息。' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/LoginPage.ets", line: 217, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '1. 信息收集',
                                                    content: '本应用仅收集您主动提供的信息：\n• 用户名和密码（加密存储，仅用于登录验证）\n• 您录入的交易记录（金额、品类、备注等）\n• 麦克风权限（仅用于语音记账功能，需您主动触发）\n\n我们不会收集您的设备标识、位置、通讯录或其他敏感信息。'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '1. 信息收集', content: '本应用仅收集您主动提供的信息：\n• 用户名和密码（加密存储，仅用于登录验证）\n• 您录入的交易记录（金额、品类、备注等）\n• 麦克风权限（仅用于语音记账功能，需您主动触发）\n\n我们不会收集您的设备标识、位置、通讯录或其他敏感信息。'
                                            });
                                        }
                                    }, { name: "PolicyItem" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicyItem(this, { title: '2. 信息使用', content: '您的所有数据仅存储在设备本地数据库中。我们不向任何第三方传输您的数据。语音识别通过您指定的 AI 接口处理，不会用于模型训练。' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/LoginPage.ets", line: 218, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '2. 信息使用',
                                                    content: '您的所有数据仅存储在设备本地数据库中。我们不向任何第三方传输您的数据。语音识别通过您指定的 AI 接口处理，不会用于模型训练。'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '2. 信息使用', content: '您的所有数据仅存储在设备本地数据库中。我们不向任何第三方传输您的数据。语音识别通过您指定的 AI 接口处理，不会用于模型训练。'
                                            });
                                        }
                                    }, { name: "PolicyItem" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicyItem(this, { title: '3. 信息存储', content: '数据存储在设备本地 SQLite 数据库中。删除应用或清除数据将永久删除所有记录。建议您定期通过设置页的"数据导出"功能备份数据。' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/LoginPage.ets", line: 219, col: 19 });
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
                                    }, { name: "PolicyItem" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicyItem(this, { title: '4. 第三方服务', content: '语音识别功能可能调用第三方 AI 接口。这些接口仅接收您上传的语音数据，不会获取您的账户信息或其他数据。' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/LoginPage.ets", line: 220, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '4. 第三方服务',
                                                    content: '语音识别功能可能调用第三方 AI 接口。这些接口仅接收您上传的语音数据，不会获取您的账户信息或其他数据。'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '4. 第三方服务', content: '语音识别功能可能调用第三方 AI 接口。这些接口仅接收您上传的语音数据，不会获取您的账户信息或其他数据。'
                                            });
                                        }
                                    }, { name: "PolicyItem" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicyItem(this, { title: '5. 用户权利', content: '您可以随时：\n• 在设置中导出您的全部数据\n• 删除单条或全部交易记录\n• 注销账号（删除所有数据）\n• 撤回麦克风权限授权' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/LoginPage.ets", line: 221, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '5. 用户权利',
                                                    content: '您可以随时：\n• 在设置中导出您的全部数据\n• 删除单条或全部交易记录\n• 注销账号（删除所有数据）\n• 撤回麦克风权限授权'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '5. 用户权利', content: '您可以随时：\n• 在设置中导出您的全部数据\n• 删除单条或全部交易记录\n• 注销账号（删除所有数据）\n• 撤回麦克风权限授权'
                                            });
                                        }
                                    }, { name: "PolicyItem" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicyItem(this, { title: '6. 联系方式', content: '如有任何隐私相关问题，请通过以下方式联系我们：\n邮箱：445816282@qq.com' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/LoginPage.ets", line: 222, col: 19 });
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
                                    }, { name: "PolicyItem" });
                                }
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicyItem(this, { title: '1. 服务说明', content: '本应用（"快记交易"）提供个人记账及 AI 语音记账功能。您使用本应用即表示同意本条款。' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/LoginPage.ets", line: 224, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '1. 服务说明',
                                                    content: '本应用（"快记交易"）提供个人记账及 AI 语音记账功能。您使用本应用即表示同意本条款。'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '1. 服务说明', content: '本应用（"快记交易"）提供个人记账及 AI 语音记账功能。您使用本应用即表示同意本条款。'
                                            });
                                        }
                                    }, { name: "PolicyItem" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicyItem(this, { title: '2. 用户责任', content: '• 您对录入数据的准确性和合法性负责\n• 不得利用本应用从事违法违规活动\n• 应妥善保管账号密码，因密码泄露导致的损失由您自行承担' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/LoginPage.ets", line: 225, col: 19 });
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
                                    }, { name: "PolicyItem" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicyItem(this, { title: '3. 免责声明', content: '• 本应用按"现状"提供服务，不保证服务不会中断\n• AI 语音识别结果仅供参考，不构成财务建议\n• 因不可抗力导致的数据丢失，开发者不承担责任' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/LoginPage.ets", line: 226, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    title: '3. 免责声明',
                                                    content: '• 本应用按"现状"提供服务，不保证服务不会中断\n• AI 语音识别结果仅供参考，不构成财务建议\n• 因不可抗力导致的数据丢失，开发者不承担责任'
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                title: '3. 免责声明', content: '• 本应用按"现状"提供服务，不保证服务不会中断\n• AI 语音识别结果仅供参考，不构成财务建议\n• 因不可抗力导致的数据丢失，开发者不承担责任'
                                            });
                                        }
                                    }, { name: "PolicyItem" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicyItem(this, { title: '4. 知识产权', content: '本应用的所有权利（包括但不限于软件著作权、商标权）归开发者所有。未经许可，不得复制、修改、分发本应用。' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/LoginPage.ets", line: 227, col: 19 });
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
                                    }, { name: "PolicyItem" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicyItem(this, { title: '5. 条款变更', content: '我们可能会不时更新本条款。重大变更将通过应用内通知告知您。继续使用即表示接受变更后的条款。' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/LoginPage.ets", line: 228, col: 19 });
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
                                    }, { name: "PolicyItem" });
                                }
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PolicyItem(this, { title: '6. 联系我们', content: '如有任何问题，请发送邮件至：\n445816282@qq.com' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/LoginPage.ets", line: 229, col: 19 });
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
                                    }, { name: "PolicyItem" });
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
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "LoginPage";
    }
}
class PolicyItem extends ViewPU {
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
    setInitiallyProvidedValue(params: PolicyItem_Params) {
        if (params.title === undefined) {
            this.__title.set('');
        }
        if (params.content === undefined) {
            this.__content.set('');
        }
    }
    updateStateVars(params: PolicyItem_Params) {
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
            Column.debugLine("entry/src/main/ets/pages/LoginPage.ets(260:5)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title);
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(261:7)", "entry");
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333');
            Text.width('100%');
            Text.margin({ bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.content);
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(268:7)", "entry");
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
registerNamedRoute(() => new LoginPage(undefined, {}), "", { bundleName: "com.xiaolin.quicktrade", moduleName: "entry", pagePath: "pages/LoginPage", pageFullPath: "entry/src/main/ets/pages/LoginPage", integratedHsp: "false", moduleType: "followWithHap" });
