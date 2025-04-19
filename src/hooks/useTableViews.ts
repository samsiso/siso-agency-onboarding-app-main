
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SavedView {
  id: string;
  name: string;
  filters: any;
  columns: any[];
  user_id: string;
}

export function useTableViews(tableName: string) {
  const [views, setViews] = useState<SavedView[]>([]);
  const [currentView, setCurrentView] = useState<SavedView | null>(null);

  const loadViews = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('table_views')
      .select('*')
      .eq('table_name', tableName)
      .eq('user_id', user.id);

    if (!error && data) {
      setViews(data);
    }
  };

  const saveView = async (name: string, state: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('table_views')
      .insert([
        {
          name,
          table_name: tableName,
          user_id: user.id,
          filters: state.filters,
          columns: state.columns
        }
      ])
      .select()
      .single();

    if (!error && data) {
      setViews([...views, data]);
    }
  };

  const selectView = (view: SavedView) => {
    setCurrentView(view);
  };

  return {
    views,
    currentView,
    loadViews,
    saveView,
    selectView
  };
}
