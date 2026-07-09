/**
 * src/features/admin/components/AdminSidebar.jsx
 * Menu điều hướng bên trái
 */

import { LayoutDashboard, Gamepad2, ShoppingBag } from 'lucide-react'

/**
 * AdminSidebar - Menu điều hướng
 * 3 items: Dashboard, Products, Orders
 */
export default function AdminSidebar({ activeTab, onTabChange }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      icon: LayoutDashboard,
      desc: 'Xem tổng quát doanh số',
    },
    {
      id: 'products',
      label: 'Quản lý sản phẩm',
      icon: Gamepad2,
      desc: 'CRUD sản phẩm',
    },
    {
      id: 'orders',
      label: 'Quản lý đơn hàng',
      icon: ShoppingBag,
      desc: 'Quản lý trạng thái',
    },
  ]

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="sidebar-brand">
        <div className="logo-triangle">
          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #0DD3FF, #00D4FF)',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        </div>
        <div>
          <h2>GEARMAX</h2>
          <small>Admin Panel</small>
        </div>
      </div>

      {/* Menu items */}
      <nav className="sidebar-menu">
        {menuItems.map(({ id, label, icon: Icon, desc }) => (
          <button
            key={id}
            className={`menu-item ${activeTab === id ? 'active' : ''}`}
            onClick={() => onTabChange(id)}
            type="button"
            title={desc}
          >
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
