
import { useState } from 'react';
import { ZoomIn, ZoomOut, Move, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WireframeViewerProps {
  imageUrl: string;
  title: string;
  onDownload?: () => void;
}

export function WireframeViewer({ imageUrl, title, onDownload }: WireframeViewerProps) {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleZoomIn}
            className="bg-black/30 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleZoomOut}
            className="bg-black/30 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="bg-black/30 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          >
            <Move className="h-4 w-4" />
          </Button>
          {onDownload && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onDownload}
              className="bg-black/30 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div 
        className={cn(
          "relative overflow-hidden border border-gray-800 rounded-lg bg-black/20 h-[400px]",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="absolute transition-transform"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0'
          }}
        >
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="max-w-full object-contain rounded-lg" 
            />
          ) : (
            <div className="flex items-center justify-center h-96 w-full">
              <p className="text-gray-500">No wireframe image available</p>
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-400 flex justify-between items-center">
        <span>Scale: {Math.round(scale * 100)}%</span>
        <span>Click and drag to move</span>
      </div>
    </div>
  );
}
