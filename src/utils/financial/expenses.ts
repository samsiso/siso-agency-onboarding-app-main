import { supabase } from '@/lib/supabase';

export interface Expense {
  id: string;
  project_id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  frequency?: 'one-time' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date?: string;
  next_billing_date?: string;
  created_at: string;
}

// Fetch all expenses for a project
export async function fetchProjectExpenses(projectId: string): Promise<Expense[]> {
  if (!projectId) {
    console.log('No project ID provided for fetching expenses');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('project_expenses')
      .select('*')
      .eq('project_id', projectId);
      
    if (error) {
      console.error('Error fetching project expenses:', error);
      return [];
    }
    
    // If there's no data yet, return demo data for visualization
    if (!data || data.length === 0) {
      return [
        {
          id: 'exp-1',
          project_id: projectId,
          name: 'Server Hosting',
          description: 'Monthly AWS server costs',
          amount: 450,
          currency: '£',
          category: 'Infrastructure',
          status: 'active',
          frequency: 'monthly',
          start_date: '2025-01-01',
          next_billing_date: '2025-06-01',
          created_at: '2025-01-01'
        },
        {
          id: 'exp-2',
          project_id: projectId,
          name: 'Security Monitoring',
          description: 'Ongoing security service',
          amount: 350,
          currency: '£',
          category: 'Security',
          status: 'active',
          frequency: 'monthly',
          start_date: '2025-01-01',
          next_billing_date: '2025-06-05',
          created_at: '2025-01-01'
        },
        {
          id: 'exp-3',
          project_id: projectId,
          name: 'Wallet Integration',
          description: 'Development of crypto wallet',
          amount: 1500,
          currency: '£',
          category: 'Development',
          status: 'completed',
          frequency: 'one-time',
          start_date: '2025-02-15',
          end_date: '2025-03-15',
          created_at: '2025-02-15'
        },
        {
          id: 'exp-4',
          project_id: projectId,
          name: 'Developer Time',
          description: 'Frontend developer hours',
          amount: 2400,
          currency: '£',
          category: 'Development',
          status: 'completed',
          frequency: 'one-time',
          start_date: '2025-02-01',
          end_date: '2025-04-30',
          created_at: '2025-02-01'
        },
        {
          id: 'exp-5',
          project_id: projectId,
          name: 'Database Hosting',
          description: 'PostgreSQL database hosting',
          amount: 120,
          currency: '£',
          category: 'Infrastructure',
          status: 'active',
          frequency: 'monthly',
          start_date: '2025-01-15',
          next_billing_date: '2025-06-15',
          created_at: '2025-01-15'
        }
      ];
    }
    
    return data;
  } catch (err) {
    console.error('Unexpected error in fetchProjectExpenses:', err);
    return [];
  }
}

// Calculate total expenses amount
export function calculateTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

// Group expenses by category
export function getExpensesByCategory(expenses: Expense[]) {
  const categoryMap = new Map<string, { total: number, count: number }>();
  
  expenses.forEach(expense => {
    const category = expense.category;
    const current = categoryMap.get(category) || { total: 0, count: 0 };
    categoryMap.set(category, {
      total: current.total + expense.amount,
      count: current.count + 1
    });
  });
  
  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    total: data.total,
    count: data.count
  })).sort((a, b) => b.total - a.total);
}

// Get only active expenses
export function getActiveExpenses(expenses: Expense[]): Expense[] {
  return expenses.filter(expense => expense.status === 'active');
}
