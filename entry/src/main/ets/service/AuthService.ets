/**
 * 认证服务 — 注册/登录/登出 + 密码哈希 + 华为帐号一键登录 + 持久化
 * API 24 适配
 */
import relationalStore from '@ohos.data.relationalStore'
import { User } from '../model/User'
import { getStore } from './DatabaseService'
import { hilog } from '@kit.PerformanceAnalysisKit'
import { preferences } from '@kit.ArkData'
import appAccount from '@ohos.account.appAccount'
import { common } from '@kit.AbilityKit'
import { localISO } from '../common/utils/DateUtils'

let currentUser: User | null = null
let appContext: common.Context | null = null
const PREFS_NAME = 'quicktrade_settings'

// 华为帐号一键登录相关常量
const HUAWEI_ACCOUNT_TYPE = 'com.huawei.hwid'
const HUAWEI_OAUTH_SCOPE = 'https://www.huawei.com/auth/account/base'

interface AppAccountInfo {
  name: string
  owner: string
}

export class AuthService {

  /** 初始化时设 context，用于 preferences */
  static init(ctx: common.Context): void {
    appContext = ctx
  }

  static getCurrentUserId(): number {
    return currentUser ? currentUser.id : 0
  }

  static getCurrentUsername(): string {
    return currentUser ? currentUser.username : ''
  }

  static isLoggedIn(): boolean {
    return currentUser !== null
  }

  /** 启动时恢复登录态 */
  static async restoreLogin(): Promise<boolean> {
    if (!appContext) return false
    try {
      const prefs = await preferences.getPreferences(appContext, PREFS_NAME)
      const userId: number = await prefs.get('login_user_id', 0) as number
      const username: string = await prefs.get('login_username', '') as string
      const passwordHash: string = await prefs.get('login_password_hash', '') as string
      const huaweiUid: string = await prefs.get('login_huawei_uid', '') as string
      const createdAt: string = await prefs.get('login_created_at', '') as string

      if (userId > 0 && username) {
        currentUser = User.create(userId, username, passwordHash, createdAt, huaweiUid)
        hilog.info(0x0000, 'AuthService', `restoreLogin: user=${username} id=${userId}`)
        return true
      }
    } catch (e) {
      hilog.warn(0x0000, 'AuthService', `restoreLogin failed: ${JSON.stringify(e)}`)
    }
    return false
  }

  /** 持久化当前用户到 preferences */
  private static async persistUser(user: User): Promise<void> {
    if (!appContext) return
    try {
      const prefs = await preferences.getPreferences(appContext, PREFS_NAME)
      await prefs.put('login_user_id', user.id)
      await prefs.put('login_username', user.username)
      await prefs.put('login_password_hash', user.password_hash)
      await prefs.put('login_huawei_uid', user.huawei_uid || '')
      await prefs.put('login_created_at', user.created_at)
      await prefs.flush()
      hilog.info(0x0000, 'AuthService', `persistUser: ${user.username}`)
    } catch (e) {
      hilog.warn(0x0000, 'AuthService', `persistUser failed: ${JSON.stringify(e)}`)
    }
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
    const now = localISO()
    const vb: relationalStore.ValuesBucket = {
      'username': username,
      'password_hash': hash,
      'created_at': now
    }
    hilog.info(0x0000, 'QuickTrade', `register: inserting user ${username}`)
    const id = await store.insert('users', vb)
    hilog.info(0x0000, 'QuickTrade', `register: user inserted, id=${id}`)
    await AuthService.createDefaultCategories(store, id)
    hilog.info(0x0000, 'QuickTrade', `register: categories created for user ${id}`)

    const user = User.create(id, username, hash, now)
    currentUser = user
    await AuthService.persistUser(user)
    return user
  }

  /** 密码登录 */
  static async login(username: string, password: string): Promise<User> {
    const store = await getStore()
    const resultSet = await store.querySql(
      'SELECT id, username, password_hash, huawei_uid, created_at FROM users WHERE username = ?', [username]
    )
    if (!resultSet.goToFirstRow()) {
      resultSet.close()
      throw new Error('用户名或密码错误')
    }
    const id = resultSet.getLong(resultSet.getColumnIndex('id'))
    const storedHash = resultSet.getString(resultSet.getColumnIndex('password_hash'))
    const huaweiUid = resultSet.getString(resultSet.getColumnIndex('huawei_uid'))
    const createdAt = resultSet.getString(resultSet.getColumnIndex('created_at'))
    resultSet.close()

    const hash = await AuthService.hashPassword(password)
    if (hash !== storedHash) {
      throw new Error('用户名或密码错误')
    }
    const user = User.create(id, username, storedHash, createdAt, huaweiUid)
    currentUser = user
    await AuthService.persistUser(user)
    return user
  }

  /** 华为帐号一键登录 */
  static async huaweiLogin(): Promise<User> {
    try {
      const accountMgr: appAccount.AppAccountManager = appAccount.createAppAccountManager()
      let accounts: AppAccountInfo[] = []
      try {
        // getAllAccounts 可能因权限/配置问题失败，捕获后给友好提示
        accounts = await accountMgr.getAllAccounts(HUAWEI_ACCOUNT_TYPE) as AppAccountInfo[]
      } catch (e) {
        hilog.error(0x0000, 'AuthService', `getAllAccounts failed: ${JSON.stringify(e)}`)
        throw new Error('获取华为帐号失败，请使用密码登录')
      }
      if (accounts.length === 0) {
        throw new Error('未找到华为帐号，请先在系统设置中登录华为帐号或使用密码登录')
      }
      const accountName: string = accounts[0].name
      let huaweiUid: string = ''
      try {
        const tokenValue: string = await accountMgr.getOAuthToken(
          accountName, HUAWEI_ACCOUNT_TYPE, HUAWEI_OAUTH_SCOPE
        ) as string
        huaweiUid = tokenValue
      } catch (e) {
        hilog.error(0x0000, 'AuthService', `getOAuthToken failed: ${JSON.stringify(e)}`)
        throw new Error('华为帐号授权失败，请在AGC中配置Account Kit或使用密码登录')
      }
      if (!huaweiUid) {
        throw new Error('获取华为帐号信息失败')
      }
      hilog.info(0x0000, 'AuthService', `Huawei account uid: ${huaweiUid}`)

      const store = await getStore()
      const resultSet = await store.querySql(
        'SELECT id, username, password_hash, huawei_uid, created_at FROM users WHERE huawei_uid = ?', [huaweiUid]
      )
      if (resultSet.goToFirstRow()) {
        const id = resultSet.getLong(resultSet.getColumnIndex('id'))
        const username = resultSet.getString(resultSet.getColumnIndex('username'))
        const storedHash = resultSet.getString(resultSet.getColumnIndex('password_hash'))
        const createdAt = resultSet.getString(resultSet.getColumnIndex('created_at'))
        resultSet.close()
        const user = User.create(id, username, storedHash, createdAt, huaweiUid)
        currentUser = user
        await AuthService.persistUser(user)
        return user
      }
      resultSet.close()

      // 新用户，自动注册
      const displayName: string = accountName.split('@')[0]
      const now = localISO()
      const newId = await store.insert('users', {
        'username': displayName,
        'password_hash': '',
        'huawei_uid': huaweiUid,
        'created_at': now
      } as relationalStore.ValuesBucket)
      await AuthService.createDefaultCategories(store, newId)
      const user = User.create(newId, displayName, '', now, huaweiUid)
      currentUser = user
      await AuthService.persistUser(user)
      return user
    } catch (e) {
      hilog.error(0x0000, 'AuthService', `Huawei login failed: ${JSON.stringify(e)}`)
      const msg = e instanceof Error ? e.message : '华为帐号登录失败'
      throw new Error(msg)
    }
  }

  static async logout(): Promise<void> {
    currentUser = null
    // 清除持久化的登录态
    if (appContext) {
      try {
        const prefs = await preferences.getPreferences(appContext, PREFS_NAME)
        await prefs.delete('login_user_id')
        await prefs.delete('login_username')
        await prefs.delete('login_password_hash')
        await prefs.delete('login_huawei_uid')
        await prefs.delete('login_created_at')
        await prefs.flush()
      } catch (e) {
        hilog.warn(0x0000, 'AuthService', `clear prefs failed: ${JSON.stringify(e)}`)
      }
    }
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
      await store.insert('categories', {
        'name': c[0], 'icon': c[1], 'type': 'expense', 'sort_order': c[2], 'user_id': userId
      } as relationalStore.ValuesBucket)
    }
    for (let i = 0; i < incomeCats.length; i++) {
      const c = incomeCats[i]
      await store.insert('categories', {
        'name': c[0], 'icon': c[1], 'type': 'income', 'sort_order': c[2], 'user_id': userId
      } as relationalStore.ValuesBucket)
    }
  }

  static async hashPassword(password: string): Promise<string> {
    let h1 = 0xdeadbeef
    let h2 = 0x41c6ce57
    for (let i = 0; i < password.length; i++) {
      const ch = password.charCodeAt(i)
      h1 = Math.imul(h1 ^ ch, 2654435761)
      h2 = Math.imul(h2 ^ ch, 1597334677)
    }
    for (let round = 0; round < 1000; round++) {
      h1 = Math.imul(h1 ^ 0x9e3779b9, 2654435761)
      h2 = Math.imul(h2 ^ (h1 >>> 0), 1597334677)
    }
    const hash = ((h1 >>> 0).toString(16).padStart(8, '0') +
                  (h2 >>> 0).toString(16).padStart(8, '0'))
    console.info('QuickTrade hashPassword length:', password.length, 'hash:', hash)
    return hash
  }
}
