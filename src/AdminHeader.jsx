import { LogOut } from 'lucide-react'

/**
 * AdminHeader - Phần header của admin dashboard
 * Hiển thị lời chào và nút đăng xuất
 */
export default function AdminHeader({ currentUser, onLogout }) {
  return (
    <header className="admin-header">
      <div className="header-left">
        <h1>Xin chào, {currentUser?.fullname || 'Admin'}</h1>
        <p>Chào mừng trở lại bảng điều khiển quản trị GEARMAX</p>
      </div>
      <button className="logout-btn" type="button" onClick={onLogout} title="Đăng xuất">
        <LogOut size={20} />
        <span>Đăng xuất</span>
      </button>
    </header>
  )
}
