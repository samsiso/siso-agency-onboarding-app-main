import { lazy, Suspense } from 'react';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Bot } from 'lucide-react';

// [Analysis] Implementing aggressive code splitting for optimal initial load
// [Plan] Monitor component load times and adjust splitting if needed

const Hero = lazy(() => import('@/components/Hero'));
const AuthButton = lazy(() => import('@/components/AuthButton'));
const Footer = lazy(() => import('@/components/Footer'));
const LandingPage = lazy(() => import('@/components/landing/LandingPage'));
const SidebarProvider = lazy(() => import('@/components/ui/sidebar').then(m => ({ default: m.SidebarProvider })));
const ExpandableChat = lazy(() => import('@/components/ui/expandable-chat').then(m => ({ default: m.ExpandableChat })));
const ExpandableChatHeader = lazy(() => import('@/components/ui/expandable-chat').then(m => ({ default: m.ExpandableChatHeader })));
const ExpandableChatBody = lazy(() => import('@/components/ui/expandable-chat').then(m => ({ default: m.ExpandableChatBody })));
const ExpandableChatFooter = lazy(() => import('@/components/ui/expandable-chat').then(m => ({ default: m.ExpandableChatFooter })));
const ChatMessageList = lazy(() => import('@/components/ui/chat-message-list').then(m => ({ default: m.ChatMessageList })));
const ChatBubble = lazy(() => import('@/components/ui/chat-bubble').then(m => ({ default: m.ChatBubble })));
const ChatBubbleAvatar = lazy(() => import('@/components/ui/chat-bubble').then(m => ({ default: m.ChatBubbleAvatar })));
const ChatBubbleMessage = lazy(() => import('@/components/ui/chat-bubble').then(m => ({ default: m.ChatBubbleMessage })));
const ChatInput = lazy(() => import('@/components/ui/chat-input').then(m => ({ default: m.ChatInput })));

// [Analysis] Loading indicator optimized for perceived performance
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-pulse bg-siso-bg/50 rounded-lg p-4">
      Loading...
    </div>
  </div>
);

export default function Index() {
  const { user } = useAuthSession();
  console.log('Index page rendering, user:', user ? 'logged in' : 'not logged in');

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