'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Close,
  Refresh,
} from '@mui/icons-material'
import ServiceStatusGrid from './ServiceStatusGrid'
import { getAuthData } from '../utils/auth'

interface ServiceStatusPopupProps {
  open: boolean
  onClose: () => void
}

interface ServiceStatusItem {
  service_name: string
  service_status: string
  hostip?: string
  end_point?: string
  started?: string
  pingdate?: string
  metric_1?: string
  replicas?: string
}

export default function ServiceStatusPopup({ open, onClose }: ServiceStatusPopupProps) {
  const [serviceData, setServiceData] = useState<ServiceStatusItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [systemName, setSystemName] = useState('Automated Data')
  const [runMode, setRunMode] = useState('DOCKER')

  // Auto-refresh timer
  useEffect(() => {
    if (open) {
      fetchServiceStatus()
      const interval = setInterval(fetchServiceStatus, 15000) // Refresh every 15 seconds
      return () => clearInterval(interval)
    }
  }, [open])

  const fetchServiceStatus = async () => {
    console.log('🔄 Fetching service status...')
    setIsLoading(true)
    setError('')

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      if (!baseUrl) {
        throw new Error('API base URL not configured')
      }

      const authData = getAuthData()
      const token = authData?.token
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const requestUrl = `${baseUrl}/get_service_status`
      const requestBody = {
        token: token
      }

      console.log('📡 Making service status API call to:', requestUrl)
      console.log('📡 Request body:', { token: token.substring(0, 8) + '...' })

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('📡 Service status API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Service status API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      console.log('✅ Service status API response data:', responseData)

      // Handle API response format: { "result": [authed, serviceArray, systemName, runMode] }
      if (responseData.result && Array.isArray(responseData.result) && responseData.result.length >= 2) {
        const [authed, serviceStatus, systemName, runMode] = responseData.result
        
        if (authed && Array.isArray(serviceStatus)) {
          console.log('✅ Setting service status data:', serviceStatus)
          setServiceData(serviceStatus)
          setSystemName(systemName || 'Automated Data')
          setRunMode(runMode || 'DOCKER')
          setLastUpdated(new Date())
        } else {
          console.log('❌ Authentication failed or invalid service status data')
          setError('Authentication failed or invalid service status data')
        }
      } else {
        console.log('❌ Unexpected service status response format:', responseData)
        setError('Unexpected response format from service status API')
      }

    } catch (error) {
      console.error('❌ Error fetching service status:', error)
      setError('Failed to load service status: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchServiceStatus()
  }

  const formatLastUpdated = () => {
    if (!lastUpdated) return ''
    return `Last Updated: ${lastUpdated.toLocaleTimeString()}`
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '600px',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Service Status
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {systemName} - {runMode} Mode
          </Typography>
          {lastUpdated && (
            <Typography variant="caption" color="text.secondary">
              {formatLastUpdated()}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={handleRefresh}
            disabled={isLoading}
            sx={{ color: 'text.secondary' }}
          >
            <Refresh />
          </IconButton>
          <IconButton
            onClick={onClose}
            sx={{ color: 'text.secondary' }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading && serviceData.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
              Loading service status...
            </Typography>
          </Box>
        ) : (
          <ServiceStatusGrid 
            data={serviceData} 
            runMode={runMode}
            isLoading={isLoading}
          />
        )}
      </DialogContent>

    </Dialog>
  )
}