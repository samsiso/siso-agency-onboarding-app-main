
import React from 'react';
import { TestSummaryGenerator } from '@/components/ai-news/daily-summary/TestSummaryGenerator';

export default function TestSummaryPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">AI Daily Summary Test</h1>
      <p className="text-muted-foreground mb-8">
        This page allows you to test the daily summary generation functionality.
        You can select a date, fetch existing summaries, or generate new ones.
      </p>
      
      <TestSummaryGenerator />
    </div>
  );
}
