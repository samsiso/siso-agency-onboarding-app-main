import React, { useState } from 'react';
import { Bot, User, Code, Copy, Check, Notebook, MessageSquare, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface ChatMessageProps {
  role: 'assistant' | 'user';
  content: string;
  assistantType?: string;
  isLoading?: boolean;
  steps?: {
    thinking?: string;
    searching?: string;
    response?: string;
  };
  richContent?: {
    tools?: {
      id: string;
      name: string;
      description: string;
      type: 'ai' | 'automation' | 'integration';
      url: string;
      rating?: number;
      imageUrl?: string;
    }[];
    videos?: {
      id: string;
      title: string;
      thumbnailUrl: string;
      duration: string;
      channelName: string;
      views: number;
    }[];
    resources?: {
      type: 'documentation' | 'tutorial' | 'github' | 'article';
      title: string;
      url: string;
      icon: string;
    }[];
  };
}

export const ChatMessage = ({ role, content, assistantType, isLoading, steps, richContent }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const formatContent = (text: string) => {
    const segments = text.split(/(```[\s\S]*?```)/);
    
    return segments.map((segment, index) => {
      if (segment.startsWith('```')) {
        const [, ...codeLines] = segment.split('\n');
        codeLines.pop();
        const code = codeLines.join('\n');
        
        const copyCode = () => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        };

        return (
          <div key={index} className="relative my-4 rounded-lg bg-black/50 p-4 font-mono text-sm shadow-lg">
            <div className="absolute right-2 top-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-siso-text hover:bg-siso-text/10 transition-colors"
                onClick={copyCode}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Code className="mb-2 h-4 w-4 text-siso-orange" />
            <pre className="mt-2 overflow-x-auto">{code}</pre>
          </div>
        );
      }

      const lines = segment.split('\n');
      
      return (
        <div key={index} className="space-y-4">
          {lines.map((line, lineIndex) => {
            if (line.trim().startsWith('- ')) {
              return (
                <div key={lineIndex} className="flex items-start gap-2 pl-4">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-siso-orange/70" />
                  <p className="flex-1 text-siso-text/90">{line.slice(2)}</p>
                </div>
              );
            }

            if (/^\d+\.\s/.test(line.trim())) {
              const [number, ...rest] = line.trim().split(/\.\s/);
              return (
                <div key={lineIndex} className="flex items-start gap-2 pl-4">
                  <span className="text-siso-orange/70 font-mono">{number}.</span>
                  <p className="flex-1 text-siso-text/90">{rest.join('. ')}</p>
                </div>
              );
            }

            if (line.startsWith('# ')) {
              return (
                <h2 key={lineIndex} className="text-xl font-semibold text-siso-text mt-6 mb-4">
                  {line.slice(2)}
                </h2>
              );
            }

            if (line.startsWith('## ')) {
              return (
                <h3 key={lineIndex} className="text-lg font-semibold text-siso-text mt-4 mb-2">
                  {line.slice(3)}
                </h3>
              );
            }

            if (line.startsWith('> ')) {
              return (
                <blockquote key={lineIndex} className="border-l-2 border-siso-orange/50 pl-4 italic text-siso-text/80">
                  {line.slice(2)}
                </blockquote>
              );
            }

            const processedLine = line.replace(
              /(https?:\/\/[^\s]+)/g,
              (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-siso-orange hover:text-siso-red underline transition-colors">${url}</a>`
            );

            const processedBold = processedLine.replace(
              /\*\*(.*?)\*\*/g,
              '<strong class="font-semibold text-siso-text-bold">$1</strong>'
            );

            const processedItalic = processedBold.replace(
              /\*(.*?)\*/g,
              '<em class="italic text-siso-text/90">$1</em>'
            );

            return line.trim() ? (
              <p
                key={lineIndex}
                className="text-siso-text/90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: processedItalic }}
              />
            ) : <div key={lineIndex} className="h-4" />;
          })}
        </div>
      );
    });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The response has been copied to your clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToNotion = async () => {
    toast({
      title: "Connecting to Notion",
      description: "Setting up Notion integration... Please wait.",
    });
    
    setTimeout(() => {
      toast({
        title: "Notion Integration",
        description: "This feature will be available soon! We're working on it.",
      });
    }, 1000);
  };

  const handleSendToChatGPT = () => {
    window.open(`https://chat.openai.com/share/new?text=${encodeURIComponent(content)}`, '_blank');
  };

  const renderIntegrationActions = () => {
    if (role !== 'assistant') return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-black/20"
      >
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "gap-2 bg-siso-bg-alt hover:bg-siso-bg",
                  copied && "text-green-500"
                )}
                onClick={handleCopyToClipboard}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-siso-orange" />
                )}
                <span className="text-siso-text">{copied ? "Copied!" : "Copy"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy to clipboard</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-siso-bg-alt hover:bg-siso-bg group"
                onClick={handleSendToNotion}
              >
                <Notebook className="w-4 h-4 text-siso-orange group-hover:scale-110 transition-transform" />
                <span className="text-siso-text">Export to Notion</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save to Notion</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-siso-bg-alt hover:bg-siso-bg"
                onClick={handleSendToChatGPT}
              >
                <MessageSquare className="w-4 h-4 text-siso-orange" />
                <span className="text-siso-text">Continue in ChatGPT</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Continue this conversation in ChatGPT</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-start gap-4 p-6 rounded-lg transition-colors relative group",
        role === 'assistant' ? 'bg-siso-text/5 hover:bg-siso-text/8' : 'hover:bg-black/20'
      )}
    >
      <div className={cn(
        "shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg",
        role === 'assistant' 
          ? 'bg-gradient-to-br from-siso-red to-siso-orange animate-glow' 
          : 'bg-gradient-to-br from-siso-text/20 to-siso-text/30'
      )}>
        {role === 'assistant' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-siso-text-bold">
            {role === 'assistant' ? assistantType : 'You'}
          </p>
          {role === 'assistant' && (
            <span className="text-xs text-siso-text-muted px-2 py-1 rounded-full bg-siso-text/10">
              AI Assistant
            </span>
          )}
        </div>
        <div className="text-siso-text prose prose-invert max-w-none">
          {role === 'assistant' && renderIntegrationActions()}
          {isLoading ? (
            <div className="flex gap-2">
              <span className="w-2 h-2 bg-siso-orange/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-siso-orange/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-siso-orange/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <>
              {steps && (
                <div className="space-y-2 mb-4 text-sm text-siso-text/80">
                  {Object.entries(steps).map(([key, value]) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        key === 'response' && "text-siso-orange font-medium"
                      )}
                    >
                      {value}
                    </motion.div>
                  ))}
                </div>
              )}
              {content && formatContent(content)}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
