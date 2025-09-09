'use client'

import { useState, useEffect } from 'react'
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
  Alert,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
} from '@mui/icons-material'

export default function CreatePassword() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [linkKey, setLinkKey] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  // Get link_key and email from session storage on component mount
  useEffect(() => {
    const storedLinkKey = sessionStorage.getItem('passwordResetLinkKey')
    const storedEmail = sessionStorage.getItem('passwordResetEmail')
    
    console.log('🔑 Create password page loaded')
    console.log('🔑 Stored link_key:', storedLinkKey)
    console.log('🔑 Stored email:', storedEmail)
    
    if (!storedLinkKey || !storedEmail) {
      console.log('❌ No password creation session found, redirecting to signin')
      setError('Invalid access. Please sign in again.')
      return
    }
    
    setLinkKey(storedLinkKey)
    setEmail(storedEmail)
  }, [])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    // Validate first name
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    // Validate last name
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

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
    console.log('🔄 Create password form submitted')
    
    if (!validateForm()) {
      console.log('❌ Form validation failed')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      console.log('🔄 Creating password for:', email)
      console.log('🔄 Using link_key:', linkKey)
      
      if (!baseUrl) {
        throw new Error('API base URL not configured')
      }

      // Convert password to base64 (matching login flow)
      const base64Password = btoa(newPassword)
      const base64ConfirmPassword = btoa(confirmPassword)
      console.log('🔐 Password converted to base64')

      const requestUrl = `${baseUrl}/create_password_v2`
      const requestBody = {
        link_key: linkKey,
        email: email,
        first_name: firstName,
        last_name: lastName,
        new_password: base64Password,
        confirm_password: base64ConfirmPassword
      }

      console.log('🔄 Making create password API call to:', requestUrl)
      console.log('🔄 Request body:', {
        ...requestBody,
        new_password: '[REDACTED]',
        confirm_password: '[REDACTED]'
      })

      // API call to create password
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('🔄 Create password API response:', response)
      console.log('🔄 Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Create password error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('🔄 Create password API response data:', responseData)

      // Handle success response
      if (responseData.result === "success" || responseData.status === "success") {
        console.log('✅ Password created successfully')
        
        // Clear session storage
        sessionStorage.removeItem('passwordResetLinkKey')
        sessionStorage.removeItem('passwordResetEmail')

        // Show success message and redirect to signin
        alert('Password created successfully! Please sign in with your new password.')
        window.location.href = '/signin'
      } else {
        console.log('❌ Unexpected response format:', responseData)
        setError('Password creation failed. Please try again.')
      }

    } catch (error) {
      console.error('❌ Password creation error:', error)
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Network error detected - possibly CORS or server not running')
        setError('Network Error: Unable to connect to server. Please check if the API server is running.')
      } else {
        setError('Failed to create password: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    }

    setIsLoading(false)
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  if (error && !linkKey) {
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
          <Card elevation={1} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <AccountCircle sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Access Denied
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {error}
              </Typography>
              <Button
                variant="contained"
                onClick={() => window.location.href = '/signin'}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Back to Sign In
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    )
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
                Create New Password
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Welcome! Please set up your account by creating a new password
              </Typography>
              
              {email && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Account: {email}
                </Typography>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              {/* First Name */}
              <TextField
                fullWidth
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                error={!!errors.firstName}
                helperText={errors.firstName}
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />

              {/* Last Name */}
              <TextField
                fullWidth
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                error={!!errors.lastName}
                helperText={errors.lastName}
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />

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
                disabled={isLoading || !linkKey}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  mb: 2,
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Creating Password...
                  </Box>
                ) : (
                  'Create Password'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="text"
                  onClick={() => window.location.href = '/signin'}
                  sx={{ textTransform: 'none', color: 'text.secondary' }}
                >
                  Back to Sign In
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}