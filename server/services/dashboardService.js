import { loadDb } from '../database.js'
import { parseProductPrice, parseProductStock } from '../utils/validators.js'

const statuses = ['pending', 'processing', 'completed', 'cancelled']
const getSafeOrderStatus = (value) => statuses.includes(value) ? value : 'pending'
const getOrderTimestamp = (order) => { const value = Date.parse(order?.createdAt); return Number.isNaN(value) ? 0 : value }
const getStartOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

function getOrderLineSubtotal(item) {
  if (!item || !Number.isSafeInteger(item.quantity) || item.quantity <= 0) return 0
  if (Number.isSafeInteger(item.subtotal) && item.subtotal >= 0) return item.subtotal
  const price = parseProductPrice(item.price)
  const subtotal = price === null ? 0 : price * item.quantity
  return Number.isSafeInteger(subtotal) ? subtotal : 0
}

function getOrderTotal(order) {
  if (Number.isSafeInteger(order?.total) && order.total >= 0) return order.total
  if (!Array.isArray(order?.items)) return 0
  return order.items.reduce((total, item) => total + getOrderLineSubtotal(item), 0)
}

function toDashboardOrder(order) {
  return { id: order.id, userId: order.userId, fullname: order.fullname, phone: order.phone, address: order.address, paymentMethod: order.paymentMethod, items: Array.isArray(order.items) ? order.items.map((item) => ({ productId: item.productId, name: item.name, price: item.price, quantity: item.quantity, subtotal: getOrderLineSubtotal(item) })) : [], total: getOrderTotal(order), createdAt: order.createdAt, status: getSafeOrderStatus(order.status) }
}

export async function getDashboard(now = new Date()) {
  const data = await loadDb()
  const { users, products, orders } = data
  const startOfToday = getStartOfDay(now).getTime()
  const startOfWeekDate = getStartOfDay(now)
  const dayOfWeek = startOfWeekDate.getDay()
  startOfWeekDate.setDate(startOfWeekDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  const startOfWeek = startOfWeekDate.getTime()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const topProductsById = new Map()
  const status = { pending: 0, processing: 0, completed: 0, cancelled: 0 }
  let revenue = 0, itemsSold = 0, today = 0, week = 0, month = 0
  for (const order of orders) {
    const total = getOrderTotal(order)
    const timestamp = getOrderTimestamp(order)
    revenue += total
    status[getSafeOrderStatus(order.status)] += 1
    if (timestamp >= startOfToday) today += 1
    if (timestamp >= startOfWeek) week += 1
    if (timestamp >= startOfMonth) month += 1
    if (!Array.isArray(order.items)) continue
    for (const item of order.items) {
      if (!Number.isSafeInteger(item?.productId) || !Number.isSafeInteger(item.quantity) || item.quantity <= 0) continue
      const previous = topProductsById.get(item.productId) || { id: item.productId, name: typeof item.name === 'string' ? item.name : '', quantitySold: 0, revenue: 0 }
      previous.quantitySold += item.quantity
      previous.revenue += getOrderLineSubtotal(item)
      if (!previous.name && typeof item.name === 'string') previous.name = item.name
      topProductsById.set(item.productId, previous)
      itemsSold += item.quantity
    }
  }
  const inventory = products.reduce((total, product) => { const stock = parseProductStock(product.stock); return stock === null ? total : total + stock }, 0)
  return {
    statistics: { users: users.length, customers: users.filter((user) => user.role === 'customer').length, staff: users.filter((user) => user.role === 'staff').length, admins: users.filter((user) => user.role === 'admin').length, products: products.length, orders: orders.length, revenue, averageOrderValue: orders.length === 0 ? 0 : revenue / orders.length, itemsSold, inventory },
    orders: { today, week, month }, status,
    topProducts: [...topProductsById.values()].sort((a, b) => b.quantitySold - a.quantitySold || b.revenue - a.revenue || a.id - b.id).slice(0, 5),
    lowStock: products.map((product) => ({ id: product.id, name: product.name, stock: parseProductStock(product.stock) })).filter((product) => product.stock !== null && product.stock <= 5).sort((a, b) => a.stock - b.stock || a.id - b.id).slice(0, 5),
    recentOrders: [...orders].sort((a, b) => getOrderTimestamp(b) - getOrderTimestamp(a)).slice(0, 10).map(toDashboardOrder),
  }
}
