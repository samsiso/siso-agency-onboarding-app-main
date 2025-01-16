import { useNavigate } from 'react-router-dom';
import { Tool } from './types';
import { 
  Star, 
  Code, 
  Database, 
  Bot, 
  Workflow, 
  Paintbrush, 
  Wrench,
  Brain,
  Laptop,
  Cloud,
  Terminal,
  Table,
  Blocks,
  Rabbit,
  Heart,
  Share2
} from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tools/${tool.id}`);
  };

  const getCustomLogoUrl = (toolName: string): string | null => {
    const logoMap: Record<string, string> = {
      'Anthropic': '/lovable-uploads/5ec1265d-9c09-4681-939b-a60fd4d06152.png',
      'Make.com': '/lovable-uploads/3b1f63ad-3a17-48a3-aac2-e827e77393c1.png',
      'Automa': '/lovable-uploads/66b63935-28a0-4212-8e2a-ab375279b188.png',
      'Rabbit': '/lovable-uploads/10c752e6-33e8-40f9-9076-a5689232e11a.png',
      'Cursor AI': '/lovable-uploads/a5a9f5ad-aef3-4379-890d-fb6cef603cce.png',
      'Replicate': '/lovable-uploads/19ca8c73-3736-4506-bfb2-de867b272e12.png',
      'OpenAI': '/lovable-uploads/e33090cc-0117-46ec-9e84-7dde6a93d0d3.png',
      '11Labs': '/lovable-uploads/90c0de54-b6ba-4500-8bac-ec508dd51cf8.png',
      'ElevenLabs': '/lovable-uploads/5ba92f91-0e4b-4f5d-9ed2-ae6e93c895a4.png',
      'Firebase': '/lovable-uploads/b5e8df80-d454-4a06-839a-19bf78371b0c.png',
      'Framer': '/lovable-uploads/11a3454b-9de6-49c7-83b3-80f258d0ff53.png',
      'Gantry': '/lovable-uploads/41a75add-6a28-4244-90ee-687082cba5cd.png',
      'GCP': '/lovable-uploads/4e18e593-8bef-45b1-b23a-95257d71bb9d.png',
      'Hugging Face': '/lovable-uploads/22b72d61-de06-441e-aef7-edd61bd7cc56.png',
      'Together AI': '/lovable-uploads/5debc3cd-29a5-4b65-a577-32749c7917c7.png',
      'n8n': '/lovable-uploads/c482563a-42db-4f47-83f2-c2e7771400b7.png',
      'Midjourney': '/lovable-uploads/8e5ff417-0826-4bc1-8afb-09cc8b6912c4.png',
      'RunPod': '/lovable-uploads/18fac9e2-df8b-44a8-9ac3-2f9c0d1ce312.png',
      'Supabase': '/lovable-uploads/1f9eba1e-c2af-4ed8-84e7-a375872c9182.png',
      'Perplexity': '/lovable-uploads/6bd048bf-9e6e-49e5-b028-62cac9c81038.png'
    };

    return logoMap[toolName] || null;
  };

  const getIconForTool = (tool: Tool) => {
    // First check specific tools
    switch (tool.name.toLowerCase()) {
      case 'supabase':
        return <Database className="h-6 w-6 text-emerald-500" />;
      case 'firebase':
        return <Database className="h-6 w-6 text-amber-500" />;
      case 'elevenlabs':
        return <Bot className="h-6 w-6 text-blue-500" />;
      case 'huggingface':
        return <Brain className="h-6 w-6 text-yellow-500" />;
      case 'gcp':
        return <Cloud className="h-6 w-6 text-blue-400" />;
      case 'cursor ai':
        return <Terminal className="h-6 w-6 text-purple-500" />;
      case 'airtable':
        return <Table className="h-6 w-6 text-teal-500" />;
      case 'n8n':
        return <Workflow className="h-6 w-6 text-green-500" />;
      case 'make.com':
        return <Blocks className="h-6 w-6 text-indigo-500" />;
      case 'anthropic':
        return <Brain className="h-6 w-6 text-pink-500" />;
      case 'framer':
        return <Paintbrush className="h-6 w-6 text-blue-600" />;
      case 'midjourney':
        return <Paintbrush className="h-6 w-6 text-indigo-600" />;
      case 'runpod':
        return <Cloud className="h-6 w-6 text-purple-600" />;
      case 'replicate':
        return <Share2 className="h-6 w-6 text-gray-500" />;
      case 'rabbit':
        return <Rabbit className="h-6 w-6 text-orange-500" />;
      case 'perplexity':
        return <Brain className="h-6 w-6 text-blue-500" />;
      case 'together ai':
        return <Heart className="h-6 w-6 text-red-500" />;
    }

    // Then fall back to category-based icons
    switch (tool.category?.toLowerCase()) {
      case 'development':
        return <Code className="h-6 w-6 text-blue-500" />;
      case 'database':
        return <Database className="h-6 w-6 text-green-500" />;
      case 'gpt builder':
        return <Bot className="h-6 w-6 text-purple-500" />;
      case 'automation':
        return <Workflow className="h-6 w-6 text-orange-500" />;
      case 'visual':
        return <Paintbrush className="h-6 w-6 text-pink-500" />;
      default:
        return <Wrench className="h-6 w-6 text-siso-orange" />;
    }
  };

  const customLogo = getCustomLogoUrl(tool.name);

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col gap-4 rounded-lg border border-siso-text/10 bg-siso-text/5 p-6 hover:bg-siso-text/10 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
    >
      <div className="flex items-center gap-4">
        {customLogo ? (
          <img
            src={customLogo}
            alt={tool.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-siso-orange/20"
          />
        ) : tool.profile_image_url ? (
          <img
            src={tool.profile_image_url}
            alt={tool.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-siso-orange/20"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center ring-2 ring-siso-orange/20">
            {getIconForTool(tool)}
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
        <p className="text-sm text-siso-text/80 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-siso-red/0 via-siso-orange/0 to-siso-red/0 group-hover:from-siso-red group-hover:via-siso-orange group-hover:to-siso-red transition-all duration-300 rounded-b-lg" />
    </div>
  );
}