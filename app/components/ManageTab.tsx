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
  Checkbox,
  FormGroup,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  Visibility,
  ExpandMore,
} from '@mui/icons-material'

interface Organization {
  id: number
  org_owner?: string
  org_id: number
  parent_id?: number
  org_type: string
  name: string
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
  org_id: string
  dept_id: string
  name: string
  description: string
  role_type: string
  security_id: number
  status: string
}




export default function ManageTab() {
  const [selectedSection, setSelectedSection] = useState('organizations')
  const [openModal, setOpenModal] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [newDeptName, setNewDeptName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDescription, setNewRoleDescription] = useState('')
  
  // API data states
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Role permissions modal states
  const [viewRoleModalOpen, setViewRoleModalOpen] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<number>(0)
  const [roleFunctions, setRoleFunctions] = useState<any[]>([])
  const [checkedFunctions, setCheckedFunctions] = useState<{[key: number]: boolean}>({})
  
  // Delete confirmation dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [deleteOrgDialogOpen, setDeleteOrgDialogOpen] = useState(false)
  const [orgToDelete, setOrgToDelete] = useState<Organization | null>(null)
  const [deleteDeptDialogOpen, setDeleteDeptDialogOpen] = useState(false)
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null)

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

  // Fetch users from API
  const fetchUsers = async () => {
    console.log('👥 Fetching users...')
    setIsLoading(true)
    setError('')

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      if (!baseUrl) {
        throw new Error('API base URL not configured')
      }

      // Get current user's token from auth data
      const authData = getAuthData()
      const token = authData?.token
      
      if (!token) {
        throw new Error('No authentication token found. Please sign in again.')
      }

      const requestUrl = `${baseUrl}/get_users`
      const requestBody = {
        user: "",
        token: token
      }

      console.log('👥 Making get users API call to:', requestUrl)
      console.log('👥 Request body:', { user: "", token: token.substring(0, 8) + '...' })

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('👥 Users API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Users API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('👥 Users API response data:', responseData)

      // Handle API response format: { "result": [true, [...users]] }
      if (responseData.result && Array.isArray(responseData.result) && responseData.result[0] === true) {
        const usersList = responseData.result[1] || []
        console.log('👥 Setting users data:', usersList)
        setUsers(usersList)
      } else {
        console.log('👥 Unexpected users response format:', responseData)
        setError('Unexpected response format from users API')
      }

    } catch (error) {
      console.error('❌ Error fetching users:', error)
      setError('Failed to load users: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch roles from API
  const fetchRoles = async () => {
    console.log('🎭 Fetching roles...')
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

      const requestUrl = `${baseUrl}/get_roles`
      const requestBody = {
        token: token
      }

      console.log('🎭 Making get roles API call to:', requestUrl)
      console.log('🎭 Request body:', { token: token.substring(0, 8) + '...' })

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('🎭 Roles API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Roles API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('🎭 Roles API response data:', responseData)

      // Handle API response format: { "result": [true, [...roles]] }
      if (responseData.result && Array.isArray(responseData.result) && responseData.result[0] === true) {
        const rolesList = responseData.result[1] || []
        console.log('🎭 Setting roles data:', rolesList)
        setRoles(rolesList)
      } else {
        console.log('❌ Unexpected roles response format:', responseData)
        setError('Unexpected response format from roles API')
      }

    } catch (error) {
      console.error('❌ Error fetching roles:', error)
      setError('Failed to load roles: ' + (error instanceof Error ? error.message : 'Unknown error'))
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
    } else if (selectedSection === 'users') {
      fetchUsers()
    } else if (selectedSection === 'roles') {
      fetchRoles()
    }
  }, [selectedSection])

  const sections = [
    { id: 'organizations', label: 'Organizations', icon: <Business />, data: organizations },
    { id: 'departments', label: 'Departments', icon: <Apartment />, data: departments },
    { id: 'users', label: 'Users', icon: <People />, data: users },
    { id: 'roles', label: 'Roles', icon: <AdminPanelSettings />, data: roles },
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
    setNewDeptName('')
    setNewUserEmail('')
    setNewRoleName('')
    setNewRoleDescription('')
  }

  const handleSaveOrganization = async () => {
    console.log('🏢 ADD ORGANIZATION STARTED')
    console.log('Save organization:', { name: newOrgName })
    
    if (!newOrgName.trim()) {
      console.log('❌ Organization name is required')
      return
    }

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

      const requestUrl = `${baseUrl}/validate_save_org`
      const requestBody = {
        token: token,
        org: newOrgName.trim()
      }

      console.log('🏢 Making validate_save_org API call to:', requestUrl)
      console.log('🏢 Request body:', { token: token.substring(0, 8) + '...', org: newOrgName.trim() })

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('🏢 Add organization API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Add organization API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('🏢 Add organization API response data:', responseData)

      // Handle API response format: { "result": [true, true] }
      if (responseData.result && Array.isArray(responseData.result) && responseData.result[0] === true && responseData.result[1] === true) {
        console.log('✅ Organization created successfully')
        alert(`Organization "${newOrgName}" created successfully!`)
        handleCloseModal()
        // Refresh organizations list
        fetchOrganizations()
      } else {
        console.log('❌ Unexpected response format or error:', responseData)
        throw new Error('Failed to create organization - invalid response from server')
      }

    } catch (error) {
      console.error('❌ Error creating organization:', error)
      alert('Failed to create organization: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDepartment = async () => {
    console.log('🏬 ADD DEPARTMENT STARTED')
    console.log('Save department:', { name: newDeptName })
    
    if (!newDeptName.trim()) {
      console.log('❌ Department name is required')
      return
    }

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

      const requestUrl = `${baseUrl}/validate_save_dept`
      const requestBody = {
        token: token,
        dept: newDeptName.trim()
      }

      console.log('🏬 Making validate_save_dept API call to:', requestUrl)
      console.log('🏬 Request body:', { token: token.substring(0, 8) + '...', dept: newDeptName.trim() })

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('🏬 Add department API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Add department API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('🏬 Add department API response data:', responseData)

      // Handle API response format: { "result": [true, true] }
      if (responseData.result && Array.isArray(responseData.result) && responseData.result[0] === true && responseData.result[1] === true) {
        console.log('✅ Department created successfully')
        alert(`Department "${newDeptName}" added successfully!`)
        handleCloseModal()
        // Refresh departments list
        fetchDepartments()
      } else {
        console.log('❌ Unexpected response format or error:', responseData)
        throw new Error('Failed to create department - invalid response from server')
      }

    } catch (error) {
      console.error('❌ Error creating department:', error)
      alert('Failed to create department: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
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

  const handleSaveRole = async () => {
    console.log('🎭 ADD ROLE STARTED')
    console.log('Save role:', { name: newRoleName, description: newRoleDescription })
    
    if (!newRoleName.trim()) {
      console.log('❌ Role name is required')
      return
    }

    if (!newRoleDescription.trim()) {
      console.log('❌ Role description is required')
      return
    }

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

      const requestUrl = `${baseUrl}/validate_save_role`
      const requestBody = {
        token: token,
        data: {
          name: newRoleName.trim(),
          description: newRoleDescription.trim()
        }
      }

      console.log('🎭 Making validate_save_role API call to:', requestUrl)
      console.log('🎭 Request body:', { 
        token: token.substring(0, 8) + '...', 
        data: { name: newRoleName.trim(), description: newRoleDescription.trim() }
      })

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('🎭 Add role API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Add role API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('🎭 Add role API response data:', responseData)

      // Handle API response format: { "result": [true, true] }
      if (responseData.result && Array.isArray(responseData.result) && responseData.result[0] === true && responseData.result[1] === true) {
        console.log('✅ Role created successfully')
        alert(`Role "${newRoleName}" added successfully!`)
        handleCloseModal()
        // Refresh roles list
        fetchRoles()
      } else {
        console.log('❌ Unexpected response format or error:', responseData)
        throw new Error('Failed to create role - invalid response from server')
      }

    } catch (error) {
      console.error('❌ Error creating role:', error)
      alert('Failed to create role: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (id: number) => {
    console.log(`Edit ${selectedSection}:`, id)
  }

  const handleViewRole = async (id: number) => {
    console.log(`🎭 VIEW ROLE STARTED for role ID:`, id)
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

      const requestUrl = `${baseUrl}/get_function_list_role`
      const requestBody = {
        token: token,
        role: id
      }

      console.log('🎭 Making get_function_list_role API call to:', requestUrl)
      console.log('🎭 Request body:', { token: token.substring(0, 8) + '...', role: id })

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('🎭 View role API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('View role API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      // Get response as text first to preserve large integers
      const responseText = await response.text()
      console.log('🎭 View role API response text:', responseText)
      
      // Replace large integers with quoted strings before JSON parsing to preserve precision
      const modifiedResponseText = responseText.replace(
        /"(org_id|dept_id)"\s*:\s*(\d{16,})/g,
        '"$1": "$2"'
      )
      
      const responseData = JSON.parse(modifiedResponseText)
      console.log('🎭 View role API response data:', responseData)

      // Handle API response format: { "result": [true, [...functions]] }
      if (responseData.result && Array.isArray(responseData.result) && responseData.result[0] === true) {
        const functionsList = responseData.result[1] || []
        console.log('✅ Successfully fetched', functionsList.length, 'functions for role')
        
        // Set functions data and initialize checked state
        setRoleFunctions(functionsList)
        setSelectedRoleId(id)
        
        // Initialize checked functions based on API response
        const initialChecked: {[key: number]: boolean} = {}
        functionsList.forEach((func: any) => {
          initialChecked[func.function_id] = func.ticked || false
        })
        setCheckedFunctions(initialChecked)
        
        setViewRoleModalOpen(true)
      } else {
        console.log('❌ Unexpected response format or error:', responseData)
        throw new Error('Failed to fetch role functions - invalid response from server')
      }

    } catch (error) {
      console.error('❌ Error fetching role functions:', error)
      setError('Failed to load role functions: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (id: number) => {
    console.log(`Delete ${selectedSection}:`, id)
    
    if (selectedSection === 'roles') {
      // Find the role to delete
      const role = roles.find(r => r.id === id)
      if (role) {
        setRoleToDelete(role)
        setDeleteDialogOpen(true)
      }
    } else if (selectedSection === 'organizations') {
      // Find the organization to delete (using org_id to match the passed id)
      const org = organizations.find(o => o.org_id === id)
      if (org) {
        setOrgToDelete(org)
        setDeleteOrgDialogOpen(true)
      }
    } else if (selectedSection === 'departments') {
      // Find the department to delete (using id to match the passed id)
      const dept = departments.find(d => d.id === id)
      if (dept) {
        setDeptToDelete(dept)
        setDeleteDeptDialogOpen(true)
      }
    }
  }

  const handleCloseRoleModal = () => {
    setViewRoleModalOpen(false)
    setSelectedRoleId(0)
    setRoleFunctions([])
    setCheckedFunctions({})
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setRoleToDelete(null)
  }

  const handleCloseOrgDeleteDialog = () => {
    setDeleteOrgDialogOpen(false)
    setOrgToDelete(null)
  }

  const handleCloseDeptDeleteDialog = () => {
    setDeleteDeptDialogOpen(false)
    setDeptToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return
    
    console.log('🗑️ DELETE ROLE STARTED')
    console.log('🗑️ Deleting role:', roleToDelete)
    
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

      const requestUrl = `${baseUrl}/delete_role`
      const requestBody = {
        token: token,
        id: roleToDelete.id,
        security_id: roleToDelete.security_id
      }

      console.log('🗑️ Making delete_role API call to:', requestUrl)
      console.log('🗑️ Request body:', { 
        token: token.substring(0, 8) + '...', 
        id: roleToDelete.id,
        security_id: roleToDelete.security_id
      })

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('🗑️ Delete role API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Delete role API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('🗑️ Delete role API response data:', responseData)

      // Handle API response format: { "result": [true, false, []] }
      if (responseData.result && Array.isArray(responseData.result) && responseData.result[0] === true) {
        console.log('✅ Role deleted successfully')
        
        // Remove the deleted role from the local state
        setRoles(prevRoles => prevRoles.filter(role => role.id !== roleToDelete.id))
        
        // Close the dialog
        handleCloseDeleteDialog()
        
        // Optionally refresh the roles list from API
        // fetchRoles()
      } else {
        console.log('❌ Unexpected response format or error:', responseData)
        throw new Error('Failed to delete role - invalid response from server')
      }

    } catch (error) {
      console.error('❌ Error deleting role:', error)
      setError('Failed to delete role: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmOrgDelete = async () => {
    if (!orgToDelete) return
    
    console.log('🗑️ DELETE ORGANIZATION STARTED')
    console.log('🗑️ Deleting organization:', orgToDelete)
    
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

      const requestUrl = `${baseUrl}/delete_org`
      const requestBody = {
        token: token,
        id: orgToDelete.id  // Use the "id" field, not org_id
      }

      console.log('🗑️ Making delete_org API call to:', requestUrl)
      console.log('🗑️ Request body:', { 
        token: token.substring(0, 8) + '...', 
        id: orgToDelete.id
      })

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('🗑️ Delete org API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Delete org API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('🗑️ Delete org API response data:', responseData)

      // Handle API response format: { "result": true }
      if (responseData.result === true) {
        console.log('✅ Organization deleted successfully')
        
        // Remove the deleted organization from the local state
        setOrganizations(prevOrgs => prevOrgs.filter(org => org.id !== orgToDelete.id))
        
        // Close the dialog
        handleCloseOrgDeleteDialog()
      } else {
        console.log('❌ Unexpected response format or error:', responseData)
        throw new Error('Failed to delete organization - invalid response from server')
      }

    } catch (error) {
      console.error('❌ Error deleting organization:', error)
      setError('Failed to delete organization: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmDeptDelete = async () => {
    if (!deptToDelete) return
    
    console.log('🗑️ DELETE DEPARTMENT STARTED')
    console.log('🗑️ Deleting department:', deptToDelete)
    
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

      const requestUrl = `${baseUrl}/delete_dept`
      const requestBody = {
        token: token,
        id: deptToDelete.id,
        dept_id: deptToDelete.dept_id,
        org_id: deptToDelete.org_id
      }

      console.log('🗑️ Making delete_dept API call to:', requestUrl)
      console.log('🗑️ Request body:', { 
        token: token.substring(0, 8) + '...', 
        id: deptToDelete.id,
        dept_id: deptToDelete.dept_id,
        org_id: deptToDelete.org_id
      })

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('🗑️ Delete dept API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Delete dept API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('🗑️ Delete dept API response data:', responseData)

      // Handle API response format: { "result": true }
      if (responseData.result === true) {
        console.log('✅ Department deleted successfully')
        
        // Remove the deleted department from the local state
        setDepartments(prevDepts => prevDepts.filter(dept => dept.id !== deptToDelete.id))
        
        // Close the dialog
        handleCloseDeptDeleteDialog()
      } else {
        console.log('❌ Unexpected response format or error:', responseData)
        throw new Error('Failed to delete department - invalid response from server')
      }

    } catch (error) {
      console.error('❌ Error deleting department:', error)
      setError('Failed to delete department: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleFunctionToggle = (functionId: number) => {
    setCheckedFunctions(prev => ({
      ...prev,
      [functionId]: !prev[functionId]
    }))
  }

  const handleSavePermissions = async () => {
    console.log('🎭 SAVE ROLE PERMISSIONS STARTED')
    console.log('🎭 Saving permissions for role:', selectedRoleId)
    console.log('🎭 Checked functions:', checkedFunctions)
    
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

      // Prepare functions array with updated ticked status
      // Since large integers are now preserved as strings from fetch, we can safely spread and update
      const functionsWithUpdatedTicked = roleFunctions.map((func: any) => ({
        ...func,
        ticked: checkedFunctions[func.function_id] || false
      }))

      const requestUrl = `${baseUrl}/save_role_functions`
      const requestBody = {
        token: token,
        role: selectedRoleId,
        functions: functionsWithUpdatedTicked
      }

      console.log('🎭 Making save_role_functions API call to:', requestUrl)
      console.log('🎭 Request body:', { 
        token: token.substring(0, 8) + '...', 
        role: selectedRoleId,
        functions: `[${functionsWithUpdatedTicked.length} functions with updated ticked status]`
      })
      
      // Debug: Log the exact org_id and dept_id values being sent
      functionsWithUpdatedTicked.forEach((func, index) => {
        if (func.org_id || func.dept_id) {
          console.log(`🔍 Function ${index} - org_id: ${func.org_id} (type: ${typeof func.org_id}), dept_id: ${func.dept_id} (type: ${typeof func.dept_id})`)
        }
      })
      
      // Debug: Log the JSON string that will be sent (with preserved large integers)
      const requestBodyString = JSON.stringify(requestBody, (key, value) => {
        // Preserve org_id and dept_id as strings to maintain precision
        if ((key === 'org_id' || key === 'dept_id') && typeof value === 'string') {
          return value
        }
        return value
      })
      console.log('🎭 Request body as JSON string (first 1000 chars):', requestBodyString.substring(0, 1000))

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody, (key, value) => {
          // Preserve org_id and dept_id as strings to maintain precision
          if ((key === 'org_id' || key === 'dept_id') && typeof value === 'string') {
            return value
          }
          return value
        })
      })

      console.log('🎭 Save permissions API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Save permissions API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('🎭 Save permissions API response data:', responseData)

      // Handle API response format: { "result": true }
      if (responseData.result === true) {
        console.log('✅ Role permissions saved successfully')
        alert('Role permissions saved successfully!')
        handleCloseRoleModal()
      } else {
        console.log('❌ Unexpected response format or error:', responseData)
        throw new Error('Failed to save permissions - invalid response from server')
      }

    } catch (error) {
      console.error('❌ Error saving role permissions:', error)
      alert('Failed to save permissions: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  // Group functions by function_group_ui
  const groupedFunctions = roleFunctions.reduce((acc: any, func: any) => {
    const group = func.function_group_ui || 'Other'
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push(func)
    return acc
  }, {})

  const handleRefresh = () => {
    console.log(`Refresh ${selectedSection}`)
    if (selectedSection === 'organizations') {
      fetchOrganizations()
    } else if (selectedSection === 'departments') {
      fetchDepartments()
    } else if (selectedSection === 'users') {
      fetchUsers()
    } else if (selectedSection === 'roles') {
      fetchRoles()
    }
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
                        <TableCell>{org.org_owner || '-'}</TableCell>
                        <TableCell>{org.org_id}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{org.name}</TableCell>
                        <TableCell>
                          <Chip label={org.org_type} color={getTypeColor(org.org_type) as any} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label={org.status} color={getStatusColor(org.status) as any} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          {org.org_type?.toLowerCase() !== 'root' && (
                            <IconButton size="small" onClick={() => handleDelete(org.org_id)}>
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
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
                  <TableCell sx={{ fontWeight: 600 }}>Org ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Dept ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Invite Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={24} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Loading users...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (currentData as any[]).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No users found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  (currentData as any[]).map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{user.org_id}</TableCell>
                      <TableCell>{user.dept_id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.status} 
                          color={user.status === 'Active' ? 'success' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleEdit(user.id)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(user.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
                          {dept.dept_type?.toLowerCase() !== 'root' && (
                            <IconButton size="small" onClick={() => handleDelete(dept.id)}>
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
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
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.100' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Role Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Organization ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Department ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Security ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(currentData as Role[]).map((role) => (
                      <TableRow key={role.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{role.name}</TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>
                          <Chip label={role.role_type} color={getTypeColor(role.role_type) as any} size="small" />
                        </TableCell>
                        <TableCell>{role.org_id}</TableCell>
                        <TableCell>{role.dept_id}</TableCell>
                        <TableCell>{role.security_id}</TableCell>
                        <TableCell>
                          <Chip label={role.status} color={getStatusColor(role.status) as any} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          {role.role_type?.toLowerCase() !== 'system' && (
                            <>
                              <IconButton size="small" onClick={() => handleViewRole(role.id)}>
                                <Visibility fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDelete(role.id)}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
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

      {/* Role Permissions Modal */}
      <Dialog
        open={viewRoleModalOpen}
        onClose={handleCloseRoleModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Role Permissions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Select the permissions for this role
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pb: 3 }}>
          {Object.keys(groupedFunctions).map((groupName) => (
            <Accordion key={groupName} sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{ backgroundColor: 'grey.50' }}
              >
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {groupName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  ({groupedFunctions[groupName].length} functions)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGroup>
                  {groupedFunctions[groupName].map((func: any) => (
                    <FormControlLabel
                      key={func.function_id}
                      control={
                        <Checkbox
                          checked={checkedFunctions[func.function_id] || false}
                          onChange={() => handleFunctionToggle(func.function_id)}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {func.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {func.description}
                          </Typography>
                        </Box>
                      }
                      sx={{ mb: 1, alignItems: 'flex-start' }}
                    />
                  ))}
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          ))}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleCloseRoleModal}
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
            onClick={handleSavePermissions}
            variant="contained"
            disabled={isLoading}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                Saving...
              </Box>
            ) : (
              'Save Permissions'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Role Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
            Delete Role
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this role?
          </Typography>
          {roleToDelete && (
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'error.light', 
              border: 1, 
              borderColor: 'error.main',
              mb: 2 
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {roleToDelete.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {roleToDelete.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {roleToDelete.id} | Security ID: {roleToDelete.security_id}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            disabled={isLoading}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={isLoading}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                Deleting...
              </Box>
            ) : (
              'Delete Role'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Organization Confirmation Dialog */}
      <Dialog
        open={deleteOrgDialogOpen}
        onClose={handleCloseOrgDeleteDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
            Delete Organization
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this organization?
          </Typography>
          {orgToDelete && (
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'error.light', 
              border: 1, 
              borderColor: 'error.main',
              mb: 2 
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {orgToDelete.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Owner: {orgToDelete.org_owner || 'N/A'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {orgToDelete.id} | Org ID: {orgToDelete.org_id} | Type: {orgToDelete.org_type}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleCloseOrgDeleteDialog}
            variant="outlined"
            disabled={isLoading}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmOrgDelete}
            variant="contained"
            color="error"
            disabled={isLoading}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                Deleting...
              </Box>
            ) : (
              'Delete Organization'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Department Confirmation Dialog */}
      <Dialog
        open={deleteDeptDialogOpen}
        onClose={handleCloseDeptDeleteDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
            Delete Department
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this department?
          </Typography>
          {deptToDelete && (
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'error.light', 
              border: 1, 
              borderColor: 'error.main',
              mb: 2 
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {deptToDelete.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Type: {deptToDelete.dept_type} | Status: {deptToDelete.status}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {deptToDelete.id} | Dept ID: {deptToDelete.dept_id} | Org ID: {deptToDelete.org_id}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleCloseDeptDeleteDialog}
            variant="outlined"
            disabled={isLoading}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeptDelete}
            variant="contained"
            color="error"
            disabled={isLoading}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                Deleting...
              </Box>
            ) : (
              'Delete Department'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}