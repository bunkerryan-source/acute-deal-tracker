-- Acute Deal Tracker — Supabase Migration
-- Run this in the Supabase SQL Editor after creating the project.

-- 1. Categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 2. Tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'done')),
  assigned_to text CHECK (assigned_to IN ('Ryan', 'Matt')),
  due_date date,
  completed_by text CHECK (completed_by IN ('Ryan', 'Matt')),
  completed_at timestamptz,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Index for the most common query pattern
CREATE INDEX idx_tasks_category_id ON tasks(category_id);

-- 4. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. RLS: Enable with permissive policies for anon role
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on categories" ON categories
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all on tasks" ON tasks
  FOR ALL USING (true) WITH CHECK (true);

-- 6. Grant permissions to anon role
GRANT ALL ON categories TO anon;
GRANT ALL ON tasks TO anon;

-- 7. Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;

-- 8. Seed categories
INSERT INTO categories (name, sort_order) VALUES
  ('Transition', 1),
  ('Bank Debt', 2),
  ('Capital Raise', 3),
  ('Transaction Docs', 4),
  ('Buyer Formation', 5);
