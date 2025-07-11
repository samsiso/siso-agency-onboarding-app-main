# Task System Troubleshooting

## Current Issues

### RLS Policy Infinite Recursion Error

**Error**: `infinite recursion detected in policy for relation "user_roles"`

**Description**: The Supabase Row Level Security (RLS) policies for the `tasks` table are causing infinite recursion when trying to query tasks. This happens when RLS policies reference each other in a circular way.

**Symptoms**:
- 500 Internal Server Error when querying tasks
- Cannot delete, create, or fetch tasks from database
- Error occurs on any task-related database operation

**Current Workaround**: 
The AI Task Agent has been modified to provide simulated responses for task operations until the RLS policies are fixed.

**Files Modified**:
- `src/services/aiTaskAgent.ts` - Added simulation mode for task operations
- `src/hooks/useTaskOperations.ts` - Enhanced with delete operations (blocked by RLS)

## Fix Required

### Database Administrator Action Needed

1. **Check RLS Policies** on the `tasks` table in Supabase
2. **Review `user_roles` table** policies for circular references
3. **Simplify RLS policies** to avoid recursive checks
4. **Test database operations** after policy changes

### Suggested RLS Policy Structure

```sql
-- Simple policy for tasks table
CREATE POLICY "Users can manage their own tasks" ON tasks
FOR ALL USING (
  auth.uid() = created_by OR auth.uid() = assigned_to
);

-- Avoid complex joins or nested policy references
```

## AI Task Agent Features

### Working Features (Simulation Mode)
- ✅ Command parsing and detection
- ✅ Natural language processing  
- ✅ Task creation commands
- ✅ Task deletion commands (simulated)
- ✅ Status reporting (simulated)
- ✅ Error handling and user feedback

### Commands Supported
- `"delete all tasks"` - Delete all user tasks
- `"delete all [category] tasks"` - Delete by category
- `"create task for [description]"` - Create new task
- `"status"` - Show task overview
- `"complete all tasks"` - Mark tasks complete

### Command Examples
```
✅ "delete all tasks"
✅ "delete all high priority tasks"  
✅ "create new task for client meeting"
✅ "show task status"
✅ "complete all daily tasks"
```

## Next Steps

1. **Database Fix**: Resolve RLS policy recursion
2. **Remove Simulation**: Replace simulated responses with real database operations
3. **Testing**: Verify all task operations work correctly
4. **Documentation**: Update user documentation when fixed

## Files to Update After RLS Fix

- `src/services/aiTaskAgent.ts` - Remove simulation mode
- `src/hooks/useTaskOperations.ts` - Test all operations
- `src/hooks/useTasks.ts` - Verify query functionality

---

*Last Updated*: Current session
*Status*: RLS policies need fixing by database administrator