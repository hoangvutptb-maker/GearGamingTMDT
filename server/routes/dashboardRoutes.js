import { getDashboard, health } from '../controllers/dashboardController.js'

export async function dashboardRoutes(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/dashboard') await getDashboard(req, res)
  else if (req.method === 'GET' && url.pathname === '/health') health(req, res)
  else return false
  return true
}
