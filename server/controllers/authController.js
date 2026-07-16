import * as service from '../services/authService.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { send, success, badRequest, serverError, readJsonBody } from '../utils/response.js'

export async function register(req, res) {
  try {
    send(res, ...(resultParts(await service.register(await readJsonBody(req)))))
  } catch (error) {
    console.error('Register failed:', error)
    if (error.message === 'Invalid JSON body' || error.message === 'JSON body too large') badRequest(res, { message: 'Dữ liệu đăng ký không hợp lệ.' })
    else serverError(res, { message: 'Không thể đăng ký tài khoản lúc này. Vui lòng thử lại.' })
  }
}

export async function login(req, res) {
  let body
  try { body = await readJsonBody(req) } catch { badRequest(res, { message: 'Dữ liệu đăng nhập không hợp lệ.' }); return }
  try { send(res, ...(resultParts(await service.login(body)))) }
  catch (error) { console.error('Login failed:', error); serverError(res, { message: 'Không thể đăng nhập lúc này. Vui lòng thử lại.' }) }
}

export async function logout(req, res) {
  try {
    if (!(await authenticate(req, res))) return
    success(res, await service.logout(req.authToken))
  } catch (error) { console.error('Logout failed:', error); serverError(res, { message: 'Không thể đăng xuất lúc này. Vui lòng thử lại.' }) }
}

export async function me(req, res) {
  if (await authenticate(req, res)) success(res, { user: req.user })
}

function resultParts(result) { return [result.status, result.payload] }
