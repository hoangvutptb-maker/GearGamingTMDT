import * as service from '../services/accountService.js'
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js'
import { send, success, badRequest, serverError, readJsonBody } from '../utils/response.js'

const authorize = async (req, res) => await authenticate(req, res) && requireAdmin(req, res)

export async function getAccounts(req, res) {
  try { if (!(await authorize(req, res))) return; success(res, { accounts: await service.getAccounts() }) }
  catch (error) { console.error('Get accounts failed:', error); serverError(res, { message: 'Không thể tải danh sách tài khoản lúc này.' }) }
}

export async function getAccount(req, res, id) {
  try { if (!(await authorize(req, res))) return; const result = await service.getAccount(id); send(res, result.status, result.payload) }
  catch (error) { console.error('Get account failed:', error); serverError(res, { message: 'Không thể tải tài khoản lúc này.' }) }
}

export async function createAccount(req, res) {
  if (!(await authorize(req, res))) return
  let body
  try { body = await readJsonBody(req) } catch { badRequest(res, { message: 'Dữ liệu tài khoản không hợp lệ.' }); return }
  try { const result = await service.createAccount(body); send(res, result.status, result.payload) }
  catch (error) { console.error('Create account failed:', error); serverError(res, { message: 'Không thể tạo tài khoản lúc này.' }) }
}

export async function updateAccount(req, res, id) {
  if (!(await authorize(req, res))) return
  let body
  try { body = await readJsonBody(req) } catch { badRequest(res, { message: 'Dữ liệu tài khoản không hợp lệ.' }); return }
  try { const result = await service.updateAccount(id, body); send(res, result.status, result.payload) }
  catch (error) { console.error('Update account failed:', error); serverError(res, { message: 'Không thể cập nhật tài khoản lúc này.' }) }
}

export async function deleteAccount(req, res, id) {
  try { if (!(await authorize(req, res))) return; const result = await service.deleteAccount(id, req.user.id); send(res, result.status, result.payload) }
  catch (error) { console.error('Delete account failed:', error); serverError(res, { message: 'Không thể xoá tài khoản lúc này.' }) }
}
