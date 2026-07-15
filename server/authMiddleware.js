function getBearerToken(req) {
  const authorization = req.headers.authorization

  if (typeof authorization !== 'string') {
    return ''
  }

  const [scheme, token] = authorization.trim().split(/\s+/)
  return scheme?.toLowerCase() === 'bearer' && token ? token : ''
}

export function createAuthenticationMiddleware({ loadDb, sendJson }) {
  return async function authenticate(req, res) {
    const token = getBearerToken(req)
    if (!token) {
      sendJson(res, 401, { message: 'Token không hợp lệ.' })
      return false
    }

    let data
    try {
      data = await loadDb()
    } catch (error) {
      console.error('Authentication data load failed:', error)
      sendJson(res, 500, { message: 'Không thể xác thực lúc này. Vui lòng thử lại.' })
      return false
    }

    const session = data.sessions.find((entry) => entry?.token === token)
    const user = session && data.users.find((entry) => entry?.id === session.userId)

    if (!user || user.status === 'locked') {
      sendJson(res, 401, { message: 'Token không hợp lệ.' })
      return false
    }

    req.user = {
      id: user.id,
      fullname: user.fullname,
      phone: user.phone,
      email: user.email,
      role: user.role,
    }
    req.authToken = token

    return true
  }
}

function createRoleMiddleware(roles, sendJson) {
  return function authorize(req, res) {
    if (!req.user) {
      sendJson(res, 401, { message: 'Bạn cần đăng nhập để thực hiện thao tác này.' })
      return false
    }

    if (!roles.includes(req.user.role)) {
      sendJson(res, 403, { message: 'Bạn không có quyền thực hiện thao tác này.' })
      return false
    }

    return true
  }
}

export function requireAdmin(sendJson) {
  return createRoleMiddleware(['admin'], sendJson)
}

export function requireStaff(sendJson) {
  return createRoleMiddleware(['staff'], sendJson)
}

export function requireAdminOrStaff(sendJson) {
  return createRoleMiddleware(['admin', 'staff'], sendJson)
}
