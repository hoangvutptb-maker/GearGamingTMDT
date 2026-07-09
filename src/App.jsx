import {
  BadgeCheck,
  BadgePercent,
  Box,
  ChevronRight,
  CircleUserRound,
  Cpu,
  Gamepad2,
  Gift,
  Headphones,
  HousePlug,
  Keyboard,
  Laptop,
  MapPin,
  Menu,
  Monitor,
  Mouse,
  PackageSearch,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Tag,
  Wrench,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AdminLayout from './AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import './App.css'

const categories = [
  { icon: Laptop, name: 'Laptop', slug: 'laptop', desc: 'Laptop văn phòng, đồ họa và học tập' },
  { icon: Laptop, name: 'Laptop Gaming', slug: 'laptop-gaming', desc: 'Laptop gaming hiệu năng cao' },
  { icon: Cpu, name: 'PC GVN', slug: 'pc-gvn', desc: 'PC build sẵn theo ngân sách' },
  { icon: Cpu, name: 'Main, CPU, VGA', slug: 'linh-kien', desc: 'Linh kiện nâng cấp cấu hình' },
  { icon: Box, name: 'Case, Nguồn, Tản', slug: 'case-nguon-tan', desc: 'Vỏ case, PSU, tản nhiệt' },
  { icon: PackageSearch, name: 'Ổ cứng, RAM, Thẻ nhớ', slug: 'luu-tru-ram', desc: 'RAM, SSD, thẻ nhớ chính hãng' },
  { icon: Headphones, name: 'Loa, Micro, Webcam', slug: 'streaming', desc: 'Thiết bị làm việc và stream' },
  { icon: Monitor, name: 'Màn hình', slug: 'man-hinh', desc: 'Màn hình gaming, đồ họa, văn phòng' },
  { icon: Keyboard, name: 'Bàn phím', slug: 'ban-phim', desc: 'Bàn phím cơ, low profile, custom' },
  { icon: Mouse, name: 'Chuột + Lót chuột', slug: 'chuot-lot-chuot', desc: 'Chuột gaming và mousepad' },
  { icon: Headphones, name: 'Tai Nghe', slug: 'tai-nghe', desc: 'Tai nghe gaming, wireless, in-ear' },
  { icon: HousePlug, name: 'Ghế - Bàn', slug: 'ghe-ban', desc: 'Bàn ghế setup góc máy' },
  { icon: Wrench, name: 'Phần mềm, mạng', slug: 'phan-mem-mang', desc: 'Thiết bị mạng và bản quyền' },
  { icon: Gamepad2, name: 'Handheld, Console', slug: 'console', desc: 'Console, tay cầm, handheld' },
  { icon: Gamepad2, name: 'Phụ kiện (Hub, sạc, cáp...)', slug: 'phu-kien', desc: 'Hub, cáp, sạc, phụ kiện setup' },
  { icon: Gift, name: 'Dịch vụ và thông tin khác', slug: 'dich-vu', desc: 'Dịch vụ kỹ thuật và bảo hành' },
]

const quickServices = [
  { icon: Tag, text: 'BUILD PC tặng màn hình 240Hz' },
  { icon: RotateCcw, text: 'Thu cũ' },
  { icon: BadgePercent, text: 'Tin tức' },
  { icon: Wrench, text: 'Dịch vụ kỹ thuật tại nhà' },
  { icon: Gift, text: 'Thu cũ đổi mới' },
  { icon: ShieldCheck, text: 'Tra cứu bảo hành' },
]

const onlineImages = {
  heroPc:
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1400&q=90',
  buildPc:
    'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=900&q=88',
  keyboard:
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=88',
  laptopGaming:
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=88',
  laptopOffice:
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=88',
  pcRgb:
    'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=900&q=90',
  headset:
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&q=88',
  mouse:
    'https://images.unsplash.com/photo-1629429407759-01cd3d7cfb38?auto=format&fit=crop&w=900&q=88',
  monitor:
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=88',
  setup:
    'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=1400&q=90',
  category:
    'https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=1000&q=88',
}

const defaultAdminUser = {
  id: 'admin',
  fullname: 'Admin Gearmax',
  phone: '0123456789',
  email: 'admin@gearmax.com',
  password: 'admin123',
  role: 'admin',
}

function ensureDefaultAdminUser() {
  try {
    const users = JSON.parse(localStorage.getItem('gearmax_users') || '[]')
    if (!users.some((user) => user.email === defaultAdminUser.email)) {
      localStorage.setItem('gearmax_users', JSON.stringify([...users, defaultAdminUser]))
    }
  } catch {
    localStorage.setItem('gearmax_users', JSON.stringify([defaultAdminUser]))
  }
}

const tiles = [
  {
    className: 'tile-keyboard',
    title: 'Phím Cơ',
    caption: 'Giảm đến',
    value: '26%',
    image: onlineImages.keyboard,
  },
  {
    className: 'tile-laptop',
    title: 'Laptop Gaming',
    caption: 'RTX 50 Series',
    value: 'Trả góp 0%',
    image: onlineImages.laptopGaming,
  },
  {
    className: 'tile-office',
    title: 'Laptop Office',
    caption: 'Mỏng nhẹ',
    value: 'Chỉ từ 9tr',
    image: onlineImages.laptopOffice,
  },
  {
    className: 'tile-pc',
    title: 'PC i5/5060',
    caption: 'Giá chỉ từ',
    value: '23.000.000đ',
    image: onlineImages.pcRgb,
  },
  {
    className: 'tile-headset',
    title: 'Flash Sale',
    caption: 'Gaming Gear',
    value: 'Từ 99K',
    image: onlineImages.headset,
  },
  {
    className: 'tile-mouse',
    title: 'Gaming Mouse',
    caption: 'Siêu nhẹ',
    value: 'Giảm 35%',
    image: onlineImages.mouse,
  },
]

const products = [
  {
    name: 'Màn hình ViewSonic VX2528 25" IPS 180Hz',
    price: '2.590.000đ',
    oldPrice: '3.790.000đ',
    sale: '-32%',
    image: onlineImages.monitor,
  },
  {
    name: 'Bàn phím cơ AKKO 5075B Plus Blue Ocean',
    price: '1.690.000đ',
    oldPrice: '2.190.000đ',
    sale: '-23%',
    image: onlineImages.keyboard,
  },
  {
    name: 'Chuột Logitech G Pro X Superlight 2',
    price: '3.190.000đ',
    oldPrice: '3.990.000đ',
    sale: '-20%',
    image: onlineImages.mouse,
  },
  {
    name: 'Tai nghe HyperX Cloud III Wireless',
    price: '2.890.000đ',
    oldPrice: '3.590.000đ',
    sale: '-19%',
    image: onlineImages.headset,
  },
]

function Header({ cartCount, currentUser, onHome, onOpenAuth, onLogout, onOpenCart }) {
  return (
    <header className="gvn-header">
      <div className="top-campaign">
        <div className="top-campaign-inner">
          <span>MUA PC</span>
          <strong>GVN</strong>
          <b>TẶNG MÀN OLED 240HZ</b>
        </div>
      </div>

      <div className="main-header">
        <div className="shop-container header-row">
          <a className="logo" href="#" onClick={onHome}>
            <span className="logo-triangle">G</span>
            <span>
              <strong>GEARMAX</strong>
              <small>GEARVN STYLE STORE</small>
            </span>
          </a>

          <button className="category-btn" type="button">
            <Menu size={28} />
            <span>Danh mục</span>
          </button>

          <form className="search-form">
            <input type="search" placeholder="Bạn cần tìm gì?" />
            <Search size={25} />
          </form>

          <nav className="header-actions">
            <a href="#">
              <Headphones size={27} />
              <span>
                Hotline
                <strong>1900.5301</strong>
              </span>
            </a>
            <a href="#">
              <MapPin size={29} />
              <span>
                Hệ thống
                <strong>Showroom</strong>
              </span>
            </a>
            <a href="#">
              <PackageSearch size={28} />
              <span>
                Tra cứu
                <strong>đơn hàng</strong>
              </span>
            </a>
            <a
              className="cart-link"
              href="#cart"
              onClick={(event) => {
                event.preventDefault()
                onOpenCart()
              }}
            >
              <ShoppingCart size={29} />
              <i>{cartCount}</i>
              <span>
                Giỏ
                <strong>hàng</strong>
              </span>
            </a>
            {currentUser ? (
              <button className="account-btn logged-in" type="button" onClick={onLogout}>
                <CircleUserRound size={29} />
                <span>
                  {currentUser.fullname}
                  <strong>Đăng xuất</strong>
                </span>
              </button>
            ) : (
              <button className="account-btn" type="button" onClick={onOpenAuth}>
              <CircleUserRound size={29} />
              <span>
                Đăng
                <strong>nhập</strong>
              </span>
              </button>
            )}
          </nav>
        </div>
      </div>

      <div className="service-nav">
        <div className="shop-container service-row">
          {quickServices.map(({ icon: Icon, text }) => (
            <a href="#" key={text}>
              <Icon size={22} />
              {text}
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}

function AuthModal({ mode, onClose, onLogin, onSwitchMode }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState('')
  const isRegister = mode === 'register'

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const readUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('gearmax_users') || '[]')
    } catch {
      return []
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()
    const password = form.password.trim()
    const users = readUsers()

    if (!email || !password) {
      setMessage('Vui lòng nhập email và mật khẩu.')
      return
    }

    if (isRegister) {
      if (!form.name.trim() || !form.phone.trim()) {
        setMessage('Vui lòng nhập họ tên và số điện thoại.')
        return
      }

      if (password.length < 6) {
        setMessage('Mật khẩu cần ít nhất 6 ký tự.')
        return
      }

      if (password !== form.confirmPassword.trim()) {
        setMessage('Mật khẩu xác nhận chưa khớp.')
        return
      }

      if (users.some((user) => user.email === email)) {
        setMessage('Email này đã được đăng ký.')
        return
      }

      const nextUser = {
        id: Date.now(),
        fullname: form.name.trim(),
        phone: form.phone.trim(),
        email,
        password,
        role: 'customer',
      }
      localStorage.setItem('gearmax_users', JSON.stringify([...users, nextUser]))
      onLogin({ fullname: nextUser.fullname, email: nextUser.email, role: nextUser.role })
      return
    }

    const foundUser = users.find((user) => user.email === email && user.password === password)
    if (!foundUser) {
      setMessage('Email hoặc mật khẩu không đúng.')
      return
    }

    onLogin({
      fullname: foundUser.fullname || foundUser.name || 'Người dùng',
      email: foundUser.email,
      role: foundUser.role || 'customer',
    })
  }

  return (
    <div className="auth-overlay" role="dialog" aria-modal="true">
      <div className="auth-card">
        <button className="auth-close" type="button" onClick={onClose}>
          ×
        </button>
        <div className="auth-head">
          <span>GEARMAX</span>
          <h2>{isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</h2>
          <p>
            {isRegister
              ? 'Lưu thông tin mua hàng, bảo hành và đơn hàng của bạn.'
              : 'Đăng nhập để theo dõi đơn hàng và nhận ưu đãi riêng.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label>
                Họ và tên
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Nguyễn Văn A"
                />
              </label>
              <label>
                Số điện thoại
                <input
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="0901234567"
                />
              </label>
            </>
          )}
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              placeholder="email@example.com"
            />
          </label>
          <label>
            Mật khẩu
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              placeholder="Tối thiểu 6 ký tự"
            />
          </label>
          {isRegister && (
            <label>
              Nhập lại mật khẩu
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={updateField}
                placeholder="Nhập lại mật khẩu"
              />
            </label>
          )}

          {message && <div className="auth-message">{message}</div>}

          <button className="auth-submit" type="submit">
            {isRegister ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </form>

        <div className="auth-switch">
          {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
          <button type="button" onClick={() => onSwitchMode(isRegister ? 'login' : 'register')}>
            {isRegister ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SideAd({ side }) {
  return (
    <aside className={`side-ad ${side}`}>
      <div className="side-ad-card">
        <small>GEARMAX</small>
        <strong>LÊN ĐỈNH TẶNG MÀN</strong>
        <img
          src={onlineImages.buildPc}
          alt="PC gaming khuyến mãi"
        />
        <span>Build PC</span>
        <b>Giảm 2% tới đa 500K</b>
      </div>
    </aside>
  )
}

function CategoryMenu({ activeSlug, onSelect }) {
  return (
    <aside className="category-menu">
      {categories.map(({ icon: Icon, name, slug }) => (
        <a
          className={activeSlug === slug ? 'active' : ''}
          href={`#${slug}`}
          key={name}
          onClick={(event) => {
            event.preventDefault()
            onSelect(slug)
          }}
        >
          <Icon size={23} strokeWidth={1.8} />
          <span>{name}</span>
          <ChevronRight size={19} />
        </a>
      ))}
    </aside>
  )
}

function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-copy">
        <span>GEARMAX</span>
        <h1>
          LÊN ĐỈNH
          <b>TẶNG MÀN</b>
        </h1>
        <p>Trên đỉnh núi có dàn PC xanh cực cháy</p>
        <div className="price-badge">
          build PC i7 <strong>16tr</strong>
        </div>
        <small>Giảm thêm 2% tới đa 500K dành cho HSSV</small>
      </div>
      <img
        src={onlineImages.heroPc}
        alt="Thùng PC gaming"
      />
    </section>
  )
}

function PromoTile({ tile }) {
  return (
    <a className={`promo-tile ${tile.className}`} href="#">
      <div>
        <span>{tile.caption}</span>
        <h2>{tile.title}</h2>
        <strong>{tile.value}</strong>
      </div>
      <img src={tile.image} alt={tile.title} />
    </a>
  )
}

function MainHome({ activeSlug, onSelect }) {
  return (
    <main className="home-wrap">
      <SideAd side="left" />
      <div className="shop-container content-grid">
        <CategoryMenu activeSlug={activeSlug} onSelect={onSelect} />
        <div className="banner-grid">
          <HeroBanner />
          <PromoTile tile={tiles[0]} />
          {tiles.slice(1, 4).map((tile) => (
            <PromoTile tile={tile} key={tile.title} />
          ))}
        </div>
      </div>
      <SideAd side="right" />
    </main>
  )
}

function AdCarousel() {
  const slides = [
    {
      title: 'Sắm laptop xanh hè',
      text: 'Tặng voucher gear đến 1 triệu',
      cta: 'Xem ưu đãi',
      image:
        onlineImages.laptopGaming,
    },
    {
      title: 'Build PC theo game',
      text: 'Tối ưu FPS cho Valorant, CS2, PUBG',
      cta: 'Tư vấn cấu hình',
      image:
        onlineImages.buildPc,
    },
    {
      title: 'Nâng cấp góc máy',
      text: 'Chuột nhẹ, phím cơ, tai nghe wireless',
      cta: 'Mua gaming gear',
      image:
        onlineImages.setup,
    },
  ]

  return (
    <section className="shop-container ad-carousel">
      <div className="ad-track">
        {[...slides, ...slides].map((slide, index) => (
          <article className="ad-slide" key={`${slide.title}-${index}`}>
            <div>
              <span>Khuyến mãi nổi bật</span>
              <h2>{slide.title}</h2>
              <p>{slide.text}</p>
              <button type="button">{slide.cta}</button>
            </div>
            <img src={slide.image} alt={slide.title} />
          </article>
        ))}
      </div>
    </section>
  )
}

function CategoryPage({ slug, onAddToCart, onSelect }) {
  const category = useMemo(
    () => categories.find((item) => item.slug === slug) || categories[0],
    [slug],
  )
  const categoryProducts = useMemo(
    () =>
      [...products, ...products].map((product, index) => ({
        ...product,
        name:
          index % 2 === 0
            ? product.name
            : `${category.name} ${product.name.split(' ').slice(0, 4).join(' ')}`,
      })),
    [category.name],
  )

  return (
    <main className="shop-container category-page">
      <CategoryMenu activeSlug={slug} onSelect={onSelect} />
      <section className="category-content">
        <div className="breadcrumb">Trang chủ / {category.name}</div>
        <div className="category-hero">
          <div>
            <span>Danh mục sản phẩm</span>
            <h1>{category.name}</h1>
            <p>{category.desc}. Chọn nhanh theo nhu cầu, ngân sách và thương hiệu.</p>
          </div>
          <img
            src={onlineImages.category}
            alt={category.name}
          />
        </div>
        <div className="category-toolbar">
          <button type="button">Tất cả</button>
          <button type="button">Bán chạy</button>
          <button type="button">Giảm giá</button>
          <button type="button">Hàng mới</button>
          <select defaultValue="popular">
            <option value="popular">Sắp xếp: Nổi bật</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>
        <div className="category-product-grid">
          {categoryProducts.map((product, index) => (
            <article className="product-card" key={`${product.name}-${index}`}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <b>{product.sale}</b>
              </div>
              <div className="product-body">
                <h3>{product.name}</h3>
                <div className="price">
                  <strong>{product.price}</strong>
                  <del>{product.oldPrice}</del>
                </div>
                <p>
                  <BadgeCheck size={16} />
                  Có sẵn tại showroom
                </p>
                <button type="button" onClick={() => onAddToCart(product)}>
                  <ShoppingCart size={18} />
                  Thêm vào giỏ
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function ProductSection({ onAddToCart, onViewProduct }) {
  return (
    <section className="shop-container product-section">
      <div className="section-title">
        <h2>Deal gấp rút - bốc trúng phóc</h2>
        <div className="countdown">
          <span>00</span>
          <span>18</span>
          <span>35</span>
          <span>46</span>
        </div>
      </div>
      <div className="product-row">
        {products.map((product) => (
          <article className="product-card" key={product.name}>
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <b>{product.sale}</b>
            </div>
            <div className="product-body">
              <h3>{product.name}</h3>
              <div className="price">
                <strong>{product.price}</strong>
                <del>{product.oldPrice}</del>
              </div>
              <p>
                <BadgeCheck size={16} />
                Hàng chính hãng, bảo hành rõ ràng
              </p>
              <div className="product-actions">
                <button type="button" className="btn-view" onClick={() => onViewProduct && onViewProduct(product)}>
                  Xem chi tiết
                </button>
                <button type="button" className="btn-add" onClick={() => onAddToCart(product)}>
                  <ShoppingCart size={18} />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function parsePrice(price) {
  return Number(String(price).replace(/[^\d]/g, '')) || 0
}

function CartDrawer({ cartItems, onClose, onDecrease, onIncrease, onRemove, onCheckout }) {
  const total = cartItems.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0,
  )

  return (
    <div className="cart-overlay">
      <aside className="cart-drawer">
        <div className="cart-head">
          <div>
            <span>Giỏ hàng</span>
            <h2>{cartItems.length ? `${cartItems.length} sản phẩm` : 'Chưa có sản phẩm'}</h2>
          </div>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <ShoppingCart size={44} />
            <p>Giỏ hàng của bạn đang trống.</p>
            <button type="button" onClick={onClose}>
              Tiếp tục mua hàng
            </button>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map((item) => (
                <article className="cart-item" key={item.name}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <strong>{item.price}</strong>
                    <div className="cart-controls">
                      <button type="button" onClick={() => onDecrease(item.name)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => onIncrease(item)}>
                        +
                      </button>
                      <button
                        className="remove-cart"
                        type="button"
                        onClick={() => onRemove(item.name)}
                        aria-label={`Xóa ${item.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <div>
                <span>Tạm tính</span>
                <strong>{total.toLocaleString('vi-VN')}đ</strong>
              </div>
              <button type="button" onClick={() => onCheckout && onCheckout()}>Thanh toán</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

function FloatingSupport() {
  return (
    <div className="floating-support">
      <button className="translate-btn" type="button">
        文A
      </button>
      <button className="water-btn" type="button">
        ♡
      </button>
      <div className="chat-bubble">
        <button type="button">×</button>
        <span>Bạn cần hỗ trợ gì?</span>
      </div>
      <button className="bot-btn" type="button">
        <Headphones size={30} />
      </button>
      <button className="zalo-btn" type="button">
        Zalo
      </button>
    </div>
  )
}

function Footer() {
  return (
    <footer className="shop-footer">
      <div className="shop-container footer-row">
        <strong>GEARMAX</strong>
        <span>Demo giao diện React + Bootstrap theo layout bán lẻ gaming gear, tông xanh.</span>
      </div>
    </footer>
  )
}

function App() {
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

  // Product & checkout UI state
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductOpen, setIsProductOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  useEffect(() => {
    ensureDefaultAdminUser()
  }, [])

  const handleHome = (event) => {
    event?.preventDefault()
    setActiveCategory(null)
  }

  const handleLogin = (user) => {
    localStorage.setItem('gearmax_current_user', JSON.stringify(user))
    setCurrentUser(user)
    setAuthMode(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('gearmax_current_user')
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

  if (currentUser?.role === 'admin' || currentUser?.role === 'staff') {
    return (
      <ProtectedRoute currentUser={currentUser}>
        <AdminLayout currentUser={currentUser} onLogout={handleLogout} />
      </ProtectedRoute>
    )
  }

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
            {tiles.slice(4).map((tile) => (
              <PromoTile tile={tile} key={tile.title} />
            ))}
            <PromoTile tile={tiles[0]} />
          </section>
          <ProductSection onAddToCart={handleAddToCart} onViewProduct={(p) => { setSelectedProduct(p); setIsProductOpen(true) }} />
        </>
      )}
      <Footer />
      <FloatingSupport />
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
          onCheckout={() => { setIsCheckoutOpen(true); setIsCartOpen(false) }}
        />
      )}

      {/* Product detail modal */}
      {isProductOpen && selectedProduct && (
        <div className="auth-overlay" role="dialog" aria-modal="true">
          <div className="auth-card" style={{ maxWidth: 900 }}>
            <button className="auth-close" type="button" onClick={() => setIsProductOpen(false)}>
              ×
            </button>
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ flex: '0 0 420px' }}>
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div style={{ flex: 1 }}>
                <h2>{selectedProduct.name}</h2>
                <p style={{ fontSize: 18, fontWeight: 700 }}>{selectedProduct.price}</p>
                <p style={{ color: '#666' }}>Mô tả: Đây là mô tả demo cho sản phẩm. Thêm thông tin chi tiết ở đây.</p>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button type="button" className="auth-submit" onClick={() => { handleAddToCart(selectedProduct); setIsProductOpen(false) }}>
                    Thêm vào giỏ
                  </button>
                  <button type="button" onClick={() => setIsProductOpen(false)}>
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout modal */}
      {isCheckoutOpen && (
        <div className="auth-overlay" role="dialog" aria-modal="true">
          <div className="auth-card" style={{ maxWidth: 680 }}>
            <button className="auth-close" type="button" onClick={() => setIsCheckoutOpen(false)}>
              ×
            </button>
            <div className="auth-head">
              <span>Thanh toán</span>
              <h2>Thông tin giao hàng</h2>
              <p>Nhập thông tin để hoàn tất thanh toán.</p>
            </div>
            <form
              className="auth-form"
              onSubmit={(e) => {
                e.preventDefault()
                // Simulate order placement
                saveCart([])
                setIsCheckoutOpen(false)
                alert('Đặt hàng thành công — đơn hàng demo đã được tạo.')
              }}
            >
              <label>
                Họ và tên
                <input name="fullname" required placeholder="Nguyễn Văn A" />
              </label>
              <label>
                Số điện thoại
                <input name="phone" required placeholder="0901234567" />
              </label>
              <label>
                Địa chỉ giao hàng
                <input name="address" required placeholder="Số nhà, phường, quận, tỉnh" />
              </label>
              <label>
                Phương thức thanh toán
                <select name="method">
                  <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                  <option value="bank">Chuyển khoản</option>
                  <option value="card">Thẻ tín dụng / ATM</option>
                </select>
              </label>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="auth-submit" type="submit">
                  Thanh toán và đặt hàng
                </button>
                <button type="button" onClick={() => setIsCheckoutOpen(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default App
