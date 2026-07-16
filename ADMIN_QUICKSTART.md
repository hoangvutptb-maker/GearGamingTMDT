# 🚀 ADMIN DASHBOARD - QUICK START GUIDE

## 📌 TÀI KHOẢN ADMIN MẶC ĐỊNH

```
Email:    admin@gear.com
Password: 123456
```

---

## 🔐 CÁCH TRUY CẬP ADMIN DASHBOARD

1. **Trên trang chủ**, nhấn nút "Đăng nhập"
2. **Điền thông tin:**
   - Email: `admin@gear.com`
   - Password: `123456`
3. **Nhấn "Đăng nhập"**
4. **Redirect sang Admin Dashboard** ✅

---

## 🎛️ MODULE 1: TỔNG QUAN (DASHBOARD)

Hiển thị:
- ✅ **4 Stat Cards**: Doanh thu, Đơn hàng, Sản phẩm, Khách hàng
- ✅ **Bảng 5 đơn hàng mới nhất**
- ✅ **Status badges**: Chờ xử lý, Đang giao, Hoàn thành, Đã hủy

---

## 🎮 MODULE 2: QUẢN LÝ SẢN PHẨM

### TEST: Thêm sản phẩm mới

1. Nhấn **"Thêm sản phẩm"**
2. Điền form:
   - Tên: `Chuột gaming SteelSeries Rival 600`
   - Danh mục: `Chuột`
   - Giá: `4990000`
   - Tồn kho: `20`
   - Status: `Hiển thị`
3. Nhấn **"Lưu sản phẩm"** ✅

### TEST: Sửa sản phẩm

1. Nhấn nút **"Sửa"** ở dòng bất kỳ
2. Chỉnh sửa các trường
3. Nhấn **"Lưu sản phẩm"** ✅

### TEST: Ẩn/Hiện sản phẩm

1. Nhấn nút **con mắt (Eye)** ở dòng sản phẩm
2. Status sẽ đảo ngược: `Hiển thị` → `Ẩn` ✅

### TEST: Xóa sản phẩm

1. Nhấn nút **Thùng rác (Delete)**
2. Sản phẩm sẽ bị xóa khỏi bảng ngay ✅

---

## 📦 MODULE 3: QUẢN LÝ ĐƠN HÀNG

### TEST: Update trạng thái đơn hàng

1. Ở cột "Trạng thái", chọn **dropdown**
2. Chọn trạng thái mới:
   - 🟡 Chờ xử lý (Yellow)
   - 🔵 Đang giao (Cyan)
   - 🟢 Hoàn thành (Green)
   - 🔴 Đã hủy (Red)
3. Trạng thái cập nhật **ngay** (instant) ✅

### TEST: Xem chi tiết đơn hàng

1. Nhấn vào **"Mã đơn"** (VD: ORD-001) hoặc nút **"Xem chi tiết"**
2. Modal hiện lên với:
   - Thông tin khách: Tên, SĐT, Địa chỉ
   - Danh sách sản phẩm: Tên, Số lượng, Giá, Thành tiền
   - Tóm tắt: Tổng cộng, Phương thức thanh toán
3. Nhấn **"Đóng"** hoặc click ngoài modal ✅

---

## 🔐 LOGOUT

1. Nhấn nút **"Đăng xuất"** (LogOut icon) ở header
2. Quay về trang chủ
3. **localStorage** được xóa sạch ✅

---

## 👤 TEST: ĐĂNG NHẬP CUSTOMER

1. **Logout** khỏi admin
2. Nhấn **"Đăng nhập"** trên trang chủ
3. Chọn **"Đăng ký ngay"**
4. Điền form:
   - Họ và tên: `Nguyễn Văn B`
   - Email: `customer@gmail.com`
   - Mật khẩu: `123456`
   - Nhập lại: `123456`
5. Nhấn **"Đăng ký"** ✅
6. Customer được tạo với `role="customer"`
7. Logout rồi đăng nhập lại bằng email customer
8. **Chỉ thấy giao diện client, KHÔNG thấy admin dashboard** ✅

---

## 🛠️ DEVELOPER TOOLS (Browser Console)

### Xem admin account
```javascript
JSON.parse(localStorage.getItem('gearmax_current_user'))
```

### Xem danh sách customers
```javascript
JSON.parse(localStorage.getItem('gearmax_users'))
```

### Xem giỏ hàng
```javascript
JSON.parse(localStorage.getItem('gearmax_cart'))
```

### Xóa current user (để test logout)
```javascript
localStorage.removeItem('gearmax_current_user')
```

### Xóa tất cả data
```javascript
localStorage.clear()
```

---

## 📊 DATA STRUCTURE (Mock Data)

### PRODUCTS:
```javascript
{
  id: 1,
  name: 'Laptop Gaming ASUS ROG G16',
  category: 'Laptop Gaming',
  price: '45990000',           // Format VND
  stock: 12,                    // Số lượng tồn kho
  status: 'active',             // 'active' hoặc 'hidden'
  image: 'https://...',         // URL hình ảnh
  specs: {                      // Thông số kỹ thuật
    cpu: 'Intel i9',
    gpu: 'RTX 4090',
    ram: '32GB'
  }
}
```

### ORDERS:
```javascript
{
  orderId: 'ORD-001',
  customerName: 'Nguyễn Văn A',
  phone: '0912345678',
  address: '123 Đường Lê Lợi, Q.1, TP.HCM',
  date: '2024-01-15',           // YYYY-MM-DD
  totalAmount: '12590000',      // Format VND
  status: 'pending',            // pending | shipping | completed | cancelled
  items: [
    {
      name: 'Bàn phím cơ AKKO 5075B Plus',
      quantity: 1,
      price: '1690000'          // Giá từng cái
    }
  ]
}
```

### USERS:
```javascript
{
  id: 1,                        // Date.now() hoặc fixed ID
  fullname: 'Admin GEARMAX',
  email: 'admin@gear.com',
  password: '123456',
  role: 'admin'                 // 'admin' hoặc 'customer'
}
```

---

## 📱 RESPONSIVE TESTING

| Device | Sidebar | Layout |
|--------|---------|--------|
| Desktop (1920px) | 260px | Full layout |
| Tablet (768px) | 200px | Responsive |
| Mobile (480px) | 160px | Mobile optimized |

**DevTools:** Toggle device toolbar (Ctrl+Shift+M)

---

## 🐛 COMMON ISSUES & FIXES

### Issue: Admin dashboard không hiện
```javascript
// Fix: Xóa localStorage và đăng nhập lại
localStorage.clear()
```

### Issue: Sidebar không có menu items
**Fix:** Kiểm tra admin.css đã được import
- File: `src/App.jsx` → `import './admin.css'`

### Issue: Form modal không hiện
**Fix:** Check show modal state
- File: `ManageProducts.jsx` → `showForm` state phải true

### Issue: Status dropdown không update
**Fix:** Check event handler
- File: `ManageOrders.jsx` → `handleStatusChange` function

---

## 📌 NOTES

- ✅ Tất cả dữ liệu được lưu trong **STATE** (React), không persistent
- ✅ Khi **refresh page**, state reset về mock data ban đầu
- ✅ Để **persistent**, cần `localStorage.setItem()` hoặc **API backend**
- ✅ Admin CSS **isolated** trong admin.css, không ảnh hưởng client CSS
- ✅ Tất cả functions có **comment Tiếng Việt**
- ✅ **Ready để connect API** - chỉ cần replace mock data bằng API calls

---

## ✨ NEXT STEPS

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

---

**Created:** 2026-06-09
**Version:** 1.0.0
**Status:** ✅ Ready for Development
