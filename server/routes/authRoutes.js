import * as controller from '../controllers/authController.js'

export async function authRoutes(req, res, url) {
  const routes = { 'POST /api/auth/register': controller.register, 'POST /api/auth/login': controller.login, 'POST /api/auth/logout': controller.logout, 'GET /api/auth/me': controller.me }
  const handler = routes[`${req.method} ${url.pathname}`]
  if (!handler) return false
  await handler(req, res)
  return true
}
