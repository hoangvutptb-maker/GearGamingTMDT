import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'data.json')
let dbCache = null

const defaultProducts = [
  { id: 1, name: 'Màn hình ViewSonic VX2528 25" IPS 180Hz', price: '2.590.000đ', oldPrice: '3.790.000đ', sale: '-32%', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=88', stock: 10 },
  { id: 2, name: 'Bàn phím cơ AKKO 5075B Plus Blue Ocean', price: '1.690.000đ', oldPrice: '2.190.000đ', sale: '-23%', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=88', stock: 10 },
  { id: 3, name: 'Chuột Logitech G Pro X Superlight 2', price: '3.190.000đ', oldPrice: '3.990.000đ', sale: '-20%', image: 'https://images.unsplash.com/photo-1629429407759-01cd3d7cfb38?auto=format&fit=crop&w=900&q=88', stock: 10 },
  { id: 4, name: 'Tai nghe HyperX Cloud III Wireless', price: '2.890.000đ', oldPrice: '3.590.000đ', sale: '-19%', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&q=88', stock: 10 },
]

function validateDatabase(data) {
  const requiredCollections = ['users', 'sessions', 'carts', 'orders', 'products']
  if (!data || typeof data !== 'object' || Array.isArray(data) || requiredCollections.some((key) => !Array.isArray(data[key]))) throw new Error('Invalid database structure')
  return data
}

async function ensureDb() {
  if (!existsSync(dbPath)) {
    await mkdir(__dirname, { recursive: true })
    const initial = { users: [{ id: 'admin-1', fullname: 'Admin Gearmax', phone: '0123456789', email: 'admin@gearmax.com', password: 'admin123', role: 'admin' }, { id: 'staff-1', fullname: 'Staff Gearmax', phone: '0123456790', email: 'staff@gearmax.com', password: 'staff123', role: 'staff' }], sessions: [], carts: [], orders: [], products: defaultProducts }
    await writeFile(dbPath, JSON.stringify(initial, null, 2))
    return initial
  }
  const content = await readFile(dbPath, 'utf8')
  return validateDatabase(JSON.parse(content.replace(/^\uFEFF/, '')))
}

export async function loadDb() {
  if (!dbCache) dbCache = await ensureDb()
  return validateDatabase(dbCache)
}

export async function saveDb(data) {
  const validData = validateDatabase(data)
  await writeFile(dbPath, JSON.stringify(validData, null, 2))
  dbCache = validData
}
