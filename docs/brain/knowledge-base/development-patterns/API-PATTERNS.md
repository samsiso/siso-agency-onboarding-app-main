# SUPABASE API INTEGRATION PATTERNS

## 🔌 **Supabase Client Configuration**

### **Standard Client Setup**
```typescript
// client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "your-supabase-url";
const SUPABASE_PUBLISHABLE_KEY = "your-anon-key";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Usage in components/hooks:
// import { supabase } from "@/integrations/supabase/client";
```

### **Type-Safe Database Schema**
```typescript
// Generated types.ts structure
export type Database = {
  public: {
    Tables: {
      table_name: {
        Row: {
          id: string;
          created_at: string | null;
          // ... other fields
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          // ... other fields
        };
        Update: {
          id?: string;
          // ... optional fields
        };
        Relationships: [
          {
            foreignKeyName: "fk_name";
            columns: ["foreign_key"];
            isOneToOne: boolean;
            referencedRelation: "related_table";
            referencedColumns: ["id"];
          }
        ];
      };
    };
  };
};
```

## 📊 **Query Patterns**

### **Basic CRUD Operations**
```typescript
// CREATE
const { data, error } = await supabase
  .from('table_name')
  .insert({
    field1: 'value1',
    field2: 'value2'
  })
  .select()
  .single();

// READ with filters
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('status', 'active')
  .order('created_at', { ascending: false })
  .limit(10);

// UPDATE
const { data, error } = await supabase
  .from('table_name')
  .update({ status: 'completed' })
  .eq('id', recordId)
  .select()
  .single();

// DELETE
const { error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', recordId);
```

### **Advanced Query Patterns**
```typescript
// Join queries with relationships
const { data, error } = await supabase
  .from('tasks')
  .select(`
    *,
    assigned_user:profiles(id, name, email),
    project:projects(id, name, status)
  `)
  .eq('status', 'in_progress');

// Conditional filtering
const buildQuery = (filters: FilterOptions) => {
  let query = supabase
    .from('table_name')
    .select('*');

  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.userId) {
    query = query.eq('user_id', filters.userId);
  }

  if (filters.dateRange) {
    query = query
      .gte('created_at', filters.dateRange.start)
      .lte('created_at', filters.dateRange.end);
  }

  return query;
};

// Text search
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .textSearch('name', searchTerm, {
    type: 'websearch',
    config: 'english'
  });
```

### **Complex Multi-Step Queries**
```typescript
// Pattern for checking multiple data sources
const fetchUserData = async (userId: string) => {
  // Step 1: Check primary relationship
  const { data: userLink, error: linkError } = await supabase
    .from('user_links')
    .select('related_id')
    .eq('user_id', userId)
    .single();

  if (linkError && linkError.code !== 'PGRST116') {
    console.error('Error fetching user link:', linkError);
  }

  let relatedId = userLink?.related_id;

  // Step 2: Fallback query
  if (!relatedId) {
    const { data: fallbackRecord, error: fallbackError } = await supabase
      .from('fallback_table')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (fallbackError && fallbackError.code !== 'PGRST116') {
      console.error('Error fetching fallback record:', fallbackError);
    }

    relatedId = fallbackRecord?.id;
  }

  // Step 3: Early return for no data
  if (!relatedId) {
    return null;
  }

  // Step 4: Final data fetch
  const { data: finalData, error: dataError } = await supabase
    .from('main_table')
    .select('*')
    .eq('id', relatedId)
    .single();

  if (dataError) {
    throw new Error(`Error fetching final data: ${dataError.message}`);
  }

  return finalData;
};
```

## 🔄 **Real-time Subscription Patterns**

### **Basic Subscription**
```typescript
// Listen to all changes on a table
const subscription = supabase
  .channel('table_changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'table_name' },
    (payload) => {
      console.log('Change received!', payload);
      // Handle the change
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

### **Filtered Real-time Updates**
```typescript
// Listen to specific user's data
const subscription = supabase
  .channel(`user_${userId}_tasks`)
  .on('postgres_changes',
    { 
      event: '*', 
      schema: 'public', 
      table: 'tasks',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      if (payload.eventType === 'INSERT') {
        // Handle new task
      } else if (payload.eventType === 'UPDATE') {
        // Handle task update
      } else if (payload.eventType === 'DELETE') {
        // Handle task deletion
      }
    }
  )
  .subscribe();
```

### **React Hook Real-time Pattern**
```typescript
export const useRealtimeTable = (tableName: string, filters?: any) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const channel = supabase
      .channel(`${tableName}_realtime`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        (payload) => {
          setData(currentData => {
            switch (payload.eventType) {
              case 'INSERT':
                return [...currentData, payload.new];
              case 'UPDATE':
                return currentData.map(item => 
                  item.id === payload.new.id ? payload.new : item
                );
              case 'DELETE':
                return currentData.filter(item => item.id !== payload.old.id);
              default:
                return currentData;
            }
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [tableName]);

  return data;
};
```

## 🔐 **Authentication Patterns**

### **Session Management**
```typescript
// Check current session
const { data: { session }, error } = await supabase.auth.getSession();

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Sign out
const { error } = await supabase.auth.signOut();

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session);
  
  if (event === 'SIGNED_IN') {
    // Handle sign in
  } else if (event === 'SIGNED_OUT') {
    // Handle sign out
  }
});
```

### **Row Level Security (RLS) Patterns**
```typescript
// Queries automatically respect RLS policies
// User can only see their own data when RLS is enabled

// Policy example (SQL):
/*
CREATE POLICY "Users can view own tasks"
ON tasks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"  
ON tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);
*/
```

## 📝 **Error Handling Patterns**

### **Standard Error Handling**
```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('*');

if (error) {
  console.error('Database error:', error);
  
  // Handle specific error codes
  switch (error.code) {
    case 'PGRST116':
      // No rows returned - this might be OK
      return null;
    case '23505':
      // Unique constraint violation
      throw new Error('Record already exists');
    case '23503':
      // Foreign key constraint violation
      throw new Error('Referenced record does not exist');
    default:
      throw new Error(`Database error: ${error.message}`);
  }
}
```

### **Validation and Type Safety**
```typescript
// Validate data before database operations
const validateTaskData = (task: Partial<Task>): Task => {
  if (!task.title || task.title.trim().length === 0) {
    throw new Error('Task title is required');
  }

  if (!['low', 'medium', 'high', 'urgent'].includes(task.priority)) {
    throw new Error('Invalid task priority');
  }

  return task as Task;
};

// Use in API calls
const createTask = async (taskData: Partial<Task>) => {
  const validatedTask = validateTaskData(taskData);
  
  const { data, error } = await supabase
    .from('tasks')
    .insert(validatedTask)
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

## 📈 **Performance Optimization Patterns**

### **Batch Operations**
```typescript
// Insert multiple records
const { data, error } = await supabase
  .from('table_name')
  .insert([
    { field1: 'value1' },
    { field1: 'value2' },
    { field1: 'value3' }
  ]);

// Update multiple records
const { data, error } = await supabase
  .from('table_name')
  .update({ status: 'processed' })
  .in('id', [id1, id2, id3]);
```

### **Optimized Queries**
```typescript
// Only select needed fields
const { data, error } = await supabase
  .from('large_table')
  .select('id, name, status') // Don't select *
  .eq('active', true)
  .limit(50);

// Use indexes effectively
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', userId) // Should have index on user_id
  .eq('status', 'active') // Should have composite index on (user_id, status)
  .order('created_at', { ascending: false });
```

### **Caching with React Query**
```typescript
// Cache responses appropriately
const { data, error } = useQuery({
  queryKey: ['tasks', userId, filters],
  queryFn: () => fetchTasks(userId, filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000,   // 10 minutes
});
```

## 🧪 **Testing Patterns**

### **Mock Supabase Client**
```typescript
// Mock for testing
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        data: mockData,
        error: null
      }))
    })),
    insert: jest.fn(() => ({
      data: mockData,
      error: null
    }))
  }))
};

// Test with mock
test('fetches user data', async () => {
  const userData = await fetchUserData('user-id');
  expect(userData).toEqual(expectedData);
});
```

## ✅ **Best Practices**

1. **Type Safety**: Always use generated TypeScript types
2. **Error Handling**: Handle all error cases gracefully
3. **Performance**: Select only needed fields, use appropriate limits
4. **Security**: Rely on RLS policies for data access control
5. **Real-time**: Use subscriptions judiciously to avoid performance issues
6. **Validation**: Validate data on both client and server side
7. **Caching**: Use React Query for efficient data caching
8. **Batch Operations**: Group multiple operations when possible
9. **Indexes**: Ensure database indexes for query performance
10. **Testing**: Mock Supabase client for unit tests

---

**Usage**: Follow these patterns when integrating with Supabase to ensure consistent, performant, and secure data operations across the SISO platform.