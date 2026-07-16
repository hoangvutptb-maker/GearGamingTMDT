const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const vietnamesePhonePattern = /^(?:0\d{9}|\+84\d{9})$/
const fullNamePattern = /^[\p{L}\s.'-]+$/u

export const getTrimmedString = (value) => typeof value === 'string' ? value.trim() : ''
export const validateEmail = (value) => emailPattern.test(value)
export const validatePhone = (value) => vietnamesePhonePattern.test(value)
export const validatePassword = (value) => typeof value === 'string' && value.length >= 6
export const validateFullname = (value) => typeof value === 'string' && value.length >= 2 && fullNamePattern.test(value)

export function parseProductPrice(value) {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value > 0) return value
  const rawValue = getTrimmedString(value).replace(/đ$/i, '')
  if (!/^\d+(?:[.,]\d{3})*$/.test(rawValue)) return null
  const price = Number(rawValue.replace(/[.,]/g, ''))
  return Number.isSafeInteger(price) && price > 0 ? price : null
}

export function parseProductStock(value) {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) return value
  const rawValue = getTrimmedString(value)
  if (!/^\d+$/.test(rawValue)) return null
  const stock = Number(rawValue)
  return Number.isSafeInteger(stock) ? stock : null
}

export function validateProductInput(body) {
  const name = getTrimmedString(body.name).replace(/\s+/g, ' ')
  const category = getTrimmedString(body.category).replace(/\s+/g, ' ')
  const price = parseProductPrice(body.price)
  const stock = parseProductStock(body.stock)
  if (name.length < 2) return { message: 'Tên sản phẩm cần ít nhất 2 ký tự.' }
  if (!category) return { message: 'Danh mục sản phẩm là bắt buộc.' }
  if (price === null) return { message: 'Giá sản phẩm phải là số nguyên dương hợp lệ.' }
  if (stock === null) return { message: 'Tồn kho phải là số nguyên không âm.' }
  return { product: { name, category, price: `${price.toLocaleString('vi-VN')}đ`, stock, status: body.status === 'hidden' ? 'hidden' : 'active', image: getTrimmedString(body.image), specs: body.specs && typeof body.specs === 'object' && !Array.isArray(body.specs) ? body.specs : {} } }
}

const accountRoles = ['admin', 'staff', 'customer']
const accountStatuses = ['active', 'locked']

export function validateAccountValues(account, { requirePassword = false } = {}) {
  if (!validateEmail(account.email)) return { message: 'Email không đúng định dạng.' }
  if (!validateFullname(account.fullname)) return { message: 'Họ và tên không hợp lệ.' }
  if (!validatePhone(account.phone)) return { message: 'Số điện thoại không hợp lệ.' }
  if (!accountRoles.includes(account.role)) return { message: 'Vai trò tài khoản không hợp lệ.' }
  if (!accountStatuses.includes(account.status)) return { message: 'Trạng thái tài khoản không hợp lệ.' }
  if (requirePassword && !validatePassword(account.password)) return { message: 'Mật khẩu cần ít nhất 6 ký tự.' }
  return { account }
}

export function validateCartItems(items, products) {
  if (!Array.isArray(items)) return { message: 'Giỏ hàng phải là một danh sách sản phẩm.' }
  const productsById = new Map(products.map((product) => [product.id, product]))
  const quantitiesByProductId = new Map()
  for (const item of items) {
    const productId = item?.productId
    const quantity = item?.quantity
    if (!Number.isSafeInteger(productId) || !productsById.has(productId)) return { message: 'Sản phẩm trong giỏ không tồn tại.' }
    if (!Number.isSafeInteger(quantity) || quantity <= 0) return { message: 'Số lượng sản phẩm phải là số nguyên lớn hơn 0.' }
    const nextQuantity = (quantitiesByProductId.get(productId) || 0) + quantity
    if (!Number.isSafeInteger(nextQuantity)) return { message: 'Số lượng sản phẩm không hợp lệ.' }
    quantitiesByProductId.set(productId, nextQuantity)
  }
  return { items: [...quantitiesByProductId].map(([productId, quantity]) => ({ productId, quantity })) }
}
