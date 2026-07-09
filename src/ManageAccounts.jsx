import { useState } from 'react'
import { Plus, Lock, Unlock, X } from 'lucide-react'

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      fullname: 'Nguyễn Văn A',
      email: 'admin@gearmax.com',
      role: 'admin',
      status: 'active',
    },
    {
      id: 2,
      fullname: 'Trần Thị B',
      email: 'staff1@gearmax.com',
      role: 'staff',
      status: 'active',
    },
    {
      id: 3,
      fullname: 'Lê Văn C',
      email: 'user1@gearmax.com',
      role: 'user',
      status: 'locked',
    },
  ])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '' })

  const handleAddStaff = () => {
    setFormData({ fullname: '', email: '', password: '' })
    setShowForm(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveStaff = (e) => {
    e.preventDefault()
    if (!formData.fullname || !formData.email || !formData.password) {
      return
    }

    setAccounts((prev) => [
      ...prev,
      {
        id: Date.now(),
        fullname: formData.fullname,
        email: formData.email,
        role: 'staff',
        status: 'active',
      },
    ])
    setShowForm(false)
  }

  const toggleAccountStatus = (id) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === id
          ? {
              ...account,
              status: account.status === 'active' ? 'locked' : 'active',
            }
          : account,
      ),
    )
  }

  return (
    <div className="manage-accounts">
      <div className="products-header">
        <div>
          <h2>Quản lý tài khoản</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>
            Tạo tài khoản Staff mới và quản lý trạng thái user.
          </p>
        </div>
        <button className="btn-primary" onClick={handleAddStaff} type="button">
          <Plus size={18} />
          <span>Thêm tài khoản Staff</span>
        </button>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td className="product-id">#{account.id}</td>
                <td className="product-name">{account.fullname}</td>
                <td>{account.email}</td>
                <td>{account.role === 'admin' ? 'Admin' : account.role === 'staff' ? 'Staff' : 'User'}</td>
                <td>
                  <span className={`status-badge ${account.status === 'active' ? 'active' : 'hidden'}`}>
                    {account.status === 'active' ? 'Đang hoạt động' : 'Bị khóa'}
                  </span>
                </td>
                <td className="product-actions">
                  <button
                    className="action-btn toggle"
                    type="button"
                    onClick={() => toggleAccountStatus(account.id)}
                    title={account.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                  >
                    {account.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm tài khoản Staff mới</h3>
              <button className="modal-close" type="button" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="product-form" onSubmit={handleSaveStaff}>
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="Nhập họ tên"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button className="btn-primary" type="submit">
                  Lưu tài khoản
                </button>
                <button
                  type="button"
                  className="action-btn delete"
                  onClick={() => setShowForm(false)}
                  style={{ width: 'auto', padding: '10px 18px' }}
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
