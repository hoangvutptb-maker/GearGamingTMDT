/**
 * src/features/admin/hooks/useAdminTab.js
 * Hook để quản lý tab hiện tại
 */

import { useState } from 'react'

export function useAdminTab(initialTab = 'dashboard') {
  const [activeTab, setActiveTab] = useState(initialTab)

  const changeTab = (tabName) => {
    setActiveTab(tabName)
  }

  return {
    activeTab,
    changeTab,
    setActiveTab,
  }
}
