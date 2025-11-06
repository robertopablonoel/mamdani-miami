-- Add retirement savings columns to quiz_leads table
ALTER TABLE quiz_leads
ADD COLUMN retirement_savings INTEGER,
ADD COLUMN years_until_retirement INTEGER;

-- Add comment for documentation
COMMENT ON COLUMN quiz_leads.retirement_savings IS 'Projected total wealth increase by retirement (age 65) assuming 7% annual return';
COMMENT ON COLUMN quiz_leads.years_until_retirement IS 'Number of years until user reaches retirement age (65)';
