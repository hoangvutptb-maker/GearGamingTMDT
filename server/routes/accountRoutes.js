import * as controller from '../controllers/accountController.js'

export async function accountRoutes(req, res, url) {
  if (url.pathname === '/api/accounts') {
    if (req.method === 'GET') await controller.getAccounts(req, res)
    else if (req.method === 'POST') await controller.createAccount(req, res)
    else return false
    return true
  }
  const match = url.pathname.match(/^\/api\/accounts\/([^/]+)$/)
  if (!match || !['GET', 'PUT', 'DELETE'].includes(req.method)) return false
  const id = match[1]
  if (req.method === 'GET') await controller.getAccount(req, res, id)
  else if (req.method === 'PUT') await controller.updateAccount(req, res, id)
  else await controller.deleteAccount(req, res, id)
  return true
}
