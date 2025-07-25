-- Update jason@jaydus.ai to admin role if exists
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'jason@jaydus.ai';

-- Also ensure the trigger will set future signups correctly
-- (This is already handled in the previous migration, but adding for clarity)