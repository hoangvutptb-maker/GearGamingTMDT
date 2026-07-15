import * as controller from '../controllers/cartController.js'

export async function cartRoutes(req, res, url) {
  if (url.pathname !== '/api/cart') return false
  if (req.method === 'GET') await controller.getCart(req, res)
  else if (req.method === 'POST') await controller.saveCart(req, res)
  else return false
  return true
}
