'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getAuthData } from '../utils/auth'
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
  Business,
  Apartment,
  HealthAndSafety,
  Help,
  ChevronRight,
} from '@mui/icons-material'
import ServiceStatusPopup from './ServiceStatusPopup'

const drawerWidth = 72

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [orgAnchorEl, setOrgAnchorEl] = useState<null | HTMLElement>(null)
  const [deptAnchorEl, setDeptAnchorEl] = useState<null | HTMLElement>(null)
  const [serviceStatusOpen, setServiceStatusOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const [organizations, setOrganizations] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [selectedOrg, setSelectedOrg] = useState<string>('AUTOMATED DATA')
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null)
  const [selectedDept, setSelectedDept] = useState<string>('')
  const pathname = usePathname()

  // Get user email and fetch organizations
  useEffect(() => {
    const authData = getAuthData()
    if (authData?.userDetails?.email) {
      setUserEmail(authData.userDetails.email)
    } else {
      // Fallback: try to get email from stored auth data
      const storedAuthData = localStorage.getItem('authData')
      if (storedAuthData) {
        try {
          const parsedData = JSON.parse(storedAuthData)
          if (parsedData.userDetails?.email) {
            setUserEmail(parsedData.userDetails.email)
          }
        } catch (error) {
          console.error('Error parsing stored auth data:', error)
        }
      }
    }

    // Fetch organizations
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      const authData = getAuthData()
      const token = authData?.token
      
      if (!baseUrl || !token) return

      const response = await fetch(`${baseUrl}/get_orgs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          org: "",
          token: token
        })
      })

      if (response.ok) {
        const responseData = await response.json()
        
        // Handle null response (expired token)
        if (!responseData) {
          console.log('Null response - token expired, redirecting to signin')
          window.location.href = '/signin?expired=true'
          return
        }
        
        if (responseData.result && Array.isArray(responseData.result) && responseData.result[0] === true) {
          const orgsList = responseData.result[1] || []
          setOrganizations(orgsList)
          // Set the first organization as selected if available
          if (orgsList.length > 0) {
            setSelectedOrg(orgsList[0].name)
            setSelectedOrgId(orgsList[0].org_id)
            // Automatically fetch departments for the first organization
            fetchDepartments(orgsList[0].org_id)
          }
        } else if (responseData.result && Array.isArray(responseData.result) && responseData.result[0] === false) {
          // API returned error - likely expired token
          console.log('API returned error - token likely expired, redirecting to signin')
          window.location.href = '/signin?expired=true'
          return
        }
      } else if (response.status === 401 || response.status === 403) {
        console.log('Unauthorized response, redirecting to signin')
        window.location.href = '/signin'
        return
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    }
  }

  const fetchDepartments = async (orgId: number) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      const authData = getAuthData()
      const token = authData?.token
      
      if (!baseUrl || !token) return

      const response = await fetch(`${baseUrl}/get_depts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          org_id: orgId,
          token: token
        })
      })

      if (response.ok) {
        const responseData = await response.json()
        
        // Handle null response (expired token)
        if (!responseData) {
          console.log('Departments API - Null response, token expired, redirecting to signin')
          window.location.href = '/signin?expired=true'
          return
        }
        
        if (responseData.result && Array.isArray(responseData.result) && responseData.result[0] === true) {
          const deptsList = responseData.result[1] || []
          setDepartments(deptsList)
          // Set the first department as selected if available
          if (deptsList.length > 0) {
            setSelectedDept(deptsList[0].name)
          }
        } else if (responseData.result && Array.isArray(responseData.result) && responseData.result[0] === false) {
          // API returned error - likely expired token
          console.log('Departments API - returned error, token likely expired, redirecting to signin')
          window.location.href = '/signin?expired=true'
          return
        }
      } else if (response.status === 401 || response.status === 403) {
        console.log('Departments API - Unauthorized, redirecting to signin')
        window.location.href = '/signin'
        return
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }


  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleOrgMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOrgAnchorEl(event.currentTarget)
  }

  const handleOrgMenuClose = () => {
    setOrgAnchorEl(null)
  }

  const handleDeptMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setDeptAnchorEl(event.currentTarget)
  }

  const handleDeptMenuClose = () => {
    setDeptAnchorEl(null)
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

  const handleServiceStatusClick = () => {
    setServiceStatusOpen(true)
    handleProfileMenuClose()
  }

  const handleHelpClick = () => {
    window.open('https://automated-data-inc.gitbook.io/docs/deployment', '_blank')
    handleProfileMenuClose()
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
            borderRadius: 1,
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
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            borderRadius: 1,
            minWidth: 280,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider',
            mb: 1,
          }
        }}
      >
        {/* User Email Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32, backgroundColor: 'primary.main' }}>
              <AccountCircle />
            </Avatar>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
              {userEmail || 'user@example.com'}
            </Typography>
          </Box>
        </Box>

        {/* Menu Items */}
        <MenuItem 
          onClick={handleOrgMenuOpen}
          sx={{ 
            py: 1.5, 
            px: 2,
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Business fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" sx={{ flex: 1 }}>
            Organization
          </Typography>
          <ChevronRight fontSize="small" color="action" />
        </MenuItem>

        <MenuItem 
          onClick={handleDeptMenuOpen}
          sx={{ 
            py: 1.5, 
            px: 2,
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Apartment fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" sx={{ flex: 1 }}>
            Department
          </Typography>
          <ChevronRight fontSize="small" color="action" />
        </MenuItem>

        <MenuItem 
          onClick={handleServiceStatusClick}
          sx={{ 
            py: 1.5, 
            px: 2,
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <HealthAndSafety fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" sx={{ flex: 1 }}>
            Service Status
          </Typography>
        </MenuItem>

        <MenuItem 
          onClick={handleHelpClick}
          sx={{ 
            py: 1.5, 
            px: 2,
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Help fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" sx={{ flex: 1 }}>
            Help
          </Typography>
        </MenuItem>

        {/* Divider before logout */}
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 1 }} />

        <MenuItem 
          onClick={handleLogout}
          sx={{ 
            py: 1.5, 
            px: 2,
            '&:hover': {
              backgroundColor: 'error.light',
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" sx={{ flex: 1 }}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>

      {/* Organization Menu */}
      <Menu
        anchorEl={orgAnchorEl}
        open={Boolean(orgAnchorEl)}
        onClose={handleOrgMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            borderRadius: 1,
            minWidth: 250,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider',
            ml: 0,
          }
        }}
      >

        {organizations.length > 0 ? (
          organizations.map((org) => (
            <MenuItem 
              key={org.id}
              onClick={() => {
                setSelectedOrg(org.name)
                setSelectedOrgId(org.org_id)
                fetchDepartments(org.org_id)
                handleOrgMenuClose()
              }}
              sx={{ 
                py: 1.5, 
                px: 2,
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  flex: 1,
                  color: selectedOrg === org.name ? 'primary.main' : 'text.primary',
                  fontWeight: selectedOrg === org.name ? 500 : 400
                }}
              >
                {org.name}
              </Typography>
              {selectedOrg === org.name && (
                <Box sx={{ ml: 1, color: 'primary.main' }}>✓</Box>
              )}
            </MenuItem>
          ))
        ) : (
          <MenuItem sx={{ py: 1.5, px: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No organizations available
            </Typography>
          </MenuItem>
        )}
      </Menu>

      {/* Department Menu */}
      <Menu
        anchorEl={deptAnchorEl}
        open={Boolean(deptAnchorEl)}
        onClose={handleDeptMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1,
              minWidth: 250,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid',
              borderColor: 'divider',
              ml: 0,
            }
          }
        }}
      >
        {departments.length > 0 ? (
          departments.map((dept) => (
            <MenuItem 
              key={dept.id}
              onClick={() => {
                setSelectedDept(dept.name)
                handleDeptMenuClose()
              }}
              sx={{ 
                py: 1.5, 
                px: 2,
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  flex: 1,
                  color: selectedDept === dept.name ? 'primary.main' : 'text.primary',
                  fontWeight: selectedDept === dept.name ? 500 : 400
                }}
              >
                {dept.name}
              </Typography>
              {selectedDept === dept.name && (
                <Box sx={{ ml: 1, color: 'primary.main' }}>✓</Box>
              )}
            </MenuItem>
          ))
        ) : (
          <MenuItem sx={{ py: 1.5, px: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No departments available
            </Typography>
          </MenuItem>
        )}
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
          p: 0,
          m: 0,
        }}
      >
        {children}
      </Box>

      {/* Service Status Popup */}
      <ServiceStatusPopup 
        open={serviceStatusOpen} 
        onClose={() => setServiceStatusOpen(false)} 
      />
    </Box>
  )
}