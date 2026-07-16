import * as controller from '../controllers/orderController.js'

export async function orderRoutes(req, res, url) {
  if (url.pathname !== '/api/orders') return false
  if (req.method === 'GET') await controller.getOrders(req, res)
  else if (req.method === 'POST') await controller.createOrder(req, res)
  else return false
  return true
}
