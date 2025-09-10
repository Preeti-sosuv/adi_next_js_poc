'use client'

import { useState, useEffect } from 'react'
import { getAuthData } from '../utils/auth'
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Business,
  Apartment,
  People,
  AdminPanelSettings,
  Refresh,
} from '@mui/icons-material'

interface Organization {
  id: number
  org_owner?: string
  org_id: number
  parent_id?: number
  org_type: string
  org_name: string
  default_dept_id?: number
  status: string
}

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive'
  lastLogin: string
}

interface Department {
  id: number
  org_id: number
  dept_id: number
  dept_type: string
  name: string
  status: string
}

interface Role {
  id: number
  name: string
  permissions: string[]
  users: number
  status: 'Active' | 'Inactive'
}


const usersData: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: '2024-01-14',
  },
]


const rolesData: Role[] = [
  {
    id: 1,
    name: 'Super Admin',
    permissions: ['Read', 'Write', 'Delete', 'Manage'],
    users: 2,
    status: 'Active',
  },
  {
    id: 2,
    name: 'User',
    permissions: ['Read'],
    users: 15,
    status: 'Active',
  },
]

export default function ManageTab() {
  const [selectedSection, setSelectedSection] = useState('organizations')
  const [openModal, setOpenModal] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [newOrgDescription, setNewOrgDescription] = useState('')
  const [newDeptName, setNewDeptName] = useState('')
  const [newDeptDescription, setNewDeptDescription] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDescription, setNewRoleDescription] = useState('')
  
  // API data states
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch organizations from API
  const fetchOrganizations = async () => {
    console.log('🏢 Fetching organizations...')
    setIsLoading(true)
    setError('')
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      if (!baseUrl) {
        throw new Error('API base URL not configured')
      }

      // Get token from auth data
      const authData = getAuthData()
      const token = authData?.token
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const requestUrl = `${baseUrl}/get_orgs`
      const requestBody = {
        token: token
      }

      console.log('🏢 Making get organizations API call to:', requestUrl)
      console.log('🏢 Request body:', { token: token.substring(0, 8) + '...' })

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('🏢 Organizations API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Organizations API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('🏢 Organizations API response data:', responseData)

      // Handle API response format: { "result": [true, [...organizations]] }
      if (responseData.result && Array.isArray(responseData.result) && responseData.result[0] === true) {
        const orgsData = responseData.result[1] || []
        console.log('✅ Successfully fetched', orgsData.length, 'organizations')
        setOrganizations(orgsData)
      } else {
        console.log('❌ Unexpected response format or error:', responseData)
        throw new Error('Invalid response format from organizations API')
      }

    } catch (error) {
      console.error('❌ Error fetching organizations:', error)
      setError('Failed to load organizations: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch departments from API
  const fetchDepartments = async () => {
    console.log('🏬 Fetching departments...')
    setIsLoading(true)
    setError('')
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      if (!baseUrl) {
        throw new Error('API base URL not configured')
      }

      // Get token from auth data
      const authData = getAuthData()
      const token = authData?.token
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const requestUrl = `${baseUrl}/get_depts`
      const requestBody = {
        token: token
      }

      console.log('🏬 Making get departments API call to:', requestUrl)
      console.log('🏬 Request body:', { token: token.substring(0, 8) + '...' })

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('🏬 Departments API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Departments API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('🏬 Departments API response data:', responseData)

      // Handle API response format: { "result": [true, [...departments]] }
      if (responseData.result && Array.isArray(responseData.result) && responseData.result[0] === true) {
        const departmentsList = responseData.result[1] || []
        console.log('🏬 Setting departments data:', departmentsList)
        setDepartments(departmentsList)
      } else {
        console.log('❌ Unexpected departments response format:', responseData)
        setError('Unexpected response format from departments API')
      }

    } catch (error) {
      console.error('❌ Error fetching departments:', error)
      setError('Failed to load departments: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  // Load data when component mounts or when section is selected
  useEffect(() => {
    if (selectedSection === 'organizations') {
      fetchOrganizations()
    } else if (selectedSection === 'departments') {
      fetchDepartments()
    }
  }, [selectedSection])

  const sections = [
    { id: 'organizations', label: 'Organizations', icon: <Business />, data: organizations },
    { id: 'departments', label: 'Departments', icon: <Apartment />, data: departments },
    { id: 'users', label: 'Users', icon: <People />, data: usersData },
    { id: 'roles', label: 'Roles', icon: <AdminPanelSettings />, data: rolesData },
  ]

  const currentSection = sections.find(s => s.id === selectedSection)
  const currentData = currentSection?.data || []

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'success' : 'default'
  }

  const getTypeColor = (type: string) => {
    return type === 'root' ? 'primary' : 'secondary'
  }

  const handleAdd = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setNewOrgName('')
    setNewOrgDescription('')
    setNewDeptName('')
    setNewDeptDescription('')
    setNewUserEmail('')
    setNewRoleName('')
    setNewRoleDescription('')
  }

  const handleSaveOrganization = () => {
    console.log('Save organization:', { name: newOrgName, description: newOrgDescription })
    // Add logic to save organization
    handleCloseModal()
  }

  const handleSaveDepartment = () => {
    console.log('Save department:', { name: newDeptName, description: newDeptDescription })
    // Add logic to save department
    handleCloseModal()
  }

  const handleSendInvite = async () => {
    console.log('🚀 ADD USER STARTED')
    console.log('Adding user:', { email: newUserEmail })
    
    if (!newUserEmail.trim()) {
      console.log('❌ Email is required')
      return
    }

    setIsLoading(true)
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      console.log('🌐 Base URL from env:', baseUrl)
      
      if (!baseUrl) {
        throw new Error('API base URL not configured')
      }

      // Get current user's token from auth data
      const authData = getAuthData()
      const token = authData?.token
      
      console.log('🔑 Using token:', token)
      
      if (!token) {
        throw new Error('No authentication token found. Please sign in again.')
      }

      const requestUrl = `${baseUrl}/add_user_v2`
      const requestBody = {
        user: newUserEmail.trim(),
        token: token
      }
      
      console.log('📡 Making add user API call to:', requestUrl)
      console.log('📡 Request body:', { user: newUserEmail.trim(), token: 'hidden' })

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('📡 Add user API response status:', response.status)
      console.log('📡 Add user API response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Add user API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('✅ Add user API response:', responseData)

      // Handle API response format: { result: [authed, status] }
      if (response.status === 200 && responseData.result && Array.isArray(responseData.result)) {
        const [authed, status] = responseData.result
        console.log('📊 Response details:')
        console.log('  - authed (first boolean):', authed)
        console.log('  - Status (second boolean):', status)
        
        if (status === true) {
          console.log('🎉 User added successfully and invite link sent!')
          alert(`User ${newUserEmail} added successfully! Invite link has been sent.`)
        } else if (authed === true) {
          console.log('✅ User added but invite link not sent')
          alert(`User ${newUserEmail} added successfully, but invite link was not sent.`)
        } else {
          console.log('⚠️ User addition may have failed')
          alert(`User ${newUserEmail} could not be added. Please try again.`)
        }
        
        handleCloseModal()
        // Refresh the users list
        handleRefresh()
      } else {
        console.log('⚠️ Unexpected response format:', responseData)
        alert(`User ${newUserEmail} has been processed, but response format was unexpected.`)
        handleCloseModal()
      }

    } catch (error) {
      console.error('❌ Add user error:', error)
      alert('Failed to add user: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveRole = () => {
    console.log('Save role:', { name: newRoleName, description: newRoleDescription })
    // Add logic to save role
    handleCloseModal()
  }

  const handleEdit = (id: number) => {
    console.log(`Edit ${selectedSection}:`, id)
  }

  const handleDelete = (id: number) => {
    console.log(`Delete ${selectedSection}:`, id)
  }

  const handleRefresh = () => {
    console.log(`Refresh ${selectedSection}`)
    if (selectedSection === 'organizations') {
      fetchOrganizations()
    } else if (selectedSection === 'departments') {
      fetchDepartments()
    }
    // Add other refresh handlers for users, roles as needed
  }

  const renderTable = () => {
    switch (selectedSection) {
      case 'organizations':
        return (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.100' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Parent #ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Org #ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={24} />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Loading organizations...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : organizations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No organizations found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    organizations.map((org) => (
                      <TableRow key={org.org_id} hover>
                        <TableCell>{org.parent_id || '-'}</TableCell>
                        <TableCell>{org.org_id}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{org.org_name}</TableCell>
                        <TableCell>
                          <Chip label={org.org_type} color={getTypeColor(org.org_type) as any} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label={org.status} color={getStatusColor(org.status) as any} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleDelete(org.org_id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )

      case 'users':
        return (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(currentData as User[]).map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip label={user.role} color="info" size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip label={user.status} color={getStatusColor(user.status) as any} size="small" />
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(user.id)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(user.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )

      case 'departments':
        return (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.100' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Dept #ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Org #ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={24} />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Loading departments...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : departments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No departments found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    departments.map((dept) => (
                      <TableRow key={dept.dept_id} hover>
                        <TableCell>{dept.dept_id}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{dept.name}</TableCell>
                        <TableCell>{dept.org_id}</TableCell>
                        <TableCell>
                          <Chip label={dept.dept_type} color={getTypeColor(dept.dept_type) as any} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label={dept.status} color={getStatusColor(dept.status) as any} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleEdit(dept.id)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(dept.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )

      case 'roles':
        return (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Permissions</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Users</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(currentData as Role[]).map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{role.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {role.permissions.map((perm, index) => (
                          <Chip key={index} label={perm} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>{role.users}</TableCell>
                    <TableCell>
                      <Chip label={role.status} color={getStatusColor(role.status) as any} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(role.id)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(role.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )

      default:
        return null
    }
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', m: 0, p: 0 }}>
      {/* Sidebar */}
      <Box sx={{ width: 280, borderRight: 1, borderColor: 'divider', backgroundColor: 'background.paper', m: 0, p: 0 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.875rem' }}>
            MANAGE
          </Typography>
        </Box>
        <List sx={{ p: 0 }}>
          {sections.map((section) => (
            <ListItem key={section.id} disablePadding>
              <ListItemButton
                selected={selectedSection === section.id}
                onClick={() => setSelectedSection(section.id)}
                sx={{
                  px: 2,
                  py: 1.5,
                  mx: 0,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    borderRight: 3,
                    borderColor: 'primary.main',
                    mx: 0,
                  },
                }}
              >
                <Box sx={{ 
                  mr: 2, 
                  color: selectedSection === section.id ? 'primary.main' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: 24,
                }}>
                  {section.icon}
                </Box>
                <ListItemText 
                  primary={section.label}
                  primaryTypographyProps={{
                    fontWeight: selectedSection === section.id ? 600 : 400,
                    color: selectedSection === section.id ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, backgroundColor: 'background.default', m: 0, p: 0 }}>
        {/* Header */}
        <Box sx={{ p: 2, backgroundColor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
              {currentSection?.label}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAdd}
                sx={{ textTransform: 'none' }}
              >
                Add {currentSection?.label.slice(0, -1)}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                sx={{ textTransform: 'none' }}
              >
                Refresh
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 0, m: 0 }}>
          <Paper elevation={0} sx={{ borderRadius: 0, m: 0, boxShadow: 'none' }}>
            {renderTable()}
          </Paper>
        </Box>
      </Box>

      {/* Add Organization/Department/User Modal */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
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
            {selectedSection === 'organizations' 
              ? 'Create New Organization' 
              : selectedSection === 'departments' 
                ? 'Create New Department'
                : selectedSection === 'users'
                  ? 'Create New User'
                  : 'Create New Role'}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pb: 3 }}>
          {selectedSection === 'users' ? (
            // User Form
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter User Email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                variant="outlined"
                type="email"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Box>
          ) : selectedSection === 'roles' ? (
            // Role Form
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
              
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Description"
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  variant="outlined"
                  multiline
                  rows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
            </Box>
          ) : (
            // Organization/Department Form
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Name"
                  value={selectedSection === 'organizations' ? newOrgName : newDeptName}
                  onChange={(e) => {
                    if (selectedSection === 'organizations') {
                      setNewOrgName(e.target.value)
                    } else {
                      setNewDeptName(e.target.value)
                    }
                  }}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
              
              <Box>
                <TextField
                  fullWidth
                  placeholder="Description (optional)"
                  value={selectedSection === 'organizations' ? newOrgDescription : newDeptDescription}
                  onChange={(e) => {
                    if (selectedSection === 'organizations') {
                      setNewOrgDescription(e.target.value)
                    } else {
                      setNewDeptDescription(e.target.value)
                    }
                  }}
                  variant="outlined"
                  multiline
                  rows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={
              selectedSection === 'organizations' 
                ? handleSaveOrganization 
                : selectedSection === 'departments'
                  ? handleSaveDepartment
                  : selectedSection === 'users'
                    ? handleSendInvite
                    : handleSaveRole
            }
            variant="contained"
            disabled={
              isLoading || (
                selectedSection === 'organizations' 
                  ? !newOrgName.trim() 
                  : selectedSection === 'departments'
                    ? !newDeptName.trim()
                    : selectedSection === 'users'
                      ? !newUserEmail.trim()
                      : !newRoleName.trim()
              )
            }
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                {selectedSection === 'users' ? 'Adding User...' : 'Saving...'}
              </Box>
            ) : (
              selectedSection === 'users' ? 'Add User' : 'Save'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}