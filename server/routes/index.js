import { authRoutes } from './authRoutes.js'
import { productRoutes } from './productRoutes.js'
import { cartRoutes } from './cartRoutes.js'
import { orderRoutes } from './orderRoutes.js'
import { accountRoutes } from './accountRoutes.js'
import { dashboardRoutes } from './dashboardRoutes.js'
import { send } from '../utils/response.js'

const routes = [authRoutes, productRoutes, cartRoutes, orderRoutes, accountRoutes, dashboardRoutes]

export async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') {
    send(res, 204, {})
    return
  }
  const url = new URL(req.url, `http://${req.headers.host}`)
  for (const route of routes) {
    if (await route(req, res, url)) return
  }
  send(res, 404, { message: 'Route not found.' })
}
