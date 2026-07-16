# 📁 FOLDER STRUCTURE - HƯỚNG DẪN

## 🏗️ CẤU TRÚC FOLDER MỚI

```
src/
│
├── features/                      # ← Tất cả feature modules ở đây
│   │
│   ├── auth/                      # 🔐 PHẦN 1: ĐĂNG NHẬP / ĐĂNG KÝ
│   │   ├── components/
│   │   │   ├── AuthModal.jsx      # Modal chính (login + register)
│   │   │   ├── LoginForm.jsx      # Component form login
│   │   │   └── RegisterForm.jsx   # Component form register
│   │   ├── hooks/
│   │   │   └── useAuth.js         # Hook: handleLogin, handleRegister
│   │   └── utils/
│   │       └── authHelpers.js     # Functions: validate, save, read user
│   │
│   ├── admin/                     # 👑 PHẦN 2: ADMIN DASHBOARD
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx    # Khung bố cục chính
│   │   │   ├── AdminSidebar.jsx   # Menu trái (3 tabs)
│   │   │   └── AdminHeader.jsx    # Header trên (greeting + logout)
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   │   └── AdminDashboard.jsx    # 4 stat cards + orders table
│   │   │   ├── Products/
│   │   │   │   ├── ManageProducts.jsx    # CRUD sản phẩm chính
│   │   │   │   ├── ProductTable.jsx      # (Optional) Table component
│   │   │   │   ├── ProductForm.jsx       # (Optional) Form component
│   │   │   │   └── productHelpers.js     # (Optional) Helpers
│   │   │   └── Orders/
│   │   │       ├── ManageOrders.jsx      # CRUD đơn hàng chính
│   │   │       ├── OrdersTable.jsx       # (Optional) Table component
│   │   │       ├── OrderDetailModal.jsx  # (Optional) Modal component
│   │   │       └── orderHelpers.js       # (Optional) Helpers
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAdminTab.js            # Hook: quản lý tab hiện tại
│   │   │   ├── useProductManagement.js   # (Optional) CRUD sản phẩm
│   │   │   └── useOrderManagement.js     # (Optional) CRUD đơn hàng
│   │   │
│   │   └── utils/
│   │       ├── adminHelpers.js           # Functions: format, calculate
│   │       └── formatters.js             # (Optional) formatPrice, formatDate
│   │
│   └── client/                    # 🛒 PHẦN 3: CLIENT (TÙY CHỌN)
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── CategoryMenu.jsx
│       │   ├── CartDrawer.jsx
│       │   └── Footer.jsx
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   └── CategoryPage.jsx
│       └── utils/
│           └── cartHelpers.js
│
├── App.jsx                        # Main app (refactored để import từ features/)
├── App.css
├── admin.css
├── index.css
├── main.jsx
│
├── CODE_STRUCTURE_GUIDE.md        # 📖 Tài liệu giải thích code
├── ADMIN_GUIDE.md
├── ADMIN_QUICKSTART.md
├── FOLDER_STRUCTURE_GUIDE.md      # ← TÀI LIỆU NÀY
│
└── ...

```

---

## 🔐 PHẦN 1: AUTH (Đăng nhập / Đăng ký)

### 📍 Vị trí
`src/features/auth/`

### 📁 Files

| File | Công việc | Dòng code | 
|------|----------|----------|
| `authHelpers.js` | Functions validate, save, read user | ~150 |
| `useAuth.js` | Hook: handleLogin, handleRegister | ~80 |
| `LoginForm.jsx` | Component form login | ~50 |
| `RegisterForm.jsx` | Component form register | ~70 |
| `AuthModal.jsx` | Component modal chính (quản lý 2 form) | ~80 |

### 🔄 Flow

```
User nhấn "Đăng nhập"
    ↓
AuthModal mở
    ↓
Chọn: "Đăng nhập" hoặc "Đăng ký"
    ↓
LoginForm hoặc RegisterForm render
    ↓
useAuth hook xử lý logic
    ↓
authHelpers.js validate + save
    ↓
localStorage cập nhật
    ↓
App.jsx nhận user mới
```

### 💾 localStorage keys

```javascript
'gearmax_current_user' = {
  fullname: 'Nguyễn Văn A',
  email: 'customer@gmail.com',
  role: 'customer' // hoặc 'admin'
}

'gearmax_users' = [
  { id, fullname, phone, email, password, role },
  { ... }
]
```

---

## 👑 PHẦN 2: ADMIN (Dashboard)

### 📍 Vị trí
`src/features/admin/`

### 📁 Folder Structure

```
admin/
├── components/
│   ├── AdminLayout.jsx       ← CHÍNH
│   ├── AdminSidebar.jsx      ← Menu trái
│   └── AdminHeader.jsx       ← Header trên
├── pages/
│   ├── Dashboard/
│   │   └── AdminDashboard.jsx       ← TỔNG QUAN
│   ├── Products/
│   │   └── ManageProducts.jsx       ← QUẢN LÝ SP
│   └── Orders/
│       └── ManageOrders.jsx         ← QUẢN LÝ ĐH
├── hooks/
│   └── useAdminTab.js        ← Tab management
└── utils/
    └── adminHelpers.js       ← Helpers
```

### 🎯 Hệ thống 3 tabs

```
┌──────────────────────────────────────┐
│  [📊 Dashboard]  [🎮 Products]  [📦 Orders]  │  ← AdminSidebar menu
└──────────────────────────────────────┘
            ↓
        activeTab = 'dashboard' / 'products' / 'orders'
            ↓
        AdminLayout renderContent()
            ↓
        Hiển thị component tương ứng
```

### 📊 DASHBOARD (Tổng quan)
**Component:** `AdminDashboard.jsx`  
**Hiển thị:**
- 4 stat cards (doanh thu, đơn hàng, sản phẩm, khách hàng)
- Bảng 5 đơn hàng mới nhất

**Mock data:**
```javascript
statCards = [
  { title: '💰 Doanh thu', value: '145.290.000đ', trend: '+12%' },
  { title: '📦 Đơn hàng', value: '12', trend: '+5%' },
  { title: '🛒 Sản phẩm', value: '86', trend: '+8%' },
  { title: '👥 Khách hàng', value: '1.240', trend: '+15%' }
]
```

### 🎮 PRODUCTS (Quản lý sản phẩm)
**Component:** `ManageProducts.jsx`  
**Chức năng:**
- ✅ CREATE: Thêm sản phẩm mới
- ✅ READ: Hiển thị danh sách
- ✅ UPDATE: Sửa sản phẩm
- ✅ TOGGLE: Ẩn/Hiện sản phẩm
- ✅ DELETE: Xóa sản phẩm

**Mock data structure:**
```javascript
{
  id: 1,
  name: 'Laptop Gaming ASUS ROG G16',
  category: 'Laptop Gaming',
  price: '45990000',
  stock: 12,
  status: 'active', // 'active' hoặc 'hidden'
  image: 'https://...',
  specs: { cpu: 'Intel i9', gpu: 'RTX 4090', ram: '32GB' }
}
```

### 📦 ORDERS (Quản lý đơn hàng)
**Component:** `ManageOrders.jsx`  
**Chức năng:**
- ✅ UPDATE Status: Dropdown chọn trạng thái
- ✅ VIEW Details: Modal hiển thị chi tiết

**Mock data structure:**
```javascript
{
  orderId: 'ORD-001',
  customerName: 'Nguyễn Văn A',
  phone: '0912345678',
  address: '123 Đường Lê Lợi, Q.1, TP.HCM',
  date: '2024-01-15',
  totalAmount: '12590000',
  status: 'pending', // pending|shipping|completed|cancelled
  items: [
    { name: 'Bàn phím', quantity: 1, price: '1690000' },
    { name: 'Chuột', quantity: 1, price: '3190000' }
  ]
}
```

---

## 🎯 IMPORT PATHS

### Trong App.jsx (refactored)
```javascript
// Đăng nhập/Đăng ký
import AuthModal from './features/auth/components/AuthModal'
import { clearCurrentUser } from './features/auth/utils/authHelpers'

// Admin Dashboard
import AdminLayout from './features/admin/components/AdminLayout'

// Admin CSS
import './admin.css'
```

### Trong AdminLayout.jsx
```javascript
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminDashboard from '../pages/Dashboard/AdminDashboard'
import ManageProducts from '../pages/Products/ManageProducts'
import ManageOrders from '../pages/Orders/ManageOrders'
```

---

## 🔗 MỐI LIÊN HỆ GIỮA CÁC FILES

```
App.jsx (main)
  ├── AuthModal (features/auth/components/)
  │   ├── LoginForm / RegisterForm
  │   └── useAuth hook
  │       └── authHelpers.js
  │
  └── AdminLayout (features/admin/components/)
      ├── AdminSidebar
      ├── AdminHeader
      └── renderContent()
          ├── AdminDashboard
          ├── ManageProducts
          └── ManageOrders
```

---

## ✅ LỢI ÍCH CỦA CẤUTRÚC NÀY

| Lợi ích | Ý nghĩa |
|---------|---------|
| **Modular** | Mỗi feature riêng biệt, dễ bảo trì |
| **Scalable** | Thêm feature mới dễ dàng |
| **Organized** | Folder structure rõ ràng |
| **Reusable** | Hooks, utils dùng lại được |
| **Clean** | Component nhỏ, readable |
| **Testable** | Dễ viết unit tests |

---

## 🚀 TIẾP THEO

### Phase 1 (DONE)
- ✅ Tạo folder structure
- ✅ Tách auth module
- ✅ Tách admin module

### Phase 2 (Tùy chọn)
- ☐ Tách client module (Header, CartDrawer, CategoryPage)
- ☐ Tách shared components (FloatingSupport, Footer)
- ☐ Tạo hooks cho product/order CRUD

### Phase 3 (Backend)
- ☐ Connect API endpoints
- ☐ Replace mock data với API calls
- ☐ Error handling + loading states

---

## 📞 CÂU HỎI THƯỜNG GẶP

**Q: Tại sao phải tách thành folders?**
A: Dễ quản lý, tìm kiếm, bảo trì. Dự án lớn thì folder structure tốt là 50% thành công.

**Q: Có bắt buộc phải đặt files vào folders không?**
A: Không. Nhưng best practice thì nên tách. Nó giống như tổ chức nhà - chảy loạn thì mệt lắm.

**Q: Khi nào nên tách thành files riêng?**
A: Khi component > 200 dòng hoặc có nhiều logic phức tạp, nên tách thành subcomponents + hooks.

**Q: Cần tạo index.js không?**
A: Tùy. `import from './auth'` sạch hơn `import from './auth/components'` nếu có index.js.

---

**Tài liệu này cùng với:**
- `CODE_STRUCTURE_GUIDE.md` - Giải thích chi tiết code
- `ADMIN_GUIDE.md` - Hướng dẫn sử dụng admin
- `ADMIN_QUICKSTART.md` - Quick start

