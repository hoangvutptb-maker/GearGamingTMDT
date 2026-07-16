import { getDashboard as getDashboardData } from '../services/dashboardService.js'
import { authenticate, requireAdminOrStaff } from '../middleware/authMiddleware.js'
import { success, serverError } from '../utils/response.js'

export async function getDashboard(req, res) {
  try {
    if (!(await authenticate(req, res)) || !requireAdminOrStaff(req, res)) return
    success(res, await getDashboardData())
  } catch (error) { console.error('Get dashboard failed:', error); serverError(res, { message: 'Không thể tải dữ liệu Dashboard lúc này.' }) }
}

export function health(req, res) {
  success(res, { ok: true, service: 'geargamingtmdt-api' })
}
