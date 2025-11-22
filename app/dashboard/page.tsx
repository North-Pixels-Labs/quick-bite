'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardRedirect() {
  const { user } = useAuth()
  const router = useRouter()
  useEffect(()=>{
    if (!user) { router.replace('/') ; return }
    if (user.user_type === 'restaurant_owner' || user.user_type === 'restaurant_staff') {
      router.replace('/dashboard/restaurant')
    } else if (user.user_type === 'rider') {
      router.replace('/dashboard/rider')
    } else {
      router.replace('/')
    }
  },[user, router])
  return null
}