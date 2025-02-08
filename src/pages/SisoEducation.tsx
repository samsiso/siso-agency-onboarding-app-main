
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Bot } from 'lucide-react';
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from '@/components/ui/expandable-chat';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { ChatInput } from '@/components/ui/chat-input';
import { Send, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EducationHeader } from '@/components/education/layout/EducationHeader';
import { EducationToolbar } from '@/components/education/layout/EducationToolbar';
import { EducationContent } from '@/components/education/layout/EducationContent';
import { useEducatorsList } from '@/hooks/use-education-queries';

export default function SisoEducation() {
  const [activeSection, setActiveSection] = useState<'videos' | 'educators'>('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { 
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useEducatorsList(searchQuery);

  // [Analysis] Flatten pages data for infinite scroll
  const members = data?.pages.flatMap(page => page.educators) || [];

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <EducationHeader 
            stats={{
              totalEducators: members?.length || 0,
              totalVideos: members?.reduce((acc, member) => acc + (member.channel_total_videos || 0), 0) || 0,
              totalStudents: members?.reduce((acc, member) => acc + (member.member_count || 0), 0) || 0
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isSearchFocused={isSearchFocused}
            onSearchFocus={() => setIsSearchFocused(true)}
            onSearchBlur={() => setIsSearchFocused(false)}
          />

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
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />

          <ExpandableChat
            size="lg"
            position="bottom-right"
            icon={<Bot className="h-6 w-6" />}
          >
            <ExpandableChatHeader className="flex-col text-center justify-center">
              <h1 className="text-xl font-semibold">Education Assistant</h1>
              <p className="text-sm text-muted-foreground">
                Ask me anything about our educational resources
              </p>
            </ExpandableChatHeader>

            <ExpandableChatBody>
              <ChatMessageList>
                <ChatBubble variant="received">
                  <ChatBubbleAvatar
                    src="/path-to-ai-avatar.png"
                    fallback="AI"
                  />
                  <ChatBubbleMessage>
                    Hello! I'm your Education Assistant. How can I help you find learning resources today?
                  </ChatBubbleMessage>
                </ChatBubble>
              </ChatMessageList>
            </ExpandableChatBody>

            <ExpandableChatFooter>
              <form className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1">
                <ChatInput
                  placeholder="Type your message..."
                  className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center p-3 pt-0 justify-between">
                  <div className="flex">
                    <Button variant="ghost" size="icon" type="button">
                      <Paperclip className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" type="button">
                      <Mic className="size-4" />
                    </Button>
                  </div>
                  <Button type="submit" size="sm" className="ml-auto gap-1.5">
                    Send Message
                    <Send className="size-3.5" />
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
