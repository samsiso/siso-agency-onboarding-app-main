
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, BookOpen, MessageCircle, Video, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function HelpPage() {
  const [helpArticles, setHelpArticles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHelpArticles = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('help_articles')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setHelpArticles(data || []);
      } catch (error) {
        console.error('Error fetching help articles:', error);
        toast({
          title: "Error",
          description: "Failed to load help articles",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHelpArticles();
  }, [toast]);
  
  const filteredArticles = helpArticles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gradient-to-r from-siso-red to-siso-orange mb-6">
          Help & Support
        </h1>
        
        <div className="mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-siso-text/50" />
            <Input 
              placeholder="Search help articles..." 
              className="pl-10 bg-black/30 border border-siso-text/10 text-siso-text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <HelpCard
            icon={<BookOpen className="h-8 w-8 text-siso-orange" />}
            title="Documentation"
            description="Browse comprehensive guides and documentation."
            buttonText="View Docs"
          />
          <HelpCard
            icon={<MessageCircle className="h-8 w-8 text-siso-orange" />}
            title="Chat Support"
            description="Get help from our support team through chat."
            buttonText="Start Chat"
          />
          <HelpCard
            icon={<Video className="h-8 w-8 text-siso-orange" />}
            title="Video Tutorials"
            description="Watch tutorials on how to use our platform."
            buttonText="Watch Videos"
          />
          <HelpCard
            icon={<FileText className="h-8 w-8 text-siso-orange" />}
            title="Submit a Ticket"
            description="Create a support ticket for complex issues."
            buttonText="Submit Ticket"
          />
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-siso-text-bold mb-4">Frequently Asked Questions</h2>
          <Card className="bg-black/30 border border-siso-text/10">
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="py-4 text-center text-siso-text">Loading help articles...</div>
              ) : filteredArticles.length === 0 ? (
                <div className="py-4 text-center text-siso-text">
                  {searchTerm ? "No matching help articles found." : "No help articles available."}
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredArticles.map((article) => (
                    <FaqItem
                      key={article.id}
                      question={article.title}
                      answer={article.content}
                    />
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-gradient-to-r from-siso-red/10 to-siso-orange/10 border border-siso-text/10">
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription className="text-siso-text">
              Our support team is available 24/7 to assist you with any questions or issues.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90">
              Contact Support
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}

function HelpCard({ icon, title, description, buttonText }) {
  return (
    <Card className="bg-black/30 border border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-center mb-2">
          {icon}
        </div>
        <CardTitle className="text-center">{title}</CardTitle>
        <CardDescription className="text-center text-siso-text">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-center pb-6">
        <Button variant="outline" className="border-siso-orange/30 text-siso-orange hover:bg-siso-orange/10">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}

function FaqItem({ question, answer }) {
  return (
    <AccordionItem value={question.toLowerCase().replace(/\s+/g, '-')}>
      <AccordionTrigger className="text-siso-text-bold hover:text-siso-orange">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-siso-text">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}
