'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Container,
  CircularProgress,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
} from '@mui/icons-material'

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [linkKey, setLinkKey] = useState('')
  const [email, setEmail] = useState('')

  const searchParams = useSearchParams()

  // Get link_key and email from URL hash parameters
  useEffect(() => {
    console.log('🔑 Reset password page loaded')
    
    // Parse URL hash parameters (for links like #?email=...&link_key=...)
    const getUrlParams = () => {
      const hash = window.location.hash
      console.log('🔑 URL hash:', hash)
      
      if (hash.includes('?')) {
        const queryString = hash.split('?')[1]
        const urlParams = new URLSearchParams(queryString)
        const urlEmail = urlParams.get('email')
        const urlLinkKey = urlParams.get('link_key')
        
        console.log('🔑 URL email:', urlEmail)
        console.log('🔑 URL link_key:', urlLinkKey)
        
        if (urlEmail && urlLinkKey) {
          return {
            email: decodeURIComponent(urlEmail),
            linkKey: urlLinkKey
          }
        }
      }
      return null
    }
    
    // Try hash parameters first (for reset password links)
    const urlParams = getUrlParams()
    if (urlParams) {
      console.log('✅ Found hash parameters for password reset')
      setEmail(urlParams.email)
      setLinkKey(urlParams.linkKey)
      return
    }
    
    // Fallback to query parameters (for backward compatibility)
    const urlLinkKey = searchParams?.get('link_key')
    const urlEmail = searchParams?.get('email')
    
    if (urlLinkKey && urlEmail) {
      console.log('✅ Found query parameters for password reset')
      setLinkKey(urlLinkKey)
      setEmail(urlEmail)
      
      // Note: For admin, first_name and last_name will be hardcoded in API call
      
      return
    }
    
    // Check sessionStorage (for first-time login from signin page)
    const storedLinkKey = sessionStorage.getItem('passwordResetLinkKey')
    const storedEmail = sessionStorage.getItem('passwordResetEmail')
    
    console.log('🔑 Checking sessionStorage - link_key:', storedLinkKey)
    console.log('🔑 Checking sessionStorage - email:', storedEmail)
    
    if (storedLinkKey && storedEmail) {
      console.log('✅ Found session storage parameters for first-time login')
      setLinkKey(storedLinkKey)
      setEmail(storedEmail)
      
      // Note: For admin, first_name and last_name will be hardcoded in API call
      
      return
    }
    
    console.log('❌ No valid reset password parameters found, redirecting to signin')
    window.location.href = '/signin'
  }, [searchParams])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    // Validate password
    if (!newPassword) {
      newErrors.newPassword = 'Password is required'
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase and number'
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 PASSWORD RESET FORM SUBMISSION STARTED')
    console.log('Form data:', { email, newPassword: '***hidden***' })
    console.log('Link key:', linkKey)
    
    if (!validateForm()) {
      console.log('❌ Form validation failed')
      return
    }

    console.log('✅ Form validation passed, proceeding with password reset...')
    setIsLoading(true)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      if (!baseUrl) {
        throw new Error('API base URL not configured')
      }

      // Convert password to base64 before sending
      const base64Password = btoa(newPassword)
      console.log('🔐 Original password:', newPassword)
      console.log('🔐 Base64 password:', base64Password)
      
      // API call to reset password using reset_password_v2 endpoint
      const requestUrl = `${baseUrl}/reset_password_v2`
      
      // Hardcode admin names for first-time login
      const requestBody = {
        email: email,
        new_password: base64Password,
        link_key: linkKey,
        first_name: 'adi',
        last_name: 'admin'
      }
      
      console.log('📡 Making password reset API call to:', requestUrl)
      console.log('📡 Request body:', requestBody)
      
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      console.log('✅ Password reset response:', responseData)
      console.log('✅ Response type:', typeof responseData)
      console.log('✅ Response keys:', Object.keys(responseData || {}))

      // Handle success response
      if (responseData.result === "success") {
        console.log('🎉 Password reset successful! Redirecting to sign-in page.')
        alert('Password reset successful! You can now sign in with your new password.')
        window.location.href = '/signin'
      } else {
        console.log('❌ Unexpected response format:', responseData)
        alert('Password reset failed. Please try again or contact support.')
      }

    } catch (error) {
      console.error('Password reset error:', error)
      alert('Password reset failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }

    setIsLoading(false)
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        py: 3,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={1}
          sx={{
            borderRadius: 3,
            overflow: 'visible',
            position: 'relative',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <AccountCircle sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
              
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 500 }}>
                Reset Your Password
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Please enter your new password below
              </Typography>
              
              {email && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Account: {email}
                </Typography>
              )}
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              {/* New Password */}
              <TextField
                fullWidth
                label="Create Password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                error={!!errors.newPassword}
                helperText={errors.newPassword || 'Password must contain uppercase, lowercase and number (min 8 characters)'}
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Confirm Password */}
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                sx={{ mb: 4 }}
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                        aria-label="toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Resetting Password...
                  </Box>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}