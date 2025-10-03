-- this i always use in phpMyAdmin in SQL when i use it locally:

CREATE DATABASE IF NOT EXISTS yumunity CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE yumunity;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS friend_requests;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS post_images;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

-- users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    bio TEXT DEFAULT 'new food this, new food that... i love pasta.',
    profile_image VARCHAR(255) DEFAULT 'pictures/hp-prof-1.jpg',
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- posts
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') DEFAULT 'lunch',
    description TEXT NOT NULL,
    calories INT DEFAULT NULL,
    images JSON DEFAULT NULL,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- images in posts table
CREATE TABLE post_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- likes
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (user_id, post_id)
);

-- comments
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- friends
CREATE TABLE friendships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_friendship (user1_id, user2_id),
    CHECK (user1_id != user2_id)
);

-- friends requests
CREATE TABLE friend_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_request (sender_id, receiver_id),
    CHECK (sender_id != receiver_id)
);

-- notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('like', 'comment', 'friend_request', 'friend_accepted', 'general') NOT NULL,
    message TEXT NOT NULL,
    related_user_id INT DEFAULT NULL,
    related_post_id INT DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (related_post_id) REFERENCES posts(id) ON DELETE SET NULL
);

CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_friend_requests_receiver ON friend_requests(receiver_id);
CREATE INDEX idx_friendships_user1 ON friendships(user1_id);
CREATE INDEX idx_friendships_user2 ON friendships(user2_id);

-- triggers
DELIMITER //

CREATE TRIGGER update_likes_count_insert 
AFTER INSERT ON likes 
FOR EACH ROW 
BEGIN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
END//

CREATE TRIGGER update_likes_count_delete 
AFTER DELETE ON likes 
FOR EACH ROW 
BEGIN
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
END//

CREATE TRIGGER update_comments_count_insert 
AFTER INSERT ON comments 
FOR EACH ROW 
BEGIN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
END//

CREATE TRIGGER update_comments_count_delete 
AFTER DELETE ON comments 
FOR EACH ROW 
BEGIN
    UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
END//

DELIMITER ;

-- if notif is older than 7 days -> delete
CREATE EVENT IF NOT EXISTS cleanup_old_notifications
ON SCHEDULE EVERY 1 DAY
DO
DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);

-- sample data - exactly from your js files

-- sample users (including the ones from your js files)
INSERT INTO users (username, email, password_hash, bio, profile_image, is_online, last_seen) VALUES 
('testuser', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'I love cooking and trying new recipes!', 'pictures/hp-prof-1.jpg', TRUE, NOW()),
('funycat123', 'funycat@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Cat lover who loves food!', 'pictures/hp-prof-1.jpg', TRUE, NOW()),
('yumyum8', 'yumyum@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Always hungry for good food', 'pictures/hp-prof-2.jpg', FALSE, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('ilikefood1', 'ilikefood@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Food is life!', 'pictures/hp-prof-1.jpg', TRUE, NOW()),
('foodlover22', 'foodlover22@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Passionate about healthy eating and organic food.', 'pictures/hp-prof-2.jpg', FALSE, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
('cookmaster', 'cookmaster@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Professional chef sharing my culinary adventures.', 'pictures/hp-prof-1.jpg', TRUE, NOW()),
('healthyeats', 'healthyeats@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Healthy lifestyle enthusiast', 'pictures/hp-prof-2.jpg', FALSE, DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
('sarah_chef', 'sarah@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Love making breakfast!', 'pictures/hp-prof-1.jpg', TRUE, NOW()),
('mike_foodie', 'mike@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Always looking for new friends to share recipes', 'pictures/hp-prof-2.jpg', TRUE, NOW()),
('emma_cook', 'emma@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Cooking is my passion', 'pictures/hp-prof-1.jpg', FALSE, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('chefmaster2024', 'chefmaster2024@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Master chef 2024', 'pictures/hp-prof-2.jpg', TRUE, NOW());

-- sample posts with images from your gallery
INSERT INTO posts (user_id, meal_type, description, calories, images) VALUES 
(2, 'lunch', 'my sandwiches look so nice!!! white cheese and cucumbers hihi', 450, '["pictures/pic-hp-gallery-1.jpg", "pictures/pic-hp-gallery-1-2.jpg", "pictures/pic-hp-gallery-1-3.jpg"]'),
(3, 'lunch', 'how do you like my lunch GUYSSSSSS hello', 320, '["pictures/pic-hp-gallery-2.jpg"]'),
(4, 'lunch', 'i couldnt wait for break! i was so hungry, what did YOU eat for lunch btw? ill enjoy it now', 520, '["pictures/pic-hp-gallery-3.jpg", "pictures/pic-hp-gallery-3-2.jpg", "pictures/pic-hp-gallery-3-3.jpg"]'),
(1, 'breakfast', 'Delicious homemade pasta with fresh tomatoes and basil!', 450, '["pictures/pic-prof-gallery-1.jpg"]'),
(5, 'breakfast', 'Healthy smoothie bowl with berries and granola', 320, '["pictures/pic-prof-gallery-2.jpg"]'),
(6, 'dinner', 'Grilled salmon with roasted vegetables', 520, '["pictures/pic-hp-gallery-1.jpg"]');

-- sample likes
INSERT INTO likes (user_id, post_id) VALUES 
(3, 1), (4, 1), (1, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1), (11, 1), (2, 1), -- 11 likes for post 1 (removed duplicate (1,1))
(2, 2), (4, 2), (1, 2), (5, 2), (6, 2), (7, 2), (8, 2), (9, 2), -- 8 likes for post 2
(1, 3), (2, 3), (3, 3), (5, 3), (6, 3), (7, 3), (8, 3), (9, 3), (10, 3), (11, 3), (4, 3); -- 11 likes for post 3 (removed duplicates)

-- sample comments
INSERT INTO comments (user_id, post_id, content) VALUES 
(2, 1, 'This looks amazing! 😍'),
(3, 1, 'Recipe please!'),
(4, 1, 'So delicious looking!'),
(4, 2, 'Looks so healthy! 🥗'),
(2, 2, 'I need to try this combination!'),
(1, 2, 'Perfect cooking!'),
(3, 2, 'Amazing colors!'),
(5, 2, 'Great presentation!'),
(1, 3, 'Such a healthy way to start the day!'),
(2, 3, 'Those ingredients look so fresh!');

-- sample friendships (from your JS files)
INSERT INTO friendships (user1_id, user2_id) VALUES 
(1, 2), -- testuser <-> funycat123
(1, 3), -- testuser <-> yumyum8  
(1, 4), -- testuser <-> ilikefood1
(1, 5), -- testuser <-> foodlover22
(1, 6), -- testuser <-> cookmaster
(1, 7), -- testuser <-> healthyeats
(2, 3), -- funycat123 <-> yumyum8
(2, 4), -- funycat123 <-> ilikefood1
(3, 4), -- yumyum8 <-> ilikefood1
(5, 6), -- foodlover22 <-> cookmaster
(6, 7); -- cookmaster <-> healthyeats

-- sample friend requests (from your JS files)
INSERT INTO friend_requests (sender_id, receiver_id, status) VALUES 
(5, 1, 'pending'), -- foodlover22 wants to be friends with testuser
(6, 1, 'pending'), -- cookmaster wants to be friends with testuser  
(7, 1, 'pending'), -- healthyeats wants to be friends with testuser
(9, 1, 'pending'), -- mike_foodie wants to be friends with testuser
(2, 3, 'accepted'), -- accepted friendship
(1, 4, 'accepted'); -- accepted friendship

-- sample notifications (exactly from your JS files)
INSERT INTO notifications (user_id, type, message, related_user_id, related_post_id, created_at) VALUES 
(1, 'like', 'Sarah liked your breakfast post', 8, 4, DATE_SUB(NOW(), INTERVAL 2 MINUTE)),
(1, 'friend_request', 'New friend request from Mike', 9, NULL, DATE_SUB(NOW(), INTERVAL 15 MINUTE)),
(1, 'like', 'Your lunch got 5 new likes!', NULL, 1, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(1, 'comment', 'Emma commented on your post', 10, 4, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(1, 'general', 'New follower: ChefMaster2024', 11, NULL, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(1, 'general', 'Weekly meal summary ready', NULL, NULL, DATE_SUB(NOW(), INTERVAL 1 DAY)),

-- additional notifications for other users
(2, 'like', 'testuser liked your post', 1, 1, DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
(2, 'comment', 'yumyum8 commented on your post', 3, 1, DATE_SUB(NOW(), INTERVAL 45 MINUTE)),
(3, 'like', 'funycat123 liked your post', 2, 2, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(3, 'friend_request', 'New friend request from ilikefood1', 4, NULL, DATE_SUB(NOW(), INTERVAL 2 HOUR));

SELECT 'Database setup completed successfully with sample data from JS files! :)' as status;
