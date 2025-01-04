-- Drop existing policies
DROP POLICY IF EXISTS "Users can create groups" ON groups;
DROP POLICY IF EXISTS "Users can view groups by invite code" ON groups;

-- Recreate the policies
CREATE POLICY "Users can view groups by invite code"
  ON groups FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create groups"
  ON groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by); 