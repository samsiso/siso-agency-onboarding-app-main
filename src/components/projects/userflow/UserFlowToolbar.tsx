import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Download, 
  RefreshCw,
  Lock,
  Unlock
} from 'lucide-react';
import { useReactFlow, Panel } from 'reactflow';
import { toast } from '@/components/ui/use-toast';

interface UserFlowToolbarProps {
  isLocked: boolean;
  toggleLock: () => void;
  onDownload?: () => void;
}

export function UserFlowToolbar({ isLocked, toggleLock, onDownload }: UserFlowToolbarProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  
  const handleZoomIn = () => {
    zoomIn();
  };

  const handleZoomOut = () => {
    zoomOut();
  };

  const handleFitView = () => {
    fitView({ padding: 0.2 });
  };
  
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      toast({
        title: "Coming Soon",
        description: "Export functionality will be available in the next update."
      });
    }
  };

  return (
    <Panel position="top-left" className="bg-black/40 p-2 rounded-md backdrop-blur-sm border border-gray-800 shadow-lg">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 text-gray-300 hover:text-white hover:bg-white/10"
          onClick={handleZoomIn}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 text-gray-300 hover:text-white hover:bg-white/10"
          onClick={handleZoomOut}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 text-gray-300 hover:text-white hover:bg-white/10"
          onClick={handleFitView}
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 text-gray-300 hover:text-white hover:bg-white/10"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 text-gray-300 hover:text-white hover:bg-white/10"
          onClick={handleFitView}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`w-8 h-8 ${isLocked ? 'text-amber-400' : 'text-emerald-400'} hover:text-white hover:bg-white/10`}
          onClick={toggleLock}
        >
          {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </Button>
      </div>
    </Panel>
  );
}
