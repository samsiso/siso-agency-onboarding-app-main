import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  FileText, 
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Book,
  Video,
  Download,
  ExternalLink,
  Search,
  Star,
  Users,
  Target,
  TrendingUp,
  Zap,
  Bot,
  Globe,
  Shield,
  Award,
  DollarSign,
  Calendar,
  Plus,
  LifeBuoy
} from 'lucide-react';
import { PartnershipLayout } from '@/components/partnership/PartnershipLayout';
import { ResourcesHelpTemplate } from '@/components/ui/dashboard-templates';
import type { FeaturedArticle, QuickHelpCard, HelpCenterCard, HelpCategory } from '@/components/ui/dashboard-templates';
import { AIChatAssistant } from '@/components/support/AIChatAssistant';
import { SupportTicketForm } from '@/components/support/SupportTicketForm';
import { SearchSection } from '@/components/support/SearchSection';
import { AdvancedSearchModal } from '@/components/support/AdvancedSearchModal';
import { Button } from '@/components/ui/button';
import { 
  featuredArticles, 
  quickHelpCards, 
  helpCenterCards, 
  helpCategories,
  contactInfo 
} from '@/data/partnershipSupportData';

export default function Support() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTicketFormOpen, setIsTicketFormOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    console.log('Searching partnership knowledge base for:', query);
    setIsSearchModalOpen(true);
  };

  const handleTicketSubmit = (ticketData: unknown) => {
    console.log('Support ticket submitted:', ticketData);
    // Here you would send the ticket data to your backend
    // Integration with support systems like Zendesk, Freshdesk, etc.
  };

  return (
    <>
      <PartnershipLayout
        title="Partnership Support Center"
        subtitle="Get help, find resources, and connect with our team"
        actions={
          <div className="flex gap-3">
            <Button
              onClick={() => setIsTicketFormOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
            <Button
              onClick={() => setIsChatOpen(true)}
              variant="outline"
              className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        }
      >
        <div className="space-y-12">
          {/* Enhanced Search Section */}
          <SearchSection
            onSearchClick={() => setIsSearchModalOpen(true)}
            onAIAssistantClick={() => setIsChatOpen(true)}
          />

          {/* Main Resources Template */}
          <ResourcesHelpTemplate
            title="Partnership Support & Resources"
            subtitle="Everything you need to succeed as a SISO partner - help articles, training materials, and direct support 🚀"
            searchPlaceholder="Search partnership support articles, guides, and FAQs..."
            featuredArticles={featuredArticles}
            quickHelpCards={quickHelpCards}
            helpCenterCards={helpCenterCards}
            helpCategories={helpCategories}
            backgroundImage="/images/partnership-support-bg.jpg"
            onSearch={handleSearch}
            defaultTab="getting-started"
            className="space-y-8"
          />
        </div>
      </PartnershipLayout>

      {/* AI Chat Assistant */}
      <AIChatAssistant 
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />

      {/* Support Ticket Form */}
      <SupportTicketForm
        isOpen={isTicketFormOpen}
        onClose={() => setIsTicketFormOpen(false)}
        onSubmit={handleTicketSubmit}
      />

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Floating Support Button */}
      {!isChatOpen && !isTicketFormOpen && !isSearchModalOpen && (
        <div className="fixed bottom-6 left-6 z-40">
          <Button
            onClick={() => setIsTicketFormOpen(true)}
            className="h-14 w-14 rounded-full bg-orange-600 hover:bg-orange-700 shadow-lg"
            title="Get Support"
          >
            <LifeBuoy className="h-6 w-6 text-white" />
          </Button>
        </div>
      )}
    </>
  );
}