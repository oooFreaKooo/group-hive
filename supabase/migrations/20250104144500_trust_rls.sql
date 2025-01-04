-- First, drop all policies
DROP POLICY IF EXISTS "Enable all for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON groups;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON group_members;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON task_categories;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON tasks;

-- Disable RLS on all tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE group_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE task_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- Allow public access (but still requires authentication through our app)
ALTER TABLE profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE groups FORCE ROW LEVEL SECURITY;
ALTER TABLE group_members FORCE ROW LEVEL SECURITY;
ALTER TABLE task_categories FORCE ROW LEVEL SECURITY;
ALTER TABLE tasks FORCE ROW LEVEL SECURITY;

-- Create a single policy for each table that allows everything
CREATE POLICY "Trust authenticated users" ON profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Trust authenticated users" ON groups FOR ALL TO authenticated USING (true);
CREATE POLICY "Trust authenticated users" ON group_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Trust authenticated users" ON task_categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Trust authenticated users" ON tasks FOR ALL TO authenticated USING (true); 