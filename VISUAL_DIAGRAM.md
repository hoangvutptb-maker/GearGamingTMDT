# 🎨 VISUAL DIAGRAM - CẤU TRÚC & FLOW

## 1️⃣ FOLDER STRUCTURE DIAGRAM

```
GearGamingTMDT (Project root)
│
├── src/
│   ├── 🔐 features/auth/
│   │   ├── components/
│   │   │   ├── 📄 AuthModal.jsx ──────────────┐
│   │   │   ├── 📄 LoginForm.jsx   ┐           │
│   │   │   └── 📄 RegisterForm.jsx ┼─ import ─┤
│   │   │                           ┘           │
│   │   ├── hooks/                              │
│   │   │   └── 📄 useAuth.js ─────────────────┤
│   │   └── utils/                              │
│   │       └── 📄 authHelpers.js ─────────────┘
│   │
│   ├── 👑 features/admin/
│   │   ├── components/
│   │   │   ├── 📄 AdminLayout.jsx ────────────┐
│   │   │   ├── 📄 AdminSidebar.jsx           │
│   │   │   └── 📄 AdminHeader.jsx            │
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   │   └── 📄 AdminDashboard.jsx     │
│   │   │   ├── Products/
│   │   │   │   └── 📄 ManageProducts.jsx     ├─ import
│   │   │   └── Orders/                       │
│   │   │       └── 📄 ManageOrders.jsx       │
│   │   ├── hooks/                             │
│   │   │   └── 📄 useAdminTab.js             │
│   │   └── utils/                             │
│   │       └── 📄 adminHelpers.js ───────────┘
│   │
│   ├── 📄 App.jsx ◄────── Main entry point (import từ features/)
│   ├── 🎨 App.css
│   ├── 🎨 admin.css
│   ├── 📄 main.jsx
│   └── ...
│
├── 📖 CODE_STRUCTURE_GUIDE.md ◄────── Tài liệu giải thích code
├── 📖 FOLDER_STRUCTURE_GUIDE.md ◄────── Hướng dẫn folder
├── 📖 APP_REFACTORED_EXAMPLE.md ◄────── Ví dụ App.jsx mới
├── 📖 ADMIN_GUIDE.md
├── 📖 ADMIN_QUICKSTART.md
│
└── package.json
    vite.config.js
    eslint.config.js
    ...

```

---

## 2️⃣ USER FLOW DIAGRAM

### 🔐 ĐĂNG NHẬP CUSTOMER

```
┌─────────────────────────────────────────────────────────┐
│ USER TRÊN TRANG CHỦ                                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ Nhấn "Đăng nhập"
                 ↓
         ┌───────────────────────┐
         │ <AuthModal />          │
         │ mode="login"           │
         └───────┬───────────────┘
                 │
                 │ Render <LoginForm />
                 ↓
         ┌───────────────────────────────────────┐
         │ <LoginForm />                         │
         │ ├─ Email input                        │
         │ ├─ Password input                     │
         │ └─ [Đăng nhập] button                │
         └───────┬───────────────────────────────┘
                 │
                 │ Submit form
                 ↓
         ┌───────────────────────────────────────┐
         │ useAuth hook                          │
         │ handleLogin(email, password)          │
         └───────┬───────────────────────────────┘
                 │
                 │ Call authHelpers
                 ↓
         ┌───────────────────────────────────────┐
         │ authHelpers.validateLoginForm()       │
         │ Check: email + password not empty?    │
         └───────┬───────────────────────────────┘
                 │ YES
                 ↓
         ┌───────────────────────────────────────┐
         │ authHelpers.findUserByCredentials()   │
         │ Find user từ gearmax_users            │
         └───────┬──────────────┬────────────────┘
                 │              │
            FOUND │              │ NOT FOUND
                 ↓              ↓
            ✅ SAVE      ❌ ERROR MESSAGE
            User to       "Email hoặc
            localStorage   mật khẩu sai"
                 │
                 │ onLogin() callback
                 ↓
         ┌───────────────────────────────────────┐
         │ App.jsx handleLogin(user)             │
         │ ├─ setCurrentUser(user)               │
         │ ├─ localStorage.setItem(...)          │
         │ └─ setAuthMode(null) ◄─ Close modal  │
         └───────┬───────────────────────────────┘
                 │
            ✅ SUCCESS
                 │
         ┌──────┴──────────────────────────────┐
         │                                     │
    role='customer'                    role='admin'
         │                                     │
         ↓                                     ↓
   Trang chủ                            AdminLayout
   + Giỏ hàng                           + Dashboard
   + Header: "Name"                     + Products CRUD
                                        + Orders CRUD
```

### 📝 ĐĂNG KÝ CUSTOMER

```
Nhấn "Đăng nhập" → AuthModal login mode
    ↓
Nhấn "Đăng ký ngay" → onSwitchMode('register')
    ↓
AuthModal mode="register"
    ↓
Render <RegisterForm />
    ├─ Họ tên input
    ├─ SĐT input
    ├─ Email input
    ├─ Password input
    ├─ Confirm password input
    └─ [Đăng ký] button
    ↓
Submit form
    ↓
useAuth hook
    ↓
authHelpers.validateRegisterForm()
    ├─ Check: fullname, phone, email, password không trống?
    ├─ Check: password ≥ 6 ký tự?
    ├─ Check: password === confirmPassword?
    └─ Check: email chưa tồn tại?
    ↓
✅ ALL VALID
    ↓
authHelpers.createNewUser()
    ├─ New user object {id, fullname, phone, email, password, role:'customer'}
    ↓
authHelpers.saveNewUser()
    ├─ Lưu vào localStorage['gearmax_users']
    ↓
Tự động login
    ↓
Trang chủ
```

---

## 3️⃣ ADMIN DASHBOARD FLOW

```
┌─────────────────────────────────────────────────────────┐
│ AFTER LOGIN (role='admin')                              │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ App.jsx check: isAdminMode?
                 │ (currentUser?.role === 'admin')
                 ↓
         ┌───────────────────────────────────────┐
         │ <AdminLayout />                       │
         │ currentUser={currentUser}             │
         │ onLogout={handleLogout}               │
         └───────┬───────────────────────────────┘
                 │
        ┌────────┴────────────────────────┐
        │                                 │
        ↓                                 ↓
    AdminSidebar                   AdminHeader
    menu items:                    ├─ "Xin chào, Admin"
    ├─ 📊 Dashboard                └─ [Đăng xuất]
    ├─ 🎮 Products                      │ onclick
    └─ 📦 Orders                        ↓
        │                           clearCurrentUser()
        │ onClick (setActiveTab)     setCurrentUser(null)
        │                                │
    activeTab state                      ↓
        │                           Back to login
        ├─ 'dashboard'
        ├─ 'products'
        └─ 'orders'
        │
        │ renderContent()
        ↓
    ┌───────────────┬──────────────┬────────────────┐
    │               │              │                │
activeTab='dashboard'│        activeTab='products' ... activeTab='orders'
    ↓               │              ↓                │
┌───────────────┐  │  ┌──────────────────────┐     ↓
│AdminDashboard │  │  │ManageProducts        │  ┌─────────────┐
│               │  │  │                      │  │ManageOrders │
│• 4 Stat Cards │  │  │• Table (ID, Name...)│  │             │
│• Recent Orders   │  │• [Thêm sản phẩm] btn│  │• Table (ID, │
│  Table        │  │  │                      │  │  Name...)   │
└───────────────┘  │  │CRUD:                │  │             │
                   │  │• Edit row            │  │FEATURES:    │
                   │  │• Toggle visibility   │  │• Status     │
                   │  │• Delete row          │  │  dropdown   │
                   │  │                      │  │• View detail│
                   │  │Modal Form:           │  │  modal      │
                   │  │• Add/Edit product    │  └─────────────┘
                   │  └──────────────────────┘
                   │
                   └─ All useState in components
                      (Mock data only, not persistent)
```

---

## 4️⃣ COMPONENT HIERARCHY

```
App
├── Header
│   ├── Logo
│   ├── Search bar
│   └── Account button
│       └── AuthModal
│           ├── LoginForm
│           │   ├── Email input
│           │   ├── Password input
│           │   └── [Login] button
│           ├── RegisterForm
│           │   ├── Fullname input
│           │   ├── Phone input
│           │   ├── Email input
│           │   ├── Password input
│           │   ├── Confirm password input
│           │   └── [Register] button
│           └── Mode switcher
│
├── AdminLayout (if role='admin')
│   ├── AdminSidebar
│   │   ├── Logo
│   │   └── Menu items (3)
│   ├── AdminHeader
│   │   ├── Greeting text
│   │   └── [Logout] button
│   └── AdminContent
│       ├── AdminDashboard
│       │   ├── Stats Grid (4 cards)
│       │   └── Orders Table
│       ├── ManageProducts
│       │   ├── [Add] button
│       │   ├── Products Table
│       │   └── Product Modal Form
│       └── ManageOrders
│           ├── Orders Table
│           │   ├── Dropdown (status)
│           │   └── [View] button
│           └── Order Detail Modal
│
└── ClientUI (if role!='admin')
    ├── MainHome
    ├── CategoryPage
    ├── ProductSection
    ├── CartDrawer
    └── Footer
```

---

## 5️⃣ DATA FLOW (localStorage)

```
┌─────────────────────────────────────────────────────┐
│ localStorage (Browser)                              │
│ ─────────────────────────────────────────────────── │
│                                                     │
│ KEY: 'gearmax_current_user'                        │
│ VALUE: {                                           │
│   fullname: 'Nguyễn Văn A',                       │
│   email: 'customer@gmail.com',                    │
│   role: 'customer' ◄── IMPORTANT!                 │
│ }                                                  │
│                                                     │
│ KEY: 'gearmax_users'                              │
│ VALUE: [                                          │
│   { id, fullname, phone, email, password, role }, │
│   { id, fullname, phone, email, password, role }, │
│   ...                                             │
│ ]                                                  │
│                                                     │
│ KEY: 'gearmax_cart'                               │
│ VALUE: [                                          │
│   { name, quantity, price, image },               │
│   { name, quantity, price, image },               │
│   ...                                             │
│ ]                                                  │
└─────────────────────────────────────────────────────┘
```

---

## 6️⃣ FILE SIZE REFERENCE

| Module | Files | Est. Lines |
|--------|-------|-----------|
| **Auth** | 5 files | ~450 lines |
| | authHelpers.js | 150 |
| | useAuth.js | 80 |
| | AuthModal.jsx | 80 |
| | LoginForm.jsx | 50 |
| | RegisterForm.jsx | 90 |
| **Admin** | 8 files | ~1,500 lines |
| | AdminLayout.jsx | 40 |
| | AdminSidebar.jsx | 60 |
| | AdminHeader.jsx | 30 |
| | AdminDashboard.jsx | 150 |
| | ManageProducts.jsx | 500 |
| | ManageOrders.jsx | 400 |
| | adminHelpers.js | 100 |
| | useAdminTab.js | 30 |
| **Total** | **13 files** | **~1,950 lines** |

---

## 🎯 QUICK REFERENCE

### Import Pattern

```javascript
// ❌ OLD (everything in App.jsx)
function App() {
  function AuthModal() { ... }
  function AdminLayout() { ... }
  ...
}

// ✅ NEW (organized by features)
import AuthModal from './features/auth/components/AuthModal'
import AdminLayout from './features/admin/components/AdminLayout'
import { validateLoginForm } from './features/auth/utils/authHelpers'
import { formatPrice } from './features/admin/utils/adminHelpers'

function App() {
  // ... clean code
}
```

### Hook Usage

```javascript
// Features/auth/hooks/useAuth.js
const { message, handleLogin, handleRegister } = useAuth()

// Features/admin/hooks/useAdminTab.js
const { activeTab, changeTab } = useAdminTab('dashboard')
```

### State Management

```javascript
// App.jsx (root level)
const [currentUser, setCurrentUser] = useState(...)
const [authMode, setAuthMode] = useState(...)

// Components (local level)
const [showForm, setShowForm] = useState(false)
const [activeTab, setActiveTab] = useState('dashboard')
```

---

## 📊 COMPARISON

| Aspect | Before | After |
|--------|--------|-------|
| **App.jsx size** | 1000+ lines | 200-300 lines |
| **Findability** | Hard | Easy (features/) |
| **Reusability** | Low | High (hooks) |
| **Testability** | Hard | Easy (separate files) |
| **Scalability** | Difficult | Easy (modular) |
| **Maintenance** | Time-consuming | Quick fixes |
