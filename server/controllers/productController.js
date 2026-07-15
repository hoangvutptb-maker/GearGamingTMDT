import * as service from '../services/productService.js'
import { authenticate, requireAdminOrStaff } from '../middleware/authMiddleware.js'
import { send, success, badRequest, serverError, readJsonBody } from '../utils/response.js'

const authorize = async (req, res) => await authenticate(req, res) && requireAdminOrStaff(req, res)

export async function getProducts(req, res) {
  try { success(res, { products: await service.getProducts() }) }
  catch (error) { console.error('Get products failed:', error); serverError(res, { message: 'Không thể tải sản phẩm lúc này.' }) }
}

export async function createProduct(req, res) {
  if (!(await authorize(req, res))) return
  let body
  try { body = await readJsonBody(req) } catch { badRequest(res, { message: 'Dữ liệu sản phẩm không hợp lệ.' }); return }
  try { const result = await service.createProduct(body); send(res, result.status, result.payload) }
  catch (error) { console.error('Create product failed:', error); serverError(res, { message: 'Không thể tạo sản phẩm lúc này.' }) }
}

export async function updateProduct(req, res, id) {
  if (!(await authorize(req, res))) return
  let body
  try { body = await readJsonBody(req) } catch { badRequest(res, { message: 'Dữ liệu sản phẩm không hợp lệ.' }); return }
  try { const result = await service.updateProduct(id, body); send(res, result.status, result.payload) }
  catch (error) { console.error('Update product failed:', error); serverError(res, { message: 'Không thể cập nhật sản phẩm lúc này.' }) }
}

export async function deleteProduct(req, res, id) {
  if (!(await authorize(req, res))) return
  try { const result = await service.deleteProduct(id); send(res, result.status, result.payload) }
  catch (error) { console.error('Delete product failed:', error); serverError(res, { message: 'Không thể xóa sản phẩm lúc này.' }) }
}
