import { useEffect, useState } from 'react';
import { getPagesByProject, getPromptsByPage } from '@/api/prompt-agent';
import { Page, UIPrompt } from '@/types/ui-prompts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function PagesView() {
  const [pages, setPages] = useState<Page[]>([]);
  const [pagePrompts, setPagePrompts] = useState<Record<string, UIPrompt[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const projectId = 'ubahcrypt'; // TODO: Make this dynamic based on selected project
        const fetchedPages = await getPagesByProject(projectId);
        setPages(fetchedPages);

        // Fetch prompts for each page
        const promptsMap: Record<string, UIPrompt[]> = {};
        await Promise.all(
          fetchedPages.map(async (page) => {
            const prompts = await getPromptsByPage(page.id);
            promptsMap[page.id] = prompts;
          })
        );
        setPagePrompts(promptsMap);
      } catch (err) {
        setError('Failed to fetch pages');
        console.error('Error fetching pages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {pages.map((page) => (
          <Card key={page.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">{page.name}</CardTitle>
                <Badge variant={getStatusVariant(page.status)}>{page.status}</Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {page.route}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Category:</span> {page.category}
                  </div>
                  <div>
                    <span className="font-medium">Priority:</span> {page.priority}
                  </div>
                  {page.description && (
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="text-sm text-muted-foreground mt-1">{page.description}</p>
                    </div>
                  )}
                  {page.pdr_source && (
                    <div>
                      <span className="font-medium">PDR Source:</span>
                      <p className="text-sm text-muted-foreground mt-1">{page.pdr_source}</p>
                    </div>
                  )}
                </div>

                {pagePrompts[page.id]?.length > 0 && (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="prompts">
                      <AccordionTrigger>
                        Prompts ({pagePrompts[page.id].length})
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {pagePrompts[page.id].map((prompt) => (
                            <div
                              key={prompt.id}
                              className="p-2 rounded-md bg-muted/50"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{prompt.step}</span>
                                <Badge variant={getPromptStatusVariant(prompt.status)}>
                                  {prompt.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {prompt.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

function getStatusVariant(status: string | null): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'default';
    case 'in_progress':
      return 'secondary';
    case 'initialized':
      return 'outline';
    default:
      return 'outline';
  }
}

function getPromptStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'default';
    case 'in_progress':
      return 'secondary';
    case 'pending':
      return 'outline';
    case 'draft':
      return 'outline';
    case 'archived':
      return 'destructive';
    default:
      return 'outline';
  }
} 