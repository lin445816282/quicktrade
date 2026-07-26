/**
 * 用户模型 — 登录系统
 */
export class User {
  id: number = 0
  username: string = ''
  password_hash: string = ''
  created_at: string = ''

  static create(id: number, username: string, hash: string, createdAt: string): User {
    const u = new User()
    u.id = id
    u.username = username
    u.password_hash = hash
    u.created_at = createdAt
    return u
  }
}
