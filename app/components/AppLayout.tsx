'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Build,
  ManageAccounts,
  Logout,
  AccountCircle,
} from '@mui/icons-material'

const drawerWidth = 72

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const pathname = usePathname()

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    // Import clearAuthData dynamically to avoid issues
    import('../utils/auth').then(({ clearAuthData }) => {
      clearAuthData()
      handleProfileMenuClose()
      console.log('User logged out, clearing auth data')
      window.location.href = '/signin'
    })
  }

  const menuItems = [
    { id: 'ask-ai', label: 'Ask AI', icon: <Psychology />, path: '/ask-ai' },
    { id: 'fix', label: 'Fix', icon: <Build />, path: '/fix' },
    { id: 'manage', label: 'Manage', icon: <ManageAccounts />, path: '/manage' },
  ]

  const isActive = (path: string) => pathname === path

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
            <Link href={item.path} passHref style={{ textDecoration: 'none', width: '100%' }}>
              <ListItemButton
                selected={isActive(item.path)}
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
                    color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </ListItemButton>
            </Link>
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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
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
              height: '100vh',
              position: 'fixed',
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
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}