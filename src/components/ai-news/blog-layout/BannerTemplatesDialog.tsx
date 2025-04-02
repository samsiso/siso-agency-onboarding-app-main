
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { TemplateForm } from './TemplateForm';
import { TemplateList } from './TemplateList';
import type { BannerTemplate, BannerTemplateResponse } from './types';

export function BannerTemplatesDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [templates, setTemplates] = useState<BannerTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Omit<BannerTemplate, 'id'>>({
    name: '',
    description: '',
    image_url: '',
    is_default: false,
    template_type: 'daily_brief',
    text_overlay: {
      title: '',
      subtitle: ''
    },
    metadata: {
      dateFormat: 'MMMM d, yyyy',
      dynamicDate: false
    }
  });
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('banner_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedTemplates: BannerTemplate[] = (data as BannerTemplateResponse[]).map(template => {
        const parsedTextOverlay = typeof template.text_overlay === 'string' 
          ? JSON.parse(template.text_overlay)
          : template.text_overlay;

        const parsedMetadata = typeof template.metadata === 'string'
          ? JSON.parse(template.metadata)
          : template.metadata || { dateFormat: 'MMMM d, yyyy', dynamicDate: false };

        return {
          ...template,
          // Make sure to include description field, even if it's empty
          description: template.description || '',
          text_overlay: parsedTextOverlay as BannerTemplate['text_overlay'],
          metadata: parsedMetadata,
          is_default: template.is_default || false
        };
      });

      setTemplates(transformedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to load banner templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.name) {
      toast({
        title: "Error",
        description: "Template name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const insertData = {
        name: newTemplate.name,
        description: newTemplate.description,  // Make sure this is included
        template_type: newTemplate.template_type,
        text_overlay: JSON.stringify(newTemplate.text_overlay),
        metadata: JSON.stringify(newTemplate.metadata),
        is_default: false
      };

      const { data, error } = await supabase
        .from('banner_templates')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      // Create a default text overlay object in case parsing fails
      const defaultTextOverlay = { title: '', subtitle: '' };
      
      // Safely parse the text_overlay with proper type assertion
      let parsedTextOverlay;
      try {
        parsedTextOverlay = typeof data.text_overlay === 'string'
          ? JSON.parse(data.text_overlay)
          : data.text_overlay;
      } catch (e) {
        console.error('Error parsing text_overlay:', e);
        parsedTextOverlay = defaultTextOverlay;
      }

      // Ensure the parsed text_overlay has the required properties
      const validTextOverlay = {
        title: parsedTextOverlay?.title || defaultTextOverlay.title,
        subtitle: parsedTextOverlay?.subtitle || defaultTextOverlay.subtitle
      };

      const transformedTemplate: BannerTemplate = {
        ...data,
        description: data.description || '',  // Ensure description is defined
        text_overlay: validTextOverlay,
        metadata: typeof data.metadata === 'string'
          ? JSON.parse(data.metadata)
          : data.metadata,
        is_default: data.is_default || false
      };

      toast({
        title: "Success",
        description: "Banner template created successfully",
      });

      setTemplates([transformedTemplate, ...templates]);
      setNewTemplate({
        name: '',
        description: '',
        image_url: '',
        is_default: false,
        template_type: 'daily_brief',
        text_overlay: {
          title: '',
          subtitle: ''
        },
        metadata: {
          dateFormat: 'MMMM d, yyyy',
          dynamicDate: false
        }
      });
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create banner template",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          onClick={() => {
            setIsOpen(true);
            fetchTemplates();
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Manage Banner Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Banner Templates</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <TemplateForm
            template={newTemplate}
            onTemplateChange={setNewTemplate}
            onSubmit={handleCreateTemplate}
            loading={loading}
          />

          <div className="space-y-4">
            <h3 className="font-semibold">Existing Templates</h3>
            <TemplateList templates={templates} loading={loading} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
