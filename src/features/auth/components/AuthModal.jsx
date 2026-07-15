/**
 * AuthModal.jsx - Component modal xác thực (refactored)
 * Quản lý 2 chế độ: login và register
 */

import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { useAuth } from '../hooks/useAuth'

export default function AuthModal({ mode, onClose, onLogin, onSwitchMode }) {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { message, handleLogin, handleRegister } = useAuth()
  const isRegister = mode === 'register'

  // Cập nhật field
  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  // Submit form
  const handleSubmit = (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    if (isRegister) {
      handleRegister(form, (user) => {
        onLogin(user)
        setIsSubmitting(false)
      })
    } else {
      handleLogin(form.email, form.password, (user) => {
        onLogin(user)
        setIsSubmitting(false)
      })
    }

    setIsSubmitting(false)
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

        {isRegister ? (
          <RegisterForm form={form} onFieldChange={updateField} onSubmit={handleSubmit} message={message} isSubmitting={isSubmitting} />
        ) : (
          <LoginForm form={form} onFieldChange={updateField} onSubmit={handleSubmit} message={message} isSubmitting={isSubmitting} />
        )}

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
