import { createServer } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { randomUUID, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { createAuthenticationMiddleware, requireAdmin, requireAdminOrStaff } from './authMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, 'data.json')
const port = Number(process.env.PORT || 3001)
const scryptAsync = promisify(scrypt)
const passwordHashPrefix = 'scrypt'
const passwordKeyLength = 64
const maxJsonBodyBytes = 1024 * 1024

const defaultProducts = [
  {
    id: 1,
    name: 'Màn hình ViewSonic VX2528 25" IPS 180Hz',
    price: '2.590.000đ',
    oldPrice: '3.790.000đ',
    sale: '-32%',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=88',
    stock: 10,
  },
  {
    id: 2,
    name: 'Bàn phím cơ AKKO 5075B Plus Blue Ocean',
    price: '1.690.000đ',
    oldPrice: '2.190.000đ',
    sale: '-23%',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=88',
    stock: 10,
  },
  {
    id: 3,
    name: 'Chuột Logitech G Pro X Superlight 2',
    price: '3.190.000đ',
    oldPrice: '3.990.000đ',
    sale: '-20%',
    image: 'https://images.unsplash.com/photo-1629429407759-01cd3d7cfb38?auto=format&fit=crop&w=900&q=88',
    stock: 10,
  },
  {
    id: 4,
    name: 'Tai nghe HyperX Cloud III Wireless',
    price: '2.890.000đ',
    oldPrice: '3.590.000đ',
    sale: '-19%',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&q=88',
    stock: 10,
  },
]

async function ensureDb() {
  if (!existsSync(dbPath)) {
    await mkdir(__dirname, { recursive: true })
    const initial = {
      users: [
        {
          id: 'admin-1',
          fullname: 'Admin Gearmax',
          phone: '0123456789',
          email: 'admin@gearmax.com',
          password: 'admin123',
          role: 'admin',
        },
        {
          id: 'staff-1',
          fullname: 'Staff Gearmax',
          phone: '0123456790',
          email: 'staff@gearmax.com',
          password: 'staff123',
          role: 'staff',
        },
      ],
      sessions: [],
      carts: [],
      orders: [],
      products: defaultProducts,
    }
    await writeFile(dbPath, JSON.stringify(initial, null, 2))
    return initial
  }

  const content = await readFile(dbPath, 'utf8')
  return validateDatabase(JSON.parse(content.replace(/^\uFEFF/, '')))
}

let dbCache = null

function validateDatabase(data) {
  const requiredCollections = ['users', 'sessions', 'carts', 'orders', 'products']
  if (!data || typeof data !== 'object' || Array.isArray(data) || requiredCollections.some((key) => !Array.isArray(data[key]))) {
    throw new Error('Invalid database structure')
  }
  return data
}

async function loadDb() {
  if (!dbCache) {
    dbCache = await ensureDb()
  }
  return validateDatabase(dbCache)
}

async function saveDb(data) {
  const validData = validateDatabase(data)
  await writeFile(dbPath, JSON.stringify(validData, null, 2))
  dbCache = validData
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' })
  res.end(JSON.stringify(payload))
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    let bodySize = 0
    let bodyTooLarge = false
    req.on('data', (chunk) => {
      bodySize += chunk.length
      if (bodySize > maxJsonBodyBytes) {
        bodyTooLarge = true
        return
      }
      body += chunk
    })
    req.on('end', () => {
      if (bodyTooLarge) {
        reject(new Error('JSON body too large'))
        return
      }
      if (!body) {
        resolve({})
        return
      }
      try {
        const parsedBody = JSON.parse(body)
        if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
          reject(new Error('Invalid JSON body'))
          return
        }
        resolve(parsedBody)
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const vietnamesePhonePattern = /^(?:0\d{9}|\+84\d{9})$/
const fullNamePattern = /^[\p{L}\s.'-]+$/u

function getTrimmedString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function isScryptHash(value) {
  return typeof value === 'string' && value.startsWith(`${passwordHashPrefix}$`)
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('base64url')
  const hash = await scryptAsync(password, salt, passwordKeyLength)
  return `${passwordHashPrefix}$${salt}$${Buffer.from(hash).toString('base64url')}`
}

async function verifyPassword(password, storedPassword) {
  if (typeof password !== 'string' || typeof storedPassword !== 'string') {
    return false
  }

  if (!isScryptHash(storedPassword)) {
    const expected = Buffer.from(storedPassword)
    const actual = Buffer.from(password)
    return expected.length === actual.length && timingSafeEqual(expected, actual)
  }

  const [, salt, encodedHash] = storedPassword.split('$')
  if (!salt || !encodedHash) {
    return false
  }

  try {
    const expected = Buffer.from(encodedHash, 'base64url')
    if (expected.length !== passwordKeyLength) {
      return false
    }
    const actual = Buffer.from(await scryptAsync(password, salt, passwordKeyLength))
    return timingSafeEqual(expected, actual)
  } catch {
    return false
  }
}

function parseProductPrice(value) {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value > 0) {
    return value
  }

  const rawValue = getTrimmedString(value).replace(/đ$/i, '')
  if (!/^\d+(?:[.,]\d{3})*$/.test(rawValue)) {
    return null
  }

  const price = Number(rawValue.replace(/[.,]/g, ''))
  return Number.isSafeInteger(price) && price > 0 ? price : null
}

function parseProductStock(value) {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) {
    return value
  }

  const rawValue = getTrimmedString(value)
  if (!/^\d+$/.test(rawValue)) {
    return null
  }

  const stock = Number(rawValue)
  return Number.isSafeInteger(stock) ? stock : null
}

function validateProductInput(body) {
  const name = getTrimmedString(body.name).replace(/\s+/g, ' ')
  const category = getTrimmedString(body.category).replace(/\s+/g, ' ')
  const price = parseProductPrice(body.price)
  const stock = parseProductStock(body.stock)

  if (name.length < 2) {
    return { message: 'Tên sản phẩm cần ít nhất 2 ký tự.' }
  }
  if (!category) {
    return { message: 'Danh mục sản phẩm là bắt buộc.' }
  }
  if (price === null) {
    return { message: 'Giá sản phẩm phải là số nguyên dương hợp lệ.' }
  }
  if (stock === null) {
    return { message: 'Tồn kho phải là số nguyên không âm.' }
  }

  return {
    product: {
      name,
      category,
      price: `${price.toLocaleString('vi-VN')}đ`,
      stock,
      status: body.status === 'hidden' ? 'hidden' : 'active',
      image: getTrimmedString(body.image),
      specs: body.specs && typeof body.specs === 'object' && !Array.isArray(body.specs) ? body.specs : {},
    },
  }
}

function getNextProductId(products) {
  const highestId = products.reduce((highest, product) => (
    Number.isSafeInteger(product.id) && product.id > highest ? product.id : highest
  ), 0)
  return highestId + 1
}

const accountRoles = ['admin', 'staff', 'customer']
const accountStatuses = ['active', 'locked']

function toSafeAccount(user) {
  return {
    id: user.id,
    fullname: user.fullname,
    phone: user.phone,
    email: user.email,
    role: user.role,
    status: user.status || 'active',
  }
}

function validateAccountValues(account, { requirePassword = false } = {}) {
  if (!emailPattern.test(account.email)) {
    return { message: 'Email không đúng định dạng.' }
  }
  if (account.fullname.length < 2 || !fullNamePattern.test(account.fullname)) {
    return { message: 'Họ và tên không hợp lệ.' }
  }
  if (!vietnamesePhonePattern.test(account.phone)) {
    return { message: 'Số điện thoại không hợp lệ.' }
  }
  if (!accountRoles.includes(account.role)) {
    return { message: 'Vai trò tài khoản không hợp lệ.' }
  }
  if (!accountStatuses.includes(account.status)) {
    return { message: 'Trạng thái tài khoản không hợp lệ.' }
  }
  if (requirePassword && account.password.length < 6) {
    return { message: 'Mật khẩu cần ít nhất 6 ký tự.' }
  }
  return { account }
}

function getAccountUpdate(user, body) {
  const account = {
    email: user.email,
    fullname: body.fullname === undefined ? user.fullname : getTrimmedString(body.fullname).replace(/\s+/g, ' '),
    phone: body.phone === undefined ? user.phone : getTrimmedString(body.phone),
    role: body.role === undefined ? user.role : getTrimmedString(body.role),
    status: body.status === undefined ? user.status || 'active' : getTrimmedString(body.status),
    password: user.password,
  }
  return validateAccountValues(account)
}

function getCartResponseItems(cartItems, products) {
  const productsById = new Map(products.map((product) => [product.id, product]))

  return cartItems.flatMap((item) => {
    const productId = Number.isSafeInteger(item.productId) ? item.productId : item.id
    const product = productsById.get(productId)
    return product ? [{ ...product, quantity: item.quantity }] : []
  })
}

function validateCartItems(items, products) {
  if (!Array.isArray(items)) {
    return { message: 'Giỏ hàng phải là một danh sách sản phẩm.' }
  }

  const productsById = new Map(products.map((product) => [product.id, product]))
  const quantitiesByProductId = new Map()

  for (const item of items) {
    const productId = item?.productId
    const quantity = item?.quantity

    if (!Number.isSafeInteger(productId) || !productsById.has(productId)) {
      return { message: 'Sản phẩm trong giỏ không tồn tại.' }
    }
    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      return { message: 'Số lượng sản phẩm phải là số nguyên lớn hơn 0.' }
    }

    const nextQuantity = (quantitiesByProductId.get(productId) || 0) + quantity
    if (!Number.isSafeInteger(nextQuantity)) {
      return { message: 'Số lượng sản phẩm không hợp lệ.' }
    }
    quantitiesByProductId.set(productId, nextQuantity)
  }

  return {
    items: [...quantitiesByProductId].map(([productId, quantity]) => ({ productId, quantity })),
  }
}

function createOrderLines(cartItems, products) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { message: 'Giỏ hàng đang trống.' }
  }

  const productsById = new Map(products.map((product) => [product.id, product]))
  const quantitiesByProductId = new Map()

  for (const item of cartItems) {
    const productId = Number.isSafeInteger(item.productId) ? item.productId : item.id
    const quantity = item.quantity

    if (!Number.isSafeInteger(productId) || !productsById.has(productId)) {
      return { message: 'Sản phẩm trong giỏ không tồn tại.' }
    }
    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      return { message: 'Số lượng sản phẩm trong giỏ không hợp lệ.' }
    }

    const nextQuantity = (quantitiesByProductId.get(productId) || 0) + quantity
    if (!Number.isSafeInteger(nextQuantity)) {
      return { message: 'Số lượng sản phẩm trong giỏ không hợp lệ.' }
    }
    quantitiesByProductId.set(productId, nextQuantity)
  }

  const lines = []
  let total = 0

  for (const [productId, quantity] of quantitiesByProductId) {
    const product = productsById.get(productId)
    const price = parseProductPrice(product.price)
    if (price === null || !Number.isSafeInteger(product.stock) || product.stock < 0) {
      return { message: 'Dữ liệu sản phẩm không hợp lệ.' }
    }
    if (quantity > product.stock) {
      return { conflict: true }
    }

    const subtotal = price * quantity
    if (!Number.isSafeInteger(subtotal) || !Number.isSafeInteger(total + subtotal)) {
      return { message: 'Tổng tiền đơn hàng không hợp lệ.' }
    }

    total += subtotal
    lines.push({
      productId,
      name: product.name,
      price: product.price,
      quantity,
      subtotal,
    })
  }

  return { lines, total }
}

const dashboardOrderStatuses = ['pending', 'processing', 'completed', 'cancelled']

function getSafeOrderStatus(value) {
  return dashboardOrderStatuses.includes(value) ? value : 'pending'
}

function getOrderLineSubtotal(item) {
  if (!item || !Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
    return 0
  }
  if (Number.isSafeInteger(item.subtotal) && item.subtotal >= 0) {
    return item.subtotal
  }

  const price = parseProductPrice(item.price)
  const subtotal = price === null ? 0 : price * item.quantity
  return Number.isSafeInteger(subtotal) ? subtotal : 0
}

function getOrderTotal(order) {
  if (Number.isSafeInteger(order?.total) && order.total >= 0) {
    return order.total
  }
  if (!Array.isArray(order?.items)) {
    return 0
  }
  return order.items.reduce((total, item) => total + getOrderLineSubtotal(item), 0)
}

function getOrderTimestamp(order) {
  const timestamp = Date.parse(order?.createdAt)
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function toDashboardOrder(order) {
  return {
    id: order.id,
    userId: order.userId,
    fullname: order.fullname,
    phone: order.phone,
    address: order.address,
    paymentMethod: order.paymentMethod,
    items: Array.isArray(order.items)
      ? order.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: getOrderLineSubtotal(item),
      }))
      : [],
    total: getOrderTotal(order),
    createdAt: order.createdAt,
    status: getSafeOrderStatus(order.status),
  }
}

function getStartOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function buildDashboardData(data, now = new Date()) {
  const users = Array.isArray(data.users) ? data.users : []
  const products = Array.isArray(data.products) ? data.products : []
  const orders = Array.isArray(data.orders) ? data.orders : []
  const startOfToday = getStartOfDay(now).getTime()
  const startOfWeekDate = getStartOfDay(now)
  const dayOfWeek = startOfWeekDate.getDay()
  startOfWeekDate.setDate(startOfWeekDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  const startOfWeek = startOfWeekDate.getTime()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const topProductsById = new Map()
  const status = { pending: 0, processing: 0, completed: 0, cancelled: 0 }
  let revenue = 0
  let itemsSold = 0
  let today = 0
  let week = 0
  let month = 0

  for (const order of orders) {
    const total = getOrderTotal(order)
    const timestamp = getOrderTimestamp(order)
    const orderStatus = getSafeOrderStatus(order.status)
    revenue += total
    status[orderStatus] += 1

    if (timestamp >= startOfToday) today += 1
    if (timestamp >= startOfWeek) week += 1
    if (timestamp >= startOfMonth) month += 1

    if (!Array.isArray(order.items)) continue
    for (const item of order.items) {
      if (!Number.isSafeInteger(item?.productId) || !Number.isSafeInteger(item.quantity) || item.quantity <= 0) continue

      const previous = topProductsById.get(item.productId) || {
        id: item.productId,
        name: typeof item.name === 'string' ? item.name : '',
        quantitySold: 0,
        revenue: 0,
      }
      previous.quantitySold += item.quantity
      previous.revenue += getOrderLineSubtotal(item)
      if (!previous.name && typeof item.name === 'string') previous.name = item.name
      topProductsById.set(item.productId, previous)
      itemsSold += item.quantity
    }
  }

  const inventory = products.reduce((total, product) => {
    const stock = parseProductStock(product.stock)
    return stock === null ? total : total + stock
  }, 0)

  return {
    statistics: {
      users: users.length,
      customers: users.filter((user) => user.role === 'customer').length,
      staff: users.filter((user) => user.role === 'staff').length,
      admins: users.filter((user) => user.role === 'admin').length,
      products: products.length,
      orders: orders.length,
      revenue,
      averageOrderValue: orders.length === 0 ? 0 : revenue / orders.length,
      itemsSold,
      inventory,
    },
    orders: { today, week, month },
    status,
    topProducts: [...topProductsById.values()]
      .sort((first, second) => second.quantitySold - first.quantitySold || second.revenue - first.revenue || first.id - second.id)
      .slice(0, 5),
    lowStock: products
      .map((product) => ({ id: product.id, name: product.name, stock: parseProductStock(product.stock) }))
      .filter((product) => product.stock !== null && product.stock <= 5)
      .sort((first, second) => first.stock - second.stock || first.id - second.id)
      .slice(0, 5),
    recentOrders: [...orders]
      .sort((first, second) => getOrderTimestamp(second) - getOrderTimestamp(first))
      .slice(0, 10)
      .map(toDashboardOrder),
  }
}

const authenticate = createAuthenticationMiddleware({ loadDb, sendJson })
const requireProductManager = requireAdminOrStaff(sendJson)
const requireOrderManager = requireAdminOrStaff(sendJson)
const requireAccountAdmin = requireAdmin(sendJson)
const requireDashboardManager = requireAdminOrStaff(sendJson)

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {})
    return
  }

  const url = new URL(req.url, `http://${req.headers.host}`)

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { ok: true, service: 'geargamingtmdt-api' })
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/products') {
    try {
      const data = await loadDb()
      sendJson(res, 200, { products: data.products })
    } catch (error) {
      console.error('Get products failed:', error)
      sendJson(res, 500, { message: 'Không thể tải sản phẩm lúc này.' })
    }
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/dashboard') {
    try {
      if (!(await authenticate(req, res)) || !requireDashboardManager(req, res)) {
        return
      }

      const data = await loadDb()
      sendJson(res, 200, buildDashboardData(data))
    } catch (error) {
      console.error('Get dashboard failed:', error)
      sendJson(res, 500, { message: 'Không thể tải dữ liệu Dashboard lúc này.' })
    }
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/products') {
    if (!(await authenticate(req, res)) || !requireProductManager(req, res)) {
      return
    }

    let body
    try {
      body = await readJsonBody(req)
    } catch {
      sendJson(res, 400, { message: 'Dữ liệu sản phẩm không hợp lệ.' })
      return
    }

    const validation = validateProductInput(body)
    if (validation.message) {
      sendJson(res, 400, { message: validation.message })
      return
    }

    try {
      const data = await loadDb()
      const product = { id: getNextProductId(data.products), ...validation.product }
      data.products.push(product)
      await saveDb(data)
      sendJson(res, 201, { product })
    } catch (error) {
      console.error('Create product failed:', error)
      sendJson(res, 500, { message: 'Không thể tạo sản phẩm lúc này.' })
    }
    return
  }

  const productIdMatch = url.pathname.match(/^\/api\/products\/(\d+)$/)
  if (productIdMatch && req.method === 'PUT') {
    if (!(await authenticate(req, res)) || !requireProductManager(req, res)) {
      return
    }

    let body
    try {
      body = await readJsonBody(req)
    } catch {
      sendJson(res, 400, { message: 'Dữ liệu sản phẩm không hợp lệ.' })
      return
    }

    const validation = validateProductInput(body)
    if (validation.message) {
      sendJson(res, 400, { message: validation.message })
      return
    }

    try {
      const data = await loadDb()
      const productId = Number(productIdMatch[1])
      const productIndex = data.products.findIndex((product) => product.id === productId)
      if (productIndex === -1) {
        sendJson(res, 404, { message: 'Không tìm thấy sản phẩm.' })
        return
      }

      const product = { ...data.products[productIndex], ...validation.product, id: productId }
      data.products[productIndex] = product
      await saveDb(data)
      sendJson(res, 200, { product })
    } catch (error) {
      console.error('Update product failed:', error)
      sendJson(res, 500, { message: 'Không thể cập nhật sản phẩm lúc này.' })
    }
    return
  }

  if (productIdMatch && req.method === 'DELETE') {
    if (!(await authenticate(req, res)) || !requireProductManager(req, res)) {
      return
    }

    try {
      const data = await loadDb()
      const productId = Number(productIdMatch[1])
      const productIndex = data.products.findIndex((product) => product.id === productId)
      if (productIndex === -1) {
        sendJson(res, 404, { message: 'Không tìm thấy sản phẩm.' })
        return
      }

      data.products.splice(productIndex, 1)
      data.carts = data.carts.flatMap((cart) => {
        const items = Array.isArray(cart.items)
          ? cart.items.filter((item) => (Number.isSafeInteger(item?.productId) ? item.productId : item?.id) !== productId)
          : []
        return items.length > 0 ? [{ ...cart, items }] : []
      })
      await saveDb(data)
      sendJson(res, 200, { ok: true })
    } catch (error) {
      console.error('Delete product failed:', error)
      sendJson(res, 500, { message: 'Không thể xóa sản phẩm lúc này.' })
    }
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/accounts') {
    try {
      if (!(await authenticate(req, res)) || !requireAccountAdmin(req, res)) {
        return
      }

      const data = await loadDb()
      sendJson(res, 200, { accounts: data.users.map(toSafeAccount) })
    } catch (error) {
      console.error('Get accounts failed:', error)
      sendJson(res, 500, { message: 'Không thể tải danh sách tài khoản lúc này.' })
    }
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/accounts') {
    if (!(await authenticate(req, res)) || !requireAccountAdmin(req, res)) {
      return
    }

    let body
    try {
      body = await readJsonBody(req)
    } catch {
      sendJson(res, 400, { message: 'Dữ liệu tài khoản không hợp lệ.' })
      return
    }

    const accountInput = {
      email: getTrimmedString(body.email).toLowerCase(),
      fullname: getTrimmedString(body.fullname).replace(/\s+/g, ' '),
      phone: getTrimmedString(body.phone),
      role: getTrimmedString(body.role) || 'staff',
      status: 'active',
      password: getTrimmedString(body.password),
    }
    const validation = validateAccountValues(accountInput, { requirePassword: true })
    if (validation.message) {
      sendJson(res, 400, { message: validation.message })
      return
    }

    try {
      const data = await loadDb()
      if (data.users.some((user) => user.email.toLowerCase() === accountInput.email)) {
        sendJson(res, 409, { message: 'Email này đã được đăng ký.' })
        return
      }

      const user = {
        id: randomUUID(),
        ...accountInput,
        password: await hashPassword(accountInput.password),
      }
      data.users.push(user)
      await saveDb(data)
      sendJson(res, 201, { account: toSafeAccount(user) })
    } catch (error) {
      console.error('Create account failed:', error)
      sendJson(res, 500, { message: 'Không thể tạo tài khoản lúc này.' })
    }
    return
  }

  const accountIdMatch = url.pathname.match(/^\/api\/accounts\/([^/]+)$/)
  if (accountIdMatch && req.method === 'GET') {
    try {
      if (!(await authenticate(req, res)) || !requireAccountAdmin(req, res)) {
        return
      }

      const data = await loadDb()
      const user = data.users.find((entry) => entry.id === accountIdMatch[1])
      if (!user) {
        sendJson(res, 404, { message: 'Không tìm thấy tài khoản.' })
        return
      }
      sendJson(res, 200, { account: toSafeAccount(user) })
    } catch (error) {
      console.error('Get account failed:', error)
      sendJson(res, 500, { message: 'Không thể tải tài khoản lúc này.' })
    }
    return
  }

  if (accountIdMatch && req.method === 'PUT') {
    if (!(await authenticate(req, res)) || !requireAccountAdmin(req, res)) {
      return
    }

    let body
    try {
      body = await readJsonBody(req)
    } catch {
      sendJson(res, 400, { message: 'Dữ liệu tài khoản không hợp lệ.' })
      return
    }

    try {
      const data = await loadDb()
      const user = data.users.find((entry) => entry.id === accountIdMatch[1])
      if (!user) {
        sendJson(res, 404, { message: 'Không tìm thấy tài khoản.' })
        return
      }

      const validation = getAccountUpdate(user, body)
      if (validation.message) {
        sendJson(res, 400, { message: validation.message })
        return
      }
      if (user.role === 'admin' && validation.account.role !== 'admin' && data.users.filter((entry) => entry.role === 'admin').length === 1) {
        sendJson(res, 409, { message: 'Không thể thay đổi vai trò của Admin cuối cùng.' })
        return
      }

      Object.assign(user, validation.account)
      if (user.status === 'locked') {
        data.sessions = data.sessions.filter((session) => session.userId !== user.id)
      }
      await saveDb(data)
      sendJson(res, 200, { account: toSafeAccount(user) })
    } catch (error) {
      console.error('Update account failed:', error)
      sendJson(res, 500, { message: 'Không thể cập nhật tài khoản lúc này.' })
    }
    return
  }

  if (accountIdMatch && req.method === 'DELETE') {
    try {
      if (!(await authenticate(req, res)) || !requireAccountAdmin(req, res)) {
        return
      }

      const data = await loadDb()
      const userIndex = data.users.findIndex((entry) => entry.id === accountIdMatch[1])
      if (userIndex === -1) {
        sendJson(res, 404, { message: 'Không tìm thấy tài khoản.' })
        return
      }

      const user = data.users[userIndex]
      if (user.id === req.user.id) {
        sendJson(res, 409, { message: 'Không thể xoá tài khoản đang đăng nhập.' })
        return
      }
      if (user.role === 'admin' && data.users.filter((entry) => entry.role === 'admin').length === 1) {
        sendJson(res, 409, { message: 'Không thể xoá tài khoản Admin cuối cùng.' })
        return
      }

      data.users.splice(userIndex, 1)
      data.sessions = data.sessions.filter((session) => session.userId !== user.id)
      data.carts = data.carts.filter((cart) => cart.userId !== user.id)
      await saveDb(data)
      sendJson(res, 200, { ok: true })
    } catch (error) {
      console.error('Delete account failed:', error)
      sendJson(res, 500, { message: 'Không thể xoá tài khoản lúc này.' })
    }
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/register') {
    try {
      const body = await readJsonBody(req)
      const data = await loadDb()
      const fullname = getTrimmedString(body.fullname).replace(/\s+/g, ' ')
      const phone = getTrimmedString(body.phone)
      const email = getTrimmedString(body.email).toLowerCase()
      const password = getTrimmedString(body.password)

      if (!email || !password || !fullname || !phone) {
        sendJson(res, 400, { message: 'Vui lòng điền đầy đủ thông tin.' })
        return
      }
      if (!emailPattern.test(email)) {
        sendJson(res, 400, { message: 'Email không đúng định dạng.' })
        return
      }
      if (password.length < 6) {
        sendJson(res, 400, { message: 'Mật khẩu cần ít nhất 6 ký tự.' })
        return
      }
      if (!vietnamesePhonePattern.test(phone)) {
        sendJson(res, 400, { message: 'Số điện thoại không hợp lệ.' })
        return
      }
      if (fullname.length < 2 || !fullNamePattern.test(fullname)) {
        sendJson(res, 400, { message: 'Họ và tên không hợp lệ.' })
        return
      }
      if (data.users.some((user) => typeof user.email === 'string' && user.email.toLowerCase() === email)) {
        sendJson(res, 409, { message: 'Email này đã được đăng ký.' })
        return
      }

      const user = {
        id: randomUUID(),
        fullname,
        phone,
        email,
        password: await hashPassword(password),
        role: 'customer',
      }
      const token = randomUUID()
      data.users.push(user)
      data.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() })
      await saveDb(data)
      sendJson(res, 201, { user: { id: user.id, fullname: user.fullname, phone: user.phone, email: user.email, role: user.role }, token })
    } catch (error) {
      console.error('Register failed:', error)
      if (error.message === 'Invalid JSON body' || error.message === 'JSON body too large') {
        sendJson(res, 400, { message: 'Dữ liệu đăng ký không hợp lệ.' })
      } else {
        sendJson(res, 500, { message: 'Không thể đăng ký tài khoản lúc này. Vui lòng thử lại.' })
      }
    }
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    let body
    try {
      body = await readJsonBody(req)
    } catch {
      sendJson(res, 400, { message: 'Dữ liệu đăng nhập không hợp lệ.' })
      return
    }

    const email = getTrimmedString(body.email).toLowerCase()
    const password = getTrimmedString(body.password)
    if (!email || !password) {
      sendJson(res, 400, { message: 'Vui lòng nhập email và mật khẩu.' })
      return
    }
    if (!emailPattern.test(email)) {
      sendJson(res, 400, { message: 'Email không đúng định dạng.' })
      return
    }
    if (password.length < 6) {
      sendJson(res, 400, { message: 'Mật khẩu cần ít nhất 6 ký tự.' })
      return
    }

    try {
      const data = await loadDb()
      const user = data.users.find((entry) => typeof entry.email === 'string' && entry.email.toLowerCase() === email)
      if (!user || !(await verifyPassword(password, user.password))) {
        sendJson(res, 401, { message: 'Email hoặc mật khẩu không đúng.' })
        return
      }
      if (user.status === 'locked') {
        sendJson(res, 403, { message: 'Tài khoản đã bị khóa.' })
        return
      }

      const token = randomUUID()
      if (!isScryptHash(user.password)) {
        user.password = await hashPassword(password)
      }
      data.sessions = data.sessions.filter((session) => session.userId !== user.id)
      data.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() })
      await saveDb(data)
      sendJson(res, 200, { user: { id: user.id, fullname: user.fullname, phone: user.phone, email: user.email, role: user.role }, token })
    } catch (error) {
      console.error('Login failed:', error)
      sendJson(res, 500, { message: 'Không thể đăng nhập lúc này. Vui lòng thử lại.' })
    }
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/logout') {
    try {
      if (!(await authenticate(req, res))) {
        return
      }

      const data = await loadDb()
      data.sessions = data.sessions.filter((session) => session.token !== req.authToken)
      await saveDb(data)
      sendJson(res, 200, { ok: true })
    } catch (error) {
      console.error('Logout failed:', error)
      sendJson(res, 500, { message: 'Không thể đăng xuất lúc này. Vui lòng thử lại.' })
    }
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/auth/me') {
    if (!(await authenticate(req, res))) {
      return
    }
    sendJson(res, 200, { user: req.user })
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/cart') {
    try {
      if (!(await authenticate(req, res))) {
        return
      }

      const data = await loadDb()
      const cart = data.carts.find((entry) => entry.userId === req.user.id)
      sendJson(res, 200, { items: getCartResponseItems(cart?.items || [], data.products) })
    } catch (error) {
      console.error('Get cart failed:', error)
      sendJson(res, 500, { message: 'Không thể tải giỏ hàng lúc này.' })
    }
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/cart') {
    if (!(await authenticate(req, res))) {
      return
    }

    let body
    try {
      body = await readJsonBody(req)
    } catch {
      sendJson(res, 400, { message: 'Dữ liệu giỏ hàng không hợp lệ.' })
      return
    }

    try {
      const data = await loadDb()
      const validation = validateCartItems(body.items, data.products)
      if (validation.message) {
        sendJson(res, 400, { message: validation.message })
        return
      }

      const existing = data.carts.find((entry) => entry.userId === req.user.id)
      if (validation.items.length === 0) {
        data.carts = data.carts.filter((entry) => entry.userId !== req.user.id)
      } else if (existing) {
        existing.items = validation.items
      } else {
        data.carts.push({ userId: req.user.id, items: validation.items })
      }

      await saveDb(data)
      sendJson(res, 200, { items: getCartResponseItems(validation.items, data.products) })
    } catch (error) {
      console.error('Save cart failed:', error)
      sendJson(res, 500, { message: 'Không thể lưu giỏ hàng lúc này.' })
    }
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/orders') {
    if (!(await authenticate(req, res))) {
      return
    }

    let body
    try {
      body = await readJsonBody(req)
    } catch {
      sendJson(res, 400, { message: 'Dữ liệu đơn hàng không hợp lệ.' })
      return
    }

    try {
      const data = await loadDb()
      const cart = data.carts.find((entry) => entry.userId === req.user.id)
      if (!cart) {
        sendJson(res, 400, { message: 'Giỏ hàng không tồn tại.' })
        return
      }

      const orderCalculation = createOrderLines(cart.items, data.products)
      if (orderCalculation.conflict) {
        sendJson(res, 409, { message: 'Sản phẩm không đủ tồn kho.' })
        return
      }
      if (orderCalculation.message) {
        sendJson(res, 400, { message: orderCalculation.message })
        return
      }

      for (const line of orderCalculation.lines) {
        const product = data.products.find((entry) => entry.id === line.productId)
        product.stock -= line.quantity
      }

      const order = {
        id: randomUUID(),
        userId: req.user.id,
        fullname: getTrimmedString(body.fullname) || req.user.fullname,
        phone: getTrimmedString(body.phone) || req.user.phone || '',
        address: getTrimmedString(body.address),
        paymentMethod: getTrimmedString(body.paymentMethod) || 'cod',
        items: orderCalculation.lines,
        total: orderCalculation.total,
        createdAt: new Date().toISOString(),
        status: 'pending',
      }

      data.orders.push(order)
      data.carts = data.carts.filter((entry) => entry.userId !== req.user.id)
      await saveDb(data)
      sendJson(res, 201, { order })
    } catch (error) {
      console.error('Create order failed:', error)
      sendJson(res, 500, { message: 'Không thể tạo đơn hàng lúc này.' })
    }
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/orders') {
    try {
      if (!(await authenticate(req, res))) {
        return
      }

      const data = await loadDb()
      const isOrderManager = req.user.role === 'admin' || req.user.role === 'staff'
      if (isOrderManager && !requireOrderManager(req, res)) {
        return
      }

      const orders = isOrderManager
        ? data.orders
        : data.orders.filter((entry) => entry.userId === req.user.id)
      sendJson(res, 200, { orders })
    } catch (error) {
      console.error('Get orders failed:', error)
      sendJson(res, 500, { message: 'Không thể tải đơn hàng lúc này.' })
    }
    return
  }

  sendJson(res, 404, { message: 'Route not found.' })
})

server.listen(port, () => {
  console.log(`GearGamingTMDT API listening on http://localhost:${port}`)
})
