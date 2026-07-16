/**
 * src/features/admin/utils/adminHelpers.js
 * Các hàm tiện ích cho admin
 */

/**
 * Format giá VNĐ
 */
export function formatPrice(price) {
  return parseInt(price).toLocaleString('vi-VN')
}

/**
 * Format ngày tháng
 */
export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

/**
 * Format ngày giờ
 */
export function formatDateTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN')
}

/**
 * Map status thành label + color
 */
export function getStatusInfo(status) {
  const statusMap = {
    pending: { label: 'Chờ xử lý', color: '#FFC107' },
    shipping: { label: 'Đang giao', color: '#0DD3FF' },
    completed: { label: 'Hoàn thành', color: '#1ECC71' },
    cancelled: { label: 'Đã hủy', color: '#FF5252' },
    active: { label: 'Hiển thị', color: '#1ECC71' },
    hidden: { label: 'Ẩn', color: '#FF5252' },
  }
  return statusMap[status] || { label: 'Không xác định', color: '#999' }
}

/**
 * Tính tổng tiền từ mảng items
 */
export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + parseInt(item.price) * item.quantity, 0)
}
