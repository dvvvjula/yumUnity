<?php
require_once '../check_session.php';
require_once '../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    requireLogin();
    $user = getCurrentUser();
    
    try {
        $pdo = getDBConnection();
        
        $stmt = $pdo->prepare("
            SELECT n.*, u.username as related_username 
            FROM notifications n
            LEFT JOIN users u ON n.related_user_id = u.id
            WHERE n.user_id = ?
            ORDER BY n.created_at DESC
            LIMIT 20
        ");
        $stmt->execute([$user['id']]);
        $notifications = $stmt->fetchAll();
        
        // Format timestamps
        foreach ($notifications as &$notification) {
            $notification['formatted_time'] = date('H:i', strtotime($notification['created_at']));
            $notification['formatted_date'] = date('M j', strtotime($notification['created_at']));
        }
        
        echo json_encode(['success' => true, 'notifications' => $notifications]);
        
    } catch (Exception $e) {
        error_log("Notifications error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireLogin();
    $user = getCurrentUser();
    
    try {
        $pdo = getDBConnection();
        $action = $_POST['action'] ?? '';
        
        if ($action === 'mark_read') {
            $notificationId = (int)($_POST['notification_id'] ?? 0);
            
            $stmt = $pdo->prepare("
                UPDATE notifications SET is_read = 1 
                WHERE id = ? AND user_id = ?
            ");
            $stmt->execute([$notificationId, $user['id']]);
            
            echo json_encode(['success' => true]);
            
        } elseif ($action === 'mark_all_read') {
            $stmt = $pdo->prepare("
                UPDATE notifications SET is_read = 1 WHERE user_id = ?
            ");
            $stmt->execute([$user['id']]);
            
            echo json_encode(['success' => true]);
        }
        
    } catch (Exception $e) {
        error_log("Notifications POST error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
}
?>
