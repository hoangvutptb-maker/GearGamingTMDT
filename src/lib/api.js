const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'

function getStoredToken() {
  return typeof window === 'undefined' ? '' : localStorage.getItem('gearmax_token') || ''
}

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

export async function getDashboard() {
  return request('/api/dashboard', { token: getStoredToken() })
}

export async function createProduct(payload) {
  return request('/api/products', { method: 'POST', body: JSON.stringify(payload), token: getStoredToken() })
}

export async function updateProduct(id, payload) {
  return request(`/api/products/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(payload), token: getStoredToken() })
}

export async function deleteProduct(id) {
  return request(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE', token: getStoredToken() })
}

export async function getAccounts() {
  const data = await request('/api/accounts', { token: getStoredToken() })
  return data.accounts || []
}

export async function createAccount(payload) {
  return request('/api/accounts', { method: 'POST', body: JSON.stringify(payload), token: getStoredToken() })
}

export async function updateAccount(id, payload) {
  return request(`/api/accounts/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(payload), token: getStoredToken() })
}

export async function deleteAccount(id) {
  return request(`/api/accounts/${encodeURIComponent(id)}`, { method: 'DELETE', token: getStoredToken() })
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

export async function saveCart(items) {
  const cartItems = items.map((item) => ({ productId: item.id, quantity: item.quantity }))
  return request('/api/cart', { method: 'POST', body: JSON.stringify({ items: cartItems }), token: getStoredToken() })
}

export async function getCart() {
  return request('/api/cart', { token: getStoredToken() })
}

export async function placeOrder(payload) {
  return request('/api/orders', { method: 'POST', body: JSON.stringify(payload), token: getStoredToken() })
}

export async function getOrders() {
  return request('/api/orders', { token: getStoredToken() })
}
