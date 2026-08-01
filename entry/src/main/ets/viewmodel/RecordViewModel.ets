/**
 * 手动记账页 ViewModel — API 11 兼容版
 */
import { Transaction, TransactionType } from '../model/Transaction'
import { localISO } from '../common/utils/DateUtils'

export class RecordViewModel {
  type: TransactionType = TransactionType.EXPENSE
  amount: string = '0'
  category: string = '餐饮'
  note: string = ''
  date: string = localISO()

  inputDigit(digit: string): void {
    if (this.amount === '0' && digit !== '.') {
      this.amount = digit
    } else if (digit === '.' && this.amount.includes('.')) {
      return
    } else if (this.amount.includes('.') && this.amount.split('.')[1].length >= 2) {
      return
    } else {
      this.amount += digit
    }
  }

  deleteDigit(): void {
    if (this.amount.length <= 1) {
      this.amount = '0'
    } else {
      this.amount = this.amount.slice(0, -1)
    }
  }

  toggleType() {
    this.type = this.type === TransactionType.EXPENSE
      ? TransactionType.INCOME
      : TransactionType.EXPENSE
  }

  buildTransaction(): Transaction {
    const t = new Transaction()
    t.type = this.type
    t.amount = parseFloat(this.amount) || 0
    t.category = this.category
    t.note = this.note
    t.created_at = this.date
    return t
  }

  reset() {
    this.amount = '0'
    this.category = '餐饮'
    this.note = ''
    this.date = localISO()
  }

  get amountValue(): number {
    return parseFloat(this.amount) || 0
  }

  get canSave(): boolean {
    return this.amountValue > 0 && this.category.length > 0
  }
}
