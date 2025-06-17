<?php
require_once '../config.php';
require_once '../check_session.php';

header('Content-Type: application/json');

$response = [
    'success' => false,
    'message' => '',
    'post' => null
];

try {
    $pdo = getDBConnection();
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create new post
        $user_id = $_SESSION['user_id'];
        $meal_type = $_POST['meal_type'] ?? 'lunch';
        $description = $_POST['description'] ?? '';
        $calories = $_POST['calories'] ?? null;
        
        // Insert post into database
        $stmt = $pdo->prepare("
            INSERT INTO posts (user_id, meal_type, description, calories) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$user_id, $meal_type, $description, $calories]);
        $post_id = $pdo->lastInsertId();
        
        // Handle image uploads
        $images = [];
        if (!empty($_FILES['images'])) {
            $uploadDir = '../uploads/posts/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
                $fileName = uniqid() . '_' . basename($_FILES['images']['name'][$key]);
                $targetPath = $uploadDir . $fileName;
                
                if (move_uploaded_file($tmp_name, $targetPath)) {
                    // Save image to database
                    $stmt = $pdo->prepare("
                        INSERT INTO post_images (post_id, image_path) 
                        VALUES (?, ?)
                    ");
                    $stmt->execute([$post_id, 'uploads/posts/' . $fileName]);
                    $images[] = 'uploads/posts/' . $fileName;
                }
            }
        }
        
        // Get user info for response
        $stmt = $pdo->prepare("
            SELECT u.username, u.profile_image, p.* 
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = ?
        ");
        $stmt->execute([$post_id]);
        $post = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Get images for the post
        $stmt = $pdo->prepare("SELECT image_path FROM post_images WHERE post_id = ?");
        $stmt->execute([$post_id]);
        $post['images'] = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
        
        $response['success'] = true;
        $response['post'] = $post;
        $response['message'] = 'Post created successfully';
    }
    
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get user posts
        $user_id = $_GET['user_id'] ?? $_SESSION['user_id'];
        
        // Get basic post info
        $stmt = $pdo->prepare("
            SELECT p.*, u.username, u.profile_image,
                   (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
                   (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
            LIMIT 3
        ");
        $stmt->execute([$user_id]);
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get images for each post
        foreach ($posts as &$post) {
            $stmt = $pdo->prepare("
                SELECT image_path FROM post_images 
                WHERE post_id = ?
            ");
            $stmt->execute([$post['id']]);
            $post['images'] = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
        }
        
        $response['success'] = true;
        $response['posts'] = $posts;
    }
    
} catch (PDOException $e) {
    $response['message'] = 'Database error: ' . $e->getMessage();
} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
}

echo json_encode($response);