import { useNavigate } from 'react-router-dom';
import { Tool } from './types';
import { Star } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tools/${tool.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col gap-4 rounded-lg border border-siso-text/10 bg-siso-text/5 p-6 hover:bg-siso-text/10 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        {tool.profile_image_url ? (
          <img
            src={tool.profile_image_url}
            alt={tool.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-siso-orange/20"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center ring-2 ring-siso-orange/20">
            <Star className="h-6 w-6 text-siso-orange" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-siso-text-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange transition-all duration-300">
            {tool.name}
          </h3>
          <p className="text-sm text-siso-text/80">{tool.category}</p>
        </div>
      </div>
      {tool.description && (
        <p className="text-sm text-siso-text/80 line-clamp-2">{tool.description}</p>
      )}
    </div>
  );
}