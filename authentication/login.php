<?php
session_start();
require_once '../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    
    // validate
    if (empty($username)) {
        echo json_encode([
            'success' => false, 
            'message' => 'Username is required'
        ]);
        exit;
    }
    
    if (empty($password)) {
        echo json_encode([
            'success' => false, 
            'message' => 'Password is required'
        ]);
        exit;
    }
    
    $pdo = getDBConnection();
    
    $stmt = $pdo->prepare("SELECT id, username, email, password_hash FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password_hash'])) {
        // create session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];
        
        echo json_encode([
            'success' => true, 
            'message' => 'Login successful! Welcome back!'
        ]);
    } else {
        echo json_encode([
            'success' => false, 
            'message' => 'Invalid username or password. Please try again.'
        ]);
    }
    
} catch (PDOException $e) {
    error_log("Login error: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'message' => 'Database error. Please try again later.'
    ]);
} catch (Exception $e) {
    error_log("General login error: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'message' => 'An unexpected error occurred. Please try again.'
    ]);
}
?>