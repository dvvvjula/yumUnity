<?php
session_start();

// Sprawdzenie czy użytkownik jest zalogowany
function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

// Funkcja do pobierania danych zalogowanego użytkownika
function getCurrentUser() {
    if (isLoggedIn()) {
        return [
            'id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'email' => $_SESSION['email']
        ];
    }
    return null;
}

// Funkcja do wymuszenia logowania (przekierowanie jeśli nie zalogowany)
function requireLogin() {
    if (!isLoggedIn()) {
        header("Location: login.html");
        exit;
    }
}
?>
