/**
 * src/features/admin/components/AdminLayout.jsx
 * Khung bố cục chính của Admin Dashboard
 */

import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminDashboard from '../pages/Dashboard/AdminDashboard'
import ManageProducts from '../pages/Products/ManageProducts'
import ManageOrders from '../pages/Orders/ManageOrders'

/**
 * AdminLayout - Container chính cho admin
 * Quản lý 3 tabs: dashboard | products | orders
 */
export default function AdminLayout({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Render nội dung dựa trên tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />
      case 'products':
        return <ManageProducts />
      case 'orders':
        return <ManageOrders />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="admin-container">
      {/* Sidebar trái */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content area */}
      <div className="admin-main">
        {/* Header trên */}
        <AdminHeader currentUser={currentUser} onLogout={onLogout} />

        {/* Nội dung dựa trên tab */}
        <div className="admin-content">{renderContent()}</div>
      </div>
    </div>
  )
}
