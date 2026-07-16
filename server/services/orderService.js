import { randomUUID } from 'node:crypto'
import { loadDb, saveDb } from '../database.js'
import { getTrimmedString, parseProductPrice } from '../utils/validators.js'

function createOrderLines(cartItems, products) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) return { message: 'Giỏ hàng đang trống.' }
  const productsById = new Map(products.map((product) => [product.id, product]))
  const quantitiesByProductId = new Map()
  for (const item of cartItems) {
    const productId = Number.isSafeInteger(item.productId) ? item.productId : item.id
    const quantity = item.quantity
    if (!Number.isSafeInteger(productId) || !productsById.has(productId)) return { message: 'Sản phẩm trong giỏ không tồn tại.' }
    if (!Number.isSafeInteger(quantity) || quantity <= 0) return { message: 'Số lượng sản phẩm trong giỏ không hợp lệ.' }
    const nextQuantity = (quantitiesByProductId.get(productId) || 0) + quantity
    if (!Number.isSafeInteger(nextQuantity)) return { message: 'Số lượng sản phẩm trong giỏ không hợp lệ.' }
    quantitiesByProductId.set(productId, nextQuantity)
  }
  const lines = []
  let total = 0
  for (const [productId, quantity] of quantitiesByProductId) {
    const product = productsById.get(productId)
    const price = parseProductPrice(product.price)
    if (price === null || !Number.isSafeInteger(product.stock) || product.stock < 0) return { message: 'Dữ liệu sản phẩm không hợp lệ.' }
    if (quantity > product.stock) return { conflict: true }
    const subtotal = price * quantity
    if (!Number.isSafeInteger(subtotal) || !Number.isSafeInteger(total + subtotal)) return { message: 'Tổng tiền đơn hàng không hợp lệ.' }
    total += subtotal
    lines.push({ productId, name: product.name, price: product.price, quantity, subtotal })
  }
  return { lines, total }
}

export async function createOrder(user, body) {
  const data = await loadDb()
  const cart = data.carts.find((entry) => entry.userId === user.id)
  if (!cart) return { status: 400, payload: { message: 'Giỏ hàng không tồn tại.' } }
  const calculation = createOrderLines(cart.items, data.products)
  if (calculation.conflict) return { status: 409, payload: { message: 'Sản phẩm không đủ tồn kho.' } }
  if (calculation.message) return { status: 400, payload: { message: calculation.message } }
  for (const line of calculation.lines) data.products.find((entry) => entry.id === line.productId).stock -= line.quantity
  const order = { id: randomUUID(), userId: user.id, fullname: getTrimmedString(body.fullname) || user.fullname, phone: getTrimmedString(body.phone) || user.phone || '', address: getTrimmedString(body.address), paymentMethod: getTrimmedString(body.paymentMethod) || 'cod', items: calculation.lines, total: calculation.total, createdAt: new Date().toISOString(), status: 'pending' }
  data.orders.push(order)
  data.carts = data.carts.filter((entry) => entry.userId !== user.id)
  await saveDb(data)
  return { status: 201, payload: { order } }
}

export async function getOrders(user) {
  const data = await loadDb()
  const manager = user.role === 'admin' || user.role === 'staff'
  return manager ? data.orders : data.orders.filter((entry) => entry.userId === user.id)
}
