# CUSTOM HOOK PATTERNS

## 🎣 **Hook Architecture Standards**

### **Standard Hook Structure**
```typescript
// 1. Imports (React Query, Supabase, types)
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TypeDefinitions } from '@/types/domain.types';

// 2. Interface/Type Definitions
export interface HookData {
  id: string;
  // ... other properties
}

// 3. Helper Functions (if needed)
const validateData = (data: any): ValidType => {
  // Validation logic
};

// 4. Main Hook Implementation
export const useCustomHook = (params?: HookParams) => {
  return useQuery({
    queryKey: ['hookData', params],
    queryFn: async () => {
      // Implementation
    },
    enabled: !!requiredCondition,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });
};
```

## 🔄 **React Query Patterns**

### **Standard Query Hook**
```typescript
export function useEntityData() {
  const useEntityQuery = (filters?: FilterOptions, userId?: string) => {
    console.log('Fetching entities with filters:', filters, 'userId:', userId);
    
    return useQuery({
      queryKey: ['entities', filters, userId],
      queryFn: async () => {
        const query = supabase
          .from('table_name')
          .select('*')
          
        // Apply filters conditionally
        if (filters?.category) {
          query.eq('category', filters.category);
        }

        if (userId) {
          query.eq('user_id', userId);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching entities:', error);
          throw error;
        }

        // Map and validate data
        const mappedData = (data || []).map(item => ({
          ...item,
          status: validateStatus(item.status),
          priority: validatePriority(item.priority)
        } as EntityType));

        // Sort data
        return mappedData.sort((a, b) => {
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
        });
      },
      meta: {
        onError: (error: Error) => {
          console.error('Error in entity query:', error);
        }
      }
    });
  };

  return { useEntityQuery };
}
```

### **Authentication-Dependent Queries**
```typescript
export const useClientData = () => {
  const { user } = useAuthSession();

  return useQuery({
    queryKey: ['clientData', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Multi-step data fetching pattern
      const { data: userLink, error: linkError } = await supabase
        .from('client_user_links')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      if (linkError && linkError.code !== 'PGRST116') {
        console.error('Error fetching client link:', linkError);
      }

      let clientId = userLink?.client_id;

      // Fallback query pattern
      if (!clientId) {
        const { data: clientRecord, error: clientError } = await supabase
          .from('client_onboarding')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (clientError && clientError.code !== 'PGRST116') {
          console.error('Error fetching client record:', clientError);
        }

        clientId = clientRecord?.id;
      }

      // Early return pattern
      if (!clientId) {
        return null;
      }

      // Final data fetch
      const { data: clientData, error: dataError } = await supabase
        .from('client_onboarding')
        .select('*')
        .eq('id', clientId)
        .single();

      if (dataError) {
        throw new Error(`Error fetching client data: ${dataError.message}`);
      }

      return clientData as ClientData;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
```

## ✅ **Data Validation Patterns**

### **Type Validation Functions**
```typescript
// Helper function to validate enum values
const validateTaskStatus = (status: any): TaskStatus => {
  const validStatuses: TaskStatus[] = ['pending', 'in_progress', 'completed'];
  return validStatuses.includes(status) ? status : 'pending';
};

const validateTaskPriority = (priority: any): TaskPriority => {
  const validPriorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
  return validPriorities.includes(priority) ? priority : 'medium';
};
```

### **Data Transformation Patterns**
```typescript
// Map raw data to typed interfaces
const mappedData = (data || []).map(item => ({
  ...item,
  status: validateTaskStatus(item.status),
  priority: validateTaskPriority(item.priority),
  // Transform dates
  createdAt: new Date(item.created_at),
  updatedAt: new Date(item.updated_at)
} as TypedEntity));
```

## 🔧 **Composite Hook Patterns**

### **Hook Composition Pattern**
```typescript
export function useTasks() {
  // Import operations from specialized hooks
  const { useCreateTask, useUpdateTask } = useTaskOperations();

  const useTaskQuery = (category?: TaskCategory, userId?: string) => {
    // Query implementation
  };

  const useTaskStatsQuery = (userId?: string) => {
    return useQuery({
      queryKey: ['taskStats', userId],
      queryFn: () => fetchTaskStats(userId)
    });
  };

  // Return composed interface
  return {
    useTaskQuery,
    useTaskStatsQuery,
    useCreateTask,
    useUpdateTask
  };
}

// Export types for backward compatibility
export type { Task, TaskCategory, TaskStats, TaskPriority };
```

### **Derived State Hooks**
```typescript
export const useIsClient = () => {
  const { data: clientData, isLoading, error } = useClientData();
  
  return {
    isClient: !!clientData,
    clientData,
    loading: isLoading,
    error
  };
};
```

## ⚡ **Performance Optimization Patterns**

### **Query Configuration**
```typescript
// Standard cache timings
staleTime: 5 * 60 * 1000,  // 5 minutes - data considered fresh
gcTime: 10 * 60 * 1000,    // 10 minutes - cache cleanup time

// Conditional enabling
enabled: !!user?.id,        // Only run when user exists

// Optimistic updates
onMutate: async (newData) => {
  await queryClient.cancelQueries({ queryKey: ['entities'] });
  const previousData = queryClient.getQueryData(['entities']);
  queryClient.setQueryData(['entities'], old => [...old, newData]);
  return { previousData };
},

onError: (err, newData, context) => {
  queryClient.setQueryData(['entities'], context.previousData);
},

onSettled: () => {
  queryClient.invalidateQueries({ queryKey: ['entities'] });
}
```

### **Error Handling Patterns**
```typescript
// Graceful error handling with fallbacks
const { data, error } = await query;

if (error) {
  console.error('Error fetching data:', error);
  
  // Handle specific error codes
  if (error.code === 'PGRST116') {
    return null; // No data found is OK
  }
  
  throw error; // Re-throw other errors
}
```

## 🎯 **Specialized Hook Patterns**

### **Authentication Hooks**
```typescript
export const useAuthSession = () => {
  return useQuery({
    queryKey: ['authSession'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    staleTime: Infinity, // Auth rarely changes
  });
};
```

### **Local Storage Hooks**
```typescript
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};
```

### **Real-time Subscription Hooks**
```typescript
export const useRealtimeData = (table: string, filters?: any) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table },
        (payload) => {
          console.log('Real-time update:', payload);
          // Update local state based on payload
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table]);

  return data;
};
```

## 📊 **Business Logic Hook Patterns**

### **Statistics and Calculations**
```typescript
export const useEntityStats = (entities: Entity[]) => {
  return useMemo(() => {
    const stats = {
      total: entities.length,
      byStatus: entities.reduce((acc, entity) => {
        acc[entity.status] = (acc[entity.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byPriority: entities.reduce((acc, entity) => {
        acc[entity.priority] = (acc[entity.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return stats;
  }, [entities]);
};
```

## ✅ **Hook Best Practices**

1. **Query Keys**: Use consistent, hierarchical query keys
2. **Error Handling**: Always handle errors gracefully with fallbacks
3. **Type Safety**: Strong TypeScript interfaces for all data
4. **Performance**: Appropriate cache timings and conditional enabling
5. **Composition**: Break complex logic into smaller, composable hooks
6. **Validation**: Always validate data from external sources
7. **Loading States**: Provide proper loading and error states
8. **Real-time**: Use Supabase subscriptions for live data
9. **Local Storage**: Graceful fallbacks for localStorage operations
10. **Authentication**: Always check user state before data operations

---

**Usage**: Follow these patterns when creating new hooks to maintain consistency and reliability across the SISO platform.