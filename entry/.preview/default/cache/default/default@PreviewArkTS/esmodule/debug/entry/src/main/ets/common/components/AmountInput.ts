if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface AmountInput_Params {
    value?: string;
    onDigit?: (digit: string) => void;
    onDelete?: () => void;
}
export class AmountInput extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__value = new SynchedPropertySimpleOneWayPU(params.value, this, "value");
        this.onDigit = undefined;
        this.onDelete = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: AmountInput_Params) {
        if (params.value === undefined) {
            this.__value.set('0');
        }
        if (params.onDigit !== undefined) {
            this.onDigit = params.onDigit;
        }
        if (params.onDelete !== undefined) {
            this.onDelete = params.onDelete;
        }
    }
    updateStateVars(params: AmountInput_Params) {
        this.__value.reset(params.value);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__value.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__value.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __value: SynchedPropertySimpleOneWayPU<string>;
    get value() {
        return this.__value.get();
    }
    set value(newValue: string) {
        this.__value.set(newValue);
    }
    private onDigit?: (digit: string) => void;
    private onDelete?: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/common/components/AmountInput.ets(11:5)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 金额显示
            Text.create(`¥${this.value}`);
            Text.debugLine("entry/src/main/ets/common/components/AmountInput.ets(13:7)", "entry");
            // 金额显示
            Text.fontSize(36);
            // 金额显示
            Text.fontWeight(FontWeight.Bold);
            // 金额显示
            Text.fontColor('#e74c3c');
            // 金额显示
            Text.padding({ top: 16, bottom: 16 });
            // 金额显示
            Text.width('100%');
            // 金额显示
            Text.textAlign(TextAlign.Center);
        }, Text);
        // 金额显示
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 键盘行
            Column.create();
            Column.debugLine("entry/src/main/ets/common/components/AmountInput.ets(22:7)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Row 1: 1 2 3
            Row.create();
            Row.debugLine("entry/src/main/ets/common/components/AmountInput.ets(24:9)", "entry");
            // Row 1: 1 2 3
            Row.width('100%');
        }, Row);
        this.KeyButton.bind(this)('1');
        this.KeyButton.bind(this)('2');
        this.KeyButton.bind(this)('3');
        // Row 1: 1 2 3
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Row 2: 4 5 6
            Row.create();
            Row.debugLine("entry/src/main/ets/common/components/AmountInput.ets(31:9)", "entry");
            // Row 2: 4 5 6
            Row.width('100%');
        }, Row);
        this.KeyButton.bind(this)('4');
        this.KeyButton.bind(this)('5');
        this.KeyButton.bind(this)('6');
        // Row 2: 4 5 6
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Row 3: 7 8 9
            Row.create();
            Row.debugLine("entry/src/main/ets/common/components/AmountInput.ets(38:9)", "entry");
            // Row 3: 7 8 9
            Row.width('100%');
        }, Row);
        this.KeyButton.bind(this)('7');
        this.KeyButton.bind(this)('8');
        this.KeyButton.bind(this)('9');
        // Row 3: 7 8 9
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Row 4: . 0 ⌫
            Row.create();
            Row.debugLine("entry/src/main/ets/common/components/AmountInput.ets(45:9)", "entry");
            // Row 4: . 0 ⌫
            Row.width('100%');
        }, Row);
        this.KeyButton.bind(this)('.');
        this.KeyButton.bind(this)('0');
        this.DelButton.bind(this)();
        // Row 4: . 0 ⌫
        Row.pop();
        // 键盘行
        Column.pop();
        Column.pop();
    }
    KeyButton(key: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/common/components/AmountInput.ets(56:5)", "entry");
            Button.width('30%');
            Button.height(56);
            Button.backgroundColor('#fff');
            Button.borderRadius(8);
            Button.border({ width: 0.5, color: '#e8e8e8' });
            Button.margin({ left: '1.5%', right: '1.5%', bottom: 8 });
            Button.onClick(() => {
                if (this.onDigit)
                    this.onDigit(key);
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(key);
            Text.debugLine("entry/src/main/ets/common/components/AmountInput.ets(57:7)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Regular);
        }, Text);
        Text.pop();
        Button.pop();
    }
    DelButton(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/common/components/AmountInput.ets(72:5)", "entry");
            Button.width('30%');
            Button.height(56);
            Button.backgroundColor('#f0f0f0');
            Button.borderRadius(8);
            Button.margin({ left: '1.5%', right: '1.5%', bottom: 8 });
            Button.onClick(() => {
                if (this.onDelete)
                    this.onDelete();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('⌫');
            Text.debugLine("entry/src/main/ets/common/components/AmountInput.ets(73:7)", "entry");
            Text.fontSize(22);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        Button.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
