# 🛠️ **Autonomous Development Templates for SISO Agency Platform**

---

## 🎯 **Template System Overview**
These templates enable Claude Code to rapidly create consistent, high-quality code following SISO project patterns and business requirements.

### 📁 **Template Categories**
- **Components** - UI components with TypeScript and SISO styling
- **Hooks** - Custom hooks with Supabase integration
- **Pages** - Full page components with proper structure
- **Database Operations** - Supabase query patterns
- **Forms** - React Hook Form + Zod validation
- **Utilities** - Helper functions and common patterns

---

## ⚛️ **REACT COMPONENT TEMPLATES**

### 🎯 **Basic Component Template**
```typescript
// Template: Basic SISO Component
import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2, [ICON_NAME] } from 'lucide-react'

interface [COMPONENT_NAME]Props {
  // Required props
  id?: string
  className?: string
  
  // Component-specific props
  [PROP_NAME]: [PROP_TYPE]
  
  // Event handlers
  onClick?: () => void
  onError?: (error: Error) => void
}

export const [COMPONENT_NAME]: React.FC<[COMPONENT_NAME]Props> = ({
  id,
  className,
  [PROP_NAME],
  onClick,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleAction = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Implementation logic here
      
      onClick?.()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className={cn(
        "p-4 border border-red-200 rounded-lg bg-red-50",
        className
      )}>
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Error</span>
        </div>
        <p className="mt-1 text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div
      id={id}
      className={cn(
        // SISO base styles
        "bg-white border border-gray-200 rounded-lg shadow-sm",
        // SISO brand colors
        "hover:border-orange-300 transition-colors duration-200",
        className
      )}
      {...props}
    >
      {/* Component content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            [COMPONENT_TITLE]
          </h3>
          <[ICON_NAME] className="h-5 w-5 text-orange-500" />
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            <span className="ml-2 text-sm text-gray-600">Loading...</span>
          </div>
        ) : (
          <div>
            {/* Component-specific content */}
            <p className="text-gray-600 text-sm">
              {[PROP_NAME]}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

[COMPONENT_NAME].displayName = '[COMPONENT_NAME]'
```

### 📊 **Dashboard Card Template**
```typescript
// Template: SISO Dashboard Card
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { [ICON_NAME], TrendingUp, TrendingDown } from 'lucide-react'

interface [CARD_NAME]Props {
  title: string
  value: number | string
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period: string
  }
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export const [CARD_NAME]: React.FC<[CARD_NAME]Props> = ({
  title,
  value,
  change,
  icon,
  action,
  className
}) => {
  return (
    <Card className={cn(
      "hover:shadow-md transition-shadow duration-200",
      "border-l-4 border-l-orange-500",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon || <[ICON_NAME] className="h-4 w-4 text-orange-500" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        
        {change && (
          <div className="flex items-center text-xs">
            {change.type === 'increase' ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={cn(
              "font-medium",
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            )}>
              {change.value > 0 ? '+' : ''}{change.value}%
            </span>
            <span className="text-gray-500 ml-1">from {change.period}</span>
          </div>
        )}
        
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="mt-3 text-orange-600 border-orange-200 hover:bg-orange-50"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
```

---

## 🎣 **CUSTOM HOOKS TEMPLATES**

### 🗄️ **Supabase Data Hook Template**
```typescript
// Template: SISO Supabase Data Hook
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types'
import { z } from 'zod'

// Zod validation schema
const [ENTITY_NAME]Schema = z.object({
  [FIELD_NAME]: z.string().min(1, '[FIELD_NAME] is required'),
  // Add other fields as needed
})

type [ENTITY_NAME] = Tables<'[TABLE_NAME]'>
type [ENTITY_NAME]Insert = TablesInsert<'[TABLE_NAME]'>
type [ENTITY_NAME]Update = TablesUpdate<'[TABLE_NAME]'>

interface Use[ENTITY_NAME]Options {
  userId?: string
  filters?: {
    status?: string
    category?: string
    // Add other filters as needed
  }
  enabled?: boolean
}

export const use[ENTITY_NAME] = (options: Use[ENTITY_NAME]Options = {}) => {
  const { userId, filters, enabled = true } = options
  const queryClient = useQueryClient()

  // Query for fetching data
  const {
    data: [ENTITY_NAME_PLURAL],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['[ENTITY_NAME_PLURAL]', userId, filters],
    queryFn: async () => {
      let query = supabase
        .from('[TABLE_NAME]')
        .select(`
          *,
          // Add related table joins if needed
          // related_table:related_table_id(*)
        `)
        .order('created_at', { ascending: false })

      if (userId) {
        query = query.eq('user_id', userId)
      }

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Failed to fetch [ENTITY_NAME_PLURAL]: ${error.message}`)
      }

      return data as [ENTITY_NAME][]
    },
    enabled
  })

  // Mutation for creating new records
  const createMutation = useMutation({
    mutationFn: async (newData: [ENTITY_NAME]Insert) => {
      // Validate data
      const validatedData = [ENTITY_NAME]Schema.parse(newData)

      const { data, error } = await supabase
        .from('[TABLE_NAME]')
        .insert(validatedData)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create [ENTITY_NAME]: ${error.message}`)
      }

      return data as [ENTITY_NAME]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[ENTITY_NAME_PLURAL]'] })
    }
  })

  // Mutation for updating records
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: [ENTITY_NAME]Update }) => {
      const { data, error } = await supabase
        .from('[TABLE_NAME]')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update [ENTITY_NAME]: ${error.message}`)
      }

      return data as [ENTITY_NAME]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[ENTITY_NAME_PLURAL]'] })
    }
  })

  // Mutation for deleting records
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('[TABLE_NAME]')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Failed to delete [ENTITY_NAME]: ${error.message}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[ENTITY_NAME_PLURAL]'] })
    }
  })

  return {
    // Data
    [ENTITY_NAME_PLURAL],
    isLoading,
    error,
    
    // Actions
    refetch,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Errors
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error
  }
}
```

### 📊 **Analytics Hook Template**
```typescript
// Template: SISO Analytics Hook
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { subDays, format } from 'date-fns'

interface Analytics[FEATURE_NAME]Options {
  userId?: string
  dateRange?: {
    start: Date
    end: Date
  }
  granularity?: 'day' | 'week' | 'month'
}

interface [FEATURE_NAME]Analytics {
  totalCount: number
  changeFromPrevious: number
  breakdown: {
    date: string
    count: number
    value?: number
  }[]
  categories: {
    name: string
    count: number
    percentage: number
  }[]
}

export const useAnalytics[FEATURE_NAME] = (options: Analytics[FEATURE_NAME]Options = {}) => {
  const { 
    userId, 
    dateRange = {
      start: subDays(new Date(), 30),
      end: new Date()
    },
    granularity = 'day'
  } = options

  return useQuery({
    queryKey: ['analytics', '[FEATURE_NAME_LOWER]', userId, dateRange, granularity],
    queryFn: async (): Promise<[FEATURE_NAME]Analytics> => {
      // Current period data
      let currentQuery = supabase
        .from('[TABLE_NAME]')
        .select('*')
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString())

      if (userId) {
        currentQuery = currentQuery.eq('user_id', userId)
      }

      const { data: currentData, error: currentError } = await currentQuery

      if (currentError) {
        throw new Error(`Failed to fetch current analytics: ${currentError.message}`)
      }

      // Previous period for comparison
      const daysDiff = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))
      const previousStart = subDays(dateRange.start, daysDiff)
      const previousEnd = dateRange.start

      let previousQuery = supabase
        .from('[TABLE_NAME]')
        .select('id', { count: 'exact' })
        .gte('created_at', previousStart.toISOString())
        .lt('created_at', previousEnd.toISOString())

      if (userId) {
        previousQuery = previousQuery.eq('user_id', userId)
      }

      const { count: previousCount, error: previousError } = await previousQuery

      if (previousError) {
        throw new Error(`Failed to fetch previous analytics: ${previousError.message}`)
      }

      // Calculate metrics
      const totalCount = currentData.length
      const changeFromPrevious = previousCount > 0 
        ? ((totalCount - previousCount) / previousCount) * 100 
        : totalCount > 0 ? 100 : 0

      // Generate breakdown by date
      const breakdown = generateDateBreakdown(currentData, dateRange, granularity)

      // Generate category breakdown (customize based on your data)
      const categories = generateCategoryBreakdown(currentData)

      return {
        totalCount,
        changeFromPrevious,
        breakdown,
        categories
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000 // 10 minutes
  })
}

// Helper functions
function generateDateBreakdown(
  data: any[], 
  dateRange: { start: Date; end: Date }, 
  granularity: 'day' | 'week' | 'month'
) {
  // Implementation based on granularity
  return []
}

function generateCategoryBreakdown(data: any[]) {
  // Implementation based on your data structure
  return []
}
```

---

## 📄 **PAGE COMPONENT TEMPLATES**

### 🏠 **Dashboard Page Template**
```typescript
// Template: SISO Dashboard Page
import React from 'react'
import { useAuthSession } from '@/hooks/useAuthSession'
import { use[FEATURE_NAME] } from '@/hooks/use[FEATURE_NAME]'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { [FEATURE_NAME]Table } from '@/components/[FEATURE_NAME]/[FEATURE_NAME]Table'
import { Button } from '@/components/ui/button'
import { Plus, [ICON_NAME] } from 'lucide-react'
import { useState } from 'react'

export const [PAGE_NAME]Page: React.FC = () => {
  const { user } = useAuthSession()
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  const {
    [FEATURE_NAME_PLURAL],
    isLoading,
    error,
    create,
    isCreating
  } = use[FEATURE_NAME]({
    userId: user?.id,
    enabled: !!user
  })

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Please log in to access this page.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              [PAGE_TITLE]
            </h1>
            <p className="text-gray-600 mt-1">
              [PAGE_DESCRIPTION]
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create [ENTITY_NAME]
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total [ENTITY_NAME_PLURAL]"
            value={[FEATURE_NAME_PLURAL]?.length || 0}
            icon={<[ICON_NAME] className="h-4 w-4" />}
            change={{
              value: 12, // Calculate from analytics
              type: 'increase',
              period: 'last month'
            }}
          />
          {/* Add more stat cards as needed */}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span className="ml-3 text-gray-600">Loading [FEATURE_NAME_PLURAL]...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 font-medium">Error loading [FEATURE_NAME_PLURAL]</p>
                <p className="text-gray-500 text-sm mt-1">{error.message}</p>
              </div>
            </div>
          ) : (
            <[FEATURE_NAME]Table
              data={[FEATURE_NAME_PLURAL] || []}
              onEdit={(item) => {
                // Handle edit
              }}
              onDelete={(item) => {
                // Handle delete
              }}
            />
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <[FEATURE_NAME]CreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={create}
          isCreating={isCreating}
        />
      )}
    </DashboardLayout>
  )
}
```

---

## 📝 **FORM TEMPLATES**

### 🎯 **React Hook Form + Zod Template**
```typescript
// Template: SISO Form Component
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'

// Zod validation schema
const [FORM_NAME]Schema = z.object({
  [FIELD_NAME]: z.string().min(1, '[FIELD_NAME] is required'),
  email: z.string().email('Please enter a valid email'),
  description: z.string().optional(),
  category: z.enum(['option1', 'option2', 'option3'], {
    required_error: 'Please select a category'
  })
})

type [FORM_NAME]Data = z.infer<typeof [FORM_NAME]Schema>

interface [FORM_NAME]Props {
  initialData?: Partial<[FORM_NAME]Data>
  onSubmit: (data: [FORM_NAME]Data) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
}

export const [FORM_NAME]: React.FC<[FORM_NAME]Props> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const form = useForm<[FORM_NAME]Data>({
    resolver: zodResolver([FORM_NAME]Schema),
    defaultValues: {
      [FIELD_NAME]: initialData?.[FIELD_NAME] || '',
      email: initialData?.email || '',
      description: initialData?.description || '',
      category: initialData?.category || undefined
    }
  })

  const handleSubmit = async (data: [FORM_NAME]Data) => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      // Error is handled by parent component
      console.error('Form submission error:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="[FIELD_NAME]"
          render={({ field }) => (
            <FormItem>
              <FormLabel>[FIELD_LABEL]</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter [FIELD_NAME]..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter email address..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description..."
                  rows={4}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

---

## 🛠️ **UTILITY TEMPLATES**

### 📊 **Data Processing Utility**
```typescript
// Template: SISO Data Processing Utility
import { format, parseISO, subDays } from 'date-fns'

export interface ProcessedData<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  filters: Record<string, any>
  summary: {
    total: number
    filtered: number
    percentage: number
  }
}

export class [FEATURE_NAME]DataProcessor<T extends Record<string, any>> {
  constructor(private data: T[]) {}

  // Filter data based on criteria
  filter(criteria: Partial<T> & {
    dateRange?: { start: Date; end: Date }
    search?: string
    searchFields?: (keyof T)[]
  }): [FEATURE_NAME]DataProcessor<T> {
    let filtered = [...this.data]

    // Apply field filters
    Object.entries(criteria).forEach(([key, value]) => {
      if (key === 'dateRange' || key === 'search' || key === 'searchFields' || value === undefined) {
        return
      }
      
      filtered = filtered.filter(item => {
        if (Array.isArray(value)) {
          return value.includes(item[key])
        }
        return item[key] === value
      })
    })

    // Apply date range filter
    if (criteria.dateRange) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created_at || item.date)
        return itemDate >= criteria.dateRange!.start && itemDate <= criteria.dateRange!.end
      })
    }

    // Apply search filter
    if (criteria.search && criteria.searchFields) {
      const searchTerm = criteria.search.toLowerCase()
      filtered = filtered.filter(item =>
        criteria.searchFields!.some(field =>
          String(item[field]).toLowerCase().includes(searchTerm)
        )
      )
    }

    return new [FEATURE_NAME]DataProcessor(filtered)
  }

  // Sort data
  sort(field: keyof T, direction: 'asc' | 'desc' = 'asc'): [FEATURE_NAME]DataProcessor<T> {
    const sorted = [...this.data].sort((a, b) => {
      const aVal = a[field]
      const bVal = b[field]

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal
      }

      if (aVal instanceof Date && bVal instanceof Date) {
        return direction === 'asc'
          ? aVal.getTime() - bVal.getTime()
          : bVal.getTime() - aVal.getTime()
      }

      return 0
    })

    return new [FEATURE_NAME]DataProcessor(sorted)
  }

  // Paginate data
  paginate(page: number, limit: number): ProcessedData<T> {
    const total = this.data.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return {
      data: this.data.slice(startIndex, endIndex),
      pagination: {
        total,
        page,
        limit,
        totalPages
      },
      filters: {},
      summary: {
        total: this.data.length,
        filtered: this.data.length,
        percentage: 100
      }
    }
  }

  // Get summary statistics
  getSummary(): {
    total: number
    byCategory: Record<string, number>
    byStatus: Record<string, number>
    trends: {
      thisMonth: number
      lastMonth: number
      change: number
    }
  } {
    const total = this.data.length
    
    // Group by category (customize based on your data)
    const byCategory = this.data.reduce((acc, item) => {
      const category = item.category || 'uncategorized'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Group by status (customize based on your data)
    const byStatus = this.data.reduce((acc, item) => {
      const status = item.status || 'unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Calculate trends
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    const thisMonth = this.data.filter(item => {
      const itemDate = new Date(item.created_at || item.date)
      return itemDate >= thisMonthStart
    }).length

    const lastMonth = this.data.filter(item => {
      const itemDate = new Date(item.created_at || item.date)
      return itemDate >= lastMonthStart && itemDate <= lastMonthEnd
    }).length

    const change = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0

    return {
      total,
      byCategory,
      byStatus,
      trends: {
        thisMonth,
        lastMonth,
        change
      }
    }
  }

  // Export data
  toCSV(filename?: string): void {
    if (this.data.length === 0) return

    const headers = Object.keys(this.data[0])
    const csvContent = [
      headers.join(','),
      ...this.data.map(row =>
        headers.map(header => {
          const value = row[header]
          // Escape quotes and wrap in quotes if contains comma
          const escaped = String(value).replace(/"/g, '""')
          return escaped.includes(',') ? `"${escaped}"` : escaped
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `[FEATURE_NAME_LOWER]_export_${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Get raw data
  getData(): T[] {
    return this.data
  }
}

// Factory function for easy usage
export const process[FEATURE_NAME]Data = <T extends Record<string, any>>(data: T[]) => {
  return new [FEATURE_NAME]DataProcessor(data)
}
```

---

## 🎯 **TEMPLATE USAGE INSTRUCTIONS**

### ⚡ **Quick Start Guide**
1. **Choose appropriate template** based on component type
2. **Replace placeholders** with actual values:
   - `[COMPONENT_NAME]` - PascalCase component name
   - `[FEATURE_NAME]` - Feature name in PascalCase
   - `[TABLE_NAME]` - Database table name
   - `[FIELD_NAME]` - Form field names
   - `[ICON_NAME]` - Lucide React icon name
3. **Customize business logic** for specific requirements
4. **Apply SISO branding** (orange/yellow colors)
5. **Add proper error handling** and loading states
6. **Include TypeScript types** and interfaces
7. **Test thoroughly** with quality gates

### 📋 **Checklist for Template Usage**
- [ ] All placeholders replaced with actual values
- [ ] TypeScript interfaces properly defined
- [ ] SISO brand colors applied consistently
- [ ] Error handling implemented
- [ ] Loading states included
- [ ] Responsive design considerations
- [ ] Accessibility attributes added
- [ ] Proper database queries optimized
- [ ] Form validation with Zod schemas
- [ ] Component tested in isolation

---

**🚀 TEMPLATES READY**: Claude Code is equipped with comprehensive development templates for rapid, consistent, and high-quality implementation of SISO Agency Platform features following established patterns and best practices.