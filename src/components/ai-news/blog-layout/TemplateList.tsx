
import { Image as ImageIcon, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { BannerTemplate } from './types';

interface TemplateListProps {
  templates: BannerTemplate[];
  loading: boolean;
}

export function TemplateList({ templates, loading }: TemplateListProps) {
  const renderPreviewDate = (template: BannerTemplate) => {
    if (template.metadata?.dynamicDate) {
      const today = new Date();
      const dateFormat = template.metadata.dateFormat || 'MMMM d, yyyy';
      return format(today, dateFormat);
    }
    return template.text_overlay.subtitle;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <div
          key={template.id}
          className="flex items-start justify-between p-4 border rounded-lg"
        >
          <div className="space-y-1">
            <p className="font-medium">{template.name}</p>
            <p className="text-sm text-gray-500">{template.description}</p>
            <p className="text-sm text-gray-500">Title: {template.text_overlay.title}</p>
            {template.metadata?.dynamicDate ? (
              <p className="text-sm text-blue-500">
                <Calendar className="h-3 w-3 inline-block mr-1" />
                Dynamic date: {renderPreviewDate(template)}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Subtitle: {template.text_overlay.subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {template.image_url ? (
              <img
                src={template.image_url}
                alt={template.name}
                className="w-16 h-16 rounded object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
