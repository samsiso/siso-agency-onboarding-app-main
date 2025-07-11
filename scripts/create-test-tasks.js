// Quick script to create test tasks for the current user
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mneeyfmqqsnfcrrqdxed.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZWV5Zm1xcXNuZmNycnFkeGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1OTIzMjcsImV4cCI6MjA0OTE2ODMyN30.sGBwAHJUQtmj9w9OyS8fFWuUvE1aGjxKnDKsogR2zfg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestTasks() {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('No authenticated user found:', userError);
      return;
    }

    console.log('Creating tasks for user:', user.id);

    const testTasks = [
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the SISO Agency platform',
        status: 'pending',
        priority: 'high',
        category: 'siso_app_dev',
        estimated_time: 120,
        assigned_to: user.id,
        created_by: user.id,
        due_date: '2025-01-15'
      },
      {
        title: 'Review Instagram lead generation system',
        description: 'Analyze and optimize the current Instagram lead generation workflow',
        status: 'in_progress',
        priority: 'medium',
        category: 'instagram',
        estimated_time: 90,
        assigned_to: user.id,
        created_by: user.id,
        due_date: '2025-01-12'
      },
      {
        title: 'Weekly team standup',
        description: 'Conduct weekly team standup meeting to review progress',
        status: 'pending',
        priority: 'low',
        category: 'weekly',
        estimated_time: 30,
        assigned_to: user.id,
        created_by: user.id,
        due_date: '2025-01-10'
      }
    ];

    for (const task of testTasks) {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', task.title, error);
      } else {
        console.log('Created task:', data.title);
      }
    }

    console.log('Test tasks creation completed!');
  } catch (error) {
    console.error('Script error:', error);
  }
}

createTestTasks();