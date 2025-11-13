'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  Edit,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Column<T = any> {
  key: keyof T | string
  label: string
  sortable?: boolean
  searchable?: boolean
  render?: (value: any, item: T, index: number) => React.ReactNode
  width?: string
  className?: string
}

interface DataTableProps<T = any> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  error?: string | null
  pagination?: {
    page: number
    limit: number
    total: number
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
  }
  selection?: {
    selectedItems: T[]
    onSelectionChange: (selectedItems: T[]) => void
    getRowId: (item: T) => string
  }
  actions?: {
    add?: {
      label: string
      onClick: () => void
    }
    edit?: (item: T) => void
    delete?: (item: T) => void
    view?: (item: T) => void
    custom?: (item: T) => React.ReactNode
  }
  search?: {
    placeholder?: string
    onSearch: (query: string) => void
    value?: string
  }
  filters?: {
    placeholder?: string
    options: { label: string; value: string }[]
    onFilter: (filter: string) => void
    value?: string
  }
  bulkActions?: {
    delete: (items: T[]) => void
    export?: (items: T[]) => void
  }
  className?: string
  emptyState?: React.ReactNode
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error = null,
  pagination,
  selection,
  actions,
  search,
  filters,
  bulkActions,
  className,
  emptyState,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string
    direction: 'asc' | 'desc'
  } | null>(null)

  const [localSearchQuery, setLocalSearchQuery] = useState(search?.value || '')

  // Filter and sort data
  const processedData = useMemo(() => {
    let filteredData = [...data]

    // Client-side filtering (optional - mainly for search)
    if (localSearchQuery && !search?.onSearch) {
      const query = localSearchQuery.toLowerCase()
      filteredData = filteredData.filter(item =>
        columns.some(column => {
          const value = item[column.key as keyof T]
          return String(value).toLowerCase().includes(query)
        })
      )
    }

    // Client-side sorting
    if (sortConfig) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T]
        const bValue = b[sortConfig.key as keyof T]

        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filteredData
  }, [data, localSearchQuery, sortConfig, columns, search])

  const handleSort = (key: keyof T | string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' }
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' }
      }
      return null
    })
  }

  const handleSearch = (query: string) => {
    setLocalSearchQuery(query)
    search?.onSearch?.(query)
  }

  const handleSelectAll = (checked: boolean) => {
    if (!selection) return
    selection.onSelectionChange(checked ? processedData : [])
  }

  const handleSelectRow = (item: T, checked: boolean) => {
    if (!selection) return
    const selected = checked
      ? [...selection.selectedItems, item]
      : selection.selectedItems.filter(selectedItem =>
          selection.getRowId(selectedItem) !== selection.getRowId(item)
        )
    selection.onSelectionChange(selected)
  }

  const isAllSelected = selection && processedData.length > 0 &&
    processedData.every(item =>
      selection.selectedItems.some(selectedItem =>
        selection.getRowId(selectedItem) === selection.getRowId(item)
      )
    )

  const isIndeterminate = selection && processedData.length > 0 &&
    processedData.some(item =>
      selection.selectedItems.some(selectedItem =>
        selection.getRowId(selectedItem) === selection.getRowId(item)
      )
    ) && !isAllSelected

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 0

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="border rounded-lg">
          <div className="h-96 bg-gray-100 animate-pulse rounded-t-lg"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border border-red-200 rounded-lg bg-red-50 p-6 text-center">
        <p className="text-red-600">Error: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-2">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {actions?.add && (
            <Button onClick={actions.add.onClick}>
              {actions.add.label}
            </Button>
          )}
          {selection && bulkActions && selection.selectedItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {selection.selectedItems.length} selected
              </Badge>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                  </DialogHeader>
                  <p>
                    Are you sure you want to delete {selection.selectedItems.length} item(s)?
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button
                      variant="destructive"
                      onClick={() => bulkActions.delete(selection.selectedItems)}
                    >
                      Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {search && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={search.placeholder || 'Search...'}
                value={localSearchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          )}

          {filters && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {filters.options.find(f => f.value === filters.value)?.label || 'Filter'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {filters.options.map(option => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => filters.onFilter?.(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {selection && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    ref={ref => {
                      if (ref && 'indeterminate' in ref) {
                        ref.indeterminate = isIndeterminate
                      }
                    }}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className={cn(
                    column.sortable && 'cursor-pointer hover:bg-gray-50',
                    column.className
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
              ))}
              {actions && <TableHead className="w-12">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selection ? 1 : 0) + (actions ? 1 : 0)}>
                  <div className="text-center py-8">
                    {emptyState || (
                      <div className="text-gray-500">
                        No data available
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              processedData.map((item, index) => (
                <TableRow key={selection?.getRowId(item) || index}>
                  {selection && (
                    <TableCell>
                      <Checkbox
                        checked={selection.selectedItems.some(selectedItem =>
                          selection.getRowId(selectedItem) === selection.getRowId(item)
                        )}
                        onCheckedChange={(checked) => handleSelectRow(item, !!checked)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      className={column.className}
                    >
                      {column.render
                        ? column.render(item[column.key as keyof T], item, index)
                        : String(item[column.key as keyof T] || '')
                      }
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.view && (
                            <DropdownMenuItem onClick={() => actions.view!(item)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                          )}
                          {actions.edit && (
                            <DropdownMenuItem onClick={() => actions.edit!(item)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {actions.custom && actions.custom(item)}
                          {actions.delete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => actions.delete!(item)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}