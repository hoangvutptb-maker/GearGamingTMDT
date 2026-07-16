/**
 * authHelpers.js - Hàm tiện ích cho xác thực
 */

/**
 * Đọc danh sách users từ localStorage
 */
export function readUsers() {
  try {
    return JSON.parse(localStorage.getItem('gearmax_users') || '[]')
  } catch {
    return []
  }
}

/**
 * Kiểm tra xem email đã tồn tại chưa
 */
export function emailExists(email) {
  const users = readUsers()
  return users.some((user) => user.email === email.toLowerCase().trim())
}

/**
 * Tìm user từ email + password
 */
export function findUserByCredentials(email, password) {
  const users = readUsers()
  return users.find(
    (user) => user.email === email.toLowerCase().trim() && user.password === password.trim()
  )
}

/**
 * Tạo user mới để đăng ký
 */
export function createNewUser(formData) {
  return {
    id: Date.now(),
    fullname: formData.fullname.trim(),
    phone: formData.phone.trim(),
    email: formData.email.toLowerCase().trim(),
    password: formData.password.trim(),
    role: 'customer', // Khác với admin
  }
}

/**
 * Lưu user mới vào localStorage
 */
export function saveNewUser(newUser) {
  const users = readUsers()
  localStorage.setItem('gearmax_users', JSON.stringify([...users, newUser]))
}

/**
 * Validate form login
 */
export function validateLoginForm(email, password) {
  const errors = []

  if (!email.trim()) {
    errors.push('Vui lòng nhập email.')
  }
  if (!password.trim()) {
    errors.push('Vui lòng nhập mật khẩu.')
  }

  return errors.length === 0 ? null : errors[0]
}

/**
 * Validate form register
 */
export function validateRegisterForm(formData) {
  const { fullname, phone, email, password, confirmPassword } = formData

  if (!fullname.trim()) {
    return 'Vui lòng nhập họ và tên.'
  }
  if (!phone.trim()) {
    return 'Vui lòng nhập số điện thoại.'
  }
  if (!email.trim()) {
    return 'Vui lòng nhập email.'
  }
  if (!password.trim()) {
    return 'Vui lòng nhập mật khẩu.'
  }

  if (password.length < 6) {
    return 'Mật khẩu cần ít nhất 6 ký tự.'
  }

  if (password !== confirmPassword.trim()) {
    return 'Mật khẩu xác nhận chưa khớp.'
  }

  if (emailExists(email)) {
    return 'Email này đã được đăng ký.'
  }

  return null
}

/**
 * Lưu current user vào localStorage
 */
export function saveCurrentUser(user) {
  localStorage.setItem('gearmax_current_user', JSON.stringify(user))
}

/**
 * Đọc current user từ localStorage
 */
export function readCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('gearmax_current_user') || 'null')
  } catch {
    return null
  }
}

/**
 * Clear current user (logout)
 */
export function clearCurrentUser() {
  localStorage.removeItem('gearmax_current_user')
}
