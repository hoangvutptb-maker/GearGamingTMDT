import sql from 'mssql'

// Cấu hình kết nối tới SQL Server cho môi trường local.
// Các option dưới đây giúp tránh lỗi chứng chỉ khi chạy trên máy phát triển.
const config = {
  server: process.env.DB_SERVER || 'localhost',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourStrong!Passw0rd',
  database: process.env.DB_NAME || 'GearGamingDB',
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
}

// Khởi tạo pool kết nối để tái sử dụng cho nhiều request cùng lúc.
let pool

// Hàm kết nối tới SQL Server theo kiểu fail-fast: nếu kết nối thất bại thì throw lỗi ngay.
async function connectDB() {
  if (!pool) {
    pool = new sql.ConnectionPool(config)
  }

  try {
    await pool.connect()
    await pool.request().query('SELECT 1 AS status')
    console.log('✅ Kết nối đến SQL Server thành công! Hệ thống Gaming Gear đã sẵn sàng.')
    return pool
  } catch (err) {
    console.error('❌ Lỗi kết nối SQL Server:', err.message)
    throw err
  }
}

// Export module để các file API khác có thể dùng lại.
export { connectDB, sql }
export default { connectDB, sql }
