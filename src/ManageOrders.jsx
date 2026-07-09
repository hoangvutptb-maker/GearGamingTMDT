import { useState } from 'react'
import { X } from 'lucide-react'

/**
 * ManageOrders - Trang quản lý đơn hàng
 * Mock data: danh sách đơn hàng COD với CRUD và status update
 */
export default function ManageOrders() {
  // Mock dữ liệu đơn hàng ban đầu
  const initialOrders = [
    {
      orderId: 'ORD-001',
      customerName: 'Nguyễn Văn A',
      phone: '0912345678',
      address: '123 Đường Lê Lợi, Q.1, TP.HCM',
      date: '2024-01-15',
      totalAmount: '12590000',
      status: 'pending',
      items: [
        { name: 'Bàn phím cơ AKKO 5075B Plus', quantity: 1, price: '1690000' },
        { name: 'Chuột Logitech G Pro X', quantity: 1, price: '3190000' },
        { name: 'Tai nghe HyperX Cloud III', quantity: 1, price: '2890000' },
        { name: 'Mousepad SteelSeries', quantity: 1, price: '1190000' },
      ],
    },
    {
      orderId: 'ORD-002',
      customerName: 'Trần Thị B',
      phone: '0987654321',
      address: '456 Đường Nguyễn Huệ, Q.3, TP.HCM',
      date: '2024-01-14',
      totalAmount: '8290000',
      status: 'shipping',
      items: [
        { name: 'Màn hình ViewSonic VX2528', quantity: 1, price: '2590000' },
        { name: 'Dây HDMI', quantity: 2, price: '990000' },
        { name: 'Giá đỡ màn hình', quantity: 1, price: '890000' },
      ],
    },
    {
      orderId: 'ORD-003',
      customerName: 'Lê Văn C',
      phone: '0898765432',
      address: '789 Đường Trần Hưng Đạo, Q.5, TP.HCM',
      date: '2024-01-13',
      totalAmount: '15990000',
      status: 'completed',
      items: [
        { name: 'Laptop Gaming ASUS ROG G16', quantity: 1, price: '45990000' },
        { name: 'Balo gaming', quantity: 1, price: '890000' },
      ],
    },
    {
      orderId: 'ORD-004',
      customerName: 'Phạm Thị D',
      phone: '0876543210',
      address: '321 Đường Cao Thắng, Q.10, TP.HCM',
      date: '2024-01-12',
      totalAmount: '5690000',
      status: 'pending',
      items: [
        { name: 'Chuột gaming Razer DeathAdder', quantity: 1, price: '2890000' },
        { name: 'Pad chuột Razer', quantity: 1, price: '1890000' },
      ],
    },
    {
      orderId: 'ORD-005',
      customerName: 'Hoàng Văn E',
      phone: '0765432109',
      address: '654 Đường Tôn Thất Tùng, Q.7, TP.HCM',
      date: '2024-01-11',
      totalAmount: '22190000',
      status: 'completed',
      items: [
        { name: 'Bàn phím cơ Keychron Pro', quantity: 1, price: '4990000' },
        { name: 'Bộ gậy cơ', quantity: 1, price: '890000' },
        { name: 'Dầu bôi trơn Switch', quantity: 1, price: '290000' },
      ],
    },
  ]

  const [orders, setOrders] = useState(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Hàm map status sang thông tin badge
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'Chờ xử lý', color: '#FFC107' },
      shipping: { label: 'Đang giao', color: '#0DD3FF' },
      completed: { label: 'Hoàn thành', color: '#1ECC71' },
      cancelled: { label: 'Đã hủy', color: '#FF5252' },
    }
    return statusMap[status] || { label: 'Không xác định', color: '#999' }
  }

  // Hàm cập nhật trạng thái đơn hàng
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    )
  }

  // Hàm format tiền tệ
  const formatPrice = (price) => {
    return parseInt(price).toLocaleString('vi-VN')
  }

  return (
    <div className="manage-orders">
      <div className="orders-header">
        <h2>Quản lý đơn hàng</h2>
        <p>
          Tổng số đơn: <strong>{orders.length}</strong>
        </p>
      </div>

      {/* Bảng đơn hàng */}
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Tên khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền (VNĐ)</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status)
              return (
                <tr key={order.orderId}>
                  <td className="order-id">
                    <button
                      className="link-btn"
                      onClick={() => setSelectedOrder(order)}
                      type="button"
                    >
                      {order.orderId}
                    </button>
                  </td>
                  <td>{order.customerName}</td>
                  <td>{order.date}</td>
                  <td className="order-amount">{formatPrice(order.totalAmount)}đ</td>
                  <td>
                    <div className="status-dropdown">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="shipping">Đang giao</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                      <span
                        className="status-indicator"
                        style={{ backgroundColor: statusInfo.color }}
                      />
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => setSelectedOrder(order)}
                      type="button"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết đơn hàng {selectedOrder.orderId}</h3>
              <button
                className="modal-close"
                onClick={() => setSelectedOrder(null)}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <div className="order-details">
              {/* Thông tin giao hàng */}
              <div className="details-section">
                <h4>Thông tin giao hàng</h4>
                <div className="details-grid">
                  <div>
                    <span className="label">Tên khách hàng:</span>
                    <p>{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <span className="label">Số điện thoại:</span>
                    <p>{selectedOrder.phone}</p>
                  </div>
                  <div className="full-width">
                    <span className="label">Địa chỉ:</span>
                    <p>{selectedOrder.address}</p>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="details-section">
                <h4>Danh sách sản phẩm</h4>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Giá (VNĐ)</th>
                      <th>Thành tiền (VNĐ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => {
                      const itemTotal = parseInt(item.price) * item.quantity
                      return (
                        <tr key={idx}>
                          <td>{item.name}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-right">{formatPrice(item.price)}đ</td>
                          <td className="text-right">
                            <strong>{formatPrice(itemTotal.toString())}đ</strong>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tóm tắt đơn hàng */}
              <div className="details-section">
                <div className="summary-row">
                  <span>Tổng cộng:</span>
                  <strong>{formatPrice(selectedOrder.totalAmount)}đ</strong>
                </div>
                <div className="summary-row">
                  <span>Phương thức thanh toán:</span>
                  <strong>Thanh toán khi nhận hàng (COD)</strong>
                </div>
                <div className="summary-row">
                  <span>Trạng thái:</span>
                  <span
                    className="status-badge-large"
                    style={{ backgroundColor: getStatusInfo(selectedOrder.status).color }}
                  >
                    {getStatusInfo(selectedOrder.status).label}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-close"
                onClick={() => setSelectedOrder(null)}
                type="button"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
