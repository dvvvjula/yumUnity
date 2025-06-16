<?php
require_once '../check_session.php';
require_once '../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireLogin();
    $user = getCurrentUser();
    
    try {
        $pdo = getDBConnection();
        $postId = (int)($_POST['post_id'] ?? 0);
        
        if (!$postId) {
            echo json_encode(['success' => false, 'message' => 'Post ID required']);
            exit;
        }
        
        // Sprawdź czy już polajkowane
        $stmt = $pdo->prepare("SELECT id FROM likes WHERE user_id = ? AND post_id = ?");
        $stmt->execute([$user['id'], $postId]);
        $existingLike = $stmt->fetch();
        
        if ($existingLike) {
            // Usuń lajka
            $stmt = $pdo->prepare("DELETE FROM likes WHERE user_id = ? AND post_id = ?");
            $stmt->execute([$user['id'], $postId]);
            $action = 'unliked';
        } else {
            // Dodaj lajka
            $stmt = $pdo->prepare("INSERT INTO likes (user_id, post_id) VALUES (?, ?)");
            $stmt->execute([$user['id'], $postId]);
            $action = 'liked';
            
            // Dodaj powiadomienie dla autora posta
            $stmt = $pdo->prepare("SELECT user_id FROM posts WHERE id = ?");
            $stmt->execute([$postId]);
            $post = $stmt->fetch();
            
            if ($post && $post['user_id'] != $user['id']) {
                $stmt = $pdo->prepare("
                    INSERT INTO notifications (user_id, type, message, related_user_id, related_post_id) 
                    VALUES (?, 'like', ?, ?, ?)
                ");
                $message = $user['username'] . " liked your post";
                $stmt->execute([$post['user_id'], $message, $user['id'], $postId]);
            }
        }
        
        // Pobierz aktualną liczbę lajków
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM likes WHERE post_id = ?");
        $stmt->execute([$postId]);
        $likesCount = $stmt->fetch()['count'];
        
        echo json_encode([
            'success' => true, 
            'action' => $action,
            'likes_count' => $likesCount
        ]);
        
    } catch (Exception $e) {
        error_log("Like error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
}
?>
