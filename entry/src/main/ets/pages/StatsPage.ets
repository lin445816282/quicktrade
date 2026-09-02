/**
 * 统计看板 V2 — 年/月/日联动筛选 + 每日趋势折线图 + 收支分类明细
 */
import { DatabaseService } from '../service/DatabaseService'
import { Transaction, TransactionType } from '../model/Transaction'
import { NumberUtils } from '../common/utils/NumberUtils'
import router from '@ohos.router'

// === 数据类 ===
class CatStat {
  category: string = ''
  total: number = 0
  icon: string = ''
}

interface MonthInfo { year: number; month: number }
interface DailyTotal { date: string; income: number; expense: number }
interface CategoryStat { category: string; total: number; type: string }

// === 图标映射（从数据库动态加载）
// CAT_ICONS 已废弃，改用 DatabaseService.getCategoryIconMap()

const PAD_LEFT = 40
const PAD_RIGHT = 12
const PAD_TOP = 10
const PAD_BOTTOM = 24

@Entry
@Component
struct StatsPage {
  @State totalIncome: number = 0
  @State totalExpense: number = 0
  @State dayTotals: DailyTotal[] = []
  @State expenseCats: CatStat[] = []
  @State incomeCats: CatStat[] = []
  @State listTab: number = 0 // 0=支出, 1=收入
  @State loading: boolean = true

  // 筛选
  @State years: number[] = []
  @State months: number[] = []
  @State selYear: number = 0
  @State selMonth: number = 0
  @State selDay: number = 0

  // 下拉弹窗
  @State showPicker: string = '' // 'year' | 'month' | 'day' | ''

  // 品类图标缓存
  @State catIconMap: Record<string, string> = {}

  // 存储可用月份原始数据
  private availMonths: MonthInfo[] = []

  // Canvas
  private chartSettings: RenderingContextSettings = new RenderingContextSettings(true)
  private chartCtx: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.chartSettings)

  aboutToAppear(): void {
    this.init()
  }

  async init(): Promise<void> {
    try {
      const avail: MonthInfo[] = await DatabaseService.getAvailableMonths()
      this.availMonths = avail
      const yearSet = new Set<number>()
      for (let i = 0; i < avail.length; i++) {
        yearSet.add(avail[i].year)
      }
      this.years = []
      yearSet.forEach((y: number): void => {
        this.years.push(y)
      })
      this.years.sort((a: number, b: number): number => b - a)

      if (this.years.length > 0) {
        this.selYear = this.years[0]
        this.refreshMonths()
      }
      // 加载品类图标缓存
      this.catIconMap = await DatabaseService.getCategoryIconMap()
      await this.loadData()
    } catch (e) {
      this.loading = false
    }
  }

  /** ---- 筛选联动 ---- */

  get yearLabel(): string {
    return this.selYear === 0 ? '全部年' : `${this.selYear}年`
  }

  get monthLabel(): string {
    return this.selMonth === 0 ? '全部月' : `${this.selMonth}月`
  }

  get dayLabel(): string {
    return this.selDay === 0 ? '全部日' : `${this.selDay}日`
  }

  refreshMonths(): void {
    if (this.selYear === 0) {
      this.months = []
      this.selMonth = 0
      this.selDay = 0
      return
    }
    const mSet = new Set<number>()
    for (let i = 0; i < this.availMonths.length; i++) {
      if (this.availMonths[i].year === this.selYear) {
        mSet.add(this.availMonths[i].month)
      }
    }
    this.months = []
    mSet.forEach((m: number): void => { this.months.push(m) })
    this.months.sort((a: number, b: number): number => b - a)
    this.selMonth = 0
    this.selDay = 0
  }

  getDaysInMonth(): number {
    if (this.selYear === 0 || this.selMonth === 0) return 0
    return new Date(this.selYear, this.selMonth, 0).getDate()
  }

  selectYear(y: number): void {
    this.selYear = y
    this.showPicker = ''
    this.refreshMonths()
    this.loadData()
  }

  selectMonth(m: number): void {
    this.selMonth = m
    this.showPicker = ''
    this.selDay = 0
    this.loadData()
  }

  selectDay(d: number): void {
    this.selDay = d
    this.showPicker = ''
    this.loadData()
  }

  /** ---- 日期范围 ---- */

  getQueryStart(): string {
    if (this.selYear === 0) return '2000-01-01T00:00:00'
    const y = this.selYear
    if (this.selMonth === 0) return `${y}-01-01T00:00:00`
    const m = String(this.selMonth).padStart(2, '0')
    if (this.selDay === 0) return `${y}-${m}-01T00:00:00`
    const d = String(this.selDay).padStart(2, '0')
    return `${y}-${m}-${d}T00:00:00`
  }

  getQueryEnd(): string {
    if (this.selYear === 0) return '2100-01-01T00:00:00'
    const y = this.selYear
    if (this.selMonth === 0) return `${y + 1}-01-01T00:00:00`
    let nm = this.selMonth + 1
    let ny = y
    if (nm > 12) { nm = 1; ny = y + 1 }
    if (this.selDay === 0) return `${ny}-${String(nm).padStart(2, '0')}-01T00:00:00`
    let nd = this.selDay + 1
    let nnm = this.selMonth
    let nny = y
    const maxDay = new Date(y, this.selMonth, 0).getDate()
    if (nd > maxDay) { nd = 1; nnm = this.selMonth + 1 }
    if (nnm > 12) { nnm = 1; nny = y + 1 }
    return `${nny}-${String(nnm).padStart(2, '0')}-${String(nd).padStart(2, '0')}T00:00:00`
  }

  /** ---- 数据加载 ---- */

  async loadData(): Promise<void> {
    this.loading = true
    try {
      const start = this.getQueryStart()
      const end = this.getQueryEnd()

      const txs: Transaction[] = await DatabaseService.getByDateRange(start, end)
      let inc = 0
      let exp = 0
      const expMap = new Map<string, CatStat>()
      const incMap = new Map<string, CatStat>()
      for (let i = 0; i < txs.length; i++) {
        const tx = txs[i]
        const isIncome = (tx.type === TransactionType.INCOME || String(tx.type) === 'income')
        if (isIncome) {
          inc += tx.amount
          this.accMap(incMap, tx)
        } else {
          exp += tx.amount
          this.accMap(expMap, tx)
        }
      }
      this.totalIncome = inc
      this.totalExpense = exp
      this.expenseCats = this.sortMap(expMap)
      this.incomeCats = this.sortMap(incMap)

      const daily: DailyTotal[] = await DatabaseService.getDailyTotals(start, end)
      this.dayTotals = daily
      this.loading = false

      setTimeout((): void => { this.drawChart() }, 200)
    } catch (e) {
      this.loading = false
      console.error('StatsPage loadData error')
    }
  }

  accMap(map: Map<string, CatStat>, tx: Transaction): void {
    const cat = tx.category || '其他'
    if (!map.has(cat)) {
      const cs = new CatStat()
      cs.category = cat
      cs.total = 0
      cs.icon = this.catIconMap[cat] || '📌'
      map.set(cat, cs)
    }
    const entry = map.get(cat)
    if (entry) entry.total += tx.amount
  }

  sortMap(map: Map<string, CatStat>): CatStat[] {
    const arr: CatStat[] = []
    map.forEach((v: CatStat): void => {
      const cs = new CatStat()
      cs.category = v.category; cs.total = v.total; cs.icon = v.icon
      arr.push(cs)
    })
    arr.sort((a: CatStat, b: CatStat): number => b.total - a.total)
    return arr
  }

  /** ---- Canvas 折线图 ---- */

  drawChart(): void {
    const ctx = this.chartCtx
    const w = ctx.width
    const h = 200
    if (w <= 0 || this.dayTotals.length === 0) return

    ctx.clearRect(0, 0, w, h)

    // 计算 Y 轴范围
    let maxVal = 0
    for (let i = 0; i < this.dayTotals.length; i++) {
      maxVal = Math.max(maxVal, this.dayTotals[i].income, this.dayTotals[i].expense)
    }
    if (maxVal === 0) maxVal = 100
    const yMax = Math.ceil(maxVal * 1.15)

    const chartW = w - PAD_LEFT - PAD_RIGHT
    const chartH = h - PAD_TOP - PAD_BOTTOM
    const n = this.dayTotals.length
    const barW = Math.max(chartW / (n * 2 + 1), 2)

    // Y轴刻度
    ctx.strokeStyle = '#eee'
    ctx.lineWidth = 0.5
    for (let v = 0; v <= yMax; v += Math.ceil(yMax / 4)) {
      const y = PAD_TOP + chartH - (v / yMax) * chartH
      if (y > PAD_TOP) {
        ctx.beginPath()
        ctx.moveTo(PAD_LEFT, y)
        ctx.lineTo(w - PAD_RIGHT, y)
        ctx.stroke()
        ctx.fillStyle = '#999'
        ctx.font = '9px sans-serif'
        ctx.textAlign = 'right'
        ctx.fillText(String(v), PAD_LEFT - 4, y + 3)
      }
    }

    // X轴标签（每5个显示一次）
    ctx.fillStyle = '#999'
    ctx.font = '8px sans-serif'
    ctx.textAlign = 'center'
    for (let i = 0; i < n; i++) {
      if (i % Math.max(Math.floor(n / 6), 1) === 0 || i === n - 1) {
        const dp: DailyTotal = this.dayTotals[i]
        const x = PAD_LEFT + i * barW * 2 + barW
        const dateLabel = dp.date.length >= 10 ? dp.date.slice(5) : dp.date
        ctx.fillText(dateLabel, x, h - 4)
      }
    }

    // 收入线（绿色）
    this.drawLine(ctx, PAD_LEFT, PAD_TOP, chartW, chartH, n, barW, true, yMax)
    // 支出线（红色）
    this.drawLine(ctx, PAD_LEFT, PAD_TOP, chartW, chartH, n, barW, false, yMax)

    // 图例
    ctx.font = '10px sans-serif'
    ctx.fillStyle = '#27ae60'
    ctx.textAlign = 'left'
    ctx.fillText('─ 收入', PAD_LEFT, PAD_TOP - 2)
    ctx.fillStyle = '#e74c3c'
    ctx.fillText('─ 支出', PAD_LEFT + 52, PAD_TOP - 2)
  }

  drawLine(ctx: CanvasRenderingContext2D, x0: number, y0: number,
           cw: number, ch: number, n: number, barW: number,
           isIncome: boolean, yMax: number): void {
    const color = isIncome ? '#27ae60' : '#e74c3c'
    const fillColor = isIncome ? 'rgba(39,174,96,0.12)' : 'rgba(231,76,60,0.12)'

    // 填充区域
    ctx.beginPath()
    ctx.moveTo(x0, y0 + ch)
    for (let i = 0; i < n; i++) {
      const val: number = isIncome ? this.dayTotals[i].income : this.dayTotals[i].expense
      const x = x0 + i * barW * 2 + barW
      const y = y0 + ch - (val / yMax) * ch
      ctx.lineTo(x, y)
    }
    ctx.lineTo(x0 + (n - 1) * barW * 2 + barW, y0 + ch)
    ctx.closePath()
    ctx.fillStyle = fillColor
    ctx.fill()

    // 折线
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5
    for (let i = 0; i < n; i++) {
      const val: number = isIncome ? this.dayTotals[i].income : this.dayTotals[i].expense
      const x = x0 + i * barW * 2 + barW
      const y = y0 + ch - (val / yMax) * ch
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 数据点
    ctx.fillStyle = color
    for (let i = 0; i < n; i++) {
      const val: number = isIncome ? this.dayTotals[i].income : this.dayTotals[i].expense
      if (val > 0) {
        const x = x0 + i * barW * 2 + barW
        const y = y0 + ch - (val / yMax) * ch
        ctx.beginPath()
        ctx.arc(x, y, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  /** ---- 下拉选择器 ---- */

  @Builder
  buildPickerOverlay() {
    if (this.showPicker !== '') {
      Column() {
        // 遮罩
        Column() {
        }
        .width('100%').height('100%')
        .backgroundColor('#00000040')
        .onClick((): void => { this.showPicker = '' })

        // 列表弹窗
        Column() {
          Scroll() {
            Column() {
              if (this.showPicker === 'year') {
                // 全部选项
                Row() {
                  Text('全部年').fontSize(14).fontColor(this.selYear === 0 ? '#27ae60' : '#333')
                }
                .width('100%').padding(12)
                .onClick((): void => { this.selectYear(0) })
                ForEach(this.years, (y: number): void => {
                  Row() {
                    Text(`${y}年`).fontSize(14)
                      .fontColor(y === this.selYear ? '#27ae60' : '#333')
                  }
                  .width('100%').padding(12)
                  .onClick((): void => { this.selectYear(y) })
                })
              }

              if (this.showPicker === 'month') {
                Row() {
                  Text('全部月').fontSize(14).fontColor(this.selMonth === 0 ? '#27ae60' : '#333')
                }
                .width('100%').padding(12)
                .onClick((): void => { this.selectMonth(0) })
                ForEach(this.months, (m: number): void => {
                  Row() {
                    Text(`${m}月`).fontSize(14)
                      .fontColor(m === this.selMonth ? '#27ae60' : '#333')
                  }
                  .width('100%').padding(12)
                  .onClick((): void => { this.selectMonth(m) })
                })
              }

              if (this.showPicker === 'day' && this.getDaysInMonth() > 0) {
                Row() {
                  Text('全部日').fontSize(14).fontColor(this.selDay === 0 ? '#27ae60' : '#333')
                }
                .width('100%').padding(12)
                .onClick((): void => { this.selectDay(0) })
                ForEach(Array.from({ length: this.getDaysInMonth() }, (_: undefined, i: number): number => i + 1),
                    (d: number): void => {
                    Row() {
                      Text(`${d}日`).fontSize(14)
                        .fontColor(d === this.selDay ? '#27ae60' : '#333')
                    }
                    .width('100%').padding(12)
                    .onClick((): void => { this.selectDay(d) })
                  })
              }
            }
            .width('100%')
          }
          .height(Math.min(280, (this.showPicker === 'day' ? this.getDaysInMonth() + 1 :
            this.showPicker === 'month' ? this.months.length + 1 : this.years.length + 1) * 42))
          .scrollBar(BarState.Off)
        }
        .width('80%')
        .backgroundColor('#fff').borderRadius(12)
        .padding({ top: 8, bottom: 8 })
      }
      .width('100%').height('100%').justifyContent(FlexAlign.Center)
      .position({ x: 0, y: 0 })
      .hitTestBehavior(HitTestMode.Block)
    }
  }

  /** ---- UI ---- */

  build() {
    Stack() {
      Column() {
        // 导航
        Row() {
          Text('←').fontSize(18).fontColor('#999')
            .onClick((): void => { router.back() })
          Blank()
          Text('📊 统计').fontSize(18).fontWeight(FontWeight.Medium)
          Blank()
          Text('  ').fontSize(18)
        }
        .width('100%').height(48).padding({ left: 16, right: 16 }).backgroundColor('#fff')

        // 筛选行
        Row() {
          this.buildFilterBtn(this.yearLabel, 'year')
          this.buildFilterBtn(this.monthLabel, 'month')
          this.buildFilterBtn(this.dayLabel, 'day')
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 8, bottom: 8 })
        .backgroundColor('#fff')
        .border({ width: { bottom: 0.5 }, color: '#f0f0f0' })

        // 汇总卡片
        Row() {
          Column() {
            Text('支出').fontSize(11).fontColor('#999')
            Text(NumberUtils.formatMoney(this.totalExpense))
              .fontSize(20).fontWeight(FontWeight.Bold).fontColor('#e74c3c')
              .margin({ top: 2 })
          }
          Column() {
            Text('收入').fontSize(11).fontColor('#999')
            Text(NumberUtils.formatMoney(this.totalIncome))
              .fontSize(20).fontWeight(FontWeight.Bold).fontColor('#27ae60')
              .margin({ top: 2 })
          }
          Column() {
            Text('结余').fontSize(11).fontColor('#999')
            Text(NumberUtils.formatMoney(this.totalIncome - this.totalExpense))
              .fontSize(20).fontWeight(FontWeight.Bold).fontColor('#333')
              .margin({ top: 2 })
          }
        }
        .width('100%').justifyContent(FlexAlign.SpaceAround)
        .padding({ top: 12, bottom: 12 }).backgroundColor('#fff')

        Scroll() {
          Column() {
            // 每日趋势图
            Column() {
              Row() {
                Text('📈 每日趋势').fontSize(15).fontWeight(FontWeight.Medium)
              }
              .width('100%').padding({ left: 12, right: 12, top: 10 })

              if (this.dayTotals.length === 0 && !this.loading) {
                Text('暂无数据').fontSize(13).fontColor('#ccc')
                  .width('100%').textAlign(TextAlign.Center)
                  .padding({ top: 30, bottom: 30 })
              } else {
                Canvas(this.chartCtx)
                  .width('100%').height(200)
                  .onReady((): void => { setTimeout((): void => { this.drawChart() }, 50) })
              }
            }
            .width('100%').backgroundColor('#fff').borderRadius(10)
            .margin({ left: 12, right: 12, top: 8 })

            // 收支明细
            Column() {
              Row() {
                Text('💸 支出明细').fontSize(15).fontWeight(FontWeight.Medium)
                Blank()
                Row() {
                  Text('支出').fontSize(12)
                    .fontColor(this.listTab === 0 ? '#fff' : '#999')
                    .padding({ left: 10, right: 10, top: 3, bottom: 3 }).borderRadius(10)
                    .backgroundColor(this.listTab === 0 ? '#e74c3c' : '#f0f0f0')
                    .onClick((): void => { this.listTab = 0 })
                  Text('收入').fontSize(12)
                    .fontColor(this.listTab === 1 ? '#fff' : '#999')
                    .padding({ left: 10, right: 10, top: 3, bottom: 3 }).borderRadius(10)
                    .backgroundColor(this.listTab === 1 ? '#27ae60' : '#f0f0f0')
                    .onClick((): void => { this.listTab = 1 })
                    .margin({ left: 6 })
                }
              }
              .width('100%').padding({ left: 12, right: 12, top: 10, bottom: 6 })

              if (this.listTab === 0) {
                if (this.expenseCats.length === 0) {
                  Text('暂无支出').fontSize(13).fontColor('#ccc')
                    .width('100%').textAlign(TextAlign.Center)
                    .padding({ top: 20, bottom: 20 })
                } else {
                  ForEach(this.expenseCats, (cs: CatStat, idx: number): void => {
                    this.buildCatRow(cs, idx, 'expense')
                  })
                }
              } else {
                if (this.incomeCats.length === 0) {
                  Text('暂无收入').fontSize(13).fontColor('#ccc')
                    .width('100%').textAlign(TextAlign.Center)
                    .padding({ top: 20, bottom: 20 })
                } else {
                  ForEach(this.incomeCats, (cs: CatStat, idx: number): void => {
                    this.buildCatRow(cs, idx, 'income')
                  })
                }
              }

              // 底部间距
              Row().height(20)
            }
            .width('100%').backgroundColor('#fff').borderRadius(10)
            .margin({ left: 12, right: 12, top: 8, bottom: 16 })
          }
          .width('100%')
        }
        .layoutWeight(1)
        .scrollBar(BarState.Off)
        .edgeEffect(EdgeEffect.None)
      }
      .width('100%').height('100%').backgroundColor('#f5f5f5')

      // 下拉选择器覆盖层
      this.buildPickerOverlay()
    }
    .width('100%').height('100%')
  }

  @Builder
  buildFilterBtn(label: string, pickerType: string) {
    Row() {
      Text(label).fontSize(13).fontColor('#333')
      Text(' ▼').fontSize(10).fontColor('#999')
    }
    .padding({ left: 10, right: 10, top: 6, bottom: 6 })
    .backgroundColor('#f5f5f5').borderRadius(6)
    .margin({ right: 8 })
    .onClick((): void => {
      if (pickerType === 'month' && this.selYear === 0) return
      if (pickerType === 'day' && (this.selYear === 0 || this.selMonth === 0)) return
      this.showPicker = pickerType
    })
  }

  @Builder
  buildCatRow(cs: CatStat, idx: number, _type: string) {
    Row() {
      Text(cs.icon).fontSize(16)
      Text(cs.category).fontSize(14).fontColor('#333').margin({ left: 8 })
      Blank()
      Text((this.listTab === 0 ? '-' : '+') + NumberUtils.formatMoney(cs.total)).fontSize(14)
        .fontWeight(FontWeight.Medium)
        .fontColor(this.listTab === 0 ? '#e74c3c' : '#27ae60')
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 9, bottom: 9 })
    .border({ width: { bottom: idx < (this.listTab === 0 ? this.expenseCats.length - 1 :
      this.incomeCats.length - 1) ? 0.5 : 0 }, color: '#f0f0f0' })
  }
}
