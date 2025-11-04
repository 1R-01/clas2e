-- ============================================
-- COMANDO DIRETTO PER DIVENTARE ADMIN
-- ============================================

-- Esegui questo comando sostituendo l'email con la tua:
UPDATE users 
SET role = 'admin' 
WHERE email = 'abdelghafourboucham327@gmail.com';

-- Verifica che sia andato a buon fine:
SELECT id, email, full_name, role, created_at
FROM users 
WHERE email = 'abdelghafourboucham327@gmail.com';
