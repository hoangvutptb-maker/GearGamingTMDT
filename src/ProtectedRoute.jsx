import { useEffect } from 'react'

const staffBlockedPaths = ['/admin/dashboard', '/admin/accounts']

function UnauthorizedPage({ message }) {
  return (
    <div className="unauthorized-page" style={{ padding: '32px' }}>
      <h2>Bạn không có quyền truy cập</h2>
      <p>{message}</p>
    </div>
  )
}

export default function ProtectedRoute({ currentUser, children }) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  const isAdmin = currentUser?.role === 'admin'
  const isStaff = currentUser?.role === 'staff'

  useEffect(() => {
    if (isStaff && staffBlockedPaths.includes(pathname)) {
      window.location.replace('/admin/orders')
    }
  }, [isStaff, pathname])

  if (!currentUser) {
    return <UnauthorizedPage message="Vui lòng đăng nhập để truy cập khu vực này." />
  }

  if (!isAdmin && !isStaff) {
    return <UnauthorizedPage message="Bạn không có quyền truy cập trang quản trị." />
  }

  if (isStaff && staffBlockedPaths.includes(pathname)) {
    return <div style={{ padding: '32px' }}>Đang chuyển đến Quản lý đơn hàng...</div>
  }

  return children
}
