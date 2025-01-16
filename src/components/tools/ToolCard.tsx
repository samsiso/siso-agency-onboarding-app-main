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
      'Anthropic': '/lovable-uploads/b20703bf-3b0b-49b8-8490-1be4bd00df96.png',
      'Make.com': '/lovable-uploads/ff0e4ec1-921e-4c8f-831d-86f8fac07052.png',
      'Automa': '/lovable-uploads/1ac50508-b249-4bd4-9cc5-97b99aa642d1.png',
      'Rabbit': '/lovable-uploads/92028479-a553-4ac9-9e39-0f873d2a8480.png',
      'Cursor AI': '/lovable-uploads/afba683e-7707-4663-b478-1409c00526b0.png',
      'Replicate': '/lovable-uploads/ec8e134a-f3ab-4cb6-ba76-ed7f2b291537.png',
      'OpenAI': '/lovable-uploads/d99f6770-7516-4213-9844-127aee18be83.png',
      '11Labs': '/lovable-uploads/f73e8498-21fd-4bf0-aeb9-4b5cd905d93c.png',
      'ElevenLabs': '/lovable-uploads/081b4ec6-9a2d-406a-bd52-55395784754a.png',
      'Firebase': '/lovable-uploads/0c4f0920-5f53-40c9-81bc-c81ea886d292.png',
      'Framer': '/lovable-uploads/d53455e1-00b9-4187-b3de-8a27012c6227.png',
      'Gantry': '/lovable-uploads/1d736dcc-8143-4ce7-847a-ee550725c708.png',
      'GCP': '/lovable-uploads/7c244ac8-7305-40c7-b8f7-33a92fac7bc4.png',
      'Hugging Face': '/lovable-uploads/3c3971c1-be81-477f-97b6-655fcbdf4eb6.png',
      'Together AI': '/lovable-uploads/c9d84a03-c788-413c-8701-53881daf6476.png',
      'n8n': '/lovable-uploads/c7ac43fd-bc3e-478d-8b4f-809beafb6838.png',
      'Midjourney': '/lovable-uploads/b269df74-3740-4134-8618-2c941cda5a5a.png',
      'RunPod': '/lovable-uploads/706d021e-208d-4bab-910c-f552468c2ada.png',
      'Supabase': '/lovable-uploads/67e004ed-6861-4d6a-b05e-d885a03e5c1e.png',
      'Perplexity': '/lovable-uploads/8172f415-c43b-4d18-9c8e-5c6da3de2f24.png'
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