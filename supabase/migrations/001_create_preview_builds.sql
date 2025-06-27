
-- Create the preview_builds table
CREATE TABLE IF NOT EXISTS preview_builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_url TEXT NOT NULL,
  branch TEXT NOT NULL DEFAULT 'main',
  status TEXT NOT NULL DEFAULT 'idle',
  message TEXT,
  logs TEXT[],
  preview_url TEXT,
  repo_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_preview_builds_id ON preview_builds(id);
CREATE INDEX IF NOT EXISTS idx_preview_builds_created_at ON preview_builds(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE preview_builds ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on preview_builds" ON preview_builds
  FOR ALL USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_preview_builds_updated_at
  BEFORE UPDATE ON preview_builds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
