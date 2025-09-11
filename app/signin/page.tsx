'use client'

import { useState, useEffect } from 'react'
import { storeAuthData, isAuthenticated } from '../utils/auth'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Container,
  CircularProgress,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
} from '@mui/icons-material'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)

  // Check if user is already authenticated on component mount
  useEffect(() => {
    // Debug environment variables
    console.log('🔧 Environment check:')
    console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    
    // Debug authentication status
    console.log('🔐 Checking authentication status...')
    console.log('localStorage authToken:', localStorage.getItem('authToken'))
    console.log('sessionStorage authToken:', sessionStorage.getItem('authToken'))
    console.log('localStorage authData:', localStorage.getItem('authData'))
    console.log('sessionStorage authData:', sessionStorage.getItem('authData'))
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const fromAuthFailure = urlParams.get('expired') === 'true'
    const newUser = urlParams.get('newuser') === 'true'
    
    if (fromAuthFailure) {
      console.log('🔄 User came from auth failure, clearing auth data and showing signin form')
      // Clear potentially corrupted auth data
      import('../utils/auth').then(({ clearAuthData }) => {
        clearAuthData()
      })
    } else if (newUser) {
      console.log('🆕 New user just created password, ready for signin')
      // No message shown to user
    } else {
      const authStatus = isAuthenticated()
      console.log('🔐 isAuthenticated() result:', authStatus)
      
      if (authStatus) {
        console.log('⚠️ User already authenticated, redirecting to ask-ai')
        window.location.href = '/ask-ai'
        return
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 FORM SUBMISSION STARTED')
    console.log('Form submitted with:', { email, password })
    console.log('Form validation passed, proceeding with API call...')
    setIsLoading(true)
    setError('')
    setIsNewUser(false)
    
    try {
      // Get base URL from environment
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      console.log('🌐 Base URL from env:', baseUrl)
      
      if (!baseUrl) {
        throw new Error('API base URL not configured')
      }
      
      // Convert password to base64
      const base64Password = btoa(password)
      console.log('🔐 Original password:', password)
      console.log('🔐 Base64 password:', base64Password)
      
      const requestUrl = `${baseUrl}/user_login_v2`
      const requestBody = {
        email: email,
        password: base64Password
      }
      
      console.log('📡 Making API call to:', requestUrl)
      console.log('📡 Request body:', requestBody)
      console.log('📡 About to call fetch...')
      
      // API call to sign in
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
      
      console.log('📡 Fetch completed, response received:', response)
      
      console.log('Response received:', response)
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response body:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }
      
      const responseData = await response.json()
      console.log('API Response:', responseData)
      console.log('Response type:', typeof responseData)
      
      // Check for null response
      if (!responseData) {
        console.error('🚨 API returned null response')
        setError('Server returned empty response. Please try again.')
        return
      }
      console.log('Response keys:', Object.keys(responseData || {}))
      
      // Extract and store token from response
      let token = null
      
      // Function to recursively search for token in nested objects
      const findToken = (obj: any, path: string = ''): string | null => {
        if (!obj || typeof obj !== 'object') return null
        
        // Check common token field names
        const tokenFields = ['token', 'tokens', 'access_token', 'authToken', 'accessToken', 'auth_token']
        
        for (const field of tokenFields) {
          if (obj[field] && typeof obj[field] === 'string') {
            console.log(`Found token at ${path}.${field}:`, obj[field])
            return obj[field]
          }
        }
        
        // Recursively search nested objects
        for (const key in obj) {
          if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
            const found = findToken(obj[key], path ? `${path}.${key}` : key)
            if (found) return found
          }
        }
        
        return null
      }
      
      // Search for token in the response
      token = findToken(responseData)
      
      // Additional explicit checks based on your API response structure
      if (!token) {
        // Check specific paths we've seen in your responses
        const possiblePaths = [
          responseData.result?.details?.tokens,
          responseData.result?.details?.token,
          responseData.details?.tokens,
          responseData.details?.token,
          responseData.data?.tokens,
          responseData.data?.token,
          responseData.tokens,
          responseData.token
          // NOTE: link_key is handled separately for first-time login detection
        ]
        
        for (const possibleToken of possiblePaths) {
          if (possibleToken && typeof possibleToken === 'string') {
            console.log('Found token via explicit path check:', possibleToken)
            token = possibleToken
            break
          }
        }
      }
      
      // Handle the new API response format that uses link_key
      console.log('🔍 Checking for first-time login conditions:')
      console.log('🔍 token value:', token)
      console.log('🔍 responseData.result?.valid:', responseData.result?.valid)
      console.log('🔍 responseData.result?.link_key:', responseData.result?.link_key)
      console.log('🔍 responseData.result?.message:', responseData.result?.message)
      console.log('🔍 responseData.result?.password_reset:', responseData.result?.password_reset)
      
      if (!token && responseData.result?.valid === true && responseData.result?.link_key) {
        console.log('✅ API validation successful, received link_key:', responseData.result.link_key)
        console.log('🔑 First-time login detected, redirecting to reset password')
        
        // Store link_key temporarily for password creation process  
        sessionStorage.setItem('passwordResetLinkKey', responseData.result.link_key)
        sessionStorage.setItem('passwordResetEmail', email)
        
        // Redirect to reset password form (don't set token yet)
        window.location.href = '/reset-password'
        return
      }
      
      if (token) {
        // Extract additional user data from response
        const userDetails = {
          ...responseData.result,
          email: email // Include the user's email from the form
        }
        
        // Store authentication data without expiry management
        storeAuthData(token, null, userDetails)
        
        console.log('Authentication successful:', {
          token,
          userDetails,
          message: responseData.result?.message
        })
        
        // Show the API message if available
        if (responseData.result?.message) {
          console.log('API Message:', responseData.result.message)
        }
        
        // Redirect to Ask AI page
        window.location.href = '/ask-ai'
      } else {
        console.error('No token found in response:', responseData)
        
        // Check if API returned a specific error message
        if (responseData.result?.message) {
          setError(responseData.result.message)
        } else {
          setError('Sign in failed: Invalid credentials or no authentication token received')
        }
        
        // For debugging, show the full response structure
        console.log('Full API response for debugging:', JSON.stringify(responseData, null, 2))
      }
      
    } catch (error) {
      console.error('❌ Sign in error occurred:', error)
      console.error('❌ Error type:', typeof error)
      console.error('❌ Error details:', error instanceof Error ? error.message : error)
      console.error('❌ Full error object:', error)
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Network error detected - possibly CORS or server not running')
        setError('Network Error: Unable to connect to server. Please check if the API server is running.')
      } else {
        setError('Sign in failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    }
    
    setIsLoading(false)
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setForgotPasswordOpen(true)
  }

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false)
    setForgotPasswordEmail('')
    setForgotPasswordLoading(false)
  }

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotPasswordLoading(true)
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      console.log('🔄 Sending password reset email to:', forgotPasswordEmail)
      
      if (!baseUrl) {
        throw new Error('API base URL not configured')
      }

      const requestUrl = `${baseUrl}/send_password_reset_email_v2`
      const requestBody = {
        user_email: forgotPasswordEmail.trim()
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

      console.log('📡 Password reset API response status:', response.status)
      console.log('📡 Password reset API response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Password reset API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('✅ Password reset API response:', responseData)

      // Handle successful response
      console.log('✅ Password reset email sent to:', forgotPasswordEmail)
      alert(`Password reset instructions have been sent to ${forgotPasswordEmail}. Please check your email for the reset link.`)
      
    } catch (error) {
      console.error('❌ Password reset error:', error)
      alert('Failed to send password reset email: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setForgotPasswordLoading(false)
      handleForgotPasswordClose()
    }
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
                Welcome back
              </Typography>
              
            </Box>

            {error && (
              <Alert severity={isNewUser ? "info" : "error"} sx={{ mb: 3, width: '100%' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Email address"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                sx={{ mb: 2 }}
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

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={<Typography variant="body2">Remember me</Typography>}
                />
                
                <Link
                  href="#"
                  variant="body2"
                  color="primary"
                  onClick={handleForgotPasswordClick}
                  sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  mb: 3,
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
                    Signing in...
                  </Box>
                ) : (
                  'Sign in'
                )}
              </Button>


            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={handleForgotPasswordClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Enter your email address and we'll send you instructions to reset your password.
          </Typography>
        </DialogTitle>
        
        <Box component="form" onSubmit={handleForgotPasswordSubmit}>
          <DialogContent sx={{ pb: 3 }}>
            <TextField
              fullWidth
              label="Email address"
              type="email"
              variant="outlined"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </DialogContent>
          
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button
              onClick={handleForgotPasswordClose}
              variant="outlined"
              disabled={forgotPasswordLoading}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!forgotPasswordEmail.trim() || forgotPasswordLoading}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
              }}
            >
              {forgotPasswordLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  Sending...
                </Box>
              ) : (
                'Send Reset Email'
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
}