import { useEffect, useState } from 'react'
import { Plus, Lock, Unlock, X } from 'lucide-react'
import { createAccount, getAccounts, updateAccount } from './lib/api'

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ fullname: '', phone: '', email: '', password: '' })

  useEffect(() => {
    getAccounts()
      .then(setAccounts)
      .catch((error) => alert(error.message))
  }, [])

  const handleAddStaff = () => {
    setFormData({ fullname: '', phone: '', email: '', password: '' })
    setShowForm(true)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSaveStaff = async (event) => {
    event.preventDefault()

    try {
      const response = await createAccount({ ...formData, role: 'staff' })
      setAccounts((current) => [...current, response.account])
      setShowForm(false)
    } catch (error) {
      alert(error.message)
    }
  }

  const toggleAccountStatus = async (account) => {
    try {
      const response = await updateAccount(account.id, {
        status: account.status === 'active' ? 'locked' : 'active',
      })
      setAccounts((current) => current.map((item) => (
        item.id === account.id ? response.account : item
      )))
    } catch (error) {
      alert(error.message)
    }
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
                    onClick={() => toggleAccountStatus(account)}
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
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm tài khoản Staff mới</h3>
              <button className="modal-close" type="button" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="product-form" onSubmit={handleSaveStaff}>
              <div className="form-group">
                <label>Họ và tên</label>
                <input name="fullname" value={formData.fullname} onChange={handleInputChange} placeholder="Nhập họ tên" required />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0901234567" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Nhập email" required />
              </div>
              <div className="form-group">
                <label>Mật khẩu</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Nhập mật khẩu" required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button className="btn-primary" type="submit">Lưu tài khoản</button>
                <button type="button" className="action-btn delete" onClick={() => setShowForm(false)} style={{ width: 'auto', padding: '10px 18px' }}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
