import { useEffect, useState } from 'react'
import { TrendingUp, ShoppingCart, Box, Users } from 'lucide-react'
import { getDashboard } from './lib/api'

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null)

  useEffect(() => {
    getDashboard()
      .then(setDashboard)
      .catch((error) => console.error('Không thể tải Dashboard:', error))
  }, [])

  const statistics = dashboard?.statistics || {
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
  }
  const recentOrders = dashboard?.recentOrders || []
  const statCards = [
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(statistics.revenue),
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Đơn hàng mới',
      value: statistics.orders,
      unit: 'đơn hàng',
      icon: ShoppingCart,
      color: 'yellow',
    },
    {
      title: 'Sản phẩm đang bán',
      value: statistics.products,
      unit: 'sản phẩm',
      icon: Box,
      color: 'blue',
    },
    {
      title: 'Khách hàng đăng ký',
      value: statistics.customers,
      unit: 'người',
      icon: Users,
      color: 'red',
    },
  ]

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Chờ xử lý', color: '#FFC107' },
      processing: { label: 'Đang xử lý', color: '#0DD3FF' },
      completed: { label: 'Hoàn thành', color: '#1ECC71' },
      cancelled: { label: 'Đã hủy', color: '#FF5252' },
    }
    return statusMap[status] || { label: 'Không xác định', color: '#999' }
  }

  return (
    <div className="admin-dashboard">
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
              </div>
            </div>
          )
        })}
      </div>

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
                  <td>{order.fullname}</td>
                  <td className="order-time">{formatDateTime(order.createdAt)}</td>
                  <td className="order-amount">{formatCurrency(order.total)}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: statusInfo.color }}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                </tr>
              )
            })}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan="5">Chưa có đơn hàng.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

function formatDateTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Không xác định'
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}
