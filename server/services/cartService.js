import { loadDb, saveDb } from '../database.js'
import { validateCartItems } from '../utils/validators.js'

function getCartResponseItems(cartItems, products) {
  const productsById = new Map(products.map((product) => [product.id, product]))
  return cartItems.flatMap((item) => {
    const productId = Number.isSafeInteger(item.productId) ? item.productId : item.id
    const product = productsById.get(productId)
    return product ? [{ ...product, quantity: item.quantity }] : []
  })
}

export async function getCart(userId) {
  const data = await loadDb()
  const cart = data.carts.find((entry) => entry.userId === userId)
  return { items: getCartResponseItems(cart?.items || [], data.products) }
}

export async function saveCart(userId, items) {
  const data = await loadDb()
  const validation = validateCartItems(items, data.products)
  if (validation.message) return { status: 400, payload: { message: validation.message } }
  const existing = data.carts.find((entry) => entry.userId === userId)
  if (validation.items.length === 0) data.carts = data.carts.filter((entry) => entry.userId !== userId)
  else if (existing) existing.items = validation.items
  else data.carts.push({ userId, items: validation.items })
  await saveDb(data)
  return { status: 200, payload: { items: getCartResponseItems(validation.items, data.products) } }
}
