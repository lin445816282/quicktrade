/**
 * 用户模型 — 登录系统
 */
export class User {
  id: number = 0
  username: string = ''
  password_hash: string = ''
  huawei_uid: string = ''
  created_at: string = ''

  static create(id: number, username: string, hash: string, createdAt: string, huaweiUid: string = ''): User {
    const u = new User()
    u.id = id
    u.username = username
    u.password_hash = hash
    u.huawei_uid = huaweiUid
    u.created_at = createdAt
    return u
  }
}
