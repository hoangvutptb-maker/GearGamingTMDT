/**
 * src/features/admin/pages/Dashboard/AdminDashboard.jsx
 * Trang tổng quan với 4 stat cards + bảng đơn hàng mới nhất
 */

import { TrendingUp, ShoppingCart, Box, Users } from 'lucide-react'

export default function AdminDashboard() {
  // Dữ liệu 4 thẻ chỉ số
  const statCards = [
    {
      title: 'Tổng doanh thu',
      value: '145.290.000đ',
      icon: TrendingUp,
      color: 'green',
      trend: '+12%',
    },
    {
      title: 'Đơn hàng mới',
      value: '12',
      unit: 'đơn hàng',
      icon: ShoppingCart,
      color: 'yellow',
      trend: '+5%',
    },
    {
      title: 'Sản phẩm đang bán',
      value: '86',
      unit: 'sản phẩm',
      icon: Box,
      color: 'blue',
      trend: '+8%',
    },
    {
      title: 'Khách hàng đăng ký',
      value: '1.240',
      unit: 'người',
      icon: Users,
      color: 'red',
      trend: '+15%',
    },
  ]

  // Mock: 5 đơn hàng mới nhất
  const recentOrders = [
    { id: 'ORD-001', customer: 'Nguyễn Văn A', time: '2 giờ trước', amount: '12.590.000đ', status: 'pending' },
    { id: 'ORD-002', customer: 'Trần Thị B', time: '4 giờ trước', amount: '8.290.000đ', status: 'shipping' },
    { id: 'ORD-003', customer: 'Lê Văn C', time: '6 giờ trước', amount: '15.990.000đ', status: 'completed' },
    { id: 'ORD-004', customer: 'Phạm Thị D', time: '1 ngày trước', amount: '5.690.000đ', status: 'pending' },
    { id: 'ORD-005', customer: 'Hoàng Văn E', time: '1 ngày trước', amount: '22.190.000đ', status: 'completed' },
  ]

  // Map status sang badge
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Chờ xử lý', color: '#FFC107' },
      shipping: { label: 'Đang giao', color: '#0DD3FF' },
      completed: { label: 'Hoàn thành', color: '#1ECC71' },
      cancelled: { label: 'Đã hủy', color: '#FF5252' },
    }
    return statusMap[status] || { label: 'Không xác định', color: '#999' }
  }

  return (
    <div className="admin-dashboard">
      {/* 4 Stat Cards */}
      <div className="stats-grid">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className={`stat-card stat-${card.color}`}>
              <div className="stat-icon">
                <Icon size={28} />
              </div>
              <div className="stat-body">
                <p className="stat-label">{card.title}</p>
                <h3 className="stat-value">{card.value}</h3>
                {card.unit && <small className="stat-unit">{card.unit}</small>}
                <span className="stat-trend">{card.trend}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bảng đơn hàng mới nhất */}
      <div className="recent-orders">
        <div className="section-header">
          <h2>Đơn hàng mới nhất</h2>
          <a href="#orders">Xem tất cả →</a>
        </div>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Thời gian</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => {
              const statusInfo = getStatusBadge(order.status)
              return (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.customer}</td>
                  <td className="order-time">{order.time}</td>
                  <td className="order-amount">{order.amount}</td>
                  <td>
                    <span className="status-badge" style={{ backgroundColor: statusInfo.color }}>
                      {statusInfo.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
