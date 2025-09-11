'use client'

import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Container,
} from '@mui/material'
import {
  Psychology,
  Send,
} from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { isAuthenticated } from '../utils/auth'
import AppLayout from '../components/AppLayout'

export default function AskAI() {
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      console.log('User not authenticated, redirecting to signin')
      window.location.href = '/signin?expired=true'
      return
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    
    setIsLoading(true)
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('AI Question:', question)
    setIsLoading(false)
    setQuestion('')
  }

  return (
    <AppLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Psychology sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Ask AI
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Get intelligent answers to your questions using our AI assistant.
          </Typography>
        </Box>

        <Card elevation={1} sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Ask me anything..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Send />}
                  disabled={!question.trim() || isLoading}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  {isLoading ? 'Processing...' : 'Ask AI'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            This is a placeholder for the AI functionality. Integration with AI services coming soon.
          </Typography>
        </Box>
      </Container>
    </AppLayout>
  )
}