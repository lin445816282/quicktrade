/**
 * 统计看板 — Phase 2 — API 24 适配
 */
import { DatabaseService } from '../service/DatabaseService'
import { TransactionType } from '../model/Transaction'
import { NumberUtils } from '../common/utils/NumberUtils'
import router from '@ohos.router'

interface MonthRange { start: string; end: string }
interface PadRect { top: number; right: number; bottom: number; left: number }
interface CatStat { category: string; total: number; type: string }

interface PieSlice {
  label: string
  value: number
  color: string
}

interface DayPoint {
  date: string
  income: number
  expense: number
}

const PIE_COLORS: string[] = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
                     '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9']
const CATEGORY_ICONS: Record<string, string> = {
  '餐饮': '🍜', '交通': '🚗', '购物': '🛍️', '日用品': '🧴',
  '娱乐': '🎮', '通讯': '📱', '居住': '🏠', '医疗': '💊',
  '教育': '📚', '工资': '💵', '投资': '📈', '兼职': '💼',
  '退款': '↩️', '其他': '📌'
}

@Entry
@Component
struct StatsPage {
  @State monthIncome: number = 0
  @State monthExpense: number = 0
  @State year: number = new Date().getFullYear()
  @State month: number = new Date().getMonth() + 1
  @State pieSlices: PieSlice[] = []
  @State dayPoints: DayPoint[] = []
  @State loading: boolean = true
  @State selectedTab: number = 0

  private pieSettings: RenderingContextSettings = new RenderingContextSettings(true)
  private pieCtx: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.pieSettings)
  private barSettings: RenderingContextSettings = new RenderingContextSettings(true)
  private barCtx: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.barSettings)

  aboutToAppear() {
    this.loadData()
  }

  getMonthRange(): MonthRange {
    const m = String(this.month).padStart(2, '0')
    const s = `${this.year}-${m}-01T00:00:00.000Z`
    let ey = this.year, em = this.month + 1
    if (em > 12) { em = 1; ey++ }
    const sem = String(em).padStart(2, '0')
    const e = `${ey}-${sem}-01T00:00:00.000Z`
    const result: MonthRange = { start: s, end: e }
    return result
  }

  get monthLabel(): string {
    return `${this.year}年${this.month}月`
  }

  get netAmount(): string {
    return NumberUtils.formatMoney(this.monthIncome - this.monthExpense)
  }

  async loadData() {
    this.loading = true
    try {
      const range = this.getMonthRange()
      const s = range.start
      const e = range.end
      const summary = await DatabaseService.getMonthlySummary(this.year, this.month)
      this.monthIncome = summary.income
      this.monthExpense = summary.expense

      const catStats = await DatabaseService.getCategoryStats(s, e)
      this.pieSlices = this.buildPieData(catStats)

      const daily = await DatabaseService.getDailyTotals(s, e)
      this.dayPoints = daily
    } catch (err) {
      console.error('StatsPage loadData failed:', JSON.stringify(err))
    }
    this.loading = false
  }

  buildPieData(stats: CatStat[]): PieSlice[] {
    const filterType = this.selectedTab === 0 ? TransactionType.EXPENSE : TransactionType.INCOME
    const filtered = stats.filter((s: CatStat) => s.type === filterType)
    if (filtered.length === 0) return []

    const top = filtered.slice(0, 9)
    let otherTotal = 0
    for (let i = 9; i < filtered.length; i++) {
      otherTotal += filtered[i].total
    }
    const result: PieSlice[] = []
    for (let i = 0; i < top.length; i++) {
      const slice: PieSlice = { label: top[i].category, value: top[i].total, color: PIE_COLORS[i] }
      result.push(slice)
    }
    if (otherTotal > 0) {
      const other: PieSlice = { label: '其他', value: otherTotal, color: '#CCCCCC' }
      result.push(other)
    }
    return result
  }

  drawPieChart() {
    const ctx = this.pieCtx
    const w = 240, h = 240
    const cx = w / 2, cy = h / 2
    const r = 90

    ctx.clearRect(0, 0, w, h)
    if (this.pieSlices.length === 0) {
      ctx.font = '14px sans-serif'
      ctx.fillStyle = '#ccc'
      ctx.textAlign = 'center'
      ctx.fillText('暂无数据', cx, cy)
      return
    }

    let total = 0
    for (const slice of this.pieSlices) total += slice.value
    if (total === 0) return

    let startAngle = -Math.PI / 2
    for (const slice of this.pieSlices) {
      const angle = (slice.value / total) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, startAngle, startAngle + angle)
      ctx.closePath()
      ctx.fillStyle = slice.color
      ctx.fill()

      const midAngle = startAngle + angle / 2
      const lx = cx + Math.cos(midAngle) * (r + 16)
      const ly = cy + Math.sin(midAngle) * (r + 16)
      ctx.font = '10px sans-serif'
      ctx.fillStyle = '#666'
      ctx.textAlign = lx > cx ? 'left' : 'right'
      ctx.fillText(`${slice.label}`, lx, ly + 4)

      startAngle += angle
    }
  }

  drawBarChart() {
    const ctx = this.barCtx
    const w = 340, h = 180
    const pad: PadRect = { top: 16, right: 12, bottom: 28, left: 12 }
    const cw = w - pad.left - pad.right
    const ch = h - pad.top - pad.bottom

    ctx.clearRect(0, 0, w, h)

    if (this.dayPoints.length === 0) {
      ctx.font = '14px sans-serif'
      ctx.fillStyle = '#ccc'
      ctx.textAlign = 'center'
      ctx.fillText('暂无数据', w / 2, h / 2)
      return
    }

    let maxVal = 0
    for (const d of this.dayPoints) {
      maxVal = Math.max(maxVal, Math.max(d.income, d.expense))
    }
    if (maxVal === 0) maxVal = 100
    maxVal = Math.ceil(maxVal * 1.2)

    const barCount = this.dayPoints.length
    const barGap = 4
    const groupW = cw / barCount
    const barW = Math.max(4, (groupW - barGap * 2) / 2)

    ctx.strokeStyle = '#f0f0f0'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (ch / 4) * i
      ctx.beginPath()
      ctx.moveTo(pad.left, y)
      ctx.lineTo(w - pad.right, y)
      ctx.stroke()
    }

    for (let i = 0; i < barCount; i++) {
      const d = this.dayPoints[i]
      const x = pad.left + groupW * i

      if (d.income > 0) {
        const ih = Math.max(2, (d.income / maxVal) * ch)
        const iy = pad.top + ch - ih
        ctx.fillStyle = '#27ae6050'
        ctx.fillRect(x + barGap, iy, barW, ih)
        ctx.fillStyle = '#27ae60'
        ctx.fillRect(x + barGap, iy, barW, 2)
      }

      if (d.expense > 0) {
        const eh = Math.max(2, (d.expense / maxVal) * ch)
        const ey = pad.top + ch - eh
        ctx.fillStyle = '#e74c3c50'
        ctx.fillRect(x + barGap + barW, ey, barW, eh)
        ctx.fillStyle = '#e74c3c'
        ctx.fillRect(x + barGap + barW, ey, barW, 2)
      }

      const iCx = x + groupW / 2
      const iCy = pad.top + ch - (d.income / maxVal) * ch
      if (i > 0 && (d.income > 0 || this.dayPoints[i-1].income > 0)) {
        const pi = this.dayPoints[i-1]
        const pICy = pad.top + ch - (pi.income / maxVal) * ch
        ctx.strokeStyle = '#27ae60'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x - groupW / 2, pICy)
        ctx.lineTo(iCx, iCy)
        ctx.stroke()
        ctx.fillStyle = '#27ae60'
        ctx.beginPath()
        ctx.arc(iCx, iCy, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      const eCy = pad.top + ch - (d.expense / maxVal) * ch
      if (i > 0 && (d.expense > 0 || this.dayPoints[i-1].expense > 0)) {
        const pi = this.dayPoints[i-1]
        const pECy = pad.top + ch - (pi.expense / maxVal) * ch
        ctx.strokeStyle = '#e74c3c'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x - groupW / 2, pECy)
        ctx.lineTo(iCx, eCy)
        ctx.stroke()
        ctx.fillStyle = '#e74c3c'
        ctx.beginPath()
        ctx.arc(iCx, eCy, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const labelInterval = Math.max(1, Math.floor(barCount / 6))
    ctx.font = '9px sans-serif'
    ctx.fillStyle = '#999'
    ctx.textAlign = 'center'
    for (let i = 0; i < barCount; i += labelInterval) {
      const d = this.dayPoints[i]
      const label = d.date.slice(5)
      ctx.fillText(label, pad.left + groupW * i + groupW / 2, h - 6)
    }

    ctx.font = '11px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#27ae60'
    ctx.fillRect(pad.left + 4, 0, 12, 10)
    ctx.fillStyle = '#333'
    ctx.fillText('收入', pad.left + 20, 10)
    ctx.fillStyle = '#e74c3c'
    ctx.fillRect(pad.left + 64, 0, 12, 10)
    ctx.fillStyle = '#333'
    ctx.fillText('支出', pad.left + 80, 10)
  }

  prevMonth() {
    if (this.month === 1) { this.year--; this.month = 12 }
    else { this.month-- }
    this.loadData()
  }

  nextMonth() {
    if (this.month === 12) { this.year++; this.month = 1 }
    else { this.month++ }
    this.loadData()
  }

  switchTab(idx: number) {
    if (this.selectedTab === idx) return
    this.selectedTab = idx
    this.loadData()
  }

  build() {
    Column() {
      Row() {
        Text('←').fontSize(18).fontColor('#999').onClick(() => router.back())
        Blank()
        Text('📊 统计').fontSize(18).fontWeight(FontWeight.Medium)
        Blank()
        Text('  ').fontSize(18)
      }
      .width('100%').height(48).padding({ left: 16, right: 16 }).backgroundColor('#fff')

      Row() {
        Text('◀').fontSize(16).fontColor('#666').onClick(() => this.prevMonth()).padding(8)
        Text(this.monthLabel).fontSize(18).fontWeight(FontWeight.Medium).layoutWeight(1).textAlign(TextAlign.Center)
        Text('▶').fontSize(16).fontColor('#666').onClick(() => this.nextMonth()).padding(8)
      }
      .width('100%').height(44).backgroundColor('#fff').border({ width: { bottom: 0.5 }, color: '#f0f0f0' })

      Scroll() {
        Column() {
          Row() {
            Column() { Text('支出').fontSize(12).fontColor('#999')
              Text(NumberUtils.formatMoney(this.monthExpense)).fontSize(22).fontWeight(FontWeight.Bold).fontColor('#e74c3c')
            }
            Column() { Text('收入').fontSize(12).fontColor('#999')
              Text(NumberUtils.formatMoney(this.monthIncome)).fontSize(22).fontWeight(FontWeight.Bold).fontColor('#27ae60')
            }
            Column() { Text('净额').fontSize(12).fontColor('#999')
              Text(this.netAmount).fontSize(22).fontWeight(FontWeight.Bold).fontColor('#333')
            }
          }
          .width('100%').justifyContent(FlexAlign.SpaceAround).padding({ top: 16, bottom: 16 })
          .backgroundColor('#fff').borderRadius(12).margin({ left: 16, right: 16, top: 12 })

          Column() {
            Row() {
              Text(this.selectedTab === 0 ? '💸 支出构成' : '💰 收入构成').fontSize(16).fontWeight(FontWeight.Medium)
              Blank()
              Row() {
                Text('支出').fontSize(13).fontColor(this.selectedTab === 0 ? '#fff' : '#999')
                  .padding({ left: 12, right: 12, top: 4, bottom: 4 }).borderRadius(12)
                  .backgroundColor(this.selectedTab === 0 ? '#e74c3c' : '#f0f0f0').onClick(() => this.switchTab(0))
                Text('收入').fontSize(13).fontColor(this.selectedTab === 1 ? '#fff' : '#999')
                  .padding({ left: 12, right: 12, top: 4, bottom: 4 }).borderRadius(12)
                  .backgroundColor(this.selectedTab === 1 ? '#27ae60' : '#f0f0f0').onClick(() => this.switchTab(1))
              }
            }
            .width('100%').padding({ left: 16, right: 16, top: 12 })

            if (this.pieSlices.length > 0) {
              Canvas(this.pieCtx).width(240).height(240).onReady(() => this.drawPieChart()).margin({ top: 8, bottom: 8 })
              Column() {
                ForEach(this.pieSlices, (slice: PieSlice) => {
                  Row() {
                    Row().width(10).height(10).borderRadius(5).backgroundColor(slice.color).margin({ right: 8 })
                    Text(CATEGORY_ICONS[slice.label] || '📌').fontSize(14)
                    Text(slice.label).fontSize(12).fontColor('#333').margin({ left: 4 })
                    Blank()
                    Text(NumberUtils.formatMoney(slice.value)).fontSize(13).fontWeight(FontWeight.Medium)
                  }
                  .width('100%').padding({ left: 16, right: 16, top: 6, bottom: 6 })
                })
              }
            } else {
              Text('本月暂无记录').fontSize(14).fontColor('#ccc').margin({ top: 24, bottom: 24 })
            }
          }
          .width('100%').backgroundColor('#fff').borderRadius(12).margin({ left: 16, right: 16, top: 12 })

          Column() {
            Text('📈 每日趋势').fontSize(16).fontWeight(FontWeight.Medium).width('100%').padding({ left: 16, top: 12 })
            Canvas(this.barCtx).width('100%').height(180).onReady(() => this.drawBarChart())
              .margin({ left: 4, right: 4, top: 8, bottom: 12 })
          }
          .width('100%').backgroundColor('#fff').borderRadius(12).margin({ left: 16, right: 16, top: 12, bottom: 24 })
        }
        .width('100%')
      }
      .layoutWeight(1).scrollBar(BarState.Off)
    }
    .width('100%').height('100%').backgroundColor('#f5f5f5')
  }
}
