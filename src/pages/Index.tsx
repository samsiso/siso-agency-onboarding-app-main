import { lazy, Suspense } from 'react';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Bot } from 'lucide-react';

// [Analysis] Implementing granular code splitting for optimal initial load
// [Plan] Monitor component load times and adjust splits if needed

// Lazy load components with descriptive chunk names
const Hero = lazy(() => import(/* webpackChunkName: "hero" */ '@/components/Hero'));
const AuthButton = lazy(() => import(/* webpackChunkName: "auth-button" */ '@/components/AuthButton'));
const Footer = lazy(() => import(/* webpackChunkName: "footer" */ '@/components/Footer'));
const LandingPage = lazy(() => import(/* webpackChunkName: "landing" */ '@/components/landing/LandingPage'));
const SidebarProvider = lazy(() => import(/* webpackChunkName: "sidebar" */ '@/components/ui/sidebar').then(m => ({ default: m.SidebarProvider })));

// Chat components with their own chunk
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

// [Analysis] Loading indicator optimized for perceived performance
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px] animate-pulse">
    <div className="bg-siso-bg/50 rounded-lg p-4 backdrop-blur-sm">
      Loading...
    </div>
  </div>
);

export default function Index() {
  const { user } = useAuthSession();
  console.log('Index page rendering, user:', user ? 'logged in' : 'not logged in');

  const {
    ExpandableChat,
    ExpandableChatHeader,
    ExpandableChatBody,
    ExpandableChatFooter,
    ChatMessageList,
    ChatBubble,
    ChatBubbleAvatar,
    ChatBubbleMessage,
    ChatInput,
  } = ChatComponents;

  if (!user) {
    return (
      <div className="relative">
        <Suspense fallback={<LoadingFallback />}>
          <LandingPage />
          <ExpandableChat
            size="lg"
            position="bottom-right"
            icon={<Bot className="h-6 w-6" />}
          >
            <ExpandableChatHeader className="flex-col text-center justify-center">
              <h1 className="text-xl font-semibold">Welcome to SISO ✨</h1>
              <p className="text-sm text-muted-foreground">
                How can I help you get started?
              </p>
            </ExpandableChatHeader>

            <ExpandableChatBody>
              <ChatMessageList>
                <ChatBubble variant="received">
                  <ChatBubbleAvatar
                    className="h-8 w-8"
                    src="/lovable-uploads/c482563a-42db-4f47-83f2-c2e7771400b7.png"
                    fallback="AI"
                  />
                  <ChatBubbleMessage>
                    Welcome to SISO! I'm here to help you explore our platform and find the resources you need. What would you like to know about?
                  </ChatBubbleMessage>
                </ChatBubble>
              </ChatMessageList>
            </ExpandableChatBody>

            <ExpandableChatFooter>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
              >
                <ChatInput
                  placeholder="Type your message..."
                  className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                />
              </form>
            </ExpandableChatFooter>
          </ExpandableChat>
        </Suspense>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <Suspense fallback={<LoadingFallback />}>
        <SidebarProvider>
          <div className="relative min-h-screen flex flex-col">
            <div className="flex-grow relative z-10">
              <Hero key="main-hero" />
            </div>
            <div className="relative z-20">
              <AuthButton />
            </div>
            <div className="relative z-10">
              <Footer />
            </div>
          </div>
        </SidebarProvider>
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <ExpandableChat
          size="lg"
          position="bottom-right"
          icon={<Bot className="h-6 w-6" />}
        >
          <ExpandableChatHeader className="flex-col text-center justify-center">
            <h1 className="text-xl font-semibold">SISO Assistant ✨</h1>
            <p className="text-sm text-muted-foreground">
              How can I help you today?
            </p>
          </ExpandableChatHeader>

          <ExpandableChatBody>
            <ChatMessageList>
              <ChatBubble variant="received">
                <ChatBubbleAvatar
                  className="h-8 w-8"
                  src="/lovable-uploads/c482563a-42db-4f47-83f2-c2e7771400b7.png"
                  fallback="AI"
                />
                <ChatBubbleMessage>
                  Welcome back! I'm here to assist you with anything you need. What can I help you with?
                </ChatBubbleMessage>
              </ChatBubble>
            </ChatMessageList>
          </ExpandableChatBody>

          <ExpandableChatFooter>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
            >
              <ChatInput
                placeholder="Type your message..."
                className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
              />
            </form>
          </ExpandableChatFooter>
        </ExpandableChat>
      </Suspense>
    </div>
  );
}