'use client'

import { useEffect } from 'react'
import { isAuthenticated } from '../utils/auth'
import AppLayout from '../components/AppLayout'
import ManageTab from '../components/ManageTab'

export default function Manage() {
  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      console.log('User not authenticated, redirecting to signin')
      window.location.href = '/signin'
      return
    }
  }, [])
  return (
    <AppLayout>
      <ManageTab />
    </AppLayout>
  )
}