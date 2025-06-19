-- Create table for project wireframes
CREATE TABLE IF NOT EXISTS project_wireframes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'page',
  wireframe_status TEXT DEFAULT 'planned',
  specs_status TEXT DEFAULT 'pending',
  dev_status TEXT DEFAULT 'pending',
  notion_link TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE project_wireframes ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read project wireframes
CREATE POLICY "Allow authenticated users to read project wireframes" 
ON project_wireframes
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Allow admin users to insert project wireframes
CREATE POLICY "Allow admin users to insert project wireframes"
ON project_wireframes
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Allow admin users to update project wireframes
CREATE POLICY "Allow admin users to update project wireframes"
ON project_wireframes
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Allow admin users to delete project wireframes
CREATE POLICY "Allow admin users to delete project wireframes"
ON project_wireframes
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updated_at
CREATE TRIGGER update_project_wireframes_updated_at
BEFORE UPDATE ON project_wireframes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create a function to get project wireframes
CREATE OR REPLACE FUNCTION get_project_wireframes(project_id_param UUID)
RETURNS SETOF project_wireframes
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT * FROM project_wireframes
  WHERE project_id = project_id_param
  ORDER BY created_at DESC;
$$;
