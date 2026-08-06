<?php
/**
 * AuthShield - Database Connection (PDO)
 * Modern, safe MySQL database connector using PHP Data Objects (PDO)
 * with prepared statement enforcement and error handling.
 */

$DB_HOST = getenv('DB_HOST') ?: 'localhost';
$DB_PORT = getenv('DB_PORT') ?: '3306';
$DB_USER = getenv('DB_USER') ?: 'root';
$DB_PASS = getenv('DB_PASS') ?: '';
$DB_NAME = getenv('DB_NAME') ?: 'auth_demo';

$dsn = "mysql:host={$DB_HOST};port={$DB_PORT};dbname={$DB_NAME};charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
} catch (PDOException $e) {
    // If database connection fails, return JSON or die with friendly message
    if (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database Connection Error: ' . $e->getMessage()]);
        exit;
    }
    die("Database Connection Failure: " . htmlspecialchars($e->getMessage()));
}
?>
