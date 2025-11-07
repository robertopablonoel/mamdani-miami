-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous inserts to quiz_sessions" ON quiz_sessions;
DROP POLICY IF EXISTS "Allow anonymous inserts to quiz_answers" ON quiz_answers;

-- Allow anonymous users to insert AND select their own quiz sessions
CREATE POLICY "Allow anonymous access to quiz_sessions"
ON quiz_sessions
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Allow anonymous users to insert AND select quiz answers
CREATE POLICY "Allow anonymous access to quiz_answers"
ON quiz_answers
FOR ALL
TO anon
USING (true)
WITH CHECK (true);
