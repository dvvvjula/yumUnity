<?php
require_once '../config.php';
require_once '../check_session.php';

header('Content-Type: application/json');
<<<<<<< HEAD

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
=======
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

requireLogin();
$user = getCurrentUser();
$pdo = getDBConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $userId = $_GET['user_id'] ?? $user['id'];
        
        $stmt = $pdo->prepare("
            SELECT p.*, u.username, u.profile_image,
                   COUNT(DISTINCT l.id) as likes_count,
                   COUNT(DISTINCT c.id) as comments_count
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            LEFT JOIN likes l ON p.id = l.post_id 
            LEFT JOIN comments c ON p.id = c.post_id 
            WHERE p.user_id = ? 
            GROUP BY p.id 
            ORDER BY p.created_at DESC
        ");
        $stmt->execute([$userId]);
        $posts = $stmt->fetchAll();
        
        // Get images for each post
        foreach ($posts as &$post) {
            $stmt = $pdo->prepare("SELECT image_path FROM post_images WHERE post_id = ? ORDER BY id");
            $stmt->execute([$post['id']]);
            $images = $stmt->fetchAll(PDO::FETCH_COLUMN);
            $post['images'] = $images;
        }
        
        echo json_encode([
            'success' => true,
            'posts' => $posts
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error loading posts: ' . $e->getMessage()
        ]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $mealType = $_POST['meal_type'] ?? 'lunch';
        $description = trim($_POST['description'] ?? '');
        $calories = !empty($_POST['calories']) ? (int)$_POST['calories'] : null;
        
        if (empty($description)) {
            throw new Exception('Description is required');
        }
        
        // Insert post
        $stmt = $pdo->prepare("
            INSERT INTO posts (user_id, meal_type, description, calories, created_at) 
            VALUES (?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$user['id'], $mealType, $description, $calories]);
        $postId = $pdo->lastInsertId();
        
        // Handle image uploads
        if (isset($_FILES['images'])) {
            $uploadDir = '../uploads/posts/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            $files = $_FILES['images'];
            if (is_array($files['name'])) {
                for ($i = 0; $i < count($files['name']); $i++) {
                    if ($files['error'][$i] === UPLOAD_ERR_OK) {
                        $fileExtension = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
                        $fileName = $postId . '_' . $i . '_' . time() . '.' . $fileExtension;
                        $uploadPath = $uploadDir . $fileName;
                        
                        if (move_uploaded_file($files['tmp_name'][$i], $uploadPath)) {
                            $stmt = $pdo->prepare("INSERT INTO post_images (post_id, image_path) VALUES (?, ?)");
                            $stmt->execute([$postId, 'uploads/posts/' . $fileName]);
                        }
                    }
                }
            } else {
                if ($files['error'] === UPLOAD_ERR_OK) {
                    $fileExtension = pathinfo($files['name'], PATHINFO_EXTENSION);
                    $fileName = $postId . '_' . time() . '.' . $fileExtension;
                    $uploadPath = $uploadDir . $fileName;
                    
                    if (move_uploaded_file($files['tmp_name'], $uploadPath)) {
                        $stmt = $pdo->prepare("INSERT INTO post_images (post_id, image_path) VALUES (?, ?)");
                        $stmt->execute([$postId, 'uploads/posts/' . $fileName]);
                    }
>>>>>>> bedcc8833e2b8b2d9bd6facc58b573133d455c38
                }
            }
        }
        
<<<<<<< HEAD
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
=======
        echo json_encode([
            'success' => true,
            'message' => 'Post created successfully',
            'post_id' => $postId
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error creating post: ' . $e->getMessage()
        ]);
    }
}
?>
>>>>>>> bedcc8833e2b8b2d9bd6facc58b573133d455c38
