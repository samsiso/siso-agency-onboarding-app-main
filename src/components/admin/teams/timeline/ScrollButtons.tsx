
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ScrollButtonsProps {
  onScrollUp: () => void;
  onScrollDown: () => void;
}

export function ScrollButtons({ onScrollUp, onScrollDown }: ScrollButtonsProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-16 top-2 z-20"
        onClick={onScrollUp}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-16 bottom-2 z-20"
        onClick={onScrollDown}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </>
  );
}
