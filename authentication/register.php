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
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    $errors = [];
    // check username
    if (empty($username)) {
        $errors[] = "Username is required";
    } else {
        $usernameErrors = validateUsername($username);
        $errors = array_merge($errors, $usernameErrors);
    }
    
    // check email
    if (empty($email)) {
        $errors[] = "Email is required";
    } else {
        $emailErrors = validateEmail($email);
        $errors = array_merge($errors, $emailErrors);
    }
    
    // check password
    if (empty($password)) {
        $errors[] = "Password is required";
    } else {
        $passwordErrors = validatePassword($password);
        $errors = array_merge($errors, $passwordErrors);
    }
    
    if (!empty($errors)) {
        echo json_encode([
            'success' => false, 
            'message' => implode('. ', $errors)
        ]);
        exit;
    }
    
    $pdo = getDBConnection();
    
    // username has to be unique
    if (isUsernameExists($pdo, $username)) {
        echo json_encode([
            'success' => false, 
            'message' => 'Username already exists. Please choose a different one.'
        ]);
        exit;
    }
    
    // email has to be unique
    if (isEmailExists($pdo, $email)) {
        echo json_encode([
            'success' => false, 
            'message' => 'Email already exists. Please use a different email address.'
        ]);
        exit;
    }
    
    // password hash
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    // add user to data base
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
    $result = $stmt->execute([$username, $email, $passwordHash]);
    
    if ($result) {
        $userId = $pdo->lastInsertId();
        
        $_SESSION['user_id'] = $userId;
        $_SESSION['username'] = $username;
        $_SESSION['email'] = $email;
        
        echo json_encode([
            'success' => true, 
            'message' => 'Registration successful! Welcome to YumUnity!'
        ]);
    } else {
        echo json_encode([
            'success' => false, 
            'message' => 'Registration failed. Please try again.'
        ]);
    }
    
} catch (PDOException $e) {
    error_log("Registration error: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'message' => 'Database error. Please try again later.'
    ]);
} catch (Exception $e) {
    error_log("General registration error: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'message' => 'An unexpected error occurred. Please try again.'
    ]);
}
?>