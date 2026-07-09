const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.message || 'Request failed')
  }
  return payload
}

export async function getProducts() {
  const data = await request('/api/products')
  return data.products || []
}

export async function registerUser(payload) {
  return request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) })
}

export async function loginUser(payload) {
  return request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) })
}

export async function getCurrentUser(token) {
  return request('/api/auth/me', { method: 'GET', token })
}

export async function saveCart(userId, items) {
  return request('/api/cart', { method: 'POST', body: JSON.stringify({ userId, items }) })
}

export async function getCart(userId) {
  return request(`/api/cart?userId=${encodeURIComponent(userId)}`)
}

export async function placeOrder(payload) {
  return request('/api/orders', { method: 'POST', body: JSON.stringify(payload) })
}

export async function getOrders(userId) {
  return request(`/api/orders?userId=${encodeURIComponent(userId)}`)
}
