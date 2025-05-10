-- Create enum types for feedback
CREATE TYPE public.feedback_type AS ENUM ('feature', 'bug', 'ui', 'performance', 'other');
CREATE TYPE public.feedback_status AS ENUM ('new', 'in-progress', 'implemented', 'rejected');
CREATE TYPE public.feedback_priority AS ENUM ('low', 'medium', 'high');

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.project_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type feedback_type NOT NULL,
    status feedback_status NOT NULL DEFAULT 'new',
    priority feedback_priority NOT NULL DEFAULT 'medium',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    response TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.project_feedback ENABLE ROW LEVEL SECURITY;

-- Policy to allow all authenticated users to view feedback
CREATE POLICY "All authenticated users can view feedback" 
ON public.project_feedback FOR SELECT 
TO authenticated 
USING (true);

-- Policy to allow project owner and admins to create feedback
CREATE POLICY "Project owners and admins can create feedback" 
ON public.project_feedback FOR INSERT 
TO authenticated 
WITH CHECK (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Policy to allow project owner and admins to update feedback
CREATE POLICY "Project owners and admins can update feedback" 
ON public.project_feedback FOR UPDATE 
TO authenticated 
USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER set_project_feedback_updated_at
BEFORE UPDATE ON public.project_feedback
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add the feedback_type, feedback_status, and feedback_priority to the types.ts file
-- Update the Constants object with the new enum values 