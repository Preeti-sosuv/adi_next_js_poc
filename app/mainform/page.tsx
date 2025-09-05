'use client'

import { useState, useEffect } from 'react'
import { isAuthenticated, clearAuthData, setupTokenExpiryCheck, getAuthData } from '../utils/auth'
import {
  Box,
  Drawer,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Psychology,
  Settings,
  ManageAccounts,
  Logout,
  AccountCircle,
} from '@mui/icons-material'
import ManageTab from '../components/ManageTab'

const drawerWidth = 72

export default function MainForm() {
  const [selectedTab, setSelectedTab] = useState('ask-ai')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [userEmail, setUserEmail] = useState('adi-admin@automated-data.io')

  // Check authentication and setup token management on component mount
  useEffect(() => {
    // Redirect to signin if not authenticated
    if (!isAuthenticated()) {
      console.log('User not authenticated, redirecting to signin')
      window.location.href = '/signin'
      return
    }

    // Setup automatic token expiry checking
    setupTokenExpiryCheck()

    // Get user details from stored auth data
    const authData = getAuthData()
    if (authData && authData.userDetails) {
      // You can extract user email or other details here
      console.log('User authenticated with details:', authData.userDetails)
    }
  }, [])

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    // Clear all authentication data
    clearAuthData()
    handleProfileMenuClose()
    console.log('User logged out, clearing auth data')
    window.location.href = '/signin'
  }

  const menuItems = [
    { id: 'ask-ai', label: 'Ask AI', icon: <Psychology /> },
    { id: 'manage', label: 'Manage', icon: <ManageAccounts /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
  ]

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: 64,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            A
          </Typography>
        </Box>
      </Box>
      
      <List sx={{ pt: 2, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ px: 1, mb: 1 }}>
            <ListItemButton
              onClick={() => setSelectedTab(item.id)}
              selected={selectedTab === item.id}
              sx={{
                borderRadius: 2,
                minHeight: 48,
                justifyContent: 'center',
                px: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 24,
                  color: selectedTab === item.id ? 'primary.main' : 'text.secondary',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {/* User Profile at Bottom */}
      <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <ListItemButton
          onClick={handleProfileMenuOpen}
          sx={{
            borderRadius: 2,
            minHeight: 48,
            justifyContent: 'center',
            px: 1,
          }}
        >
          <Avatar sx={{ width: 32, height: 32, backgroundColor: 'primary.main' }}>
            <AccountCircle />
          </Avatar>
        </ListItemButton>
      </Box>
    </Box>
  )

  const renderContent = () => {
    switch (selectedTab) {
      case 'ask-ai':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Ask AI
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ask AI content coming soon...
            </Typography>
          </Box>
        )
      case 'manage':
        return <ManageTab />
      case 'settings':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Settings content coming soon...
            </Typography>
          </Box>
        )
      default:
        return null
    }
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: drawerWidth, flexShrink: 0 }}
      >
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              backgroundColor: 'background.paper',
              boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  )
}