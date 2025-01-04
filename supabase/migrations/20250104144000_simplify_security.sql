-- Drop all existing policies
DROP POLICY IF EXISTS "Users can create groups" ON groups;
DROP POLICY IF EXISTS "Users can view groups by invite code" ON groups;
DROP POLICY IF EXISTS "Members can read their groups" ON groups;
DROP POLICY IF EXISTS "Members can read group members" ON group_members;
DROP POLICY IF EXISTS "Users can join groups" ON group_members;
DROP POLICY IF EXISTS "Members can read group categories" ON task_categories;
DROP POLICY IF EXISTS "Members can read group tasks" ON tasks;
DROP POLICY IF EXISTS "Members can create tasks" ON tasks;
DROP POLICY IF EXISTS "Assigned members can update tasks" ON tasks;
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create simple policies that allow authenticated users to do everything
CREATE POLICY "Enable all for authenticated users" ON profiles
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users" ON groups
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users" ON group_members
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users" ON task_categories
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users" ON tasks
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true); 