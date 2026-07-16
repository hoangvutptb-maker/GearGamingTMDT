import * as service from '../services/cartService.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { send, success, badRequest, serverError, readJsonBody } from '../utils/response.js'

export async function getCart(req, res) {
  try {
    if (!(await authenticate(req, res))) return
    success(res, await service.getCart(req.user.id))
  } catch (error) { console.error('Get cart failed:', error); serverError(res, { message: 'Không thể tải giỏ hàng lúc này.' }) }
}

export async function saveCart(req, res) {
  if (!(await authenticate(req, res))) return
  let body
  try { body = await readJsonBody(req) } catch { badRequest(res, { message: 'Dữ liệu giỏ hàng không hợp lệ.' }); return }
  try { const result = await service.saveCart(req.user.id, body.items); send(res, result.status, result.payload) }
  catch (error) { console.error('Save cart failed:', error); serverError(res, { message: 'Không thể lưu giỏ hàng lúc này.' }) }
}
