
import { useState } from 'react';
import { Assistant } from '@/components/assistants/types';
import { useAssistants } from './useAssistants';

export function useFilteredAssistants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { data: assistants, isLoading } = useAssistants();

  const categoryCounts = assistants?.reduce((acc, assistant) => {
    const category = assistant.category === 'gpt builder' ? 'gpt' : (assistant.assistant_type || 'gpt');
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredAssistants = assistants?.filter(assistant => {
    const matchesSearch = !searchQuery || 
      assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      (selectedCategory === 'featured' && (assistant.rating >= 4.5 || assistant.review_average >= 4.5)) ||
      (selectedCategory === 'gpt' && assistant.category === 'gpt builder') ||
      (selectedCategory !== 'gpt' && assistant.assistant_type === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const featuredCount = assistants?.filter(a => 
    (a.rating && a.rating >= 4.5) || (a.review_average && a.review_average >= 4.5)
  ).length || 0;

  const totalConversations = assistants?.reduce((sum, assistant) => {
    if (assistant.num_conversations_str) {
      const num = parseInt(assistant.num_conversations_str);
      return isNaN(num) ? sum : sum + num;
    }
    return sum;
  }, 0) || 0;

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredAssistants,
    categoryCounts,
    featuredCount,
    totalConversations,
    isLoading,
    assistantsCount: assistants?.length || 0
  };
}
