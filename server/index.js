import { createServer } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, 'data.json')
const port = Number(process.env.PORT || 3001)

const defaultProducts = [
  {
    id: 1,
    name: 'Màn hình ViewSonic VX2528 25" IPS 180Hz',
    price: '2.590.000đ',
    oldPrice: '3.790.000đ',
    sale: '-32%',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=88',
  },
  {
    id: 2,
    name: 'Bàn phím cơ AKKO 5075B Plus Blue Ocean',
    price: '1.690.000đ',
    oldPrice: '2.190.000đ',
    sale: '-23%',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=88',
  },
  {
    id: 3,
    name: 'Chuột Logitech G Pro X Superlight 2',
    price: '3.190.000đ',
    oldPrice: '3.990.000đ',
    sale: '-20%',
    image: 'https://images.unsplash.com/photo-1629429407759-01cd3d7cfb38?auto=format&fit=crop&w=900&q=88',
  },
  {
    id: 4,
    name: 'Tai nghe HyperX Cloud III Wireless',
    price: '2.890.000đ',
    oldPrice: '3.590.000đ',
    sale: '-19%',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&q=88',
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
  return JSON.parse(content)
}

let dbCache = null

async function loadDb() {
  if (!dbCache) {
    dbCache = await ensureDb()
  }
  return dbCache
}

async function saveDb(data) {
  dbCache = data
  await writeFile(dbPath, JSON.stringify(data, null, 2))
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' })
  res.end(JSON.stringify(payload))
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      if (!body) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

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
    const data = await loadDb()
    sendJson(res, 200, { products: data.products })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/register') {
    const body = await readJsonBody(req)
    const data = await loadDb()
    const email = (body.email || '').trim().toLowerCase()
    if (!email || !body.password || !body.fullname || !body.phone) {
      sendJson(res, 400, { message: 'Vui lòng điền đầy đủ thông tin.' })
      return
    }
    if (data.users.some((user) => user.email.toLowerCase() === email)) {
      sendJson(res, 409, { message: 'Email này đã được đăng ký.' })
      return
    }
    const user = {
      id: randomUUID(),
      fullname: body.fullname.trim(),
      phone: body.phone.trim(),
      email,
      password: body.password.trim(),
      role: 'customer',
    }
    const token = randomUUID()
    data.users.push(user)
    data.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() })
    await saveDb(data)
    sendJson(res, 201, { user: { id: user.id, fullname: user.fullname, phone: user.phone, email: user.email, role: user.role }, token })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    const body = await readJsonBody(req)
    const data = await loadDb()
    const email = (body.email || '').trim().toLowerCase()
    const user = data.users.find((entry) => entry.email.toLowerCase() === email && entry.password === (body.password || '').trim())
    if (!user) {
      sendJson(res, 401, { message: 'Email hoặc mật khẩu không đúng.' })
      return
    }
    const token = randomUUID()
    data.sessions = data.sessions.filter((session) => session.userId !== user.id)
    data.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() })
    await saveDb(data)
    sendJson(res, 200, { user: { id: user.id, fullname: user.fullname, phone: user.phone, email: user.email, role: user.role }, token })
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/auth/me') {
    const token = req.headers.authorization?.replace('Bearer ', '') || ''
    const data = await loadDb()
    const session = data.sessions.find((entry) => entry.token === token)
    if (!session) {
      sendJson(res, 401, { message: 'Token không hợp lệ.' })
      return
    }
    const user = data.users.find((entry) => entry.id === session.userId)
    if (!user) {
      sendJson(res, 404, { message: 'Không tìm thấy người dùng.' })
      return
    }
    sendJson(res, 200, { user: { id: user.id, fullname: user.fullname, phone: user.phone, email: user.email, role: user.role } })
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/cart') {
    const userId = url.searchParams.get('userId')
    const data = await loadDb()
    const cart = data.carts.find((entry) => entry.userId === userId)
    sendJson(res, 200, { items: cart?.items || [] })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/cart') {
    const body = await readJsonBody(req)
    const data = await loadDb()
    const existing = data.carts.find((entry) => entry.userId === body.userId)
    if (existing) {
      existing.items = body.items || []
    } else {
      data.carts.push({ userId: body.userId, items: body.items || [] })
    }
    await saveDb(data)
    sendJson(res, 200, { ok: true })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/orders') {
    const body = await readJsonBody(req)
    const data = await loadDb()
    const order = {
      id: randomUUID(),
      userId: body.userId || 'guest',
      fullname: body.fullname || 'Khách vãng lai',
      phone: body.phone || '',
      address: body.address || '',
      paymentMethod: body.paymentMethod || 'cod',
      items: body.items || [],
      total: body.total || 0,
      createdAt: new Date().toISOString(),
      status: 'pending',
    }
    data.orders.push(order)
    await saveDb(data)
    sendJson(res, 201, { order })
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/orders') {
    const userId = url.searchParams.get('userId')
    const data = await loadDb()
    const orders = data.orders.filter((entry) => entry.userId === userId)
    sendJson(res, 200, { orders })
    return
  }

  sendJson(res, 404, { message: 'Route not found.' })
})

server.listen(port, () => {
  console.log(`GearGamingTMDT API listening on http://localhost:${port}`)
})
