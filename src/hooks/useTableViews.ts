
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

    try {
      // Check if the table exists first by using the system catalog
      const { data: tableExists } = await supabase
        .from('table_views')
        .select('id')
        .limit(1)
        .throwOnError();

      if (tableExists) {
        const { data, error } = await supabase
          .from('table_views')
          .select('*')
          .eq('table_name', tableName)
          .eq('user_id', user.id);

        if (!error && data) {
          setViews(data as unknown as SavedView[]);
        } else {
          console.error("Error loading views:", error);
        }
      } else {
        console.log("Table 'table_views' does not exist yet");
        setViews([]);
      }
    } catch (error) {
      console.log("Table 'table_views' might not exist yet:", error);
      setViews([]);
    }
  };

  const saveView = async (name: string, state: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
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
        setViews([...views, data as unknown as SavedView]);
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
