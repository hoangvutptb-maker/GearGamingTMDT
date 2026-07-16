/**
 * useAuth.js - Custom hook để quản lý trạng thái xác thực
 */

import { useState } from 'react'
import {
  validateLoginForm,
  validateRegisterForm,
  findUserByCredentials,
  createNewUser,
  saveNewUser,
  saveCurrentUser,
} from '../utils/authHelpers'

export function useAuth() {
  const [message, setMessage] = useState('')

  /**
   * Xử lý đăng nhập
   */
  const handleLogin = (email, password, onSuccess) => {
    // Validate form
    const error = validateLoginForm(email, password)
    if (error) {
      setMessage(error)
      return
    }

    // Tìm user
    const foundUser = findUserByCredentials(email, password)
    if (!foundUser) {
      setMessage('Email hoặc mật khẩu không đúng.')
      return
    }

    // Lưu user + Callback
    saveCurrentUser({
      fullname: foundUser.fullname,
      email: foundUser.email,
      role: foundUser.role,
    })
    setMessage('')
    onSuccess({
      fullname: foundUser.fullname,
      email: foundUser.email,
      role: foundUser.role,
    })
  }

  /**
   * Xử lý đăng ký
   */
  const handleRegister = (formData, onSuccess) => {
    // Validate form
    const error = validateRegisterForm(formData)
    if (error) {
      setMessage(error)
      return
    }

    // Tạo + Lưu user
    const newUser = createNewUser(formData)
    saveNewUser(newUser)

    // Lưu current user (tự động login)
    saveCurrentUser({
      fullname: newUser.fullname,
      email: newUser.email,
      role: newUser.role,
    })

    setMessage('')
    onSuccess({
      fullname: newUser.fullname,
      email: newUser.email,
      role: newUser.role,
    })
  }

  return {
    message,
    setMessage,
    handleLogin,
    handleRegister,
  }
}
