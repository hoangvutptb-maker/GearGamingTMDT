import { loadDb } from '../database.js'
import { unauthorized, forbidden, serverError } from '../utils/response.js'

function getBearerToken(req) {
  const authorization = req.headers.authorization
  if (typeof authorization !== 'string') return ''
  const [scheme, token] = authorization.trim().split(/\s+/)
  return scheme?.toLowerCase() === 'bearer' && token ? token : ''
}

export async function authenticate(req, res) {
  const token = getBearerToken(req)
  if (!token) {
    unauthorized(res, { message: 'Token không hợp lệ.' })
    return false
  }
  try {
    const data = await loadDb()
    const session = data.sessions.find((entry) => entry?.token === token)
    const user = session && data.users.find((entry) => entry?.id === session.userId)
    if (!user || user.status === 'locked') {
      unauthorized(res, { message: 'Token không hợp lệ.' })
      return false
    }
    req.user = { id: user.id, fullname: user.fullname, phone: user.phone, email: user.email, role: user.role }
    req.authToken = token
    return true
  } catch (error) {
    console.error('Authentication data load failed:', error)
    serverError(res, { message: 'Không thể xác thực lúc này. Vui lòng thử lại.' })
    return false
  }
}

function requireRole(req, res, roles) {
  if (!req.user) {
    unauthorized(res, { message: 'Bạn cần đăng nhập để thực hiện thao tác này.' })
    return false
  }
  if (!roles.includes(req.user.role)) {
    forbidden(res, { message: 'Bạn không có quyền thực hiện thao tác này.' })
    return false
  }
  return true
}

export const requireAdmin = (req, res) => requireRole(req, res, ['admin'])
export const requireStaff = (req, res) => requireRole(req, res, ['staff'])
export const requireAdminOrStaff = (req, res) => requireRole(req, res, ['admin', 'staff'])
