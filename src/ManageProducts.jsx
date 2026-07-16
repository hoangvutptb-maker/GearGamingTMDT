import { useEffect, useState } from 'react'
import { Plus, Edit, Eye, EyeOff, Trash, X } from 'lucide-react'
import { createProduct, deleteProduct, getProducts, updateProduct } from './lib/api'

function normalizeProduct(product) {
  return {
    ...product,
    category: product.category || '',
    price: Number(String(product.price || '').replace(/[^\d]/g, '')) || 0,
    stock: Number.isInteger(product.stock) ? product.stock : 0,
    status: product.status === 'hidden' ? 'hidden' : 'active',
    image: product.image || '',
    specs: product.specs || {},
  }
}

/**
 * ManageProducts - Trang quản lý sản phẩm CRUD qua API.
 */
export default function ManageProducts() {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    status: 'active',
    image: '',
    specs: { cpu: '', gpu: '', ram: '' },
  })

  useEffect(() => {
    getProducts()
      .then((items) => setProducts(items.map(normalizeProduct)))
      .catch((error) => alert(error.message))
  }, [])

  const handleAddProduct = () => {
    setEditingId(null)
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      status: 'active',
      image: '',
      specs: {},
    })
    setShowForm(true)
  }

  const handleEditProduct = (product) => {
    setEditingId(product.id)
    setFormData(normalizeProduct(product))
    setShowForm(true)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSaveProduct = async (event) => {
    event.preventDefault()

    try {
      if (editingId !== null) {
        const response = await updateProduct(editingId, formData)
        const updatedProduct = normalizeProduct(response.product)
        setProducts((current) => current.map((product) => (
          product.id === editingId ? updatedProduct : product
        )))
      } else {
        const response = await createProduct(formData)
        setProducts((current) => [...current, normalizeProduct(response.product)])
      }

      setShowForm(false)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleToggleStatus = async (product) => {
    try {
      const response = await updateProduct(product.id, {
        ...product,
        status: product.status === 'active' ? 'hidden' : 'active',
      })
      const updatedProduct = normalizeProduct(response.product)
      setProducts((current) => current.map((item) => (
        item.id === product.id ? updatedProduct : item
      )))
    } catch (error) {
      alert(error.message)
    }
  }

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id)
      setProducts((current) => current.filter((product) => product.id !== id))
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="manage-products">
      <div className="products-header">
        <h2>Quản lý sản phẩm</h2>
        <button className="btn-primary" onClick={handleAddProduct} type="button">
          <Plus size={18} />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá (VNĐ)</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="product-id">#{product.id}</td>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-thumb"
                  />
                </td>
                <td className="product-name">{product.name}</td>
                <td>{product.category || 'Chưa phân loại'}</td>
                <td className="product-price">{product.price.toLocaleString('vi-VN')}đ</td>
                <td className="product-stock">{product.stock}</td>
                <td>
                  <span className={`status-badge ${product.status}`}>
                    {product.status === 'active' ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td className="product-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => handleEditProduct(product)}
                    title="Chỉnh sửa"
                    type="button"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="action-btn toggle"
                    onClick={() => handleToggleStatus(product)}
                    title={product.status === 'active' ? 'Ẩn sản phẩm' : 'Hiển thị sản phẩm'}
                    type="button"
                  >
                    {product.status === 'active' ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteProduct(product.id)}
                    title="Xóa"
                    type="button"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId !== null ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button className="modal-close" onClick={() => setShowForm(false)} type="button">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="product-form">
              <div className="form-group">
                <label>Tên sản phẩm *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Danh mục *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} required>
                    <option value="">Chọn danh mục</option>
                    <option value="Laptop Gaming">Laptop Gaming</option>
                    <option value="Bàn phím">Bàn phím</option>
                    <option value="Chuột">Chuột</option>
                    <option value="Tai nghe">Tai nghe</option>
                    <option value="Màn hình">Màn hình</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Giá (VNĐ) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Nhập giá"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tồn kho *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="Số lượng"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Trạng thái *</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="active">Hiển thị</option>
                    <option value="hidden">Ẩn</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Link ảnh</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Nhập URL hình ảnh"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">Lưu sản phẩm</button>
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
