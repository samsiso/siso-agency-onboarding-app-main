import { Bot, ExternalLink, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface Assistant {
  id: string;
  name: string;
  description: string | null;
  assistant_type: string | null;
  prompt_template: string | null;
  use_cases: string[] | null;
  input_variables: string[] | null;
  model_type: string | null;
  response_format: string | null;
  rating: number | null;
  likes_count: number | null;
  downloads_count: number | null;
  website_url: string | null;
  gpt_url: string | null;
  review_average: number | null;
  review_count: number | null;
  num_conversations_str: string | null;
}

interface AssistantDetailsProps {
  assistant: Assistant | null;
  onClose: () => void;
}

export function AssistantDetails({ assistant, onClose }: AssistantDetailsProps) {
  if (!assistant) return null;

  const isGPTTool = !assistant.assistant_type;
  const displayRating = assistant.review_average || assistant.rating;
  const displayReviewCount = assistant.review_count || assistant.reviews_count;

  return (
    <Sheet open={!!assistant} onOpenChange={onClose}>
      <SheetContent className="bg-siso-bg border-l border-siso-text/10 w-full sm:max-w-xl">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-siso-orange" />
              </div>
              <div>
                <SheetTitle className="text-2xl font-bold text-siso-text-bold">
                  {assistant.name}
                </SheetTitle>
                <p className="text-sm text-siso-text/80">
                  {isGPTTool ? 'GPT Builder Tool' : assistant.assistant_type || 'AI Assistant'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription className="text-siso-text">
            {assistant.description}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {isGPTTool && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-siso-text-bold">Usage Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-siso-text/5">
                  <div className="text-sm font-medium text-siso-text-bold">Conversations</div>
                  <div className="text-sm text-siso-text">{assistant.num_conversations_str || '-'}</div>
                </div>
                <div className="p-3 rounded-lg bg-siso-text/5">
                  <div className="text-sm font-medium text-siso-text-bold">Rating</div>
                  <div className="text-sm text-siso-text">
                    {displayRating ? `${displayRating.toFixed(1)} (${displayReviewCount} reviews)` : '-'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {assistant.prompt_template && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-siso-text-bold">Prompt Template</h3>
              <pre className="p-4 rounded-lg bg-siso-text/5 text-sm text-siso-text overflow-x-auto">
                {assistant.prompt_template}
              </pre>
            </div>
          )}

          {assistant.use_cases && assistant.use_cases.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-siso-text-bold">Use Cases</h3>
              <div className="flex flex-wrap gap-2">
                {assistant.use_cases.map((useCase, index) => (
                  <span 
                    key={index}
                    className="text-sm px-3 py-1 rounded-full bg-siso-text/10 text-siso-text"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
            </div>
          )}

          {assistant.input_variables && assistant.input_variables.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-siso-text-bold">Input Variables</h3>
              <div className="flex flex-wrap gap-2">
                {assistant.input_variables.map((variable, index) => (
                  <span 
                    key={index}
                    className="text-sm px-3 py-1 rounded-full bg-siso-orange/10 text-siso-orange"
                  >
                    {variable}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!isGPTTool && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-siso-text-bold">Technical Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-siso-text/5">
                  <div className="text-sm font-medium text-siso-text-bold">Model</div>
                  <div className="text-sm text-siso-text">{assistant.model_type || '-'}</div>
                </div>
                <div className="p-3 rounded-lg bg-siso-text/5">
                  <div className="text-sm font-medium text-siso-text-bold">Response Format</div>
                  <div className="text-sm text-siso-text">{assistant.response_format || '-'}</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-siso-text-bold">Quick Actions</h3>
            <Button
              className="w-full justify-start gap-2"
              onClick={() => window.open(assistant.gpt_url || assistant.website_url || '#', '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              Try {isGPTTool ? 'GPT' : 'Assistant'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}