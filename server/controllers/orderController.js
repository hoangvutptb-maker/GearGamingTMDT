import * as service from '../services/orderService.js'
import { authenticate, requireAdminOrStaff } from '../middleware/authMiddleware.js'
import { send, success, badRequest, serverError, readJsonBody } from '../utils/response.js'

export async function createOrder(req, res) {
  if (!(await authenticate(req, res))) return
  let body
  try { body = await readJsonBody(req) } catch { badRequest(res, { message: 'Dữ liệu đơn hàng không hợp lệ.' }); return }
  try { const result = await service.createOrder(req.user, body); send(res, result.status, result.payload) }
  catch (error) { console.error('Create order failed:', error); serverError(res, { message: 'Không thể tạo đơn hàng lúc này.' }) }
}

export async function getOrders(req, res) {
  try {
    if (!(await authenticate(req, res))) return
    const manager = req.user.role === 'admin' || req.user.role === 'staff'
    if (manager && !requireAdminOrStaff(req, res)) return
    success(res, { orders: await service.getOrders(req.user) })
  } catch (error) { console.error('Get orders failed:', error); serverError(res, { message: 'Không thể tải đơn hàng lúc này.' }) }
}
