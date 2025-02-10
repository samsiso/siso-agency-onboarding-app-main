import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Bot, Send, Paperclip, Mic, Brain, Book, GraduationCap, Search } from 'lucide-react';
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
import { EducationHeader } from '@/components/education/layout/EducationHeader';
import { EducationToolbar } from '@/components/education/layout/EducationToolbar';
import { EducationContent } from '@/components/education/layout/EducationContent';
import { LearningProgress } from '@/components/education/learning/LearningProgress';
import { useEducatorsList } from '@/hooks/education';
import { useEducationStats } from '@/hooks/use-education-stats';
import { useEducationChat } from '@/hooks/useEducationChat';

export default function SisoEducation() {
  const [activeSection, setActiveSection] = useState<'videos' | 'educators'>('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  const { messages, isLoading, sendMessage } = useEducationChat();

  const { 
    data: educatorData,
    isLoading: isEducatorsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useEducatorsList(searchQuery);

  const {
    data: stats,
    isLoading: isStatsLoading
  } = useEducationStats();

  const members = educatorData?.pages.flatMap(page => page.educators) || [];

  const quickActions = [
    { icon: Brain, label: "Learning Path", query: "What's the recommended learning path for beginners?" },
    { icon: Book, label: "Study Tips", query: "Can you give me some effective study tips?" },
    { icon: GraduationCap, label: "Track Progress", query: "How can I track my learning progress?" },
    { icon: Search, label: "Find Course", query: "Help me find a course on " }
  ];

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <EducationHeader 
            stats={{
              totalEducators: stats?.totalEducators || 0,
              totalVideos: stats?.totalVideos || 0,
              totalStudents: stats?.totalStudents || 0
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isSearchFocused={isSearchFocused}
            onSearchFocus={() => setIsSearchFocused(true)}
            onSearchBlur={() => setIsSearchFocused(false)}
          />

          {!isSearchFocused && <LearningProgress />}

          {!isSearchFocused && (
            <EducationToolbar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          )}

          <EducationContent
            activeSection={activeSection}
            searchQuery={searchQuery}
            members={members}
            isLoading={isEducatorsLoading}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />

          <ExpandableChat
            size="lg"
            position="bottom-right"
            icon={<Bot className="h-6 w-6" />}
            onExpandedChange={setIsChatExpanded}
          >
            <ExpandableChatHeader className="flex-col text-center justify-center">
              <h1 className="text-xl font-semibold">Education Assistant</h1>
              <p className="text-sm text-muted-foreground">
                Your AI guide to learning and development
              </p>
              {isChatExpanded && (
                <div className="flex flex-wrap gap-2 mt-4 px-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-siso-bg-alt/50 hover:bg-siso-bg-alt"
                      onClick={() => sendMessage(action.query)}
                    >
                      <action.icon className="h-4 w-4 text-siso-orange" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
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
        </div>
      </div>
    </div>
  );
}
