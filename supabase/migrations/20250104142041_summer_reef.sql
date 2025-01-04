/*
  # Initial Schema Setup

  1. New Tables
    - profiles: User profiles with names and avatars
    - groups: Living spaces/flats
    - group_members: Connects users to groups with points
    - tasks: Tasks with assignments and deadlines
    - task_categories: Categories for tasks (cleaning, shopping, etc.)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  invite_code text UNIQUE DEFAULT encode(gen_random_bytes(6), 'base64'),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'member')),
  points integer DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create task_categories table
CREATE TABLE IF NOT EXISTS task_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(group_id, name)
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  category_id uuid REFERENCES task_categories(id),
  assigned_to uuid REFERENCES profiles(id),
  created_by uuid REFERENCES profiles(id),
  points integer DEFAULT 10,
  due_date timestamptz NOT NULL,
  completed_at timestamptz,
  proof_image_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Groups policies
CREATE POLICY "Members can read their groups"
  ON groups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = groups.id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view groups by invite code"
  ON groups FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create groups"
  ON groups FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Group members policies
CREATE POLICY "Members can read group members"
  ON group_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join groups"
  ON group_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Task categories policies
CREATE POLICY "Members can read group categories"
  ON task_categories FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = task_categories.group_id
      AND user_id = auth.uid()
    )
  );

-- Tasks policies
CREATE POLICY "Members can read group tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = tasks.group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = tasks.group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Assigned members can update tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = assigned_to OR
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = tasks.group_id
      AND user_id = auth.uid()
    )
  );

-- Create default task categories function
CREATE OR REPLACE FUNCTION create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO task_categories (name, color, group_id)
  VALUES
    ('Cleaning', '#22C55E', NEW.id),
    ('Shopping', '#3B82F6', NEW.id),
    ('Maintenance', '#EAB308', NEW.id),
    ('Other', '#6B7280', NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default categories when a group is created
CREATE TRIGGER create_default_categories_trigger
  AFTER INSERT ON groups
  FOR EACH ROW
  EXECUTE FUNCTION create_default_categories();

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  name_from_metadata text;
BEGIN
  -- Try to get name from metadata, fallback to email if not available
  name_from_metadata := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  INSERT INTO public.profiles (id, name)
  VALUES (new.id, name_from_metadata)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();