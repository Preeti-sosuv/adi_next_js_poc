'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MainForm() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to ask-ai page by default
    router.replace('/ask-ai')
  }, [router])

  return null
}