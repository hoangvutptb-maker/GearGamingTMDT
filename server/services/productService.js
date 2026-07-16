import { loadDb, saveDb } from '../database.js'
import { validateProductInput } from '../utils/validators.js'

const getNextProductId = (products) => products.reduce((highest, product) => Number.isSafeInteger(product.id) && product.id > highest ? product.id : highest, 0) + 1

export async function getProducts() {
  return (await loadDb()).products
}

export async function createProduct(body) {
  const validation = validateProductInput(body)
  if (validation.message) return { status: 400, payload: { message: validation.message } }
  const data = await loadDb()
  const product = { id: getNextProductId(data.products), ...validation.product }
  data.products.push(product)
  await saveDb(data)
  return { status: 201, payload: { product } }
}

export async function updateProduct(id, body) {
  const validation = validateProductInput(body)
  if (validation.message) return { status: 400, payload: { message: validation.message } }
  const data = await loadDb()
  const productIndex = data.products.findIndex((product) => product.id === id)
  if (productIndex === -1) return { status: 404, payload: { message: 'Không tìm thấy sản phẩm.' } }
  const product = { ...data.products[productIndex], ...validation.product, id }
  data.products[productIndex] = product
  await saveDb(data)
  return { status: 200, payload: { product } }
}

export async function deleteProduct(id) {
  const data = await loadDb()
  const productIndex = data.products.findIndex((product) => product.id === id)
  if (productIndex === -1) return { status: 404, payload: { message: 'Không tìm thấy sản phẩm.' } }
  data.products.splice(productIndex, 1)
  data.carts = data.carts.flatMap((cart) => {
    const items = Array.isArray(cart.items) ? cart.items.filter((item) => (Number.isSafeInteger(item?.productId) ? item.productId : item?.id) !== id) : []
    return items.length > 0 ? [{ ...cart, items }] : []
  })
  await saveDb(data)
  return { status: 200, payload: { ok: true } }
}
