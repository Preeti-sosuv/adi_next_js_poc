'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Chip,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material'
import {
  Search,
  CheckCircle,
  Error,
  Warning,
} from '@mui/icons-material'

interface ServiceStatusItem {
  service_name: string
  service_status: string
  hostip?: string
  end_point?: string
  started?: string
  pingdate?: string
  metric_1?: string
  metric_2?: string
  metric_3?: string
  replicas?: string
  api_link?: string
  sort?: number
}

interface ServiceStatusGridProps {
  data: ServiceStatusItem[]
  runMode: string
  isLoading?: boolean
}

type Order = 'asc' | 'desc'

export default function ServiceStatusGrid({ data, runMode, isLoading = false }: ServiceStatusGridProps) {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof ServiceStatusItem>('service_name')
  const [searchTerm, setSearchTerm] = useState('')

  const handleRequestSort = (property: keyof ServiceStatusItem) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'good':
      case 'up':
      case 'running':
      case 'healthy':
        return 'success'
      case 'down':
      case 'error':
      case 'failed':
        return 'error'
      case 'warning':
      case 'degraded':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'good':
      case 'up':
      case 'running':
      case 'healthy':
        return <CheckCircle fontSize="small" />
      case 'down':
      case 'error':
      case 'failed':
        return <Error fontSize="small" />
      case 'warning':
      case 'degraded':
        return <Warning fontSize="small" />
      default:
        return null
    }
  }

  // Filter and sort data
  const filteredData = data.filter((item) =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const sortedData = filteredData.sort((a, b) => {
    const aValue = a[orderBy]?.toString() || ''
    const bValue = b[orderBy]?.toString() || ''
    
    if (order === 'asc') {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

  // Define columns based on run mode (matching Anvil logic)
  const dockerColumns = [
    { key: 'service_name', label: 'Service', sortable: true },
    { key: 'service_status', label: 'Status', sortable: true },
    { key: 'replicas', label: 'Replicas', sortable: true },
  ]

  const standardColumns = [
    { key: 'service_name', label: 'Service', sortable: true },
    { key: 'service_status', label: 'Status', sortable: true },
    { key: 'hostip', label: 'Host', sortable: true },
    { key: 'end_point', label: 'Endpoint', sortable: true },
    { key: 'started', label: 'Started', sortable: true },
    { key: 'pingdate', label: 'Last Contacted', sortable: true },
    { key: 'metric_1', label: 'Activity', sortable: true },
  ]

  const columns = runMode === 'DOCKER' ? dockerColumns : standardColumns

  return (
    <Box>
      {/* Search Filter */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <TableContainer sx={{ maxHeight: 400, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{ 
                    fontWeight: 600,
                    backgroundColor: 'grey.50',
                    borderBottom: '2px solid',
                    borderColor: 'divider'
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.key}
                      direction={orderBy === column.key ? order : 'asc'}
                      onClick={() => handleRequestSort(column.key as keyof ServiceStatusItem)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Refreshing service status...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? 'No services found matching your search' : 'No service status data available'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((item, index) => (
                <TableRow key={index} hover>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.key === 'service_status' ? (
                        <Chip
                          label={String(item[column.key as keyof ServiceStatusItem] || '')}
                          color={getStatusColor(String(item[column.key as keyof ServiceStatusItem] || '')) as any}
                          size="small"
                          icon={getStatusIcon(String(item[column.key as keyof ServiceStatusItem] || '')) || undefined}
                          sx={{ minWidth: 80 }}
                        />
                      ) : column.key === 'service_name' ? (
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item[column.key as keyof ServiceStatusItem] || '-'}
                        </Typography>
                      ) : (
                        <Typography variant="body2">
                          {item[column.key as keyof ServiceStatusItem] || '-'}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary */}
      {data.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {sortedData.length} of {data.length} services
            {searchTerm && ` matching "${searchTerm}"`}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Status summary */}
            {['good', 'up', 'running', 'healthy'].some(status => 
              data.some(item => item.service_status?.toLowerCase() === status)
            ) && (
              <Chip
                label={`${data.filter(item => 
                  ['good', 'up', 'running', 'healthy'].includes(item.service_status?.toLowerCase() || '')
                ).length} Healthy`}
                color="success"
                size="small"
              />
            )}
            {['down', 'error', 'failed'].some(status => 
              data.some(item => item.service_status?.toLowerCase() === status)
            ) && (
              <Chip
                label={`${data.filter(item => 
                  ['down', 'error', 'failed'].includes(item.service_status?.toLowerCase() || '')
                ).length} Down`}
                color="error"
                size="small"
              />
            )}
            {['warning', 'degraded'].some(status => 
              data.some(item => item.service_status?.toLowerCase() === status)
            ) && (
              <Chip
                label={`${data.filter(item => 
                  ['warning', 'degraded'].includes(item.service_status?.toLowerCase() || '')
                ).length} Warning`}
                color="warning"
                size="small"
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}