
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Calendar } from 'lucide-react';
import type { BannerTemplate } from './types';

interface TemplateFormProps {
  template: Omit<BannerTemplate, 'id'>;
  onTemplateChange: (template: Omit<BannerTemplate, 'id'>) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function TemplateForm({ template, onTemplateChange, onSubmit, loading }: TemplateFormProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Create New Template</h3>
      <div className="space-y-2">
        <Label htmlFor="name">Template Name</Label>
        <Input
          id="name"
          value={template.name}
          onChange={(e) => onTemplateChange({ ...template, name: e.target.value })}
          placeholder="Daily Brief Template"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={template.description || ''}
          onChange={(e) => onTemplateChange({ ...template, description: e.target.value })}
          placeholder="Template description..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Banner Title</Label>
        <Input
          id="title"
          value={template.text_overlay.title}
          onChange={(e) => onTemplateChange({
            ...template,
            text_overlay: { ...template.text_overlay, title: e.target.value }
          })}
          placeholder="SisoAI Daily Brief"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subtitle">Banner Subtitle</Label>
        <div className="flex items-center gap-2">
          <Input
            id="subtitle"
            value={template.text_overlay.subtitle}
            onChange={(e) => onTemplateChange({
              ...template,
              text_overlay: { ...template.text_overlay, subtitle: e.target.value }
            })}
            placeholder="March 28, 2024"
            disabled={template.metadata?.dynamicDate}
          />
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => onTemplateChange({
              ...template,
              metadata: {
                ...template.metadata,
                dynamicDate: !template.metadata?.dynamicDate
              }
            })}
            className={template.metadata?.dynamicDate ? "bg-blue-500/10 text-blue-500" : ""}
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
        {template.metadata?.dynamicDate && (
          <p className="text-sm text-muted-foreground">
            Dynamic date will be automatically inserted
          </p>
        )}
      </div>
      <Button
        onClick={onSubmit}
        disabled={loading || !template.name}
        className="w-full"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Template"}
      </Button>
    </div>
  );
}
