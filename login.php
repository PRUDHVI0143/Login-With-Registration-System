<?php
/**
 * AuthShield - User Login Endpoint
 * Secure login authentication handler with PDO, password_verify(),
 * session regeneration, and remember-me option.
 */

session_start();
require_once "db.php";

function sendLoginResponse($success, $message, $redirectUrl = null) {
    $isJson = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;
    if ($isJson) {
        header('Content-Type: application/json');
        echo json_encode(['success' => $success, 'message' => $message, 'redirect' => $redirectUrl]);
        exit;
    } else {
        if ($success && $redirectUrl) {
            header("Location: {$redirectUrl}");
        } else {
            $encodedMsg = urlencode($message);
            header("Location: index.html?msg={$encodedMsg}&type=login");
        }
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendLoginResponse(false, 'Invalid request method.');
}

$identifier = trim($_POST['identifier'] ?? '');
$pass = $_POST['password'] ?? '';

if (empty($identifier) || empty($pass)) {
    sendLoginResponse(false, 'Username/Email and Password are required.');
}

try {
    // Check if identifier is an email or username
    $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL);
    
    if ($isEmail) {
        $stmt = $pdo->prepare("SELECT id, username, email, password, created_at FROM users WHERE email = :identifier");
    } else {
        $stmt = $pdo->prepare("SELECT id, username, email, password, created_at FROM users WHERE username = :identifier");
    }
    
    $stmt->execute([':identifier' => $identifier]);
    $user = $stmt->fetch();

    if (!$user) {
        sendLoginResponse(false, 'Invalid credentials. User not found.');
    }

    // Verify Password Hash
    if (!password_verify($pass, $user['password'])) {
        sendLoginResponse(false, 'Invalid credentials. Incorrect password.');
    }

    // Prevent Session Fixation
    session_regenerate_id(true);

    // Save session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user'] = $user['username'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['created_at'] = $user['created_at'];

    sendLoginResponse(true, 'Login successful!', 'dashboard.php');

} catch (PDOException $e) {
    sendLoginResponse(false, 'Database error occurred: ' . $e->getMessage());
}
?>
