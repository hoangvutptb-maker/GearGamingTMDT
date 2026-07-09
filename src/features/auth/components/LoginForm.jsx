/**
 * LoginForm.jsx - Component form đăng nhập
 * Chỉ nhập Email + Mật khẩu
 */

export function LoginForm({ form, onFieldChange, onSubmit, message, isSubmitting }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
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

      {message && <div className="auth-message">{message}</div>}

      <button className="auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  )
}
