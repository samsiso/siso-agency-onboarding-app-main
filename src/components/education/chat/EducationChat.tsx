
import { useEffect, useRef } from 'react';
import { useEducationChat } from '@/hooks/useEducationChat';
import { Bot, Send, Paperclip, Mic } from 'lucide-react';
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from '@/components/ui/expandable-chat';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { ChatInput } from '@/components/ui/chat-input';
import { Button } from '@/components/ui/button';
import { QuickAction } from '../layout/header/components/QuickAction';

interface EducationChatProps {
  isChatExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export const EducationChat = ({ isChatExpanded, onExpandedChange }: EducationChatProps) => {
  const { messages, isLoading, sendMessage } = useEducationChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { icon: Bot, label: "Learning Path", query: "What's the recommended learning path for beginners?" },
    { icon: Mic, label: "Study Tips", query: "Can you give me some effective study tips?" },
    { icon: Bot, label: "Track Progress", query: "How can I track my learning progress?" },
    { icon: Bot, label: "Find Course", query: "Help me find a course on " }
  ];

  return (
    <ExpandableChat
      size="lg"
      position="bottom-right"
      icon={<Bot className="h-6 w-6" />}
      onExpandedChange={onExpandedChange}
    >
      <ExpandableChatHeader className="flex-col text-center justify-center">
        <h1 className="text-xl font-semibold">Education Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Your AI guide to learning and development
        </p>
        {isChatExpanded && (
          <div className="flex flex-wrap gap-2 mt-4 px-4">
            {quickActions.map((action, index) => (
              <QuickAction
                key={index}
                icon={action.icon}
                label={action.label}
                onClick={() => sendMessage(action.query)}
                disabled={isLoading}
              />
            ))}
          </div>
        )}
      </ExpandableChatHeader>

      <ExpandableChatBody>
        <ChatMessageList>
          {messages.map((message, index) => (
            <ChatBubble 
              key={index} 
              variant={message.role === 'assistant' ? 'received' : 'sent'}
            >
              {message.role === 'assistant' && (
                <ChatBubbleAvatar
                  src="/lovable-uploads/c482563a-42db-4f47-83f2-c2e7771400b7.png"
                  fallback="AI"
                />
              )}
              <ChatBubbleMessage>
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                src="/lovable-uploads/c482563a-42db-4f47-83f2-c2e7771400b7.png"
                fallback="AI"
              />
              <ChatBubbleMessage>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-siso-orange/50 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-siso-orange/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-siso-orange/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </ChatBubbleMessage>
            </ChatBubble>
          )}
          <div ref={messagesEndRef} />
        </ChatMessageList>
      </ExpandableChatBody>

      <ExpandableChatFooter>
        <form 
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem('message') as HTMLTextAreaElement;
            if (input.value.trim()) {
              sendMessage(input.value);
              input.value = '';
            }
          }}
        >
          <ChatInput
            name="message"
            placeholder="Ask about courses, topics, or get learning recommendations..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
            disabled={isLoading}
          />
          <div className="flex items-center p-3 pt-0 justify-between">
            <div className="flex">
              <Button variant="ghost" size="icon" type="button" disabled={isLoading}>
                <Paperclip className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" type="button" disabled={isLoading}>
                <Mic className="size-4" />
              </Button>
            </div>
            <Button 
              type="submit" 
              size="sm" 
              className="ml-auto gap-1.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Send Message
                  <Send className="size-3.5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
};
