<!-- HTML Documentation -->
# 🎮 GEARMAX Admin Dashboard - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan Tính Năng

Hệ thống admin dashboard hoàn chỉnh cho cửa hàng bán Gaming Gear GEARMAX với 3 module chính:

### 1️⃣ **AUTH MODULE & PHÂN QUYỀN**
- **Admin Account Mặc Định:**
  - 📧 Email: `admin@gear.com`
  - 🔐 Password: `123456`
  - 👤 Role: `admin`

- **Tài Khoản Customer:**
  - Được tạo qua form đăng ký
  - Lưu trong `localStorage` (gearmax_users)
  - Role: `customer` (không thể truy cập admin)

- **Logout:**
  - Xóa sạch localStorage
  - Trở về trạng thái khách vãng lai
  - Quay lại trang chủ

### 2️⃣ **KHUNG BỐ CỤC ADMIN (AdminLayout)**

#### Sidebar (Bên Trái)
- **Kích thước:** 260px fixed width
- **Theme:** Dark gaming (gradient #1a1a2e → #16213e)
- **Menu Items:**
  - 🎛️ **Tổng quan** (Dashboard) - LayoutDashboard icon
  - 🎮 **Quản lý sản phẩm** - Gamepad2 icon
  - 📦 **Quản lý đơn hàng** - ShoppingBag icon

#### Main Area (Bên Phải)
- **Header:** Lời chào "Xin chào, Admin" + Logout button
- **Content:** Dynamic area render theo tab
- **Background:** Light gray (#f4f6f9)

### 3️⃣ **TRANG TỔNG QUAN (AdminDashboard)**

#### 4 Thẻ Chỉ Số (Stats Cards)
```
┌─────────────────────────────┐
│ 💹 Tổng Doanh Thu           │
│ 145.290.000đ (Green)        │
│ +12% trend                   │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 🛒 Đơn Hàng Mới             │
│ 12 đơn hàng (Yellow)        │
│ +5% trend                    │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 📦 Sản Phẩm Đang Bán        │
│ 86 sản phẩm (Blue)          │
│ +8% trend                    │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 👥 Khách Hàng Đăng Ký       │
│ 1.240 người (Red)           │
│ +15% trend                   │
└─────────────────────────────┘
```

#### Bảng Đơn Hàng Mới Nhất
- 5 đơn hàng gần đây
- Cột: Mã đơn | Khách | Thời gian | Tổng tiền | Trạng thái
- Badges màu tương ứng trạng thái

### 4️⃣ **QUẢN LÝ SẢN PHẨM (ManageProducts)**

#### Bảng Sản Phẩm
| Cột | Nội Dung |
|-----|----------|
| ID | Mã định danh sản phẩm |
| Hình ảnh | Thumbnail 50x50px |
| Tên sản phẩm | Tên đầy đủ |
| Danh mục | Laptop Gaming / Bàn phím / Chuột / etc |
| Giá (VNĐ) | Format locale vi-VN |
| Tồn kho | Số lượng tồn kho |
| Trạng thái | Hiển thị / Ẩn (badge) |
| Hành động | Sửa / Ẩn-Hiện / Xóa |

#### Mock Data Ban Đầu
```javascript
[
  {
    id: 1,
    name: 'Laptop Gaming ASUS ROG G16',
    category: 'Laptop Gaming',
    price: '45.990.000',
    stock: 12,
    status: 'active',
    image: 'https://...',
    specs: { cpu: 'Intel i9', gpu: 'RTX 4090', ram: '32GB' }
  },
  // ... thêm 3 sản phẩm khác
]
```

#### CRUD Functionality

**✏️ Create (Thêm Mới):**
- Nút "Thêm sản phẩm" → Modal form
- Điền: Tên, Danh mục, Giá, Tồn kho, Link ảnh, Trạng thái
- Nhấn "Lưu" → Thêm vào state
- Auto generate ID: Date.now()

**👁️ Read (Xem):**
- Bảng hiển thị tất cả sản phẩm
- Thumbnail hình ảnh

**📝 Update (Sửa):**
- Nút "Sửa" → Mở modal với dữ liệu cũ
- Chỉnh sửa các trường
- Nhấn "Lưu" → Update state theo ID

**👀 Soft Delete (Ẩn/Hiện):**
- Nút con mắt → Toggle status: 'active' ↔ 'hidden'
- Không xóa dữ liệu (giữ tham chiếu đơn hàng)

**🗑️ Delete (Xóa):**
- Nút "Xóa" → Xóa khỏi state ngay lập tức

### 5️⃣ **QUẢN LÝ ĐƠN HÀNG (ManageOrders)**

#### Bảng Đơn Hàng
| Cột | Nội Dung |
|-----|----------|
| Mã đơn | ORD-001, ORD-002, ... |
| Khách hàng | Tên khách |
| Ngày đặt | YYYY-MM-DD |
| Tổng tiền (VNĐ) | Tổng cộng đơn hàng |
| Trạng thái | Dropdown để update |

#### Mock Data Ban Đầu
```javascript
{
  orderId: 'ORD-001',
  customerName: 'Nguyễn Văn A',
  phone: '0912345678',
  address: '123 Đường Lê Lợi, Q.1, TP.HCM',
  date: '2024-01-15',
  totalAmount: '12.590.000',
  status: 'pending', // pending | shipping | completed | cancelled
  items: [
    { name: 'Bàn phím...', quantity: 1, price: '1.690.000' },
    // ...
  ]
}
```

#### Status Management
**Dropdown với 4 Trạng Thái:**
| Trạng thái | Màu | Ý Nghĩa |
|-----------|------|---------|
| Chờ xử lý | 🟡 #FFC107 | Vừa đặt hàng, chưa xử lý |
| Đang giao | 🔵 #0DD3FF | Đã ship, đang giao |
| Hoàn thành | 🟢 #1ECC71 | Khách nhận hàng |
| Đã hủy | 🔴 #FF5252 | Đã hủy đơn |

**Update Instant:** Thay đổi dropdown → State cập nhật ngay

#### Modal Xem Chi Tiết
- Tiêu đề: "Chi tiết đơn hàng ORD-XXX"
- **Section 1: Thông tin giao hàng**
  - Tên khách hàng
  - Số điện thoại
  - Địa chỉ nhận hàng

- **Section 2: Danh sách sản phẩm**
  - Table: Sản phẩm | Số lượng | Giá | Thành tiền
  - Tính tổng items

- **Section 3: Tóm tắt**
  - Tổng cộng
  - Phương thức: COD
  - Trạng thái hiện tại

---

## 🎨 UX/UI Details

### Color Scheme
- **Primary Cyan:** #0DD3FF (Accent)
- **Dark Background:** #1a1a2e (Sidebar)
- **Light Background:** #f4f6f9 (Main area)
- **Success Green:** #1ECC71
- **Warning Yellow:** #FFC107
- **Error Red:** #FF5252
- **Info Cyan:** #0DD3FF

### Typography
- **Font Family:** Be Vietnam Pro (dự án có sẵn)
- **Header:** 24px / 700 weight
- **Section Title:** 18px / 700 weight
- **Table th:** 12px / 700 weight / uppercase
- **Table td:** 13px / 400 weight

### Icons (lucide-react)
- LayoutDashboard, Gamepad2, ShoppingBag
- Plus, Edit, Trash, Eye, EyeOff
- LogOut, X, ChevronDown
- TrendingUp, ShoppingCart, Box, Users

### Responsive Breakpoints
- **Desktop:** Full layout (260px sidebar fixed)
- **Tablet (≤768px):** Sidebar 200px
- **Mobile (≤480px):** Sidebar 160px, no product thumb

### Modal Features
- Overlay: rgba(0,0,0,0.6)
- Animation: slideUp 0.3s
- Close button: X icon
- Click outside để đóng (trừ form)

---

## 💾 State Management

### localStorage Keys
```javascript
// Hiện tại
'gearmax_current_user' → { fullname, email, role }

// Customer data
'gearmax_users' → [{ id, fullname, email, password, role }]

// Cart (client)
'gearmax_cart' → [{ ...product, quantity }]
```

### Component State

**AdminLayout**
- `activeTab`: 'dashboard' | 'products' | 'orders'

**ManageProducts**
- `products`: array sản phẩm
- `showForm`: boolean
- `editingId`: null | productId
- `formData`: form input data

**ManageOrders**
- `orders`: array đơn hàng
- `selectedOrder`: null | order object

---

## 🔐 Security Notes

⚠️ **MOCK ONLY - Không dùng production!**
- Admin password là hardcoded
- Mock data stored in state (browser RAM)
- Không có backend validation
- Không có authentication token

✅ **Khi connect API:**
- Move admin auth sang backend
- Implement JWT token
- Add input validation trên server
- Add authorization checks
- Use HTTP-only cookies

---

## 📝 Code Comments

Tất cả functions có Vietnamese comments:
```javascript
// Hàm mở form thêm mới
const handleAddProduct = () => { }

// Hàm lưu sản phẩm (thêm mới hoặc sửa)
const handleSaveProduct = (e) => { }

// Hàm đảo ngược trạng thái (hiển thị/ẩn)
const handleToggleStatus = (id) => { }
```

---

## 🎯 Testing Checklist

- [ ] Đăng nhập admin: admin@gear.com / 123456
- [ ] Xem dashboard với 4 stat cards
- [ ] Xem bảng 5 đơn hàng gần đây
- [ ] Thêm sản phẩm mới (test form)
- [ ] Sửa sản phẩm (edit mode)
- [ ] Ẩn/Hiện sản phẩm (status toggle)
- [ ] Xóa sản phẩm (delete)
- [ ] Thay đổi status đơn hàng (dropdown)
- [ ] Xem chi tiết đơn hàng (modal)
- [ ] Logout
- [ ] Đăng ký customer (thử role khác)
- [ ] Responsive trên mobile

---

## 🚀 Next Steps

1. **Connect Backend API**
   - Products endpoint
   - Orders endpoint
   - User authentication

2. **Enhance Features**
   - Pagination cho bảng
   - Search/Filter products
   - Export reports (CSV/PDF)
   - Chart cho doanh thu

3. **Validation & Error Handling**
   - Input validation
   - API error messages
   - Loading states

4. **Advanced Admin Features**
   - Bulk actions
   - Import products (CSV)
   - Analytics dashboard
   - User management

---

**Tạo bởi:** GitHub Copilot
**Ngày:** 2026-06-09
**Version:** 1.0.0
