-- ============================================
-- SETUP ADMIN USER
-- ============================================
-- This script will make your user an admin
-- Replace 'abdelghafourboucham327@gmail.com' with your actual email if different

-- Update the user role to admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'abdelghafourboucham327@gmail.com';

-- Verify the admin was created
SELECT id, email, full_name, role 
FROM users 
WHERE role = 'admin';
