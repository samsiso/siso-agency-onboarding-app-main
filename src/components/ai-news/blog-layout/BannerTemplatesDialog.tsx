import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";

interface BannerTemplate {
  id: string;
  name: string;
  template_type: string;
  image_url: string | null;
  text_overlay: {
    title?: string;
    subtitle?: string;
  };
  metadata: any;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  description: string; // Add description field to match DB schema
}

interface TemplateFormValues {
  name: string;
  template_type: string;
  image_url: string;
  title: string;
  subtitle: string;
  is_default: boolean;
  description: string;
}

export function BannerTemplatesDialog() {
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<BannerTemplate | null>(null);
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const form = useForm<TemplateFormValues>({
    defaultValues: {
      name: "",
      template_type: "default",
      image_url: "",
      title: "",
      subtitle: "",
      is_default: false,
      description: "",
    },
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("banner_templates")
          .select("*");
        if (error) {
          console.error("Error fetching templates:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load banner templates",
          });
        } else {
          // When mapping the template data, include description with a default empty string
          const mappedTemplates: BannerTemplate[] = data.map(template => ({
            id: template.id,
            name: template.name,
            template_type: template.template_type,
            image_url: template.image_url,
            text_overlay: template.text_overlay,
            metadata: template.metadata,
            is_default: template.is_default,
            created_at: template.created_at,
            updated_at: template.updated_at,
            description: template.description || '' // Provide default empty string
          }));
          setTemplates(mappedTemplates);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load banner templates",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const onSubmit = async (values: TemplateFormValues) => {
    try {
      const { data, error } = await supabase.from("banner_templates").insert([
        {
          name: values.name,
          template_type: values.template_type,
          image_url: values.image_url,
          text_overlay: {
            title: values.title,
            subtitle: values.subtitle,
          },
          is_default: values.is_default,
          description: values.description,
        },
      ]);

      if (error) {
        console.error("Error creating template:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create banner template",
        });
      } else {
        toast({
          title: "Success",
          description: "Banner template created successfully",
        });
        setTemplates([...templates, ...data]);
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create banner template",
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from("banner_templates")
        .delete()
        .eq("id", templateId);

      if (error) {
        console.error("Error deleting template:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete banner template",
        });
      } else {
        toast({
          title: "Success",
          description: "Banner template deleted successfully",
        });
        setTemplates(templates.filter((template) => template.id !== templateId));
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete banner template",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Banner Templates</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Manage Banner Templates</AlertDialogTitle>
          <AlertDialogDescription>
            Create, edit, and manage banner templates for your blog posts.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
              <CardDescription>
                Select a template to view details and manage.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <ScrollArea className="rounded-md border p-4">
                  <div className="grid gap-4">
                    {templates.map((template) => (
                      <Button
                        key={template.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setSelectedTemplate(template)}
                      >
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => setOpen(true)} variant="secondary">
                <Plus className="w-4 h-4 mr-2" />
                Add Template
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
              <CardDescription>
                View and manage details of the selected template.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTemplate ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedTemplate.description}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Type:</strong> {selectedTemplate.template_type}
                    </p>
                    <p className="text-sm">
                      <strong>Image URL:</strong>{" "}
                      {selectedTemplate.image_url || "N/A"}
                    </p>
                    <p className="text-sm">
                      <strong>Title:</strong>{" "}
                      {selectedTemplate.text_overlay?.title || "N/A"}
                    </p>
                    <p className="text-sm">
                      <strong>Subtitle:</strong>{" "}
                      {selectedTemplate.text_overlay?.subtitle || "N/A"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">No template selected.</div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              {selectedTemplate && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <X className="w-4 h-4 mr-2" />
                      Delete Template
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        the template from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteTemplate(selectedTemplate.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardFooter>
          </Card>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>

      {/* Create Template Modal */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Banner Template</AlertDialogTitle>
            <AlertDialogDescription>
              Fill out the form below to create a new banner template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Template Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Template Description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="template_type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Template Type</FormLabel>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="default" id="r1" />
                        </FormControl>
                        <FormLabel htmlFor="r1">Default</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="blog" id="r2" />
                        </FormControl>
                        <FormLabel htmlFor="r2">Blog</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="news" id="r3" />
                        </FormControl>
                        <FormLabel htmlFor="r3">News</FormLabel>
                      </FormItem>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input placeholder="Subtitle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="is_default"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Set as Default</FormLabel>
                      <FormDescription>
                        This template will be used as the default for new posts.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => form.reset()}>
                  Cancel
                </AlertDialogCancel>
                <Button type="submit">Create Template</Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialog>
  );
}

const FormDescription = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  )
}
