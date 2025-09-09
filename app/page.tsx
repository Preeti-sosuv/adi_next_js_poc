'use client'

import { useEffect } from 'react'
import { isAuthenticated } from './utils/auth'

export default function Home() {
  useEffect(() => {
    // Redirect authenticated users to ask-ai
    if (isAuthenticated()) {
      console.log('User already authenticated, redirecting to ask-ai')
      window.location.href = '/ask-ai'
    }
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          Welcome to ADI
        </h1>
        <h2 className="text-2xl text-gray-600 mb-8">
          Next.js Proof of Concept
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl">
          This is a modern Next.js application built with TypeScript, Redux Toolkit for state management, and Tailwind CSS for styling.
        </p>
        <div className="mt-8 space-x-4">
          <button 
            onClick={() => window.location.href = '/signin'}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => window.location.href = '/ask-ai'}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors"
          >
            Ask AI
          </button>
        </div>
      </div>
    </main>
  )
}