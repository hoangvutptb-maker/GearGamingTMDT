import { randomUUID, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { loadDb, saveDb } from '../database.js'
import { getTrimmedString, validateEmail, validatePhone, validatePassword, validateFullname } from '../utils/validators.js'

const scryptAsync = promisify(scrypt)
const passwordHashPrefix = 'scrypt'
const passwordKeyLength = 64
const isScryptHash = (value) => typeof value === 'string' && value.startsWith(`${passwordHashPrefix}$`)

async function hashPassword(password) {
  const salt = randomBytes(16).toString('base64url')
  const hash = await scryptAsync(password, salt, passwordKeyLength)
  return `${passwordHashPrefix}$${salt}$${Buffer.from(hash).toString('base64url')}`
}

async function verifyPassword(password, storedPassword) {
  if (typeof password !== 'string' || typeof storedPassword !== 'string') return false
  if (!isScryptHash(storedPassword)) {
    const expected = Buffer.from(storedPassword)
    const actual = Buffer.from(password)
    return expected.length === actual.length && timingSafeEqual(expected, actual)
  }
  const [, salt, encodedHash] = storedPassword.split('$')
  if (!salt || !encodedHash) return false
  try {
    const expected = Buffer.from(encodedHash, 'base64url')
    if (expected.length !== passwordKeyLength) return false
    const actual = Buffer.from(await scryptAsync(password, salt, passwordKeyLength))
    return timingSafeEqual(expected, actual)
  } catch {
    return false
  }
}

const safeUser = (user) => ({ id: user.id, fullname: user.fullname, phone: user.phone, email: user.email, role: user.role })

export async function register(body) {
  const data = await loadDb()
  const fullname = getTrimmedString(body.fullname).replace(/\s+/g, ' ')
  const phone = getTrimmedString(body.phone)
  const email = getTrimmedString(body.email).toLowerCase()
  const password = getTrimmedString(body.password)
  if (!email || !password || !fullname || !phone) return { status: 400, payload: { message: 'Vui lòng điền đầy đủ thông tin.' } }
  if (!validateEmail(email)) return { status: 400, payload: { message: 'Email không đúng định dạng.' } }
  if (!validatePassword(password)) return { status: 400, payload: { message: 'Mật khẩu cần ít nhất 6 ký tự.' } }
  if (!validatePhone(phone)) return { status: 400, payload: { message: 'Số điện thoại không hợp lệ.' } }
  if (!validateFullname(fullname)) return { status: 400, payload: { message: 'Họ và tên không hợp lệ.' } }
  if (data.users.some((user) => typeof user.email === 'string' && user.email.toLowerCase() === email)) return { status: 409, payload: { message: 'Email này đã được đăng ký.' } }
  const user = { id: randomUUID(), fullname, phone, email, password: await hashPassword(password), role: 'customer' }
  const token = randomUUID()
  data.users.push(user)
  data.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() })
  await saveDb(data)
  return { status: 201, payload: { user: safeUser(user), token } }
}

export async function login(body) {
  const email = getTrimmedString(body.email).toLowerCase()
  const password = getTrimmedString(body.password)
  if (!email || !password) return { status: 400, payload: { message: 'Vui lòng nhập email và mật khẩu.' } }
  if (!validateEmail(email)) return { status: 400, payload: { message: 'Email không đúng định dạng.' } }
  if (!validatePassword(password)) return { status: 400, payload: { message: 'Mật khẩu cần ít nhất 6 ký tự.' } }
  const data = await loadDb()
  const user = data.users.find((entry) => typeof entry.email === 'string' && entry.email.toLowerCase() === email)
  if (!user || !(await verifyPassword(password, user.password))) return { status: 401, payload: { message: 'Email hoặc mật khẩu không đúng.' } }
  if (user.status === 'locked') return { status: 403, payload: { message: 'Tài khoản đã bị khóa.' } }
  const token = randomUUID()
  if (!isScryptHash(user.password)) user.password = await hashPassword(password)
  data.sessions = data.sessions.filter((session) => session.userId !== user.id)
  data.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() })
  await saveDb(data)
  return { status: 200, payload: { user: safeUser(user), token } }
}

export async function logout(token) {
  const data = await loadDb()
  data.sessions = data.sessions.filter((session) => session.token !== token)
  await saveDb(data)
  return { ok: true }
}

export { hashPassword }
