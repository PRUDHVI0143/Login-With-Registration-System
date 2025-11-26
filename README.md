# Login-With-Registration-System
A simple Login and Registration System using HTML, CSS, JS, PHP, and MySQL. Users can create accounts, store credentials securely with hashed passwords, and log in using email or username. PHP handles validation, sessions, and authentication, while MySQL stores user data.
======================
FILE: db.php
======================
<?php
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'auth_demo';

$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

if ($mysqli->connect_errno) {
    die("Database connection failed: " . $mysqli->connect_error);
}
?>

======================
FILE: index.html
======================
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login/Register</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">
  <div class="card">
    <div class="tabs">
      <button id="loginTab" class="active">Login</button>
      <button id="registerTab">Register</button>
    </div>

    <!-- LOGIN -->
    <form id="loginForm" action="login.php" method="POST">
      <h2>Login</h2>
      <input type="text" name="identifier" placeholder="Username or Email" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Login</button>
      <p id="loginMessage"></p>
    </form>

    <!-- REGISTER -->
    <form id="registerForm" action="register.php" method="POST" style="display:none">
      <h2>Register</h2>
      <input type="text" name="username" placeholder="Username" required>
      <input type="email" name="email" placeholder="Email" required>
      <input type="password" name="password" placeholder="Password" required>
      <input type="password" name="password2" placeholder="Confirm Password" required>
      <button type="submit">Register</button>
      <p id="registerMessage"></p>
    </form>

  </div>
</div>

<script src="script.js"></script>
</body>
</html>

======================
FILE: style.css
======================
body {
  font-family: Arial;
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: #e9eef5;
}
.container {
  width: 350px;
}
.card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,.1);
}
.tabs { display: flex; }
.tabs button {
  flex: 1;
  padding: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background: #ddd;
}
.tabs .active {
  background: #3b82f6;
  color: white;
}
form { display: flex; flex-direction: column; }
form input {
  padding: 10px;
  margin: 7px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
}
form button {
  margin-top: 10px;
  padding: 10px;
  background: #3b82f6;
  border: none;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}
p { text-align: center; color: red; height: 18px; }

======================
FILE: script.js
======================
let loginTab = document.getElementById("loginTab");
let registerTab = document.getElementById("registerTab");
let loginForm = document.getElementById("loginForm");
let registerForm = document.getElementById("registerForm");

loginTab.onclick = () => {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginForm.style.display = "block";
  registerForm.style.display = "none";
};

registerTab.onclick = () => {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  registerForm.style.display = "block";
  loginForm.style.display = "none";
};

======================
FILE: register.php
======================
<?php
session_start();
require "db.php";

$username = $_POST["username"];
$email = $_POST["email"];
$pass = $_POST["password"];
$pass2 = $_POST["password2"];

if ($pass !== $pass2) {
  header("Location: index.html?msg=Passwords do not match&type=register");
  exit;
}

$check = $mysqli->prepare("SELECT id FROM users WHERE username=? OR email=?");
$check->bind_param("ss", $username, $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
  header("Location: index.html?msg=User already exists&type=register");
  exit;
}
$check->close();

$hashed = password_hash($pass, PASSWORD_DEFAULT);

$insert = $mysqli->prepare("INSERT INTO users(username,email,password) VALUES(?,?,?)");
$insert->bind_param("sss", $username, $email, $hashed);
$insert->execute();

header("Location: index.html?msg=Registered successfully! Login now&type=login");
exit;

?>

======================
FILE: login.php
======================
<?php
session_start();
require "db.php";

$id = $_POST["identifier"];
$pass = $_POST["password"];

if (filter_var($id, FILTER_VALIDATE_EMAIL)) {
  $stmt = $mysqli->prepare("SELECT id, username, password FROM users WHERE email=?");
} else {
  $stmt = $mysqli->prepare("SELECT id, username, password FROM users WHERE username=?");
}
$stmt->bind_param("s", $id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
  header("Location: index.html?msg=User not found&type=login");
  exit;
}

$user = $res->fetch_assoc();

if (!password_verify($pass, $user["password"])) {
  header("Location: index.html?msg=Wrong password&type=login");
  exit;
}

$_SESSION["user"] = $user["username"];
header("Location: dashboard.php");
exit;

?>

======================
FILE: dashboard.php
======================
<?php
session_start();
if (!isset($_SESSION["user"])) {
  header("Location: index.html");
  exit;
}
?>
<!DOCTYPE html>
<html>
<head>
<title>Dashboard</title>
<style>
body { font-family: Arial; background:#eef2f7; padding:40px; }
.card {
  padding: 20px; background:white; border-radius:10px;
  max-width: 400px; margin:auto; text-align:center;
  box-shadow: 0 5px 12px rgba(0,0,0,.1);
}
button {
  padding:10px 15px; background:#3b82f6; color:white;
  border:none; border-radius:5px; cursor:pointer;
}
</style>
</head>
<body>

<div class="card">
  <h2>Welcome, <?php echo $_SESSION["user"]; ?>!</h2>
  <p>You are logged in.</p>
  <form action="logout.php" method="POST">
    <button type="submit">Logout</button>
  </form>
</div>

</body>
</html>

======================
FILE: logout.php
======================
<?php
session_start();
session_destroy();
header("Location: index.html");
exit;
?>

======================
SQL (Create Database)
======================
CREATE DATABASE auth_demo;
USE auth_demo;

CREATE TABLE users(
 id INT AUTO_INCREMENT PRIMARY KEY,
 username VARCHAR(50) UNIQUE,
 email VARCHAR(100) UNIQUE,
 password VARCHAR(255)
);

