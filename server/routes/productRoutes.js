import * as controller from '../controllers/productController.js'

export async function productRoutes(req, res, url) {
  if (url.pathname === '/api/products' && req.method === 'GET') await controller.getProducts(req, res)
  else if (url.pathname === '/api/products' && req.method === 'POST') await controller.createProduct(req, res)
  else {
    const match = url.pathname.match(/^\/api\/products\/(\d+)$/)
    if (!match || !['PUT', 'DELETE'].includes(req.method)) return false
    if (req.method === 'PUT') await controller.updateProduct(req, res, Number(match[1]))
    else await controller.deleteProduct(req, res, Number(match[1]))
  }
  return true
}
