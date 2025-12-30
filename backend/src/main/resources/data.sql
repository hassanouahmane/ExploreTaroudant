-- 1. UTILISATEURS (Les mots de passe sont 'password123')
-- On utilise INSERT IGNORE pour ne pas planter si l'utilisateur existe déjà

INSERT IGNORE INTO users (id, email, full_name, password, role, status, created_at, phone) VALUES 
(1, 'admin@taroudant.com', 'Super Admin', '$2a$10$H./lPccJk5vzQDeeZcsJWOJYStUAW5qirQCvQPqqQ9NnXmSjqkuNy', 'ADMIN', 'ACTIVE', NOW(), '+212600000000'),
(2, 'hamza@guide.com', 'Hamza Taroudant', '$2a$10$1Lvdd5s1IWVW5.Kzj1JZZuwfr54ZHNjobPgjHMcQpt5hGylQgjUhW', 'GUIDE', 'ACTIVE', NOW(), '+212611223344'),
(3, 'jean@tourist.com', 'Jean Touriste', '$2a$10$/5SDR2lM4cjtScfNGfLMuO0/lQLb7tGF4ZpHNZWFyAHJmAQFZbcry', 'TOURIST', 'ACTIVE', NOW(), '+33612345678');

-- 2. PROFILS GUIDES (Pour Hamza)
INSERT IGNORE INTO guide (id, bio, languages, user_id) VALUES 
(1, 'Guide passionné natif de Taroudant. Expert en histoire saadienne.', 'Français, Arabe, Anglais', 2);

-- 3. LIEUX (PLACES) - Exemples
INSERT IGNORE INTO place (id, name, description, city, latitude, longitude, status, created_at) VALUES 
(1, 'Remparts de Taroudant', 'Les célèbres murailles historiques entourant la médina.', 'Taroudant', 30.4700, -8.8770, 'ACTIVE', NOW()),
(2, 'Place Assarag', 'Le cœur vivant de la ville, idéal pour un café.', 'Taroudant', 30.4710, -8.8780, 'ACTIVE', NOW());

-- 4. ACTIVITÉS (Proposées par Hamza)
-- Note: guide_id = 1 (C'est l'ID du guide, pas du user)
INSERT IGNORE INTO activity (id, title, description, duration, price, status, guide_id, place_id) VALUES 
(1, 'Tour des Remparts en Calèche', 'Découverte complète des murailles au coucher du soleil.', '1h30', 150.00, 'ACTIVE', 1, 1),
(2, 'Visite des Souks Artisanaux', 'Immersion dans le travail du cuir et de l\'argent.', '2h00', 200.00, 'ACTIVE', 1, 2);

-- 5. ÉVÉNEMENTS
INSERT IGNORE INTO event (id, title, description, start_date, end_date, location, status, price) VALUES 
(1, 'Festival du Safran', 'Célébration annuelle de l\'or rouge.', '2025-11-15', '2025-11-20', 'Place Assarag', 'ACTIVE', 0);

-- 6. ARTISANS
INSERT IGNORE INTO artisan (id, name, speciality, phone, city, status, created_at) VALUES 
(1, 'Ahmed Le Bijoutier', 'Bijoux berbères en argent', '+212600000001', 'Taroudant', 'ACTIVE', NOW());