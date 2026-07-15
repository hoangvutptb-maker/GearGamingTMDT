import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminDashboard from './AdminDashboard'
import ManageProducts from './ManageProducts'
import ManageOrders from './ManageOrders'
import ManageAccounts from './ManageAccounts'

/**
 * AdminLayout - Khung bố cục chính của Admin Dashboard
 * Quản lý tab hiện tại và render nội dung tương ứng
 */
export default function AdminLayout({ currentUser, onLogout }) {
  const initialTab = currentUser?.role === 'staff' ? 'products' : 'dashboard'
  const [activeTab, setActiveTab] = useState(initialTab)
  const visibleTab = currentUser?.role === 'staff' && activeTab === 'dashboard'
    ? 'products'
    : activeTab

  // Hàm render nội dung dựa trên tab hiện tại
  const renderContent = () => {
    switch (visibleTab) {
      case 'dashboard':
        return <AdminDashboard />
      case 'products':
        return <ManageProducts />
      case 'orders':
        return <ManageOrders />
      case 'accounts':
        return <ManageAccounts />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="admin-container">
      <AdminSidebar
        activeTab={visibleTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
      />
      <div className="admin-main">
        <AdminHeader currentUser={currentUser} onLogout={onLogout} />
        <div className="admin-content">{renderContent()}</div>
      </div>
    </div>
  )
}
