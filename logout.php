<?php
/**
 * AuthShield - Logout Handler
 * Clears PHP sessions, deletes session cookies, and redirects to index.html.
 */

session_start();

// Unset all session variables
$_SESSION = array();

// Destroy session cookie if set
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(), 
        '', 
        time() - 42000,
        $params["path"], 
        $params["domain"],
        $params["secure"], 
        $params["httponly"]
    );
}

// Destroy session
session_destroy();

// Redirect to login index with message
header("Location: index.html?msg=Logged+out+successfully&type=info");
exit;
?>
