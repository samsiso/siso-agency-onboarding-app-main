
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TableColumn } from './useTableColumns';

export interface SavedView {
  id: string;
  name: string;
  filters: {
    searchQuery?: string;
    [key: string]: any;
  };
  columns: TableColumn[];
  user_id: string;
  table_name: string;
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
      setViews(data as SavedView[]);
    } else {
      console.error("Error loading views:", error);
    }
  };

  const saveView = async (name: string, state: { filters: any; columns: TableColumn[] }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('table_views')
        .insert([{
          name,
          table_name: tableName,
          user_id: user.id,
          filters: state.filters,
          columns: state.columns
        }])
        .select()
        .single();

      if (!error && data) {
        setViews([...views, data as SavedView]);
        return true;
      } else {
        console.error("Error saving view:", error);
        return false;
      }
    } catch (error) {
      console.error("Error saving view:", error);
      return false;
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
