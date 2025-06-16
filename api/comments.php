<?php
require_once '../config.php';
require_once '../check_session.php';

header('Content-Type: application/json');
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
        $postId = $_GET['post_id'] ?? 0;
        
        $stmt = $pdo->prepare("
            SELECT c.*, u.username, 
                   COALESCE(u.profile_image, '/placeholder.svg?height=20&width=20') as profile_image,
                   DATE_FORMAT(c.created_at, '%H:%i') as formatted_time
            FROM comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.post_id = ? 
            ORDER BY c.created_at ASC
        ");
        $stmt->execute([$postId]);
        $comments = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'comments' => $comments
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error loading comments: ' . $e->getMessage()
        ]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $postId = $_POST['post_id'] ?? 0;
        $content = trim($_POST['content'] ?? '');
        
        if (empty($content)) {
            throw new Exception('Comment content is required');
        }
        
        if (str_word_count($content) > 100) {
            throw new Exception('Comment is too long. Maximum 100 words allowed.');
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO comments (post_id, user_id, content, created_at) 
            VALUES (?, ?, ?, NOW())
        ");
        $stmt->execute([$postId, $user['id'], $content]);
        
        // Get the inserted comment with user info
        $commentId = $pdo->lastInsertId();
        $stmt = $pdo->prepare("
            SELECT c.*, u.username, 
                   COALESCE(u.profile_image, '/placeholder.svg?height=20&width=20') as profile_image,
                   DATE_FORMAT(c.created_at, '%H:%i') as formatted_time
            FROM comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.id = ?
        ");
        $stmt->execute([$commentId]);
        $comment = $stmt->fetch();
        
        echo json_encode([
            'success' => true,
            'message' => 'Comment added successfully',
            'comment' => $comment
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error adding comment: ' . $e->getMessage()
        ]);
    }
}
?>
