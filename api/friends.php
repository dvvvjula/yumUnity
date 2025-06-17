<?php
require_once '../check_session.php';
require_once '../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    requireLogin();
    $user = getCurrentUser();
    
    try {
        $pdo = getDBConnection();
        $action = $_GET['action'] ?? '';
        
        if ($action === 'search') {
            $query = trim($_GET['query'] ?? '');
            if (empty($query)) {
                echo json_encode(['success' => true, 'users' => []]);
                exit;
            }
            
            // Search users excluding current user and existing friends
            $stmt = $pdo->prepare("
                SELECT u.id, u.username, 
                       COALESCE(u.profile_image, '/placeholder.svg?height=40&width=40') as profile_image, 
                       u.is_online, u.last_seen,
                       CASE WHEN fr.id IS NOT NULL THEN 'pending' ELSE 'none' END as request_status
                FROM users u 
                LEFT JOIN friend_requests fr ON (
                    (fr.sender_id = ? AND fr.receiver_id = u.id) OR 
                    (fr.sender_id = u.id AND fr.receiver_id = ?)
                ) AND fr.status = 'pending'
                LEFT JOIN friendships f ON (
                    (f.user1_id = ? AND f.user2_id = u.id) OR 
                    (f.user1_id = u.id AND f.user2_id = ?)
                )
                WHERE u.username LIKE ? AND u.id != ? AND f.id IS NULL
                LIMIT 10
            ");
            $searchTerm = '%' . $query . '%';
            $stmt->execute([$user['id'], $user['id'], $user['id'], $user['id'], $searchTerm, $user['id']]);
            $users = $stmt->fetchAll();
            
            echo json_encode(['success' => true, 'users' => $users]);
            
        } elseif ($action === 'list') {
            // Get friends list
            $stmt = $pdo->prepare("
                SELECT u.id, u.username, 
                       COALESCE(u.profile_image, '/placeholder.svg?height=40&width=40') as profile_image, 
                       u.is_online, u.last_seen
                FROM users u
                JOIN friendships f ON (
                    (f.user1_id = ? AND f.user2_id = u.id) OR 
                    (f.user1_id = u.id AND f.user2_id = ?)
                )
                WHERE u.id != ?
                ORDER BY u.is_online DESC, u.last_seen DESC
            ");
            $stmt->execute([$user['id'], $user['id'], $user['id']]);
            $friends = $stmt->fetchAll();
            
            echo json_encode(['success' => true, 'friends' => $friends]);
            
        } elseif ($action === 'requests') {
            // Get friend requests
            $stmt = $pdo->prepare("
                SELECT fr.id, u.username, 
                       COALESCE(u.profile_image, '/placeholder.svg?height=40&width=40') as profile_image, 
                       fr.created_at
                FROM friend_requests fr
                JOIN users u ON fr.sender_id = u.id
                WHERE fr.receiver_id = ? AND fr.status = 'pending'
                ORDER BY fr.created_at DESC
            ");
            $stmt->execute([$user['id']]);
            $requests = $stmt->fetchAll();
            
            echo json_encode(['success' => true, 'requests' => $requests]);
        }
        
    } catch (Exception $e) {
        error_log("Friends API error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireLogin();
    $user = getCurrentUser();
    
    try {
        $pdo = getDBConnection();
        $action = $_POST['action'] ?? '';
        
        if ($action === 'send_request') {
            $receiverId = (int)($_POST['receiver_id'] ?? 0);
            
            if (!$receiverId || $receiverId === $user['id']) {
                echo json_encode(['success' => false, 'message' => 'Invalid receiver']);
                exit;
            }
            
            // Check if request already exists
            $stmt = $pdo->prepare("
                SELECT id FROM friend_requests 
                WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
            ");
            $stmt->execute([$user['id'], $receiverId, $receiverId, $user['id']]);
            
            if ($stmt->fetch()) {
                echo json_encode(['success' => false, 'message' => 'Request already exists']);
                exit;
            }
            
            // Send friend request
            $stmt = $pdo->prepare("
                INSERT INTO friend_requests (sender_id, receiver_id) 
                VALUES (?, ?)
            ");
            $stmt->execute([$user['id'], $receiverId]);
            
            // Create notification
            $stmt = $pdo->prepare("
                INSERT INTO notifications (user_id, type, message, related_user_id) 
                VALUES (?, 'friend_request', ?, ?)
            ");
            $message = $user['username'] . " sent you a friend request";
            $stmt->execute([$receiverId, $message, $user['id']]);
            
            echo json_encode(['success' => true, 'message' => 'Friend request sent']);
            
        } elseif ($action === 'accept_request') {
            $requestId = (int)($_POST['request_id'] ?? 0);
            
            // Get request details
            $stmt = $pdo->prepare("
                SELECT sender_id FROM friend_requests 
                WHERE id = ? AND receiver_id = ? AND status = 'pending'
            ");
            $stmt->execute([$requestId, $user['id']]);
            $request = $stmt->fetch();
            
            if (!$request) {
                echo json_encode(['success' => false, 'message' => 'Request not found']);
                exit;
            }
            
            $pdo->beginTransaction();
            
            try {
                // Update request status
                $stmt = $pdo->prepare("
                    UPDATE friend_requests SET status = 'accepted' WHERE id = ?
                ");
                $stmt->execute([$requestId]);
                
                // Create friendship
                $stmt = $pdo->prepare("
                    INSERT INTO friendships (user1_id, user2_id) VALUES (?, ?)
                ");
                $stmt->execute([$user['id'], $request['sender_id']]);
                
                // Create notification for sender
                $stmt = $pdo->prepare("
                    INSERT INTO notifications (user_id, type, message, related_user_id) 
                    VALUES (?, 'friend_accepted', ?, ?)
                ");
                $message = $user['username'] . " accepted your friend request";
                $stmt->execute([$request['sender_id'], $message, $user['id']]);
                
                $pdo->commit();
                echo json_encode(['success' => true, 'message' => 'Friend request accepted']);
                
            } catch (Exception $e) {
                $pdo->rollBack();
                throw $e;
            }
            
        } elseif ($action === 'decline_request') {
            $requestId = (int)($_POST['request_id'] ?? 0);
            
            $stmt = $pdo->prepare("
                UPDATE friend_requests SET status = 'declined' 
                WHERE id = ? AND receiver_id = ?
            ");
            $stmt->execute([$requestId, $user['id']]);
            
            echo json_encode(['success' => true, 'message' => 'Friend request declined']);
        }
        
    } catch (Exception $e) {
        error_log("Friends POST error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
}
?>
