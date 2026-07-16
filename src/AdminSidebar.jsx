import { LayoutDashboard, Gamepad2, ShoppingBag, Users } from 'lucide-react'

/**
 * AdminSidebar - Thanh điều hướng bên trái
 * Chiếm 260px chiều rộng cố định, nền tối, chứa menu chính
 */
export default function AdminSidebar({ activeTab, onTabChange, currentUser }) {
  const isAdmin = currentUser?.role === 'admin'
  const isStaff = currentUser?.role === 'staff'

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      icon: LayoutDashboard,
      visible: isAdmin,
    },
    {
      id: 'products',
      label: 'Quản lý sản phẩm',
      icon: Gamepad2,
      visible: isAdmin || isStaff,
    },
    {
      id: 'orders',
      label: 'Quản lý đơn hàng',
      icon: ShoppingBag,
      visible: isAdmin || isStaff,
    },
    {
      id: 'accounts',
      label: 'Quản lý tài khoản',
      icon: Users,
      visible: isAdmin,
    },
  ].filter((item) => item.visible)

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <span className="logo-triangle">G</span>
        <div>
          <strong>GEARMAX</strong>
          <small>Admin Panel</small>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`menu-item ${activeTab === id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              onTabChange(id)
            }}
          >
            <Icon size={20} />
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}
