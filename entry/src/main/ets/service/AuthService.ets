/**
 * 认证服务 — 注册/登录/登出 + SHA256 密码哈希
 * API 24 适配
 */
import cryptoFramework from '@ohos.security.cryptoFramework'
import relationalStore from '@ohos.data.relationalStore'
import { User } from '../model/User'
import { getStore } from './DatabaseService'

let currentUser: User | null = null

function makeVB(kv: Record<string, string | number>): relationalStore.ValuesBucket {
  const vb: relationalStore.ValuesBucket = {}
  const keys = Object.keys(kv)
  for (let i = 0; i < keys.length; i++) {
    vb[keys[i]] = kv[keys[i]]
  }
  return vb
}

export class AuthService {
  static getCurrentUserId(): number {
    return currentUser ? currentUser.id : 0
  }

  static getCurrentUsername(): string {
    return currentUser ? currentUser.username : ''
  }

  static isLoggedIn(): boolean {
    return currentUser !== null
  }

  /** 注册 */
  static async register(username: string, password: string): Promise<User> {
    const store = await getStore()
    const existing = await store.querySql('SELECT id FROM users WHERE username = ?', [username])
    if (existing.goToFirstRow()) {
      existing.close()
      throw new Error('用户名已存在')
    }
    existing.close()

    const hash = await AuthService.hashPassword(password)
    const now = new Date().toISOString()
    const id = await store.insert('users', makeVB({ 'username': username, 'password_hash': hash, 'created_at': now }))
    await AuthService.createDefaultCategories(store, id)

    const user = User.create(id, username, hash, now)
    currentUser = user
    return user
  }

  /** 登录 */
  static async login(username: string, password: string): Promise<User> {
    const store = await getStore()
    const resultSet = await store.querySql(
      'SELECT id, username, password_hash, created_at FROM users WHERE username = ?', [username]
    )
    if (!resultSet.goToFirstRow()) {
      resultSet.close()
      throw new Error('用户名或密码错误')
    }
    const id = resultSet.getLong(resultSet.getColumnIndex('id'))
    const storedHash = resultSet.getString(resultSet.getColumnIndex('password_hash'))
    const createdAt = resultSet.getString(resultSet.getColumnIndex('created_at'))
    resultSet.close()

    const hash = await AuthService.hashPassword(password)
    if (hash !== storedHash) {
      throw new Error('用户名或密码错误')
    }
    const user = User.create(id, username, storedHash, createdAt)
    currentUser = user
    return user
  }

  static logout(): void {
    currentUser = null
  }

  private static async createDefaultCategories(store: relationalStore.RdbStore, userId: number): Promise<void> {
    const expenseCats: [string, string, number][] = [
      ['餐饮', '🍜', 1], ['交通', '🚗', 2], ['购物', '🛍️', 3],
      ['日用品', '🧴', 4], ['娱乐', '🎮', 5], ['通讯', '📱', 6],
      ['居住', '🏠', 7], ['医疗', '💊', 8], ['教育', '📚', 9], ['其他', '📌', 99]
    ]
    const incomeCats: [string, string, number][] = [
      ['工资', '💵', 1], ['投资', '📈', 2], ['兼职', '💼', 3],
      ['退款', '↩️', 4], ['其他', '📌', 99]
    ]
    for (let i = 0; i < expenseCats.length; i++) {
      const c = expenseCats[i]
      await store.insert('categories', makeVB({ 'name': c[0], 'icon': c[1], 'type': 'expense', 'sort_order': c[2], 'user_id': userId }))
    }
    for (let i = 0; i < incomeCats.length; i++) {
      const c = incomeCats[i]
      await store.insert('categories', makeVB({ 'name': c[0], 'icon': c[1], 'type': 'income', 'sort_order': c[2], 'user_id': userId }))
    }
  }

  static async hashPassword(password: string): Promise<string> {
    const md = cryptoFramework.createMd('SHA256')
    const arr: number[] = []
    for (let i = 0; i < password.length; i++) arr.push(password.charCodeAt(i) & 0xff)
    await md.update({ data: new Uint8Array(arr) })
    const result = await md.digest()
    let hex = ''
    for (let i = 0; i < result.data.length; i++) hex += result.data[i].toString(16).padStart(2, '0')
    return hex
  }
}
