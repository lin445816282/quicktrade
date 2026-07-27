/**
 * 数字键盘组件 — V1 版本，纯 @Component + @Prop
 */
@Component
export struct AmountInput {
  @Prop value: string = '0'
  onDigit?: (digit: string) => void
  onDelete?: () => void

  build() {
    Column() {
      // 金额显示
      Text(`¥${this.value}`)
        .fontSize(36)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e74c3c')
        .padding({ top: 16, bottom: 16 })
        .width('100%')
        .textAlign(TextAlign.Center)

      // 键盘行
      Column() {
        // Row 1: 1 2 3
        Row() {
          this.KeyButton('1')
          this.KeyButton('2')
          this.KeyButton('3')
        }.width('100%')

        // Row 2: 4 5 6
        Row() {
          this.KeyButton('4')
          this.KeyButton('5')
          this.KeyButton('6')
        }.width('100%')

        // Row 3: 7 8 9
        Row() {
          this.KeyButton('7')
          this.KeyButton('8')
          this.KeyButton('9')
        }.width('100%')

        // Row 4: . 0 ⌫
        Row() {
          this.KeyButton('.')
          this.KeyButton('0')
          this.DelButton()
        }.width('100%')
      }
    }
  }

  @Builder
  KeyButton(key: string) {
    Button() {
      Text(key).fontSize(22).fontWeight(FontWeight.Regular)
    }
    .width('30%')
    .height(56)
    .backgroundColor('#fff')
    .borderRadius(8)
    .border({ width: 0.5, color: '#e8e8e8' })
    .margin({ left: '1.5%', right: '1.5%', bottom: 8 })
    .onClick(() => {
      if (this.onDigit) this.onDigit(key)
    })
  }

  @Builder
  DelButton() {
    Button() {
      Text('⌫').fontSize(22).fontColor('#999')
    }
    .width('30%')
    .height(56)
    .backgroundColor('#f0f0f0')
    .borderRadius(8)
    .margin({ left: '1.5%', right: '1.5%', bottom: 8 })
    .onClick(() => {
      if (this.onDelete) this.onDelete()
    })
  }
}
