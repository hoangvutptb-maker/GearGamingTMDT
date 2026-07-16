/**
 * RegisterForm.jsx - Component form đăng ký
 * Nhập Họ tên + SĐT + Email + Mật khẩu (×2)
 */

export function RegisterForm({ form, onFieldChange, onSubmit, message, isSubmitting }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label>
        Họ và tên
        <input
          name="fullname"
          value={form.fullname}
          onChange={onFieldChange}
          placeholder="Nguyễn Văn A"
          disabled={isSubmitting}
        />
      </label>

      <label>
        Số điện thoại
        <input
          name="phone"
          value={form.phone}
          onChange={onFieldChange}
          placeholder="0901234567"
          disabled={isSubmitting}
        />
      </label>

      <label>
        Email
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={onFieldChange}
          placeholder="email@example.com"
          disabled={isSubmitting}
        />
      </label>

      <label>
        Mật khẩu
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onFieldChange}
          placeholder="Tối thiểu 6 ký tự"
          disabled={isSubmitting}
        />
      </label>

      <label>
        Nhập lại mật khẩu
        <input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={onFieldChange}
          placeholder="Nhập lại mật khẩu"
          disabled={isSubmitting}
        />
      </label>

      {message && <div className="auth-message">{message}</div>}

      <button className="auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
      </button>
    </form>
  )
}
