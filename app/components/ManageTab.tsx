'use client'

import { useState } from 'react'
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
  parentId: string
  orgId: number
  name: string
  type: 'root' | 'client'
  status: 'Active' | 'Inactive'
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
  name: string
  organization: string
  employees: number
  status: 'Active' | 'Inactive'
}

interface Role {
  id: number
  name: string
  permissions: string[]
  users: number
  status: 'Active' | 'Inactive'
}

const organizationsData: Organization[] = [
  {
    id: 1,
    parentId: 'AUTOMATED-DATA.IO',
    orgId: 1,
    name: 'AUTOMATED-DATA.IO',
    type: 'root',
    status: 'Active',
  },
  {
    id: 2,
    parentId: 'AUTOMATED-DATA.IO',
    orgId: 2,
    name: 'TEST_ORG1',
    type: 'client',
    status: 'Active',
  },
  {
    id: 3,
    parentId: 'AUTOMATED-DATA.IO',
    orgId: 4,
    name: 'TEST_ORG2',
    type: 'client',
    status: 'Active',
  },
]

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

const departmentsData: Department[] = [
  {
    id: 1,
    name: 'Engineering',
    organization: 'AUTOMATED-DATA.IO',
    employees: 25,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Marketing',
    organization: 'TEST_ORG1',
    employees: 10,
    status: 'Active',
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

  const sections = [
    { id: 'organizations', label: 'Organizations', icon: <Business />, data: organizationsData },
    { id: 'departments', label: 'Departments', icon: <Apartment />, data: departmentsData },
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

  const handleSendInvite = () => {
    console.log('Send invite to user:', { email: newUserEmail })
    // Add logic to send user invite
    handleCloseModal()
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
  }

  const renderTable = () => {
    switch (selectedSection) {
      case 'organizations':
        return (
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
                {(currentData as Organization[]).map((org) => (
                  <TableRow key={org.id} hover>
                    <TableCell>{org.parentId}</TableCell>
                    <TableCell>{org.orgId}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{org.name}</TableCell>
                    <TableCell>
                      <Chip label={org.type} color={getTypeColor(org.type) as any} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={org.status} color={getStatusColor(org.status) as any} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleDelete(org.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Organization</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Employees</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(currentData as Department[]).map((dept) => (
                  <TableRow key={dept.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{dept.name}</TableCell>
                    <TableCell>{dept.organization}</TableCell>
                    <TableCell>{dept.employees}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Sidebar */}
      <Box sx={{ width: 280, borderRight: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
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
      <Box sx={{ flex: 1, backgroundColor: 'background.default' }}>
        {/* Header */}
        <Box sx={{ p: 3, backgroundColor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
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
        <Box sx={{ p: 3 }}>
          <Paper elevation={1} sx={{ borderRadius: 2 }}>
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
              selectedSection === 'organizations' 
                ? !newOrgName.trim() 
                : selectedSection === 'departments'
                  ? !newDeptName.trim()
                  : selectedSection === 'users'
                    ? !newUserEmail.trim()
                    : !newRoleName.trim()
            }
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
            }}
          >
            {selectedSection === 'users' ? 'Send Invite' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}