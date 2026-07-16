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
  Heart,
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
  Sparkles,
  Trash2,
  Tag,
  Wrench,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AdminLayout from './AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import { getCart, getCurrentUser, getOrders, getProducts, loginUser, placeOrder, registerUser, saveCart as saveCartApi } from './lib/api'
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

const fallbackProducts = [
  {
    id: 1,
    name: 'Màn hình ViewSonic VX2528 25" IPS 180Hz',
    price: '2.590.000đ',
    oldPrice: '3.790.000đ',
    sale: '-32%',
    image: onlineImages.monitor,
    featured: true,
    isNew: false,
    category: 'Màn hình',
    description: 'Màn hình 180Hz, màu sắc rực rỡ và phản hồi siêu nhanh cho trò chơi và đồ họa.',
    highlights: ['180Hz', 'IPS', 'Giao hàng nhanh'],
    specs: ['Tần số quét 180Hz', 'Độ phân giải 1920x1080', 'Kết nối HDMI/DisplayPort'],
  },
  {
    id: 2,
    name: 'Bàn phím cơ AKKO 5075B Plus Blue Ocean',
    price: '1.690.000đ',
    oldPrice: '2.190.000đ',
    sale: '-23%',
    image: onlineImages.keyboard,
    featured: true,
    isNew: true,
    category: 'Bàn phím',
    description: 'Bàn phím cơ hot-swappable, switch bền bỉ và thiết kế tông xanh hiện đại.',
    highlights: ['Hot swap', 'Switch xanh', 'LED RGB'],
    specs: ['Layout 75%', 'Kết nối USB-C', 'Đèn RGB tùy chỉnh'],
  },
  {
    id: 3,
    name: 'Chuột Logitech G Pro X Superlight 2',
    price: '3.190.000đ',
    oldPrice: '3.990.000đ',
    sale: '-20%',
    image: onlineImages.mouse,
    featured: false,
    isNew: true,
    category: 'Chuột',
    description: 'Chuột siêu nhẹ, chính xác và phù hợp cho cả game FPS và làm việc.',
    highlights: ['Siêu nhẹ', 'Độ chính xác cao', 'Pin lâu'],
    specs: ['Trọng lượng 60g', 'Sensor HERO 2', 'Kết nối Lightspeed'],
  },
  {
    id: 4,
    name: 'Tai nghe HyperX Cloud III Wireless',
    price: '2.890.000đ',
    oldPrice: '3.590.000đ',
    sale: '-19%',
    image: onlineImages.headset,
    featured: true,
    isNew: false,
    category: 'Tai nghe',
    description: 'Tai nghe không dây với âm thanh rộng, đệm mềm và trải nghiệm trò chuyện mượt.',
    highlights: ['Wireless', 'Âm thanh 3D', 'Đệm bọc da'],
    specs: ['Thời lượng pin 40h', 'Kết nối 2.4GHz', 'Mic giảm ồn'],
  },
]

function Header({ cartCount, currentUser, searchValue, onSearchChange, onHome, onOpenAuth, onLogout, onOpenCart, onOpenWishlist, wishlistCount, onSearchSubmit }) {
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

          <form
            className="search-form"
            onSubmit={(event) => {
              event.preventDefault()
              onSearchSubmit && onSearchSubmit(searchValue)
            }}
          >
            <input
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Bạn cần tìm gì?"
              aria-label="Tìm kiếm sản phẩm"
            />
            <button className="search-submit" type="submit" aria-label="Tìm kiếm">
              <Search size={25} />
            </button>
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
              className="wishlist-link"
              href="#wishlist"
              onClick={(event) => {
                event.preventDefault()
                onOpenWishlist && onOpenWishlist()
              }}
            >
              <Heart size={24} />
              <span>
                Yêu thích
                <strong>{wishlistCount || 0}</strong>
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isRegister = mode === 'register'

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()
    const password = form.password.trim()

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

      setIsSubmitting(true)
      try {
        const response = await registerUser({ fullname: form.name.trim(), phone: form.phone.trim(), email, password })
        onLogin({ ...response.user, token: response.token })
      } catch (error) {
        setMessage(error.message)
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    setIsSubmitting(true)
    try {
      const response = await loginUser({ email, password })
      onLogin({ ...response.user, token: response.token })
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
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

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </form>

        <div className="auth-switch">
          {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
          <button
            type="button"
            onClick={() => {
              setMessage('')
              setForm({
                name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
              })
              onSwitchMode(isRegister ? 'login' : 'register')
            }}
          >
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

function PremiumLanding() {
  return (
    <section className="shop-container premium-landing">
      <div className="premium-hero-card">
        <div>
          <span className="premium-pill">Mua sắm đỉnh cao</span>
          <h2>Thiết bị gaming và workstation được tuyển chọn cho trải nghiệm tối ưu.</h2>
          <p>Nhận ưu đãi riêng, giao hàng nhanh và tư vấn cấu hình theo nhu cầu từ esports đến sáng tạo nội dung.</p>
          <div className="premium-hero-actions">
            <button type="button">Khám phá bộ sưu tập</button>
            <button type="button" className="ghost">Tư vấn cấu hình</button>
          </div>
        </div>
        <div className="premium-stats">
          <div><strong>24/7</strong><span>Hỗ trợ khách hàng</span></div>
          <div><strong>2 năm</strong><span>Bảo hành sản phẩm</span></div>
          <div><strong>98%</strong><span>Đánh giá hài lòng</span></div>
        </div>
      </div>
      <div className="premium-feature-row">
        <div><ShieldCheck size={18} /> Bảo hành chính hãng</div>
        <div><RotateCcw size={18} /> Đổi trả trong 7 ngày</div>
        <div><MapPin size={18} /> Showroom trên toàn quốc</div>
      </div>
    </section>
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
      <PremiumLanding />
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

function CategoryPage({ slug, products, onAddToCart, onSelect, onViewProduct, onToggleWishlist, wishlistItems }) {
  const category = useMemo(
    () => categories.find((item) => item.slug === slug) || categories[0],
    [slug],
  )
  const categoryProducts = useMemo(
    () =>
      (products || []).map((product) => ({
        ...product,
        name: product.name.includes(category.name) ? product.name : `${category.name} ${product.name}`,
      })),
    [products, category.name],
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
                <div className="product-meta-row">
                  <span className="product-badge">{product.isNew ? 'Mới' : 'Hot'}</span>
                  <button type="button" className={`wishlist-btn ${wishlistItems.some((item) => item.id === product.id) ? 'active' : ''}`} onClick={() => onToggleWishlist && onToggleWishlist(product)}>
                    <Heart size={16} />
                  </button>
                </div>
                <h3>{product.name}</h3>
                <div className="price">
                  <strong>{product.price}</strong>
                  <del>{product.oldPrice}</del>
                </div>
                <p>
                  <BadgeCheck size={16} />
                  Có sẵn tại showroom
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
    </main>
  )
}

function ProductSection({ products, onAddToCart, onViewProduct, onToggleWishlist, wishlistItems, productFilter, onFilterChange, sortOrder, onSortChange }) {
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
      <div className="product-toolbar">
        <div className="filter-chip-row">
          <button type="button" className={productFilter === 'all' ? 'filter-chip active' : 'filter-chip'} onClick={() => onFilterChange('all')}>Tất cả</button>
          <button type="button" className={productFilter === 'featured' ? 'filter-chip active' : 'filter-chip'} onClick={() => onFilterChange('featured')}>Bán chạy</button>
          <button type="button" className={productFilter === 'sale' ? 'filter-chip active' : 'filter-chip'} onClick={() => onFilterChange('sale')}>Giảm giá</button>
          <button type="button" className={productFilter === 'new' ? 'filter-chip active' : 'filter-chip'} onClick={() => onFilterChange('new')}>Hàng mới</button>
        </div>
        <select value={sortOrder} onChange={(event) => onSortChange(event.target.value)}>
          <option value="featured">Sắp xếp: Nổi bật</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
        </select>
      </div>
      <div className="product-row">
        {products.map((product) => (
          <article className="product-card" key={product.name}>
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <b>{product.sale}</b>
            </div>
            <div className="product-body">
              <div className="product-meta-row">
                <span className="product-badge">{product.isNew ? 'Mới' : 'Hot'}</span>
                <button type="button" className={`wishlist-btn ${wishlistItems.some((item) => item.id === product.id) ? 'active' : ''}`} onClick={() => onToggleWishlist && onToggleWishlist(product)}>
                  <Heart size={16} />
                </button>
              </div>
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

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

const searchAliases = {
  bp: 'ban phim',
  ck: 'chuot',
  cpu: 'cpu',
  lt: 'laptop',
  ltg: 'laptop gaming',
  mh: 'man hinh',
  pc: 'pc',
  ram: 'ram',
  ssd: 'ssd',
  tn: 'tai nghe',
  vga: 'vga',
}

function matchesProductSearch(product, searchValue) {
  const query = normalizeText(searchValue)
  if (!query) {
    return true
  }

  const haystack = normalizeText([
    product.name,
    product.category,
    product.description,
    ...(product.highlights || []),
    ...(product.specs || []),
  ].join(' '))
  const expandedQuery = searchAliases[query] || query

  return haystack.includes(expandedQuery) || expandedQuery.split(' ').every((term) => haystack.includes(term))
}

function parsePrice(price) {
  return Number(String(price).replace(/[^\d]/g, '')) || 0
}

function ProductDetailPage({ product, wishlistItems, onBack, onAddToCart, onToggleWishlist }) {
  const isWishlisted = wishlistItems.some((item) => item.id === product.id)
  return (
    <main className="shop-container product-detail-shell">
      <button type="button" className="detail-back" onClick={onBack}>← Quay lại</button>
      <div className="product-detail-layout">
        <div className="product-detail-media">
          <img src={product.image} alt={product.name} />
          <div className="product-badge-row">
            <span className="product-badge">{product.isNew ? 'Mới' : 'Hot'}</span>
            <span className="product-badge accent">{product.sale}</span>
          </div>
        </div>
        <div className="product-detail-info">
          <div className="detail-eyebrow">Sản phẩm nổi bật</div>
          <h2>{product.name}</h2>
          <p className="detail-description">{product.description || 'Thiết kế hiện đại, hiệu năng ổn định và trải nghiệm mua sắm rõ ràng như một cửa hàng thương mại điện tử chuyên nghiệp.'}</p>
          <div className="detail-price-row">
            <strong>{product.price}</strong>
            <del>{product.oldPrice}</del>
          </div>
          <div className="detail-spec-list">
            {(product.highlights || []).map((item) => (
              <div key={item} className="detail-spec-item">
                <Sparkles size={14} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="detail-actions">
            <button type="button" className="auth-submit" onClick={() => onAddToCart(product)}>Thêm vào giỏ</button>
            <button type="button" className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} onClick={() => onToggleWishlist(product)}>
              <Heart size={16} />
              {isWishlisted ? 'Đã yêu thích' : 'Yêu thích'}
            </button>
          </div>
        </div>
      </div>
      <div className="detail-info-grid">
        <div className="detail-card">
          <h3>Thông số nổi bật</h3>
          <ul>
            {(product.specs || []).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="detail-card">
          <h3>Điều kiện mua hàng</h3>
          <ul>
            <li>Bảo hành chính hãng 24 tháng</li>
            <li>Giao hàng trong 24 giờ tại nội thành</li>
            <li>Hỗ trợ đổi trả trong 7 ngày nếu lỗi từ nhà sản xuất</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

function SearchResultsPage({ searchValue, products, isSearching, onBack, onSearch, onAddToCart, onViewProduct, onToggleWishlist, wishlistItems }) {
  const normalized = normalizeText(searchValue)
  const results = products.filter((product) => matchesProductSearch(product, searchValue))

  const suggestionChips = ['laptop', 'chuột', 'màn hình', 'bàn phím', 'tai nghe']

  return (
    <main className="shop-container search-results-shell">
      <button type="button" className="detail-back" onClick={onBack}>← Quay lại</button>
      <div className="auth-card" style={{ maxWidth: 1100, margin: '0 auto', padding: 24, border: '1px solid #dbeafe', boxShadow: '0 16px 45px rgba(15, 23, 42, 0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 16 }}>
          <div>
            <span style={{ color: '#0ea5e9', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 12 }}>Kết quả tìm kiếm</span>
            <h2 style={{ margin: '6px 0 8px', color: '#0f172a' }}>{normalized ? `Tìm thấy ${results.length} sản phẩm cho “${searchValue.trim()}”` : 'Nhập từ khóa để bắt đầu tìm kiếm'}</h2>
            <p style={{ margin: 0, color: '#475569' }}>Khám phá các sản phẩm phù hợp với nhu cầu của bạn trong hệ sinh thái GearMax.</p>
            {isSearching ? <p style={{ margin: '8px 0 0', color: '#0ea5e9', fontWeight: 600 }}>Đang cập nhật kết quả...</p> : null}
          </div>
          {normalized ? (
            <div style={{ background: '#f8fbff', border: '1px solid #dbeafe', borderRadius: 999, padding: '8px 12px', color: '#0f172a', fontWeight: 600 }}>
              Từ khóa: {searchValue.trim()}
            </div>
          ) : null}
        </div>

        {normalized && results.length === 0 ? (
          <div style={{ border: '1px dashed #cbd5e1', borderRadius: 16, padding: 24, textAlign: 'center', color: '#475569' }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Không tìm thấy sản phẩm phù hợp</div>
            <p style={{ margin: '0 0 12px' }}>Hãy thử từ khóa khác như “laptop”, “chuột” hoặc “màn hình”.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {suggestionChips.map((chip) => (
                <button key={chip} type="button" onClick={() => onSearch(chip)} style={{ border: '1px solid #cbd5e1', borderRadius: 999, padding: '6px 10px', background: '#fff', cursor: 'pointer' }}>
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {results.length > 0 ? (
          <div className="product-row results-grid">
            {results.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <b>{product.sale}</b>
                </div>
                <div className="product-body">
                  <div className="product-meta-row">
                    <span className="product-badge">{product.isNew ? 'Mới' : 'Hot'}</span>
                    <button type="button" className={`wishlist-btn ${wishlistItems.some((item) => item.id === product.id) ? 'active' : ''}`} onClick={() => onToggleWishlist(product)}>
                      <Heart size={16} />
                    </button>
                  </div>
                  <h3>{product.name}</h3>
                  <div className="price">
                    <strong>{product.price}</strong>
                    <del>{product.oldPrice}</del>
                  </div>
                  <div className="product-actions">
                    <button type="button" className="btn-view" onClick={() => onViewProduct(product)}>Xem chi tiết</button>
                    <button type="button" className="btn-add" onClick={() => onAddToCart(product)}>
                      <ShoppingCart size={18} />
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  )
}

function CheckoutSuccessPage({ order, onContinue, onViewOrders }) {
  return (
    <main className="shop-container checkout-success-shell">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <span className="detail-eyebrow">Đặt hàng thành công</span>
        <h2>Cảm ơn bạn đã mua sắm tại GearMax</h2>
        <p>Đơn hàng của bạn đã được tiếp nhận và sẽ được xử lý trong thời gian sớm nhất.</p>
        <div className="success-summary">
          <div>
            <span>Mã đơn hàng</span>
            <strong>{order?.id?.slice(0, 8) || 'GVN-001'}</strong>
          </div>
          <div>
            <span>Tổng thanh toán</span>
            <strong>{order?.total?.toLocaleString('vi-VN') || '0'}đ</strong>
          </div>
        </div>
        <div className="detail-actions">
          <button type="button" className="auth-submit" onClick={onContinue}>Tiếp tục mua sắm</button>
          <button type="button" onClick={onViewOrders}>Xem đơn hàng</button>
        </div>
      </div>
    </main>
  )
}

function WishlistPage({ items, onBack, onAddToCart, onRemove }) {
  return (
    <main className="shop-container wishlist-shell">
      <button type="button" className="detail-back" onClick={onBack}>← Quay lại</button>
      <div className="auth-card" style={{ maxWidth: 980, margin: '0 auto' }}>
        <div className="auth-head">
          <span>Danh sách yêu thích</span>
          <h2>Sản phẩm bạn đã lưu</h2>
          <p>Quản lý các mặt hàng bạn muốn xem lại sau.</p>
        </div>
        {items.length === 0 ? (
          <div className="empty-wishlist">Bạn chưa lưu sản phẩm nào.</div>
        ) : (
          <div className="wishlist-grid">
            {items.map((product) => (
              <div key={product.id} className="wishlist-card">
                <img src={product.image} alt={product.name} />
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>
                  <div className="detail-actions">
                    <button type="button" className="auth-submit" onClick={() => onAddToCart(product)}>Thêm vào giỏ</button>
                    <button type="button" className="wishlist-btn" onClick={() => onRemove(product)}>Bỏ lưu</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function AccountPage({ currentUser, orders, onBack }) {
  return (
    <main className="shop-container" style={{ padding: '32px 0 80px' }}>
      <div className="auth-card" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="auth-head">
          <span>Tài khoản</span>
          <h2>Xin chào, {currentUser?.fullname}</h2>
          <p>Quản lý thông tin cá nhân và theo dõi đơn hàng của bạn.</p>
        </div>
        <div style={{ display: 'grid', gap: 18 }}>
          <div style={{ background: '#f7fbff', padding: 16, borderRadius: 14 }}>
            <strong>Thông tin cá nhân</strong>
            <p style={{ margin: '6px 0 0' }}>Email: {currentUser?.email}</p>
            <p style={{ margin: '4px 0 0' }}>Điện thoại: {currentUser?.phone || 'Chưa cập nhật'}</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e6eef7', borderRadius: 14, padding: 16 }}>
            <strong>Lịch sử đơn hàng</strong>
            {orders.length === 0 ? (
              <p style={{ marginTop: 8, color: '#64748b' }}>Bạn chưa có đơn hàng nào.</p>
            ) : (
              <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
                {orders.map((order) => (
                  <div key={order.id} style={{ border: '1px solid #e6eef7', borderRadius: 10, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <strong>Đơn #{order.id.slice(0, 8)}</strong>
                      <span style={{ color: '#0f766e', fontWeight: 700 }}>{order.status === 'pending' ? 'Chờ xử lý' : 'Đã xác nhận'}</span>
                    </div>
                    <p style={{ margin: '6px 0', color: '#475569' }}>{order.address}</p>
                    <p style={{ margin: 0, color: '#0f172a', fontWeight: 600 }}>{order.total.toLocaleString('vi-VN')}đ</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="button" onClick={onBack} className="auth-submit" style={{ maxWidth: 220 }}>Quay lại cửa hàng</button>
        </div>
      </div>
    </main>
  )
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
                <article className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <strong>{item.price}</strong>
                    <div className="cart-controls">
                      <button type="button" onClick={() => onDecrease(item.id)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => onIncrease(item)}>
                        +
                      </button>
                      <button
                        className="remove-cart"
                        type="button"
                        onClick={() => onRemove(item.id)}
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
  const [cartItems, setCartItems] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [products, setProducts] = useState(fallbackProducts)
  const [searchValue, setSearchValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Product & checkout UI state
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductDetailPage, setIsProductDetailPage] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [showWishlist, setShowWishlist] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false)
  const [orders, setOrders] = useState([])
  const [latestOrder, setLatestOrder] = useState(null)
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gearmax_wishlist') || '[]')
    } catch {
      return []
    }
  })
  const [productFilter, setProductFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('featured')

  useEffect(() => {
    const syncCheckoutSuccess = () => setShowCheckoutSuccess(window.location.hash === '#success')
    syncCheckoutSuccess()
    window.addEventListener('hashchange', syncCheckoutSuccess)
    return () => window.removeEventListener('hashchange', syncCheckoutSuccess)
  }, [])

  useEffect(() => {
    const nextQuery = searchValue.trim()
    const timer = window.setTimeout(() => {
      setSearchQuery(nextQuery)
      setShowSearchResults(Boolean(nextQuery))

      if (!nextQuery) {
        return
      }

      setShowCheckoutSuccess(false)
      setActiveCategory(null)
      setShowAccount(false)
      setShowWishlist(false)
      setIsProductDetailPage(false)
    }, nextQuery ? 300 : 0)

    return () => window.clearTimeout(timer)
  }, [searchValue])

  useEffect(() => {
    const token = localStorage.getItem('gearmax_token')
    if (!token) {
      return
    }

    let isCurrent = true
    getCurrentUser(token)
      .then((response) => {
        if (isCurrent) {
          setCurrentUser({ ...response.user, token })
        }
      })
      .catch(() => {
        if (isCurrent) {
          localStorage.removeItem('gearmax_token')
          setCurrentUser(null)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [])

  useEffect(() => {
    getProducts().then((items) => {
      if (items?.length) {
        setProducts(items)
      }
    }).catch(() => {
      setProducts(fallbackProducts)
    })
  }, [])

  useEffect(() => {
    if (!currentUser?.id) {
      return
    }

    getCart()
      .then((response) => {
        setCartItems(response.items || [])
      })
      .catch(() => {
        setCartItems([])
      })

    getOrders()
      .then((response) => {
        setOrders(response.orders || [])
      })
      .catch(() => {
        setOrders([])
      })
  }, [currentUser?.id])

  const handleHome = (event) => {
    event?.preventDefault()
    setActiveCategory(null)
  }

  const handleLogin = (user) => {
    localStorage.setItem('gearmax_current_user', JSON.stringify(user))
    localStorage.setItem('gearmax_token', user.token)
    setCurrentUser(user)
    setAuthMode(null)
  }

  const handleOpenCart = () => {
    if (!currentUser?.id) {
      setAuthMode('login')
      return
    }
    setIsCartOpen(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('gearmax_current_user')
    localStorage.removeItem('gearmax_token')
    setCurrentUser(null)
    setCartItems([])
    setShowAccount(false)
    setShowWishlist(false)
    setShowCheckoutSuccess(false)
    setShowSearchResults(false)
    setIsProductDetailPage(false)
    setSelectedProduct(null)
    setActiveCategory(null)
    window.location.hash = ''
  }

  const saveCart = async (nextCart) => {
    if (!currentUser?.id) {
      setAuthMode('login')
      return false
    }

    try {
      const response = await saveCartApi(nextCart)
      setCartItems(response.items || [])
      return true
    } catch (error) {
      alert(error.message)
      return false
    }
  }

  const handleAddToCart = async (product) => {
    if (!currentUser?.id) {
      setAuthMode('login')
      return
    }

    const nextCart = cartItems.some((item) => item.id === product.id)
      ? cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      : [...cartItems, { ...product, quantity: 1 }]

    if (await saveCart(nextCart)) {
      setIsCartOpen(true)
    }
  }

  const handleDecreaseCart = async (id) => {
    const nextCart = cartItems
      .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
      .filter((item) => item.quantity > 0)
    await saveCart(nextCart)
  }

  const handleRemoveCart = async (id) => {
    await saveCart(cartItems.filter((item) => item.id !== id))
  }

  const handleToggleWishlist = (product) => {
    const nextWishlist = wishlist.some((item) => item.id === product.id)
      ? wishlist.filter((item) => item.id !== product.id)
      : [...wishlist, product]
    setWishlist(nextWishlist)
    localStorage.setItem('gearmax_wishlist', JSON.stringify(nextWishlist))
  }

  const handleSearchChange = (value) => {
    setSearchValue(value)
  }

  const handleSearchSubmit = (value) => {
    const nextValue = value.trim()
    setSearchValue(nextValue)
    setSearchQuery(nextValue)
    setShowSearchResults(Boolean(nextValue))
    setShowCheckoutSuccess(false)
    setActiveCategory(null)
    setShowAccount(false)
    setShowWishlist(false)
    setIsProductDetailPage(false)
  }

  const handleBackToShop = () => {
    setShowCheckoutSuccess(false)
    setShowSearchResults(false)
    setShowWishlist(false)
    setShowAccount(false)
    setIsProductDetailPage(false)
    setSelectedProduct(null)
    setActiveCategory(null)
    setSearchValue('')
    window.location.hash = ''
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const filteredProducts = useMemo(() => {
    const list = products.filter((product) => {
      const matchesSearch = matchesProductSearch(product, searchValue)
      const matchesFilter = productFilter === 'all'
        ? true
        : productFilter === 'featured'
          ? Boolean(product.featured)
          : productFilter === 'sale'
            ? Boolean(product.sale && product.sale !== '0%')
            : Boolean(product.isNew)
      return matchesSearch && matchesFilter
    })

    const sorted = [...list]
    if (sortOrder === 'price-asc') {
      sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
    } else if (sortOrder === 'price-desc') {
      sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
    }
    return sorted
  }, [products, searchValue, productFilter, sortOrder])

  if (showCheckoutSuccess) {
    return (
      <>
        <Header
          cartCount={cartCount}
          currentUser={currentUser}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onHome={handleBackToShop}
          onOpenAuth={() => {
            if (currentUser) {
              setShowAccount(true)
            } else {
              setAuthMode('login')
            }
          }}
          onOpenCart={handleOpenCart}
          onOpenWishlist={() => setShowWishlist(true)}
          onLogout={handleLogout}
          wishlistCount={wishlist.length}
          onSearchSubmit={handleSearchSubmit}
        />
        <CheckoutSuccessPage
          order={latestOrder}
          onContinue={handleBackToShop}
          onViewOrders={() => {
            setShowCheckoutSuccess(false)
            setShowAccount(Boolean(currentUser))
          }}
        />
        <Footer />
      </>
    )
  }

  if (isProductDetailPage && selectedProduct) {
    return (
      <>
        <Header
          cartCount={cartCount}
          currentUser={currentUser}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onHome={() => { setActiveCategory(null); setIsProductDetailPage(false); setSelectedProduct(null) }}
          onOpenAuth={() => {
            if (currentUser) {
              setShowAccount(true)
            } else {
              setAuthMode('login')
            }
          }}
          onOpenCart={handleOpenCart}
          onOpenWishlist={() => setShowWishlist(true)}
          onLogout={handleLogout}
          wishlistCount={wishlist.length}
          onSearchSubmit={handleSearchSubmit}
        />
        <ProductDetailPage
          product={selectedProduct}
          wishlistItems={wishlist}
          onBack={() => { setIsProductDetailPage(false); setSelectedProduct(null) }}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
        />
        <Footer />
      </>
    )
  }

  if (showSearchResults) {
    return (
      <>
        <Header
          cartCount={cartCount}
          currentUser={currentUser}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onHome={() => { setActiveCategory(null); setShowSearchResults(false) }}
          onOpenAuth={() => {
            if (currentUser) {
              setShowAccount(true)
            } else {
              setAuthMode('login')
            }
          }}
          onOpenCart={handleOpenCart}
          onOpenWishlist={() => setShowWishlist(true)}
          onLogout={handleLogout}
          wishlistCount={wishlist.length}
          onSearchSubmit={handleSearchSubmit}
        />
        <SearchResultsPage
          searchValue={searchQuery}
          products={products}
          isSearching={searchValue.trim() !== searchQuery}
          onBack={() => setShowSearchResults(false)}
          onSearch={handleSearchSubmit}
          onAddToCart={handleAddToCart}
          onViewProduct={(product) => { setSelectedProduct(product); setIsProductDetailPage(true) }}
          onToggleWishlist={handleToggleWishlist}
          wishlistItems={wishlist}
        />
        <Footer />
      </>
    )
  }

  if (showWishlist) {
    return (
      <>
        <Header
          cartCount={cartCount}
          currentUser={currentUser}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onHome={() => { setActiveCategory(null); setShowWishlist(false) }}
          onOpenAuth={() => {
            if (currentUser) {
              setShowAccount(true)
            } else {
              setAuthMode('login')
            }
          }}
          onOpenCart={handleOpenCart}
          onOpenWishlist={() => setShowWishlist(true)}
          onLogout={handleLogout}
          wishlistCount={wishlist.length}
          onSearchSubmit={handleSearchSubmit}
        />
        <WishlistPage items={wishlist} onBack={() => setShowWishlist(false)} onAddToCart={handleAddToCart} onRemove={handleToggleWishlist} />
        <Footer />
      </>
    )
  }

  if (showAccount && currentUser) {
    return (
      <>
        <Header
          cartCount={cartCount}
          currentUser={currentUser}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onHome={() => { setActiveCategory(null); setShowAccount(false) }}
          onOpenAuth={() => setAuthMode('login')}
          onOpenCart={handleOpenCart}
          onOpenWishlist={() => setShowWishlist(true)}
          onLogout={handleLogout}
          wishlistCount={wishlist.length}
          onSearchSubmit={handleSearchSubmit}
        />
        <AccountPage currentUser={currentUser} orders={orders} onBack={() => setShowAccount(false)} />
        <Footer />
      </>
    )
  }

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
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onHome={handleHome}
        onOpenAuth={() => {
          if (currentUser) {
            setShowAccount(true)
          } else {
            setAuthMode('login')
          }
        }}
        onOpenCart={handleOpenCart}
        onOpenWishlist={() => setShowWishlist(true)}
        onLogout={handleLogout}
        wishlistCount={wishlist.length}
        onSearchSubmit={handleSearchSubmit}
      />
      {activeCategory ? (
        <CategoryPage
          slug={activeCategory}
          products={products}
          onAddToCart={handleAddToCart}
          onSelect={setActiveCategory}
          onViewProduct={(product) => { setSelectedProduct(product); setIsProductDetailPage(true) }}
          onToggleWishlist={handleToggleWishlist}
          wishlistItems={wishlist}
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
          <ProductSection
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            onViewProduct={(p) => { setSelectedProduct(p); setIsProductDetailPage(true) }}
            onToggleWishlist={handleToggleWishlist}
            wishlistItems={wishlist}
            productFilter={productFilter}
            onFilterChange={setProductFilter}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
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
              <p>Hoàn tất đơn hàng nhanh chóng với thông tin nhận hàng và phương thức thanh toán.</p>
            </div>
            <form
              className="auth-form"
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const payload = {
                  userId: currentUser?.id || 'guest',
                  fullname: form.fullname.value.trim(),
                  phone: form.phone.value.trim(),
                  address: form.address.value.trim(),
                  paymentMethod: form.method.value,
                  items: cartItems,
                  total: cartItems.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0),
                }
                try {
                  const response = await placeOrder(payload)
                  await saveCart([])
                  setLatestOrder(response.order)
                  setIsCheckoutOpen(false)
                  if (currentUser) {
                    setOrders((prev) => [response.order, ...prev])
                  }
                  setSelectedProduct(null)
                  setIsProductDetailPage(false)
                  setShowSearchResults(false)
                  setShowAccount(false)
                  setShowWishlist(false)
                  setActiveCategory(null)
                  setShowCheckoutSuccess(true)
                  setSearchValue('')
                  window.location.hash = '#success'
                } catch (error) {
                  alert(error.message)
                }
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

              <div style={{ background: '#f8fbff', borderRadius: 14, padding: 14, marginTop: 8 }}>
                <strong>Tóm tắt đơn hàng</strong>
                <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
                  {cartItems.map((item) => (
                    <div key={`${item.name}-${item.quantity}`} style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>{item.quantity}x {item.name}</span>
                      <span>{(parsePrice(item.price) * item.quantity).toLocaleString('vi-VN')}đ</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #dbeafe', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Tổng thanh toán</span>
                  <span>{cartItems.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0).toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

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
