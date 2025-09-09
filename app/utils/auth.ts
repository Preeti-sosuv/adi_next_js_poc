// Authentication utilities for token management

export interface AuthData {
  token: string
  expiry: string
  userDetails?: any
  timestamp: number
}

// Store authentication data with expiry
export const storeAuthData = (token: string, expiry?: string, userDetails?: any): void => {
  const authData: AuthData = {
    token,
    expiry: expiry || '',
    userDetails,
    timestamp: Date.now()
  }
  
  // Store in localStorage for persistence
  localStorage.setItem('authData', JSON.stringify(authData))
  
  // Store in sessionStorage as backup
  sessionStorage.setItem('authData', JSON.stringify(authData))
  
  // Also store token directly for backward compatibility
  localStorage.setItem('authToken', token)
  sessionStorage.setItem('authToken', token)
}

// Get stored authentication data
export const getAuthData = (): AuthData | null => {
  try {
    // Try localStorage first (persistent)
    let authDataStr = localStorage.getItem('authData')
    
    // Fallback to sessionStorage
    if (!authDataStr) {
      authDataStr = sessionStorage.getItem('authData')
    }
    
    if (authDataStr) {
      const authData: AuthData = JSON.parse(authDataStr)
      
      // Check if token has expired (if expiry is provided)
      if (authData.expiry) {
        const expiryDate = new Date(authData.expiry)
        const now = new Date()
        
        if (now >= expiryDate) {
          console.log('Token has expired, clearing auth data')
          clearAuthData()
          return null
        }
      }
      
      return authData
    }
  } catch (error) {
    console.error('Error parsing auth data:', error)
    clearAuthData()
  }
  
  return null
}

// Get just the token
export const getAuthToken = (): string | null => {
  const authData = getAuthData()
  if (authData) {
    return authData.token
  }
  
  // Fallback to direct token storage
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null
}

// Clear all authentication data
export const clearAuthData = (): void => {
  localStorage.removeItem('authData')
  localStorage.removeItem('authToken')
  sessionStorage.removeItem('authData')
  sessionStorage.removeItem('authToken')
}

// Check token validity by attempting to use it (optional API call)
export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    if (!baseUrl) return false
    
    // You can implement a token validation endpoint here
    // For now, we'll assume token is valid if it exists and hasn't expired
    const response = await fetch(`${baseUrl}/validate_token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    
    return response.ok
  } catch (error) {
    console.error('Token validation error:', error)
    return false
  }
}

// Auto-logout when token expires
export const setupTokenExpiryCheck = (): void => {
  const checkTokenExpiry = () => {
    const authData = getAuthData()
    if (!authData) return
    
    if (authData.expiry) {
      const expiryDate = new Date(authData.expiry)
      const now = new Date()
      const timeUntilExpiry = expiryDate.getTime() - now.getTime()
      
      // If token expires in less than 5 minutes, show warning
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        console.warn('Token expires in less than 5 minutes')
        // You could show a renewal prompt here
      }
      
      // If token has expired, redirect to login
      if (timeUntilExpiry <= 0) {
        console.log('Token expired, redirecting to login')
        clearAuthData()
        window.location.href = '/signin'
      }
    }
  }
  
  // Check every minute
  setInterval(checkTokenExpiry, 60000)
  
  // Check immediately
  checkTokenExpiry()
}