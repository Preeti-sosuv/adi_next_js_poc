'use client'

import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material'
import {
  Build,
  Message,
  Warning,
  Error,
  CheckCircle,
  Info,
} from '@mui/icons-material'
import { useEffect } from 'react'
import { isAuthenticated } from '../utils/auth'
import AppLayout from '../components/AppLayout'

export default function Fix() {
  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      console.log('User not authenticated, redirecting to signin')
      window.location.href = '/signin?expired=true'
      return
    }
  }, [])
  
  // Placeholder data for FIX messages
  const placeholderMessages = [
    {
      id: 1,
      type: 'error',
      title: 'Database Connection Failed',
      message: 'Unable to connect to the primary database server',
      timestamp: '2024-01-15 10:30:25',
      status: 'pending'
    },
    {
      id: 2,
      type: 'warning', 
      title: 'Memory Usage High',
      message: 'System memory usage has exceeded 85% threshold',
      timestamp: '2024-01-15 10:25:12',
      status: 'investigating'
    },
    {
      id: 3,
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'System maintenance scheduled for tonight at 2:00 AM',
      timestamp: '2024-01-15 10:20:45',
      status: 'scheduled'
    },
    {
      id: 4,
      type: 'success',
      title: 'API Service Restored',
      message: 'External API service has been successfully restored',
      timestamp: '2024-01-15 10:15:33',
      status: 'resolved'
    }
  ]

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'error': return <Error color="error" />
      case 'warning': return <Warning color="warning" />
      case 'info': return <Info color="info" />
      case 'success': return <CheckCircle color="success" />
      default: return <Message />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'success'
      case 'pending': return 'error'
      case 'investigating': return 'warning'
      case 'scheduled': return 'info'
      default: return 'default'
    }
  }

  return (
    <AppLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Build sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Fix
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage FIX messages, system alerts, and troubleshooting information.
          </Typography>
        </Box>

        {/* FIX Messages Section */}
        <Card elevation={1} sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, pb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Message sx={{ mr: 1 }} />
                FIX Messages
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Recent system messages and alerts (placeholder data)
              </Typography>
            </Box>
            
            <List sx={{ pt: 0 }}>
              {placeholderMessages.map((msg, index) => (
                <Box key={msg.id}>
                  <ListItem sx={{ px: 3, py: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getMessageIcon(msg.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {msg.title}
                          </Typography>
                          <Chip 
                            label={msg.status} 
                            size="small" 
                            color={getStatusColor(msg.status) as any}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {msg.message}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            {msg.timestamp}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < placeholderMessages.length - 1 && <Divider sx={{ mx: 3 }} />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Placeholder Notice */}
        <Card elevation={1} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Build sx={{ fontSize: 48, color: 'primary.light', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                FIX System Integration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This section will display real FIX messages, system diagnostics, error logs, and troubleshooting tools. 
                The above data is placeholder content for demonstration purposes.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </AppLayout>
  )
}