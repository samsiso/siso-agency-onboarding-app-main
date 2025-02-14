
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Upload to storage bucket
      const fileExt = file.name.split('.').pop();
      const filePath = `${supabase.auth.user()?.id}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('chat_uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create file record
      const { error: dbError } = await supabase
        .from('uploaded_files')
        .insert({
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
        });

      if (dbError) throw dbError;

      toast({
        title: "File uploaded successfully",
        description: file.name,
      });

      return filePath;
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading
  };
};
