if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PrivacyItem_Params {
    icon?: string;
    label?: string;
    desc?: string;
}
interface PrivacyConsentPage_Params {
    agreed?: boolean;
}
import router from "@ohos:router";
import type common from "@ohos:app.ability.common";
import type Want from "@ohos:app.ability.Want";
import preferences from "@ohos:data.preferences";
const PREFS_NAME = 'quicktrade_settings';
class PrivacyConsentPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__agreed = new ObservedPropertySimplePU(false, this, "agreed");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PrivacyConsentPage_Params) {
        if (params.agreed !== undefined) {
            this.agreed = params.agreed;
        }
    }
    updateStateVars(params: PrivacyConsentPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__agreed.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__agreed.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __agreed: ObservedPropertySimplePU<boolean>;
    get agreed() {
        return this.__agreed.get();
    }
    set agreed(newValue: boolean) {
        this.__agreed.set(newValue);
    }
    async agree() {
        // 保存同意状态
        try {
            const ctx = getContext(this) as common.UIAbilityContext;
            const prefs = await preferences.getPreferences(ctx, PREFS_NAME);
            await prefs.put('privacy_agreed', true);
            await prefs.flush();
        }
        catch (e) {
            console.error('Privacy prefs save error:', JSON.stringify(e));
        }
        // 跳转到首页（游客模式）
        router.replaceUrl({ url: 'pages/Index' });
    }
    disagree() {
        // 退出应用
        const ctx = getContext(this) as common.UIAbilityContext;
        ctx.terminateSelf();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(38:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f8f9fc');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部图标区
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(40:7)", "entry");
            // 顶部图标区
            Column.width('100%');
            // 顶部图标区
            Column.padding({ top: 48, bottom: 32 });
            // 顶部图标区
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📒');
            Text.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(41:9)", "entry");
            Text.fontSize(56);
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('快记交易');
            Text.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(45:9)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#1a1a2e');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI语音记账 · 简单高效');
            Text.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(50:9)", "entry");
            Text.fontSize(14);
            Text.fontColor('#888');
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        // 顶部图标区
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 隐私政策内容
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(60:7)", "entry");
            // 隐私政策内容
            Scroll.layoutWeight(1);
            // 隐私政策内容
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(61:9)", "entry");
            Column.width('100%');
            Column.padding({ left: 4, right: 4 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('隐私政策概要');
            Text.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(62:11)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333');
            Text.margin({ bottom: 16 });
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new PrivacyItem(this, { icon: '📱', label: '账户信息', desc: '您注册时提供的用户名和密码（加密存储）' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/PrivacyConsentPage.ets", line: 69, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            icon: '📱',
                            label: '账户信息',
                            desc: '您注册时提供的用户名和密码（加密存储）'
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        icon: '📱', label: '账户信息', desc: '您注册时提供的用户名和密码（加密存储）'
                    });
                }
            }, { name: "PrivacyItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new PrivacyItem(this, { icon: '💰', label: '交易记录', desc: '您录入的收入/支出金额、品类、备注等' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/PrivacyConsentPage.ets", line: 70, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            icon: '💰',
                            label: '交易记录',
                            desc: '您录入的收入/支出金额、品类、备注等'
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        icon: '💰', label: '交易记录', desc: '您录入的收入/支出金额、品类、备注等'
                    });
                }
            }, { name: "PrivacyItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new PrivacyItem(this, { icon: '🎤', label: '麦克风权限', desc: '用于语音记账，仅在您主动触发时使用' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/PrivacyConsentPage.ets", line: 71, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            icon: '🎤',
                            label: '麦克风权限',
                            desc: '用于语音记账，仅在您主动触发时使用'
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        icon: '🎤', label: '麦克风权限', desc: '用于语音记账，仅在您主动触发时使用'
                    });
                }
            }, { name: "PrivacyItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new PrivacyItem(this, { icon: '🌐', label: '网络权限', desc: '用于调用AI接口解析语音内容' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/PrivacyConsentPage.ets", line: 72, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            icon: '🌐',
                            label: '网络权限',
                            desc: '用于调用AI接口解析语音内容'
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        icon: '🌐', label: '网络权限', desc: '用于调用AI接口解析语音内容'
                    });
                }
            }, { name: "PrivacyItem" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(74:11)", "entry");
            Text.height(16);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('您的所有数据均存储在设备本地，不会自动上传云端。\n您可以在设置中随时注销账号并删除全部数据。');
            Text.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(77:11)", "entry");
            Text.fontSize(13);
            Text.fontColor('#888');
            Text.lineHeight(20);
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(83:11)", "entry");
            Text.height(8);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('查看完整隐私政策 →');
            Text.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(86:11)", "entry");
            Text.fontSize(13);
            Text.fontColor('#2d6be0');
            Text.decoration({ type: TextDecorationType.Underline });
            Text.onClick(() => {
                // 打开浏览器查看隐私政策
                const ctx = getContext(this) as common.UIAbilityContext;
                const want: Want = {
                    action: 'ohos.want.action.viewData',
                    entities: ['entity.system.browsable'],
                    uri: 'https://www.ct256.cn/privacy-quicktrade'
                };
                ctx.startAbility(want).catch((err: Error) => {
                    console.error('Open browser failed:', JSON.stringify(err));
                });
            });
        }, Text);
        Text.pop();
        Column.pop();
        // 隐私政策内容
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部按钮
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(110:7)", "entry");
            // 底部按钮
            Column.width('100%');
            // 底部按钮
            Column.padding({ left: 28, right: 28, bottom: 36 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('同意并继续');
            Button.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(111:9)", "entry");
            Button.width('100%');
            Button.height(48);
            Button.fontSize(16);
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor('#2d6be0');
            Button.fontColor('#fff');
            Button.borderRadius(24);
            Button.onClick(() => this.agree());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('不同意并退出');
            Button.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(121:9)", "entry");
            Button.width('100%');
            Button.height(48);
            Button.fontSize(15);
            Button.fontWeight(FontWeight.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor('#999');
            Button.margin({ top: 12 });
            Button.onClick(() => this.disagree());
        }, Button);
        Button.pop();
        // 底部按钮
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "PrivacyConsentPage";
    }
}
class PrivacyItem extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__icon = new SynchedPropertySimpleOneWayPU(params.icon, this, "icon");
        this.__label = new SynchedPropertySimpleOneWayPU(params.label, this, "label");
        this.__desc = new SynchedPropertySimpleOneWayPU(params.desc, this, "desc");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PrivacyItem_Params) {
        if (params.icon === undefined) {
            this.__icon.set('');
        }
        if (params.label === undefined) {
            this.__label.set('');
        }
        if (params.desc === undefined) {
            this.__desc.set('');
        }
    }
    updateStateVars(params: PrivacyItem_Params) {
        this.__icon.reset(params.icon);
        this.__label.reset(params.label);
        this.__desc.reset(params.desc);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__icon.purgeDependencyOnElmtId(rmElmtId);
        this.__label.purgeDependencyOnElmtId(rmElmtId);
        this.__desc.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__icon.aboutToBeDeleted();
        this.__label.aboutToBeDeleted();
        this.__desc.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __icon: SynchedPropertySimpleOneWayPU<string>;
    get icon() {
        return this.__icon.get();
    }
    set icon(newValue: string) {
        this.__icon.set(newValue);
    }
    private __label: SynchedPropertySimpleOneWayPU<string>;
    get label() {
        return this.__label.get();
    }
    set label(newValue: string) {
        this.__label.set(newValue);
    }
    private __desc: SynchedPropertySimpleOneWayPU<string>;
    get desc() {
        return this.__desc.get();
    }
    set desc(newValue: string) {
        this.__desc.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(147:5)", "entry");
            Row.width('100%');
            Row.padding({ top: 12, bottom: 12 });
            Row.alignItems(VerticalAlign.Top);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.icon);
            Text.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(148:7)", "entry");
            Text.fontSize(18);
            Text.margin({ right: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(152:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.label);
            Text.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(153:9)", "entry");
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.desc);
            Text.debugLine("entry/src/main/ets/pages/PrivacyConsentPage.ets(157:9)", "entry");
            Text.fontSize(12);
            Text.fontColor('#999');
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
registerNamedRoute(() => new PrivacyConsentPage(undefined, {}), "", { bundleName: "com.xiaolin.quicktrade", moduleName: "entry", pagePath: "pages/PrivacyConsentPage", pageFullPath: "entry/src/main/ets/pages/PrivacyConsentPage", integratedHsp: "false", moduleType: "followWithHap" });
