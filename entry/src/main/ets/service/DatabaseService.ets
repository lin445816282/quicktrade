/**
 * 数据库服务 — RelationalStore CRUD + 多用户隔离
 * API 24 适配版
 */
import relationalStore from '@ohos.data.relationalStore'
import { Transaction, TransactionType } from '../model/Transaction'
import { Category } from '../model/Category'
import { AuthService } from './AuthService'

interface MonthlySummary { income: number; expense: number }
interface CategoryStat { category: string; total: number; type: string }
interface DailyTotal { date: string; income: number; expense: number }
interface MonthInfo { year: number; month: number }

const STORE_CONFIG: relationalStore.StoreConfig = {
  name: 'QuickTrade.db',
  securityLevel: relationalStore.SecurityLevel.S1
}

const SQL_CREATE_USERS = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`

const SQL_CREATE_TRANSACTIONS = `
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT DEFAULT '其他',
    note TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    user_id INTEGER NOT NULL DEFAULT 0
  )
`

const SQL_CREATE_CATEGORIES = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT DEFAULT '💰',
    type TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL DEFAULT 0
  )
`

let storeInstance: relationalStore.RdbStore | null = null
let appCtx: Context | null = null

export function initDB(context: Context): void {
  appCtx = context
}

export async function getStore(): Promise<relationalStore.RdbStore> {
  if (storeInstance) return storeInstance
  storeInstance = await relationalStore.getRdbStore(appCtx!, STORE_CONFIG)
  if (storeInstance) {
    await storeInstance.executeSql(SQL_CREATE_USERS)
    await storeInstance.executeSql(SQL_CREATE_TRANSACTIONS)
    await storeInstance.executeSql(SQL_CREATE_CATEGORIES)
  }
  return storeInstance!
}

function buildCategory(id: number, name: string, icon: string, type: string, sortOrder: number): Category {
  const c = new Category()
  c.id = id; c.name = name; c.icon = icon; c.type = type as TransactionType; c.sort_order = sortOrder
  return c
}

function buildTransaction(id: number, txType: string, amount: number, category: string, note: string, createdAt: string): Transaction {
  const t = new Transaction()
  t.id = id; t.type = txType as TransactionType; t.amount = amount; t.category = category; t.note = note; t.created_at = createdAt
  return t
}

export class DatabaseService {
  /** ---------- 交易 CRUD ---------- */

  static async insert(tx: Transaction): Promise<number> {
    const store = await getStore()
    const vb: relationalStore.ValuesBucket = {}
    vb['type'] = tx.type; vb['amount'] = tx.amount; vb['category'] = tx.category
    vb['note'] = tx.note; vb['created_at'] = tx.created_at || new Date().toISOString()
    vb['user_id'] = AuthService.getCurrentUserId()
    return await store.insert('transactions', vb)
  }

  static async delete(id: number): Promise<number> {
    const store = await getStore()
    const uid = AuthService.getCurrentUserId()
    await store.executeSql('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, uid])
    return 1
  }

  static async update(tx: Transaction): Promise<number> {
    const store = await getStore()
    const uid = AuthService.getCurrentUserId()
    const vb: relationalStore.ValuesBucket = {}
    vb['type'] = tx.type; vb['amount'] = tx.amount; vb['category'] = tx.category; vb['note'] = tx.note
    const predicates = new relationalStore.RdbPredicates('transactions')
    predicates.equalTo('id', tx.id)
    predicates.equalTo('user_id', uid)
    return await store.update(vb, predicates)
  }

  static async getAll(total: number = 500): Promise<Transaction[]> {
    const store = await getStore()
    const uid = AuthService.getCurrentUserId()
    const resultSet = await store.querySql(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [uid, total]
    )
    return DatabaseService.resultToTransactions(resultSet)
  }

  static async getByDateRange(start: string, end: string): Promise<Transaction[]> {
    const store = await getStore()
    const uid = AuthService.getCurrentUserId()
    const resultSet = await store.querySql(
      'SELECT * FROM transactions WHERE user_id = ? AND created_at >= ? AND created_at < ? ORDER BY created_at DESC',
      [uid, start, end]
    )
    return DatabaseService.resultToTransactions(resultSet)
  }

  static async getTodaySummary(): Promise<MonthlySummary> {
    const today = new Date().toISOString().split('T')[0]
    const start = `${today}T00:00:00.000Z`
    const end = `${today}T23:59:59.999Z`
    const store = await getStore()
    const uid = AuthService.getCurrentUserId()
    const resultSet = await store.querySql(
      'SELECT type, SUM(amount) as total FROM transactions WHERE user_id = ? AND created_at >= ? AND created_at <= ? GROUP BY type',
      [uid, start, end]
    )
    let income = 0, expense = 0
    while (resultSet.goToNextRow()) {
      const t = resultSet.getString(resultSet.getColumnIndex('type'))
      const total = resultSet.getDouble(resultSet.getColumnIndex('total'))
      if (t === TransactionType.INCOME) income = total
      else expense = total
    }
    resultSet.close()
    const result: MonthlySummary = { income: income, expense: expense }
    return result
  }

  /** ---------- 统计查询 ---------- */

  static async getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
    const store = await getStore()
    const uid = AuthService.getCurrentUserId()
    const sm = String(month).padStart(2, '0')
    const nm = month === 12 ? 1 : month + 1
    const ny = month === 12 ? year + 1 : year
    const snm = String(nm).padStart(2, '0')
    const start = `${year}-${sm}-01T00:00:00.000Z`
    const end = `${ny}-${snm}-01T00:00:00.000Z`
    const resultSet = await store.querySql(
      'SELECT type, SUM(amount) as total FROM transactions WHERE user_id = ? AND created_at >= ? AND created_at < ? GROUP BY type',
      [uid, start, end]
    )
    let income = 0, expense = 0
    while (resultSet.goToNextRow()) {
      const t = resultSet.getString(resultSet.getColumnIndex('type'))
      const total = resultSet.getDouble(resultSet.getColumnIndex('total'))
      if (t === TransactionType.INCOME) income = total
      else expense = total
    }
    resultSet.close()
    const result: MonthlySummary = { income: income, expense: expense }
    return result
  }

  static async getCategoryStats(start: string, end: string): Promise<CategoryStat[]> {
    const store = await getStore()
    const uid = AuthService.getCurrentUserId()
    const resultSet = await store.querySql(
      'SELECT category, type, SUM(amount) as total FROM transactions WHERE user_id = ? AND created_at >= ? AND created_at < ? GROUP BY category, type ORDER BY total DESC',
      [uid, start, end]
    )
    const list: CategoryStat[] = []
    while (resultSet.goToNextRow()) {
      const item: CategoryStat = {
        category: resultSet.getString(resultSet.getColumnIndex('category')),
        total: resultSet.getDouble(resultSet.getColumnIndex('total')),
        type: resultSet.getString(resultSet.getColumnIndex('type'))
      }
      list.push(item)
    }
    resultSet.close()
    return list
  }

  static async getDailyTotals(start: string, end: string): Promise<DailyTotal[]> {
    const store = await getStore()
    const uid = AuthService.getCurrentUserId()
    const resultSet = await store.querySql(
      'SELECT date(created_at) as date, type, SUM(amount) as total FROM transactions WHERE user_id = ? AND created_at >= ? AND created_at < ? GROUP BY date(created_at), type ORDER BY date',
      [uid, start, end]
    )
    const map = new Map<string, DailyTotal>()
    while (resultSet.goToNextRow()) {
      const date = resultSet.getString(resultSet.getColumnIndex('date'))
      const t = resultSet.getString(resultSet.getColumnIndex('type'))
      const total = resultSet.getDouble(resultSet.getColumnIndex('total'))
      if (!map.has(date)) {
        const dt: DailyTotal = { date: date, income: 0, expense: 0 }
        map.set(date, dt)
      }
      const entry = map.get(date)!
      if (t === TransactionType.INCOME) entry.income = total
      else entry.expense = total
    }
    resultSet.close()
    const list: DailyTotal[] = []
    map.forEach((v: DailyTotal, k: string) => {
      const item: DailyTotal = { date: k, income: v.income, expense: v.expense }
      list.push(item)
    })
    return list
  }

  static async getAvailableMonths(): Promise<MonthInfo[]> {
    const store = await getStore()
    const uid = AuthService.getCurrentUserId()
    const resultSet = await store.querySql(
      "SELECT DISTINCT strftime('%Y', created_at) as year, strftime('%m', created_at) as month FROM transactions WHERE user_id = ? ORDER BY year DESC, month DESC",
      [uid]
    )
    const months: MonthInfo[] = []
    while (resultSet.goToNextRow()) {
      const mi: MonthInfo = {
        year: parseInt(resultSet.getString(resultSet.getColumnIndex('year'))),
        month: parseInt(resultSet.getString(resultSet.getColumnIndex('month')))
      }
      months.push(mi)
    }
    resultSet.close()
    if (months.length === 0) {
      const now = new Date()
      const def: MonthInfo = { year: now.getFullYear(), month: now.getMonth() + 1 }
      months.push(def)
    }
    return months
  }

  /** ---------- 品类查询 ---------- */

  static async getCategories(type?: TransactionType): Promise<Category[]> {
    const store = await getStore()
    const uid = AuthService.getCurrentUserId()
    let sql = 'SELECT * FROM categories WHERE user_id = ?'
    const params: (string | number)[] = [uid]
    if (type) {
      sql += ' AND type = ?'
      params.push(type)
    }
    sql += ' ORDER BY sort_order ASC'
    const resultSet = await store.querySql(sql, params)
    const list: Category[] = []
    while (resultSet.goToNextRow()) {
      list.push(buildCategory(
        resultSet.getLong(resultSet.getColumnIndex('id')),
        resultSet.getString(resultSet.getColumnIndex('name')),
        resultSet.getString(resultSet.getColumnIndex('icon')),
        resultSet.getString(resultSet.getColumnIndex('type')),
        resultSet.getLong(resultSet.getColumnIndex('sort_order'))
      ))
    }
    resultSet.close()
    return list
  }

  static async addCategory(name: string, icon: string, type: TransactionType, sortOrder: number = 100): Promise<number> {
    const store = await getStore()
    const uid = AuthService.getCurrentUserId()
    const vb: relationalStore.ValuesBucket = {}
    vb['name'] = name; vb['icon'] = icon; vb['type'] = type; vb['sort_order'] = sortOrder; vb['user_id'] = uid
    return await store.insert('categories', vb)
  }

  static async deleteCategory(id: number): Promise<number> {
    const store = await getStore()
    const uid = AuthService.getCurrentUserId()
    await store.executeSql('DELETE FROM categories WHERE id = ? AND user_id = ? AND sort_order >= 100', [id, uid])
    return 1
  }

  static async updateCategory(id: number, name: string, icon: string): Promise<number> {
    const store = await getStore()
    const uid = AuthService.getCurrentUserId()
    const vb: relationalStore.ValuesBucket = {}
    vb['name'] = name; vb['icon'] = icon
    const predicates = new relationalStore.RdbPredicates('categories')
    predicates.equalTo('id', id)
    predicates.equalTo('user_id', uid)
    return await store.update(vb, predicates)
  }

  /** ---------- 辅助 ---------- */

  private static resultToTransactions(resultSet: relationalStore.ResultSet): Transaction[] {
    const list: Transaction[] = []
    while (resultSet.goToNextRow()) {
      list.push(buildTransaction(
        resultSet.getLong(resultSet.getColumnIndex('id')),
        resultSet.getString(resultSet.getColumnIndex('type')),
        resultSet.getDouble(resultSet.getColumnIndex('amount')),
        resultSet.getString(resultSet.getColumnIndex('category')),
        resultSet.getString(resultSet.getColumnIndex('note')),
        resultSet.getString(resultSet.getColumnIndex('created_at'))
      ))
    }
    resultSet.close()
    return list
  }
}
