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
        $stmt = $pdo->prepare("SELECT username, email, bio, profile_image FROM users WHERE id = ?");
        $stmt->execute([$user['id']]);
        $profile = $stmt->fetch();
        
        echo json_encode([
            'success' => true,
            'profile' => $profile
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error loading profile: ' . $e->getMessage()
        ]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $username = trim($_POST['username'] ?? '');
        $bio = trim($_POST['bio'] ?? '');
        $password = $_POST['password'] ?? '';
        
        // Validate username
        if (empty($username)) {
            throw new Exception('Username is required');
        }
        
        $usernameErrors = validateUsername($username);
        if (!empty($usernameErrors)) {
            throw new Exception(implode(', ', $usernameErrors));
        }
        
        // Check if username is taken by another user
        if ($username !== $user['username']) {
            if (isUsernameExists($pdo, $username)) {
                throw new Exception('Username already taken');
            }
        }
        
        // Validate password if provided
        if (!empty($password)) {
            $passwordErrors = validatePassword($password);
            if (!empty($passwordErrors)) {
                throw new Exception(implode(', ', $passwordErrors));
            }
        }
        
        // Update user data
        if (!empty($password)) {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE users SET username = ?, bio = ?, password = ? WHERE id = ?");
            $stmt->execute([$username, $bio, $hashedPassword, $user['id']]);
        } else {
            $stmt = $pdo->prepare("UPDATE users SET username = ?, bio = ? WHERE id = ?");
            $stmt->execute([$username, $bio, $user['id']]);
        }
        
        // Update session
        $_SESSION['username'] = $username;
        
        // Handle profile image upload
        if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = '../uploads/profiles/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            $fileExtension = pathinfo($_FILES['profile_image']['name'], PATHINFO_EXTENSION);
            $fileName = $user['id'] . '_' . time() . '.' . $fileExtension;
            $uploadPath = $uploadDir . $fileName;
            
            if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $uploadPath)) {
                $stmt = $pdo->prepare("UPDATE users SET profile_image = ? WHERE id = ?");
                $stmt->execute(['uploads/profiles/' . $fileName, $user['id']]);
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully'
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}
?>
