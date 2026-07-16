import { randomUUID } from 'node:crypto'
import { loadDb, saveDb } from '../database.js'
import { hashPassword } from './authService.js'
import { getTrimmedString, validateAccountValues } from '../utils/validators.js'

const toSafeAccount = (user) => ({ id: user.id, fullname: user.fullname, phone: user.phone, email: user.email, role: user.role, status: user.status || 'active' })

function getAccountUpdate(user, body) {
  const account = { email: user.email, fullname: body.fullname === undefined ? user.fullname : getTrimmedString(body.fullname).replace(/\s+/g, ' '), phone: body.phone === undefined ? user.phone : getTrimmedString(body.phone), role: body.role === undefined ? user.role : getTrimmedString(body.role), status: body.status === undefined ? user.status || 'active' : getTrimmedString(body.status), password: user.password }
  return validateAccountValues(account)
}

export async function getAccounts() {
  return (await loadDb()).users.map(toSafeAccount)
}

export async function getAccount(id) {
  const user = (await loadDb()).users.find((entry) => entry.id === id)
  return user ? { status: 200, payload: { account: toSafeAccount(user) } } : { status: 404, payload: { message: 'Không tìm thấy tài khoản.' } }
}

export async function createAccount(body) {
  const accountInput = { email: getTrimmedString(body.email).toLowerCase(), fullname: getTrimmedString(body.fullname).replace(/\s+/g, ' '), phone: getTrimmedString(body.phone), role: getTrimmedString(body.role) || 'staff', status: 'active', password: getTrimmedString(body.password) }
  const validation = validateAccountValues(accountInput, { requirePassword: true })
  if (validation.message) return { status: 400, payload: { message: validation.message } }
  const data = await loadDb()
  if (data.users.some((user) => user.email.toLowerCase() === accountInput.email)) return { status: 409, payload: { message: 'Email này đã được đăng ký.' } }
  const user = { id: randomUUID(), ...accountInput, password: await hashPassword(accountInput.password) }
  data.users.push(user)
  await saveDb(data)
  return { status: 201, payload: { account: toSafeAccount(user) } }
}

export async function updateAccount(id, body) {
  const data = await loadDb()
  const user = data.users.find((entry) => entry.id === id)
  if (!user) return { status: 404, payload: { message: 'Không tìm thấy tài khoản.' } }
  const validation = getAccountUpdate(user, body)
  if (validation.message) return { status: 400, payload: { message: validation.message } }
  if (user.role === 'admin' && validation.account.role !== 'admin' && data.users.filter((entry) => entry.role === 'admin').length === 1) return { status: 409, payload: { message: 'Không thể thay đổi vai trò của Admin cuối cùng.' } }
  Object.assign(user, validation.account)
  if (user.status === 'locked') data.sessions = data.sessions.filter((session) => session.userId !== user.id)
  await saveDb(data)
  return { status: 200, payload: { account: toSafeAccount(user) } }
}

export async function deleteAccount(id, currentUserId) {
  const data = await loadDb()
  const userIndex = data.users.findIndex((entry) => entry.id === id)
  if (userIndex === -1) return { status: 404, payload: { message: 'Không tìm thấy tài khoản.' } }
  const user = data.users[userIndex]
  if (user.id === currentUserId) return { status: 409, payload: { message: 'Không thể xoá tài khoản đang đăng nhập.' } }
  if (user.role === 'admin' && data.users.filter((entry) => entry.role === 'admin').length === 1) return { status: 409, payload: { message: 'Không thể xoá tài khoản Admin cuối cùng.' } }
  data.users.splice(userIndex, 1)
  data.sessions = data.sessions.filter((session) => session.userId !== user.id)
  data.carts = data.carts.filter((cart) => cart.userId !== user.id)
  await saveDb(data)
  return { status: 200, payload: { ok: true } }
}
