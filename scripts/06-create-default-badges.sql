-- Create default badges for the system
INSERT INTO badges (name, description, requirement_type, requirement_value, icon_url)
VALUES
  ('Primo Passo', 'Completa il tuo profilo', 'profile_completed', 1, '🎯'),
  ('Contributore', 'Carica il tuo primo appunto', 'materials_uploaded', 1, '📚'),
  ('Esperto', 'Carica 10 appunti', 'materials_uploaded', 10, '🎓'),
  ('Maestro', 'Carica 50 appunti', 'materials_uploaded', 50, '👨‍🏫'),
  ('Conversatore', 'Crea la tua prima discussione', 'discussions_created', 1, '💬'),
  ('Oratore', 'Crea 10 discussioni', 'discussions_created', 10, '🗣️'),
  ('Commentatore', 'Scrivi 10 commenti', 'comments_posted', 10, '✍️'),
  ('Chiacchierone', 'Scrivi 50 commenti', 'comments_posted', 50, '💭'),
  ('Studente', 'Completa il tuo primo quiz', 'quizzes_completed', 1, '📝'),
  ('Studioso', 'Completa 10 quiz', 'quizzes_completed', 10, '📖'),
  ('Principiante', 'Raggiungi 100 XP', 'xp_earned', 100, '⭐'),
  ('Intermedio', 'Raggiungi 500 XP', 'xp_earned', 500, '🌟'),
  ('Avanzato', 'Raggiungi 1000 XP', 'xp_earned', 1000, '✨'),
  ('Esperto XP', 'Raggiungi 2500 XP', 'xp_earned', 2500, '💫'),
  ('Livello 5', 'Raggiungi il livello 5', 'level_reached', 5, '🏆'),
  ('Livello 10', 'Raggiungi il livello 10', 'level_reached', 10, '👑')
ON CONFLICT DO NOTHING;
