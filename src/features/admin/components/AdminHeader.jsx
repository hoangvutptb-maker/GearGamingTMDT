/**
 * src/features/admin/components/AdminHeader.jsx
 * Header trên của admin dashboard
 */

import { LogOut } from 'lucide-react'

/**
 * AdminHeader - Đầu trang admin
 * Hiển thị lời chào + nút logout
 */
export default function AdminHeader({ currentUser, onLogout }) {
  return (
    <header className="admin-header">
      <div>
        <h3>Xin chào, {currentUser?.fullname || 'Admin'}</h3>
        <p>Chào mừng trở lại bảng điều khiển quản trị GEARMAX</p>
      </div>
      <button className="logout-btn" onClick={onLogout} type="button">
        <LogOut size={20} />
        Đăng xuất
      </button>
    </header>
  )
}
