/**
 * ⭐ HƯỚNG DẪN: App.jsx REFACTORED (VÍ DỤ)
 * 
 * Đây là cách App.jsx sẽ trông khi import từ features/
 * Chỉ để tham khảo - chưa apply vào file thực
 */

import { useState } from 'react'

// ======== IMPORTS TỪ FEATURES ========

// 🔐 Auth module
import AuthModal from './features/auth/components/AuthModal'
import { clearCurrentUser, readCurrentUser } from './features/auth/utils/authHelpers'

// 👑 Admin module
import AdminLayout from './features/admin/components/AdminLayout'

// ======== IMPORTS CÓ SẴN (KHÔNG THAY ĐỔI) ========

import {
  BadgeCheck,
  CircleUserRound,
  ShoppingCart,
  // ... other icons
} from 'lucide-react'
import './App.css'
import './admin.css'

// ======== MOCK DATA & HELPERS (GIỮ NGUYÊN) ========

const categories = [
  // ... (giữ nguyên)
]

const products = [
  // ... (giữ nguyên)
]

// ======== COMPONENTS CÓ SẴN (KHÔNG THAY ĐỔI) ========

function Header({ cartCount, currentUser, onHome, onOpenAuth, onLogout, onOpenCart }) {
  // ... code giữ nguyên
}

function SideAd({ side }) {
  // ... code giữ nguyên
}

function CategoryMenu({ activeSlug, onSelect }) {
  // ... code giữ nguyên
}

// ... (các components khác giữ nguyên)

// ======== MAIN APP COMPONENT ========

export default function App() {
  // State
  const [activeCategory, setActiveCategory] = useState(null)
  const [authMode, setAuthMode] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gearmax_cart') || '[]')
    } catch {
      return []
    }
  })
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gearmax_current_user') || 'null')
    } catch {
      return null
    }
  })

  // ✨ NEW: Check if user is admin
  const isAdminMode = currentUser?.role === 'admin'

  // Handlers
  const handleHome = (event) => {
    event?.preventDefault()
    setActiveCategory(null)
  }

  // ✨ REFACTORED: handleLogin sử dụng admin check
  const handleLogin = (user) => {
    // User được truyền từ AuthModal
    localStorage.setItem('gearmax_current_user', JSON.stringify(user))
    setCurrentUser(user)
    setAuthMode(null)
    // Nếu admin → AdminLayout sẽ render tự động ở JSX dưới
  }

  // ✨ REFACTORED: handleLogout sử dụng clearCurrentUser helper
  const handleLogout = () => {
    clearCurrentUser()
    setCurrentUser(null)
  }

  const saveCart = (nextCart) => {
    setCartItems(nextCart)
    localStorage.setItem('gearmax_cart', JSON.stringify(nextCart))
  }

  const handleAddToCart = (product) => {
    const nextCart = cartItems.some((item) => item.name === product.name)
      ? cartItems.map((item) =>
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item,
        )
      : [...cartItems, { ...product, quantity: 1 }]
    saveCart(nextCart)
    setIsCartOpen(true)
  }

  const handleDecreaseCart = (name) => {
    const nextCart = cartItems
      .map((item) => (item.name === name ? { ...item, quantity: item.quantity - 1 } : item))
      .filter((item) => item.quantity > 0)
    saveCart(nextCart)
  }

  const handleRemoveCart = (name) => {
    saveCart(cartItems.filter((item) => item.name !== name))
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // ======== RENDER ========

  // ✨ NEW: Check admin mode → render AdminLayout
  if (isAdminMode && currentUser) {
    return <AdminLayout currentUser={currentUser} onLogout={handleLogout} />
  }

  // ✨ REFACTORED: Return client UI (giữ nguyên logic)
  return (
    <>
      <Header
        cartCount={cartCount}
        currentUser={currentUser}
        onHome={handleHome}
        onOpenAuth={() => setAuthMode('login')}
        onOpenCart={() => setIsCartOpen(true)}
        onLogout={handleLogout}
      />
      {activeCategory ? (
        <CategoryPage
          slug={activeCategory}
          onAddToCart={handleAddToCart}
          onSelect={setActiveCategory}
        />
      ) : (
        <>
          <MainHome activeSlug={activeCategory} onSelect={setActiveCategory} />
          <AdCarousel />
          <section className="shop-container lower-banner-grid">
            {/* ... */}
          </section>
          <ProductSection onAddToCart={handleAddToCart} />
        </>
      )}
      <Footer />
      <FloatingSupport />

      {/* ✨ REFACTORED: AuthModal import từ features/ */}
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onLogin={handleLogin}
          onSwitchMode={setAuthMode}
        />
      )}

      {isCartOpen && (
        <CartDrawer
          cartItems={cartItems}
          onClose={() => setIsCartOpen(false)}
          onDecrease={handleDecreaseCart}
          onIncrease={handleAddToCart}
          onRemove={handleRemoveCart}
        />
      )}
    </>
  )
}

/**
 * ==================== THAY ĐỔI RÚT GỌN ====================
 * 
 * 1. IMPORTS
 *    OLD: const AuthModal = () => { ... }  (defined in App.jsx)
 *    NEW: import AuthModal from './features/auth/components/AuthModal'
 * 
 * 2. HELPERS
 *    OLD: localStorage.removeItem('gearmax_current_user')
 *    NEW: import { clearCurrentUser } from './features/auth/utils/authHelpers'
 *         clearCurrentUser()
 * 
 * 3. ADMIN CHECK
 *    OLD: không có admin mode check
 *    NEW: const isAdminMode = currentUser?.role === 'admin'
 *         if (isAdminMode) return <AdminLayout />
 * 
 * 4. ADMIN IMPORT
 *    OLD: inline AdminLayout component
 *    NEW: import AdminLayout from './features/admin/components/AdminLayout'
 * 
 * ========================================================
 */
