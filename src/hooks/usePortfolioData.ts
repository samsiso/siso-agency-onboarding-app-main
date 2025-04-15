
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PortfolioItem, PortfolioCategory } from '@/types/portfolio';
import { useToast } from '@/hooks/use-toast';

export const usePortfolioData = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, categoriesResponse] = await Promise.all([
          supabase
            .from('portfolio_items')
            .select('*')
            .order('completion_date', { ascending: false }),
          supabase
            .from('portfolio_categories')
            .select('*')
            .order('name')
        ]);

        if (itemsResponse.error) throw itemsResponse.error;
        if (categoriesResponse.error) throw categoriesResponse.error;

        setItems(itemsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        toast({
          title: "Error fetching portfolio",
          description: "Failed to load portfolio items.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return { items, categories, loading };
};
