
import { PlaceholdersAndVanishInputDemo } from "@/components/demo/PlaceholdersAndVanishInputDemo";
import { Sidebar } from "@/components/Sidebar";
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';
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

export default function Home() {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <img 
                src="/lovable-uploads/f18bd386-e74e-4601-9d78-ade0cb831744.png" 
                alt="SISO Logo" 
                className="w-16 h-16 object-contain rounded-full"
              />
            </motion.div>
          </div>
          
          {/* Main Chat Section */}
          <div className="max-w-4xl mx-auto">
            <PlaceholdersAndVanishInputDemo />
          </div>

          {/* Expandable Chat */}
          <ExpandableChat
            size="lg"
            position="bottom-right"
            icon={<Bot className="h-6 w-6" />}
          >
            <ExpandableChatHeader className="flex-col text-center justify-center">
              <h1 className="text-xl font-semibold">SISO Assistant</h1>
              <p className="text-sm text-muted-foreground">
                Ask me anything about our platform
              </p>
            </ExpandableChatHeader>

            <ExpandableChatBody>
              <ChatMessageList>
                <ChatBubble variant="received">
                  <ChatBubbleAvatar
                    src="/lovable-uploads/c482563a-42db-4f47-83f2-c2e7771400b7.png"
                    fallback="AI"
                  />
                  <ChatBubbleMessage>
                    Hello! I'm your SISO assistant. How can I help you today?
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

