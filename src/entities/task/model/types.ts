/*
SQL para ejecutar en Supabase Dashboard:

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own tasks"
  ON tasks FOR ALL
  USING (auth.uid() = user_id);
*/

export interface Task {
  id:          string;
  user_id:     string;
  title:       string;
  description: string | null;
  completed:   boolean;
  created_at:  string;
}
