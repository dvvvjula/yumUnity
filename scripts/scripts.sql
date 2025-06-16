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
    type ENUM('like', 'comment', 'friend_request', 'friend_accepted') NOT NULL,
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

-- example data (just to check if it works!)

INSERT INTO users (username, email, password_hash, bio) VALUES 
('testuser', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'I love cooking and trying new recipes!'),
('foodlover', 'food@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Passionate about healthy eating and organic food.'),
('chef123', 'chef@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Professional chef sharing my culinary adventures.');

INSERT INTO posts (user_id, meal_type, description, calories) VALUES 
(1, 'lunch', 'Delicious homemade pasta with fresh tomatoes and basil!', 450),
(2, 'breakfast', 'Healthy smoothie bowl with berries and granola', 320),
(3, 'dinner', 'Grilled salmon with roasted vegetables', 520);

INSERT INTO likes (user_id, post_id) VALUES 
(2, 1),
(3, 1),
(1, 2),
(3, 2),
(1, 3),
(2, 3);

INSERT INTO comments (user_id, post_id, content) VALUES 
(2, 1, 'This looks amazing! Could you share the recipe?'),
(3, 1, 'I love pasta dishes like this!'),
(1, 2, 'Such a healthy way to start the day!'),
(3, 2, 'Those berries look so fresh and colorful!'),
(1, 3, 'Perfect cooking on that salmon!'),
(2, 3, 'I need to try this combination!');

INSERT INTO friendships (user1_id, user2_id) VALUES 
(1, 2),
(1, 3),
(2, 3);

INSERT INTO friend_requests (sender_id, receiver_id, status) VALUES 
(1, 2, 'accepted'),
(2, 3, 'pending');

INSERT INTO notifications (user_id, type, message, related_user_id, related_post_id) VALUES 
(1, 'like', 'foodlover liked your post', 2, 1),
(1, 'comment', 'chef123 commented on your post', 3, 1),
(2, 'friend_request', 'testuser sent you a friend request', 1, NULL),
(3, 'like', 'testuser liked your post', 1, 3);

SELECT 'database setup completed successfully:)' as status;