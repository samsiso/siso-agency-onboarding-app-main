-- Create a stored procedure to create the research_documents table if it doesn't exist
CREATE OR REPLACE FUNCTION create_research_documents_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'research_documents'
  ) THEN
    -- Create the table with the enhanced structure
    CREATE TABLE public.research_documents (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      title text NOT NULL,
      description text,
      content text,
      category text DEFAULT 'Uncategorized'::text,
      tags text[] DEFAULT '{}'::text[],
      insights text[] DEFAULT '{}'::text[],
      next_steps text[] DEFAULT '{}'::text[],
      code_snippet text,
      file_url text,
      project_id text,
      is_pinned boolean DEFAULT false,
      order_index integer DEFAULT 999,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    -- Add a comment to the table
    COMMENT ON TABLE public.research_documents IS 'Stores research documents and articles for projects';
    
    -- Create index for faster searches
    CREATE INDEX idx_research_documents_project_id ON public.research_documents (project_id);
    CREATE INDEX idx_research_documents_category ON public.research_documents (category);
    
    -- Enable RLS
    ALTER TABLE public.research_documents ENABLE ROW LEVEL SECURITY;
    
    -- Add a policy that allows anyone to select records
    CREATE POLICY "Allow public read access" 
      ON public.research_documents 
      FOR SELECT USING (true);
      
    -- Add policy for authenticated users to insert/update
    CREATE POLICY "Allow authenticated insert" 
      ON public.research_documents 
      FOR INSERT 
      WITH CHECK (auth.role() = 'authenticated');
      
    CREATE POLICY "Allow authenticated update" 
      ON public.research_documents 
      FOR UPDATE 
      USING (auth.role() = 'authenticated');
  ELSE
    -- Table exists, check if we need to add any missing columns
    -- Add content column if it doesn't exist
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'research_documents' 
      AND column_name = 'content'
    ) THEN
      ALTER TABLE public.research_documents ADD COLUMN content text;
    END IF;
    
    -- Add insights array if it doesn't exist
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'research_documents' 
      AND column_name = 'insights'
    ) THEN
      ALTER TABLE public.research_documents ADD COLUMN insights text[] DEFAULT '{}'::text[];
    END IF;
    
    -- Add next_steps array if it doesn't exist
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'research_documents' 
      AND column_name = 'next_steps'
    ) THEN
      ALTER TABLE public.research_documents ADD COLUMN next_steps text[] DEFAULT '{}'::text[];
    END IF;
  END IF;
END;
$$; 