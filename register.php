<?php
/**
 * AuthShield - User Registration Endpoint
 * Secure user account registration handler with PDO prepared statements,
 * password hashing (BCRYPT), duplicate checks, and validation.
 */

session_start();
require_once "db.php";

// Helper function to send response (JSON or Redirect)
function sendResponse($success, $message, $redirectType = 'register') {
    $isJson = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;
    if ($isJson) {
        header('Content-Type: application/json');
        echo json_encode(['success' => $success, 'message' => $message]);
        exit;
    } else {
        $encodedMsg = urlencode($message);
        header("Location: index.html?msg={$encodedMsg}&type={$redirectType}");
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method.');
}

$username = trim($_POST['username'] ?? '');
$email = trim($_POST['email'] ?? '');
$pass = $_POST['password'] ?? '';
$pass2 = $_POST['password2'] ?? '';

// Validation Checks
if (empty($username) || empty($email) || empty($pass) || empty($pass2)) {
    sendResponse(false, 'All fields are required.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Invalid email format.');
}

if (!preg_match('/^[a-zA-Z0-9_]{3,30}$/', $username)) {
    sendResponse(false, 'Username must be 3-30 characters long (letters, numbers, underscores).');
}

if ($pass !== $pass2) {
    sendResponse(false, 'Passwords do not match.');
}

if (strlen($pass) < 6) {
    sendResponse(false, 'Password must be at least 6 characters long.');
}

try {
    // Check if username or email already exists
    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE username = :username OR email = :email");
    $checkStmt->execute([
        ':username' => $username,
        ':email' => $email
    ]);

    if ($checkStmt->fetch()) {
        sendResponse(false, 'Username or Email is already registered.');
    }

    // Secure Password Hashing
    $hashedPassword = password_hash($pass, PASSWORD_BCRYPT, ['cost' => 12]);

    // Insert user into database
    $insertStmt = $pdo->prepare("INSERT INTO users (username, email, password, created_at) VALUES (:username, :email, :password, NOW())");
    $insertStmt->execute([
        ':username' => $username,
        ':email' => $email,
        ':password' => $hashedPassword
    ]);

    sendResponse(true, 'Registration successful! You can now log in.', 'login');

} catch (PDOException $e) {
    sendResponse(false, 'Database error occurred: ' . $e->getMessage());
}
?>
