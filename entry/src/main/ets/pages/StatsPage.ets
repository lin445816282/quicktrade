/**
 * 统计看板 V3 — 日期范围选择 + 每日趋势折线图 + 收支分类明细
 */
import { DatabaseService } from '../service/DatabaseService'
import { Transaction, TransactionType } from '../model/Transaction'
import { NumberUtils } from '../common/utils/NumberUtils'
import router from '@ohos.router'

class CatStat {
  category: string = ''
  total: number = 0
  icon: string = ''
}

interface MonthInfo { year: number; month: number }
interface DailyTotal { date: string; income: number; expense: number }

const CAT_ICONS: Record<string, string> = {
  '餐饮': '🍜', '交通': '🚗', '购物': '🛍️', '日用品': '🧴',
  '娱乐': '🎮', '通讯': '📱', '居住': '🏠', '医疗': '💊',
  '教育': '📚', '工资': '💵', '投资': '📈', '兼职': '💼',
  '退款': '↩️', '其他': '📌'
}

class Preset {
  label: string = ''
  days: number = 0
}

const PRESETS: Preset[] = [
  { label: '今天', days: 0 } as Preset,
  { label: '本周', days: -6 } as Preset,
  { label: '本月', days: -29 } as Preset,
  { label: '本年', days: -364 } as Preset,
  { label: '全部', days: -9999 } as Preset
]

@Entry
@Component
struct StatsPage {
  @State totalIncome: number = 0
  @State totalExpense: number = 0
  @State dayTotals: DailyTotal[] = []
  @State expenseCats: CatStat[] = []
  @State incomeCats: CatStat[] = []
  @State listTab: number = 0
  @State loading: boolean = true

  // 日期范围
  @State startDate: Date = new Date()
  @State endDate: Date = new Date()
  @State startLabel: string = ''
  @State endLabel: string = ''
  @State activePreset: number = 0 // -1=自定义, 0=今天, 1=本周...

  private chartSettings: RenderingContextSettings = new RenderingContextSettings(true)
  private chartCtx: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.chartSettings)

  aboutToAppear(): void {
    const now = new Date()
    this.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    this.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    this.startLabel = this.fmtDate(this.startDate)
    this.endLabel = this.fmtDate(this.endDate)
    this.activePreset = 0
    this.loadData()
  }

  fmtDate(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  /** ---- 日期预设 ---- */

  applyPreset(idx: number): void {
    this.activePreset = idx
    const now = new Date()
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    let start: Date
    if (PRESETS[idx].days === 0) {
      start = new Date(end)
    } else if (PRESETS[idx].days < 0) {
      start = new Date(end)
      start.setDate(start.getDate() + PRESETS[idx].days)
      if (idx === 3) { // 本月
        start = new Date(now.getFullYear(), now.getMonth(), 1)
      }
      if (idx === 4) { // 本年
        start = new Date(now.getFullYear(), 0, 1)
      }
    } else { // 全部
      start = new Date(2000, 0, 1)
    }
    this.startDate = start
    this.endDate = end
    this.startLabel = this.fmtDate(start)
    this.endLabel = this.fmtDate(end)
    this.loadData()
  }

  openStartPicker(): void {
    this.getUIContext().showDatePickerDialog({
      start: new Date('2020-01-01'),
      end: new Date('2030-12-31'),
      selected: this.startDate,
      showTime: false,
      onDateAccept: (val: Date): void => {
        this.startDate = new Date(val.getFullYear(), val.getMonth(), val.getDate())
        this.startLabel = this.fmtDate(this.startDate)
        if (this.startDate.getTime() > this.endDate.getTime()) {
          this.endDate = new Date(this.startDate)
          this.endLabel = this.fmtDate(this.endDate)
        }
        this.activePreset = -1
        this.loadData()
      }
    })
  }

  openEndPicker(): void {
    this.getUIContext().showDatePickerDialog({
      start: this.startDate,
      end: new Date('2030-12-31'),
      selected: this.endDate,
      showTime: false,
      onDateAccept: (val: Date): void => {
        this.endDate = new Date(val.getFullYear(), val.getMonth(), val.getDate())
        this.endLabel = this.fmtDate(this.endDate)
        if (this.endDate.getTime() < this.startDate.getTime()) {
          this.startDate = new Date(this.endDate)
          this.startLabel = this.fmtDate(this.startDate)
        }
        this.activePreset = -1
        this.loadData()
      }
    })
  }

  /** ---- 数据 ---- */

  getQueryStart(): string {
    const d = this.startDate
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}T00:00:00`
  }

  getQueryEnd(): string {
    const d = this.endDate
    const nd = new Date(d)
    nd.setDate(nd.getDate() + 1)
    return `${nd.getFullYear()}-${String(nd.getMonth()+1).padStart(2,'0')}-${String(nd.getDate()).padStart(2,'0')}T00:00:00`
  }

  async loadData(): Promise<void> {
    this.loading = true
    try {
      const start = this.getQueryStart()
      const end = this.getQueryEnd()
      const txs: Transaction[] = await DatabaseService.getByDateRange(start, end)
      let inc = 0; let exp = 0
      const expMap = new Map<string, CatStat>()
      const incMap = new Map<string, CatStat>()
      for (let i = 0; i < txs.length; i++) {
        const tx = txs[i]
        if (tx.type === TransactionType.INCOME || String(tx.type) === 'income') {
          inc += tx.amount; this.accMap(incMap, tx)
        } else {
          exp += tx.amount; this.accMap(expMap, tx)
        }
      }
      this.totalIncome = inc; this.totalExpense = exp
      this.expenseCats = this.sortMap(expMap); this.incomeCats = this.sortMap(incMap)
      const daily: DailyTotal[] = await DatabaseService.getDailyTotals(start, end)
      this.dayTotals = daily
      this.loading = false
      setTimeout((): void => { this.drawChart() }, 300)
    } catch (e) {
      this.loading = false
    }
  }

  accMap(map: Map<string, CatStat>, tx: Transaction): void {
    const cat = tx.category || '其他'
    if (!map.has(cat)) {
      const cs = new CatStat(); cs.category = cat; cs.total = 0; cs.icon = CAT_ICONS[cat] || '📌'
      map.set(cat, cs)
    }
    const entry = map.get(cat)
    if (entry) entry.total += tx.amount
  }

  sortMap(map: Map<string, CatStat>): CatStat[] {
    const arr: CatStat[] = []
    map.forEach((v: CatStat): void => {
      const cs = new CatStat(); cs.category = v.category; cs.total = v.total; cs.icon = v.icon
      arr.push(cs)
    })
    arr.sort((a: CatStat, b: CatStat): number => b.total - a.total)
    return arr
  }

  /** ---- Canvas ---- */

  drawChart(): void {
    const ctx = this.chartCtx
    const W = ctx.width
    const H = 220
    if (W <= 0 || this.dayTotals.length === 0) return
    ctx.clearRect(0, 0, W, H)

    const padL = 42; const padR = 14; const padT = 14; const padB = 26
    const cw = W - padL - padR; const ch = H - padT - padB
    const n = this.dayTotals.length
    const step = Math.max(cw / n, 8)

    let maxVal = 0
    for (let i = 0; i < n; i++) maxVal = Math.max(maxVal, this.dayTotals[i].income, this.dayTotals[i].expense)
    if (maxVal === 0) maxVal = 100
    const yMax = Math.ceil(maxVal * 1.15)

    ctx.strokeStyle = '#eee'; ctx.lineWidth = 0.5
    for (let v = 0; v <= yMax; v += Math.ceil(yMax / 4)) {
      const y = padT + ch - (v / yMax) * ch
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke()
      ctx.fillStyle = '#999'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right'
      ctx.fillText(String(v), padL - 4, y + 3)
    }

    ctx.fillStyle = '#999'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center'
    const step6 = Math.max(Math.floor(n / 6), 1)
    for (let i = 0; i < n; i++) {
      if (i % step6 === 0 || i === n - 1) {
        const x = padL + i * step
        const lbl = this.dayTotals[i].date.length >= 10 ? this.dayTotals[i].date.slice(5) : this.dayTotals[i].date
        ctx.fillText(lbl, x, H - 6)
      }
    }

    this.paintLine(ctx, padL, padT, cw, ch, n, step, true, yMax)
    this.paintLine(ctx, padL, padT, cw, ch, n, step, false, yMax)
  }

  paintLine(ctx: CanvasRenderingContext2D, x0: number, y0: number,
            cw: number, ch: number, n: number, step: number,
            isIncome: boolean, yMax: number): void {
    const color = isIncome ? '#27ae60' : '#e74c3c'
    const fillA = isIncome ? 'rgba(39,174,96,0.10)' : 'rgba(231,76,60,0.10)'
    ctx.beginPath(); ctx.moveTo(x0, y0 + ch)
    let lastV = 0; let lastX = x0; let lastY = y0 + ch
    for (let i = 0; i < n; i++) {
      const v = isIncome ? this.dayTotals[i].income : this.dayTotals[i].expense
      const x = x0 + i * step; const y = y0 + ch - (v / yMax) * ch
      ctx.lineTo(x, y)
      if (v > 0) { lastV = v; lastX = x; lastY = y }
    }
    ctx.lineTo(x0 + (n - 1) * step, y0 + ch); ctx.closePath()
    ctx.fillStyle = fillA; ctx.fill()

    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 1.5
    for (let i = 0; i < n; i++) {
      const v = isIncome ? this.dayTotals[i].income : this.dayTotals[i].expense
      const x = x0 + i * step; const y = y0 + ch - (v / yMax) * ch
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.stroke()

    ctx.fillStyle = color
    for (let i = 0; i < n; i++) {
      const v = isIncome ? this.dayTotals[i].income : this.dayTotals[i].expense
      if (v > 0) {
        const x = x0 + i * step; const y = y0 + ch - (v / yMax) * ch
        ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill()
      }
    }

    if (lastV > 0) {
      ctx.font = '15px sans-serif'
      ctx.fillStyle = color
      ctx.textAlign = 'left'
      ctx.fillText(isIncome ? '收入' : '支出', lastX + 8, lastY + 5)
    }
  }

  /** ---- UI ---- */

  build() {
    Column() {
      // 导航
      Row() {
        Text('←').fontSize(18).fontColor('#999').onClick((): void => { router.back() })
        Blank()
        Text('📊 统计').fontSize(18).fontWeight(FontWeight.Medium)
        Blank()
        Text('  ').fontSize(18)
      }
      .width('100%').height(48).padding({ left: 16, right: 16 }).backgroundColor('#fff')

      // 日期范围卡片
      Column() {
        // 预设按钮
        Scroll() {
          Row() {
            ForEach(PRESETS, (p: Preset, idx: number): void => {
              Text(p.label).fontSize(12)
                .fontColor(idx === this.activePreset ? '#fff' : '#666')
                .padding({ left: 12, right: 12, top: 5, bottom: 5 })
                .borderRadius(12)
                .backgroundColor(idx === this.activePreset ? '#27ae60' : '#f0f0f0')
                .margin({ right: 8 })
                .onClick((): void => { this.applyPreset(idx) })
            })
          }
          .padding({ left: 16, right: 16 })
        }
        .scrollable(ScrollDirection.Horizontal).scrollBar(BarState.Off)
        .width('100%')

        // 日期范围选择行
        Row() {
          Text('📅').fontSize(14)
          Row() {
            Text(this.startLabel).fontSize(14).fontColor('#27ae60').fontWeight(FontWeight.Medium)
            Text(' ▾').fontSize(10).fontColor('#999')
          }
          .padding({ left: 10, right: 10, top: 6, bottom: 6 })
          .border({ width: 1, color: '#e0e0e0', radius: 6 })
          .backgroundColor('#fff')
          .onClick((): void => { this.openStartPicker() })

          Text('→').fontSize(14).fontColor('#999').margin({ left: 6, right: 6 })

          Row() {
            Text(this.endLabel).fontSize(14).fontColor('#e74c3c').fontWeight(FontWeight.Medium)
            Text(' ▾').fontSize(10).fontColor('#999')
          }
          .padding({ left: 10, right: 10, top: 6, bottom: 6 })
          .border({ width: 1, color: '#e0e0e0', radius: 6 })
          .backgroundColor('#fff')
          .onClick((): void => { this.openEndPicker() })
        }
        .width('100%').padding({ left: 16, right: 16, top: 8, bottom: 10 })
      }
      .width('100%').backgroundColor('#fff')
      .border({ width: { bottom: 0.5 }, color: '#f0f0f0' })

      // 汇总卡片
      Row() {
        Column() {
          Text('支出').fontSize(11).fontColor('#999')
          Text(NumberUtils.formatMoney(this.totalExpense))
            .fontSize(20).fontWeight(FontWeight.Bold).fontColor('#e74c3c').margin({ top: 2 })
        }.layoutWeight(1)
        Column() {
          Text('收入').fontSize(11).fontColor('#999')
          Text(NumberUtils.formatMoney(this.totalIncome))
            .fontSize(20).fontWeight(FontWeight.Bold).fontColor('#27ae60').margin({ top: 2 })
        }.layoutWeight(1)
        Column() {
          Text('结余').fontSize(11).fontColor('#999')
          Text(NumberUtils.formatMoney(this.totalIncome - this.totalExpense))
            .fontSize(20).fontWeight(FontWeight.Bold).fontColor('#333').margin({ top: 2 })
        }.layoutWeight(1)
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 14, bottom: 14 }).backgroundColor('#fff')

      // 滚动区
      Scroll() {
        Column() {
          // 每日趋势
          Column() {
            Text('📈 每日趋势').fontSize(15).fontWeight(FontWeight.Medium)
              .width('100%').padding({ left: 12, right: 12, top: 10, bottom: 4 })

            if (this.dayTotals.length === 0 && !this.loading) {
              Text('暂无数据').fontSize(13).fontColor('#ccc')
                .width('100%').textAlign(TextAlign.Center).padding({ top: 30, bottom: 30 })
            } else {
              Canvas(this.chartCtx).width('100%').height(220)
                .onReady((): void => { setTimeout((): void => { this.drawChart() }, 100) })
            }
          }
          .width('100%').backgroundColor('#fff').borderRadius(10)
          .margin({ left: 12, right: 12, top: 8 })

          // 收支明细
          Column() {
            Row() {
              Text('💸 收支明细').fontSize(15).fontWeight(FontWeight.Medium)
              Blank()
              Text('支出').fontSize(12)
                .fontColor(this.listTab === 0 ? '#fff' : '#999')
                .padding({ left: 10, right: 10, top: 3, bottom: 3 }).borderRadius(10)
                .backgroundColor(this.listTab === 0 ? '#e74c3c' : '#f0f0f0')
                .onClick((): void => { this.listTab = 0 })
              Text('收入').fontSize(12)
                .fontColor(this.listTab === 1 ? '#fff' : '#999')
                .padding({ left: 10, right: 10, top: 3, bottom: 3 }).borderRadius(10)
                .backgroundColor(this.listTab === 1 ? '#27ae60' : '#f0f0f0')
                .margin({ left: 6 })
                .onClick((): void => { this.listTab = 1 })
            }
            .width('100%').padding({ left: 12, right: 12, top: 10, bottom: 6 })

            if (this.listTab === 0) {
              if (this.expenseCats.length === 0) {
                Text('暂无支出').fontSize(13).fontColor('#ccc')
                  .width('100%').textAlign(TextAlign.Center).padding({ top: 20, bottom: 20 })
              } else {
                ForEach(this.expenseCats, (cs: CatStat, idx: number): void => {
                  Row() {
                    Text(cs.icon).fontSize(16)
                    Text(cs.category).fontSize(14).fontColor('#333').margin({ left: 8 })
                    Blank()
                    Text('-' + NumberUtils.formatMoney(cs.total))
                      .fontSize(14).fontWeight(FontWeight.Medium).fontColor('#e74c3c')
                  }
                  .width('100%')
                  .padding({ left: 16, right: 16, top: 9, bottom: 9 })
                  .border({ width: { bottom: idx < this.expenseCats.length - 1 ? 0.5 : 0 }, color: '#f0f0f0' })
                })
              }
            } else {
              if (this.incomeCats.length === 0) {
                Text('暂无收入').fontSize(13).fontColor('#ccc')
                  .width('100%').textAlign(TextAlign.Center).padding({ top: 20, bottom: 20 })
              } else {
                ForEach(this.incomeCats, (cs: CatStat, idx: number): void => {
                  Row() {
                    Text(cs.icon).fontSize(16)
                    Text(cs.category).fontSize(14).fontColor('#333').margin({ left: 8 })
                    Blank()
                    Text('+' + NumberUtils.formatMoney(cs.total))
                      .fontSize(14).fontWeight(FontWeight.Medium).fontColor('#27ae60')
                  }
                  .width('100%')
                  .padding({ left: 16, right: 16, top: 9, bottom: 9 })
                  .border({ width: { bottom: idx < this.incomeCats.length - 1 ? 0.5 : 0 }, color: '#f0f0f0' })
                })
              }
            }
            Row().height(20)
          }
          .width('100%').backgroundColor('#fff').borderRadius(10)
          .margin({ left: 12, right: 12, top: 8, bottom: 16 })
        }
        .width('100%')
      }
      .layoutWeight(1).scrollBar(BarState.Off).edgeEffect(EdgeEffect.None)
    }
    .width('100%').height('100%').backgroundColor('#f5f5f5')
  }
}
