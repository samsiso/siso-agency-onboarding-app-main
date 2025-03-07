
import React from 'react';
import { Search, FileX2 } from 'lucide-react';

export interface NewsEmptyStateProps {
  searchQuery: string;
}

// [Analysis] Improved empty state UI to show different messages based on search query
export function NewsEmptyState({ searchQuery }: NewsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-800/50 rounded-full p-6 mb-6">
        {searchQuery ? (
          <Search className="h-12 w-12 text-gray-500" />
        ) : (
          <FileX2 className="h-12 w-12 text-gray-500" />
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        {searchQuery ? 'No articles found' : 'No articles available'}
      </h3>
      
      <p className="text-gray-400 max-w-md">
        {searchQuery ? (
          <>We couldn't find any articles matching "<span className="text-blue-400">{searchQuery}</span>".</>
        ) : (
          'There are no articles available for this date. Try selecting a different date or sync new articles.'
        )}
      </p>
    </div>
  );
}
