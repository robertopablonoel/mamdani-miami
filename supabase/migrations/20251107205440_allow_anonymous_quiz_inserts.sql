-- Allow anonymous users to insert quiz sessions (for partial submissions)
CREATE POLICY "Allow anonymous inserts to quiz_sessions"
ON quiz_sessions
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous users to insert quiz answers (for partial submissions)
CREATE POLICY "Allow anonymous inserts to quiz_answers"
ON quiz_answers
FOR INSERT
TO anon
WITH CHECK (true);
