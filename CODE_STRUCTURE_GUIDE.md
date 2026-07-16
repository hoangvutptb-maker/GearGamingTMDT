# 📖 HƯỚNG DẪN CHI TIẾT CẤUTRÚC CODE

---

## 🔐 PHẦN 1: ĐĂNG NHẬP / ĐĂNG KÝ (AUTHENTICATION)

### 📍 Vị trí hiện tại
**File:** `src/App.jsx` (Dòng 250-450)  
**Component:** `AuthModal`

### 🎯 Công việc chính
Quản lý luồng đăng nhập/đăng ký của khách hàng bình thường (Customer)

### 📝 Chi tiết code

#### 1️⃣ **State của AuthModal**
```javascript
const [form, setForm] = useState({
  name: '',                    // Họ tên (chỉ đăng ký)
  email: '',                   // Email (cả 2 chế độ)
  phone: '',                   // SĐT (chỉ đăng ký)
  password: '',                // Mật khẩu (cả 2)
  confirmPassword: '',         // Xác nhận (chỉ đăng ký)
})
const [message, setMessage] = useState('')  // Thông báo lỗi
```

#### 2️⃣ **Hai chế độ hoạt động**

**Mode LOGIN (Đăng nhập):**
- Chỉ nhập: Email + Mật khẩu
- Kiểm tra trong localStorage['gearmax_users']
- Nếu khớp → Lưu vào currentUser + localStorage
- Nếu sai → Hiện thông báo lỗi

```javascript
const foundUser = users.find(
  (user) => user.email === email && user.password === password
)
if (!foundUser) {
  setMessage('Email hoặc mật khẩu không đúng.')
  return
}
onLogin({ name: foundUser.name, email: foundUser.email })
```

**Mode REGISTER (Đăng ký):**
- Nhập: Họ tên + SĐT + Email + Mật khẩu (×2)
- Kiểm tra:
  - Email chưa bị đăng ký
  - Mật khẩu ≥ 6 ký tự
  - Mật khẩu xác nhận khớp
- Nếu hợp lệ → Tạo user mới + Lưu vào localStorage['gearmax_users']
- Tự động đăng nhập sau khi đăng ký

```javascript
const nextUser = {
  id: Date.now(),
  name: form.name.trim(),
  phone: form.phone.trim(),
  email,
  password,
}
localStorage.setItem(
  'gearmax_users',
  JSON.stringify([...users, nextUser])
)
onLogin({ name: nextUser.name, email: foundUser.email })
```

#### 3️⃣ **Dữ liệu lưu trữ**

**localStorage key: `gearmax_users`**
```javascript
[
  {
    id: 1234567890,
    name: 'Nguyễn Văn A',
    phone: '0912345678',
    email: 'customer@gmail.com',
    password: '123456'
  },
  {
    id: 1234567891,
    name: 'Trần Thị B',
    phone: '0987654321',
    email: 'another@gmail.com',
    password: 'mypass123'
  }
]
```

**localStorage key: `gearmax_current_user`**
```javascript
{
  name: 'Nguyễn Văn A',
  email: 'customer@gmail.com'
}
```

#### 4️⃣ **Validation (Kiểm tra)**
```
✓ Email không để trống
✓ Mật khẩu không để trống
✓ (Đăng ký) Họ tên + SĐT không để trống
✓ (Đăng ký) Mật khẩu ≥ 6 ký tự
✓ (Đăng ký) Mật khẩu xác nhận phải khớp
✓ (Đăng ký) Email không được trùng
✓ (Đăng nhập) Email + Mật khẩu phải khớp
```

#### 5️⃣ **Callback functions**
- `onLogin(user)`: Gọi khi đăng nhập/đăng ký thành công
- `onClose()`: Đóng modal
- `onSwitchMode()`: Chuyển giữa Login ↔ Register

---

## 👑 PHẦN 2: ADMIN DASHBOARD

### 📍 Vị trí hiện tại
**Files chính:**
- `src/AdminLayout.jsx` - Container chính
- `src/AdminSidebar.jsx` - Menu trái
- `src/AdminHeader.jsx` - Header trên
- `src/AdminDashboard.jsx` - Trang Tổng quan
- `src/ManageProducts.jsx` - Quản lý sản phẩm
- `src/ManageOrders.jsx` - Quản lý đơn hàng
- `src/admin.css` - Styling riêng

### 🎯 Công việc chính
Cung cấp bảng điều khiển cho Admin quản lý sản phẩm + đơn hàng

### 📝 Chi tiết code

#### 1️⃣ **AdminLayout - Khung bố cục chính**

**State:**
```javascript
const [activeTab, setActiveTab] = useState('dashboard')
// Các tab: 'dashboard' | 'products' | 'orders'
```

**Cấu trúc HTML:**
```
┌─────────────────────────────────┐
│  AdminSidebar | AdminHeader      │
│              ├────────────────────┤
│              │ renderContent()    │
│  (Menu)      │ - AdminDashboard   │
│              │ - ManageProducts   │
│              │ - ManageOrders     │
│              │                    │
└─────────────────────────────────┘
```

#### 2️⃣ **AdminSidebar - Menu điều hướng**

**Cấu trúc:**
```
┌─────────────────┐
│ Logo: GEARMAX   │  ← Branding
├─────────────────┤
│ 📊 Tổng quan    │  ← Tab: dashboard
│ 🎮 Quản lý SP   │  ← Tab: products
│ 📦 Quản lý ĐH   │  ← Tab: orders
└─────────────────┘
```

**Styling:**
```css
.admin-sidebar {
  width: 260px;              /* Fixed width */
  background: linear-gradient(135deg, #1a1a2e, #16213e);  /* Dark gradient */
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.menu-item.active {
  background: rgba(0, 212, 255, 0.1);   /* Cyan highlight */
  border-left: 3px solid #0DD3FF;
  color: #0DD3FF;
}
```

#### 3️⃣ **AdminHeader - Đầu trang**

**Hiển thị:**
- Lời chào: "Xin chào, {currentUser.fullname}"
- Nút Đăng xuất

**Callback:**
```javascript
onClick={() => {
  localStorage.removeItem('gearmax_current_user')
  setCurrentUser(null)
  // Quay về trang client
}}
```

#### 4️⃣ **AdminDashboard - Trang Tổng quan**

**Hiển thị 4 KPI Cards:**

| Chỉ số | Giá trị | Xu hướng | Màu |
|--------|--------|---------|------|
| 💰 Doanh thu | 145.290.000đ | +12% | 🟢 Green |
| 📦 Đơn hàng mới | 12 | +5% | 🟡 Yellow |
| 🛒 Sản phẩm bán | 86 | +8% | 🔵 Blue |
| 👥 Khách hàng | 1.240 | +15% | 🔴 Red |

**Mock Data:**
```javascript
const statCards = [
  {
    title: 'Tổng doanh thu',
    value: '145.290.000đ',
    icon: TrendingUp,
    color: 'green',
    trend: '+12%'
  },
  // ... (3 cái khác)
]
```

**Hiển thị Bảng 5 Đơn hàng mới nhất**
```
Mã đơn | Khách hàng | Thời gian | Tiền | Trạng thái
─────────────────────────────────────────────────
ORD-001 | Nguyễn A | 10:30 | 12.5M | 🟡 Chờ xử lý
ORD-002 | Trần B | 09:15 | 8.3M | 🔵 Đang giao
```

#### 5️⃣ **ManageProducts - Quản lý sản phẩm**

**CRUD Operations:**

**1. CREATE (Thêm sản phẩm)**
```javascript
handleAddProduct() {
  setShowForm(true)
  setEditingId(null)
  setFormData({
    name: '', category: '', price: '', stock: '', status: 'active', image: ''
  })
}
```

**2. READ (Hiển thị danh sách)**
```javascript
// Bảng hiển thị:
{products.map(product => (
  <tr>
    <td>{product.id}</td>
    <td><img src={product.image} /></td>
    <td>{product.name}</td>
    <td>{product.category}</td>
    <td>{formatPrice(product.price)}đ</td>
    <td>{product.stock}</td>
    <td>{product.status}</td>
  </tr>
))}
```

**3. UPDATE (Sửa sản phẩm)**
```javascript
handleSaveProduct(e) {
  e.preventDefault()
  if (editingId) {
    // Cập nhật sản phẩm cũ
    setProducts(
      products.map(p =>
        p.id === editingId
          ? { ...p, ...formData }
          : p
      )
    )
  } else {
    // Tạo sản phẩm mới
    setProducts([
      ...products,
      { ...formData, id: Date.now() }
    ])
  }
  setShowForm(false)
}
```

**4. TOGGLE STATUS (Ẩn/Hiện)**
```javascript
handleToggleStatus(id) {
  setProducts(
    products.map(p =>
      p.id === id
        ? { ...p, status: p.status === 'active' ? 'hidden' : 'active' }
        : p
    )
  )
}
```

**5. DELETE (Xóa sản phẩm)**
```javascript
handleDeleteProduct(id) {
  setProducts(products.filter(p => p.id !== id))
}
```

**Mock Data Structure:**
```javascript
{
  id: 1,
  name: 'Laptop Gaming ASUS ROG G16',
  category: 'Laptop Gaming',
  price: '45990000',
  stock: 12,
  status: 'active',  // 'active' hoặc 'hidden'
  image: 'https://...',
  specs: {
    cpu: 'Intel i9',
    gpu: 'RTX 4090',
    ram: '32GB'
  }
}
```

#### 6️⃣ **ManageOrders - Quản lý đơn hàng**

**Chức năng chính:**

**1. Thay đổi trạng thái (Dropdown)**
```javascript
const statusOptions = [
  { value: 'pending', label: 'Chờ xử lý', color: '#FFC107' },
  { value: 'shipping', label: 'Đang giao', color: '#0DD3FF' },
  { value: 'completed', label: 'Hoàn thành', color: '#1ECC71' },
  { value: 'cancelled', label: 'Đã hủy', color: '#FF5252' }
]

handleStatusChange(orderId, newStatus) {
  setOrders(
    orders.map(o =>
      o.orderId === orderId
        ? { ...o, status: newStatus }
        : o
    )
  )
}
```

**2. Xem chi tiết (Modal Popup)**
```
Modal hiển thị:
┌─────────────────────────┐
│ Chi tiết đơn hàng ORD-001│
├─────────────────────────┤
│ Thông tin giao hàng:    │
│ • Tên: Nguyễn Văn A     │
│ • SĐT: 0912345678       │
│ • Địa chỉ: 123 Lê Lợi   │
├─────────────────────────┤
│ Danh sách sản phẩm:     │
│ • Sản phẩm | Qty | Giá  │
│ • Bàn phím | 1   | 1.6M  │
│ • Chuột    | 2   | 3.2M  │
├─────────────────────────┤
│ Tóm tắt:                │
│ • Tổng: 12.5M           │
│ • Thanh toán: COD        │
│ • Trạng thái: Chờ xử lý │
└─────────────────────────┘
```

**Mock Data Structure:**
```javascript
{
  orderId: 'ORD-001',
  customerName: 'Nguyễn Văn A',
  phone: '0912345678',
  address: '123 Đường Lê Lợi, Q.1, TP.HCM',
  date: '2024-01-15',
  totalAmount: '12590000',
  status: 'pending',
  items: [
    {
      name: 'Bàn phím cơ AKKO',
      quantity: 1,
      price: '1690000'
    },
    {
      name: 'Chuột Logitech G Pro',
      quantity: 1,
      price: '3190000'
    }
  ]
}
```

---

## 🏗️ PHẦN 3: FLOW CHUNG CỦA TOÀN APP

### Đăng nhập Admin
```
1. User nhấn "Đăng nhập"
   ↓
2. AuthModal mở (chế độ login)
   ↓
3. User nhập: admin@gear.com / 123456
   ↓
4. Kiểm tra đúng
   ↓
5. Lưu vào localStorage['gearmax_current_user']
   ↓
6. App.jsx nhận currentUser
   ↓
7. App.jsx check: currentUser.role === 'admin'?
   ↓
8. YES → Render <AdminLayout /> (Admin Dashboard)
   ↓
9. NO → Render client UI (Trang chủ, giỏ hàng, etc)
```

### Đăng nhập Customer
```
1. User nhấn "Đăng nhập"
   ↓
2. AuthModal mở (chế độ login)
   ↓
3. User nhập: customer@gmail.com / 123456
   ↓
4. Kiểm tra khớp với gearmax_users
   ↓
5. Lưu vào localStorage
   ↓
6. App.jsx check: role === 'customer'?
   ↓
7. YES → Render client UI + hiện name ở header
   ↓
8. Customer có thể dùng giỏ hàng
```

### Đăng ký Customer
```
1. User nhấn "Đăng nhập"
   ↓
2. AuthModal mở (chế độ login)
   ↓
3. User nhấn "Đăng ký ngay"
   ↓
4. AuthModal chuyển sang chế độ register
   ↓
5. User điền form (name, phone, email, password×2)
   ↓
6. Validation (email chưa tồn tại, pass ≥6 ký tự, etc)
   ↓
7. Lưu user mới vào localStorage['gearmax_users']
   ↓
8. Tự động đăng nhập
   ↓
9. Quay về client UI
```

---

## 💾 TỔNG HỢP LOCALSTORAGE

| Key | Dữ liệu | Ví dụ |
|-----|---------|-------|
| `gearmax_current_user` | User đang login | `{name: "...", email: "..."}` |
| `gearmax_users` | Danh sách tất cả customers | `[{id, name, email, ...}]` |
| `gearmax_cart` | Giỏ hàng hiện tại | `[{name, quantity, price}]` |

---

## 🎨 TỔNG HỢP ADMIN COLORS

| Màu | Hex | Dùng cho |
|-----|-----|----------|
| Cyan | `#0DD3FF` | Primary, Active, Brand |
| Dark | `#1a1a2e` | Background sidebar |
| Success | `#1ECC71` | Green badge (completed) |
| Warning | `#FFC107` | Yellow badge (pending) |
| Danger | `#FF5252` | Red badge (cancelled) |
| Light | `#f4f6f9` | Background page |

---

## 🔗 TẢI LIỆU THAM KHẢO

- **ADMIN_GUIDE.md** - Hướng dẫn sử dụng chi tiết
- **ADMIN_QUICKSTART.md** - Quick start
- **ADMIN_QUICKSTART.js** - Code snippets (comments only)
