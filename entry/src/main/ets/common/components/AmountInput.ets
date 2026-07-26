/**
 * 数字键盘组件
 * 自定义金额输入面板，类似计算器
 */
@ComponentV2
export struct AmountInput {
  @Param value: string = '0'
  @Event onDigit?: (digit: string) => void
  @Event onDelete?: () => void

  private digits: string[][] = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', '⌫']
  ]

  build() {
    Column() {
      // 金额显示
      Text(`¥${this.value}`)
        .fontSize(36)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e74c3c')
        .fontFamily('HarmonyHeiTi')  // 更厚的数字字体
        .padding({ top: 16, bottom: 16 })
        .width('100%')
        .textAlign(TextAlign.Center)

      // 键盘网格
      Grid() {
        ForEach(this.digits, (row: string[]) => {
          ForEach(row, (key: string) => {
            GridItem() {
              if (key === '⌫') {
                Button() {
                  Text(key).fontSize(22).fontColor('#999')
                }
                .width('100%')
                .height(56)
                .backgroundColor('#f0f0f0')
                .borderRadius(8)
                .onClick(() => this.onDelete?.())
              } else {
                Button() {
                  Text(key).fontSize(22).fontWeight(FontWeight.Regular)
                }
                .width('100%')
                .height(56)
                .backgroundColor('#fff')
                .borderRadius(8)
                .border({ width: 0.5, color: '#e8e8e8' })
                .onClick(() => this.onDigit?.(key))
              }
            }
          })
        })
      }
      .columnsTemplate('1fr 1fr 1fr')
      .columnsGap(8)
      .rowsGap(8)
    }
  }
}
