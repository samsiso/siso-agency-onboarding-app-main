
import { Bot } from 'lucide-react';
import { 
  ExpandableChat, 
  ExpandableChatHeader, 
  ExpandableChatBody, 
  ExpandableChatFooter 
} from '@/components/ui/expandable-chat';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { ChatInput } from '@/components/ui/chat-input';

export function ChatAssistantHelper() {
  return (
    <ExpandableChat
      size="lg"
      position="bottom-right"
      icon={<Bot className="h-6 w-6" />}
    >
      <ExpandableChatHeader className="flex-col text-center justify-center">
        <h1 className="text-xl font-semibold">Assistant Helper</h1>
        <p className="text-sm text-muted-foreground">
          Ask me anything about our AI assistants
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
              Hello! I'm your Assistant Helper. How can I help you find the perfect AI assistant today?
            </ChatBubbleMessage>
          </ChatBubble>
        </ChatMessageList>
      </ExpandableChatBody>

      <ExpandableChatFooter>
        <ChatInput
          placeholder="Type your message..."
          onSubmit={(value) => {
            console.log('Message submitted:', value);
          }}
        />
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}
