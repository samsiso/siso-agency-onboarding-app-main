
import { lazy, Suspense, useState } from 'react';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Bot } from 'lucide-react';
import { LoadingFallback } from '@/components/landing/sections/LoadingFallback';
import { ChatState } from '@/components/home/ChatState';
import { ChatMessage } from '@/types/chat';

// Lazy load components with descriptive chunk names
const LandingPage = lazy(() => import(/* webpackChunkName: "landing" */ '@/components/landing/LandingPage'));
const ChatComponents = {
  ExpandableChat: lazy(() => import(/* webpackChunkName: "chat-expandable" */ '@/components/ui/expandable-chat').then(m => ({ default: m.ExpandableChat }))),
  ExpandableChatHeader: lazy(() => import(/* webpackChunkName: "chat-header" */ '@/components/ui/expandable-chat').then(m => ({ default: m.ExpandableChatHeader }))),
  ExpandableChatBody: lazy(() => import(/* webpackChunkName: "chat-body" */ '@/components/ui/expandable-chat').then(m => ({ default: m.ExpandableChatBody }))),
  ExpandableChatFooter: lazy(() => import(/* webpackChunkName: "chat-footer" */ '@/components/ui/expandable-chat').then(m => ({ default: m.ExpandableChatFooter }))),
  ChatMessageList: lazy(() => import(/* webpackChunkName: "chat-messages" */ '@/components/ui/chat-message-list').then(m => ({ default: m.ChatMessageList }))),
  ChatBubble: lazy(() => import(/* webpackChunkName: "chat-bubble" */ '@/components/ui/chat-bubble').then(m => ({ default: m.ChatBubble }))),
  ChatBubbleAvatar: lazy(() => import(/* webpackChunkName: "chat-avatar" */ '@/components/ui/chat-bubble').then(m => ({ default: m.ChatBubbleAvatar }))),
  ChatBubbleMessage: lazy(() => import(/* webpackChunkName: "chat-message" */ '@/components/ui/chat-bubble').then(m => ({ default: m.ChatBubbleMessage }))),
  ChatInput: lazy(() => import(/* webpackChunkName: "chat-input" */ '@/components/ui/chat-input').then(m => ({ default: m.ChatInput }))),
};

export default function Index() {
  const { user, loading } = useAuthSession();
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: "Welcome to SISO! I'm here to help you explore our platform and find the resources you need. What would you like to know about?"
  }]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: message
    }]);

    setIsLoading(true);

    try {
      // Simulate AI response for now
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Here's a test response with formatting:\n\n# Main Points\n\n- First important point\n- Second key point\n\n## Details\n\n1. More detailed explanation\n2. Additional context\n\n> Important note: This is a blockquote\n\nYou can **emphasize** text or make it *italic*."
        }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <div className="relative">
      <Suspense fallback={<LoadingFallback />}>
        <ChatState
          messages={messages}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Suspense>
    </div>
  );
}
