import { useState } from 'react'
import { Plus, Edit, Eye, EyeOff, Trash, X } from 'lucide-react'

/**
 * ManageProducts - Trang quản lý sản phẩm CRUD
 * Mock data: danh sách sản phẩm với CRUD operations
 */
export default function ManageProducts() {
  // Mock dữ liệu sản phẩm ban đầu
  const initialProducts = [
    {
      id: 1,
      name: 'Laptop Gaming ASUS ROG G16',
      category: 'Laptop Gaming',
      price: '45.990.000',
      stock: 12,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=200&q=88',
      specs: { cpu: 'Intel i9', gpu: 'RTX 4090', ram: '32GB' },
    },
    {
      id: 2,
      name: 'Bàn phím cơ AKKO 5075B Plus',
      category: 'Bàn phím',
      price: '1.690.000',
      stock: 48,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=200&q=88',
      specs: { switch: 'Akko Ocean Blue', layout: 'Gasket', rgb: 'RGB' },
    },
    {
      id: 3,
      name: 'Chuột Logitech G Pro X Superlight 2',
      category: 'Chuột',
      price: '3.190.000',
      stock: 25,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1629429407759-01cd3d7cfb38?auto=format&fit=crop&w=200&q=88',
      specs: { weight: '63g', dpi: '32000', battery: '90h' },
    },
    {
      id: 4,
      name: 'Tai nghe HyperX Cloud III',
      category: 'Tai nghe',
      price: '2.890.000',
      stock: 0,
      status: 'hidden',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=200&q=88',
      specs: { type: 'Over-ear', connection: 'Wireless', battery: '30h' },
    },
  ]

  const [products, setProducts] = useState(initialProducts)
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

  // Hàm mở form thêm mới
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

  // Hàm mở form sửa
  const handleEditProduct = (product) => {
    setEditingId(product.id)
    setFormData(product)
    setShowForm(true)
  }

  // Hàm xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Hàm lưu sản phẩm (thêm mới hoặc sửa)
  const handleSaveProduct = (e) => {
    e.preventDefault()

    if (editingId) {
      // Cập nhật sản phẩm hiện tại
      setProducts(
        products.map((p) => (p.id === editingId ? { ...formData, id: editingId } : p))
      )
    } else {
      // Thêm sản phẩm mới
      setProducts([...products, { ...formData, id: Date.now() }])
    }

    setShowForm(false)
  }

  // Hàm đảo ngược trạng thái (hiển thị/ẩn)
  const handleToggleStatus = (id) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, status: p.status === 'active' ? 'hidden' : 'active' } : p
      )
    )
  }

  // Hàm xóa sản phẩm
  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div className="manage-products">
      <div className="products-header">
        <h2>Quản lý sản phẩm</h2>
        <button className="btn-primary" onClick={handleAddProduct}>
          <Plus size={18} />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* Bảng sản phẩm */}
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
                <td>{product.category}</td>
                <td className="product-price">{parseInt(product.price).toLocaleString('vi-VN')}đ</td>
                <td className="product-stock">{product.stock}</td>
                <td>
                  <span
                    className={`status-badge ${product.status}`}
                  >
                    {product.status === 'active' ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td className="product-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => handleEditProduct(product)}
                    title="Chỉnh sửa"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="action-btn toggle"
                    onClick={() => handleToggleStatus(product.id)}
                    title={product.status === 'active' ? 'Ẩn sản phẩm' : 'Hiển thị sản phẩm'}
                  >
                    {product.status === 'active' ? (
                      <Eye size={16} />
                    ) : (
                      <EyeOff size={16} />
                    )}
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteProduct(product.id)}
                    title="Xóa"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal form thêm/sửa sản phẩm */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
              >
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
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
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
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
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
                <button type="submit" className="btn-save">
                  Lưu sản phẩm
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
