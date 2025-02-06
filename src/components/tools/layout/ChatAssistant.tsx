
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

export function ChatAssistant() {
  return (
    <ExpandableChat
      size="lg"
      position="bottom-right"
      icon={<Bot className="h-6 w-6" />}
    >
      <ExpandableChatHeader className="flex-col text-center justify-center">
        <h1 className="text-xl font-semibold">Tools Assistant ✨</h1>
        <p className="text-sm text-muted-foreground">
          Ask me anything about our AI tools
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
              Hello! I'm your AI tools assistant. How can I help you find the right tools for your needs?
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
          <div className="flex items-center p-3 pt-0 justify-between">
            <div className="flex">
              <button className="p-2 hover:bg-accent rounded-md">
                <Paperclip className="size-4" />
              </button>
              <button className="p-2 hover:bg-accent rounded-md">
                <Mic className="size-4" />
              </button>
            </div>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2">
              Send <Send className="size-4" />
            </button>
          </div>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}
