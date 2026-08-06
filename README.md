# 🛡️ AuthShield - Modern Login & Registration System

![Version](https://img.shields.io/badge/version-2.0.0-indigo.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PHP](https://img.shields.io/badge/PHP-8.0%2B-777BB4.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-4479A1.svg)
![UI](https://img.shields.io/badge/Design-Glassmorphism-pink.svg)

A state-of-the-art, secure **Login and Registration System** featuring a modern glassmorphism UI, dual execution engines (Client-Side LocalStorage Preview & PHP/PDO MySQL Backend), real-time validation, live password strength meter, session management, and BCRYPT password hashing.

---

## ✨ Features

- 🎨 **Modern Glassmorphism UI**: Built with custom CSS variables, floating blur background orbs, sleek micro-interactions, dark/light theme toggle, and Google Fonts (*Inter*).
- ⚡ **Dual Execution Engine**:
  - **Client Storage Mode (Demo)**: Instant interactive preview running in any browser using `localStorage` (no PHP/MySQL installation needed).
  - **PHP & MySQL Mode**: Full server-side production backend with PDO prepared statements and session protection.
- 🔒 **Enterprise-Grade Security**:
  - **BCRYPT Hashing**: Passwords stored safely using PHP `password_hash()` and `password_verify()`.
  - **SQL Injection Defense**: 100% prepared PDO statements with parameterized bindings.
  - **Session Protection**: Automatic session ID regeneration (`session_regenerate_id(true)`) to prevent session fixation.
  - **XSS Sanitization**: Input validation and output encoding (`htmlspecialchars`).
- 🔑 **Smart Authentication**:
  - Support login via **Username** or **Email**.
  - Interactive password visibility toggle (Eye icon).
  - Real-time password strength meter (Weak / Medium / Strong).
  - Toast notification system for user feedback.
  - Remember Me functionality.
- 📊 **User Dashboard**: Dedicated post-login portal with avatar generation, account stats, and session activity logs.

---

## 📁 Repository Structure

```text
Login-With-Registration-System/
├── index.html         # Main Authentication Portal (Login / Register Tabs)
├── style.css          # Modern Glassmorphism & UI Design System
├── script.js           # Client-side Validation, Animations & LocalStorage Engine
├── dashboard.html     # Client-Side Demo Dashboard (Static Mode)
├── dashboard.php      # PHP Authenticated User Dashboard (Server Mode)
├── db.php             # Secure PDO Database Connection
├── register.php       # PHP Backend Account Registration Endpoint
├── login.php          # PHP Backend User Authentication Endpoint
├── logout.php         # PHP Session Destruction & Cookie Handler
└── schema.sql         # MySQL Database Creation & Seed Data Script
```

---

## 🚀 Quick Start Guide

### Option A: Instant Client Preview (No PHP Required)

1. Double-click or open `index.html` in any web browser.
2. Click **Create Account** to register a new user, or use the pre-seeded demo user:
   - **Username**: `demo`
   - **Password**: `password123`
3. Enjoy full interactive authentication and dashboard experience saved to your browser's local storage.

---

### Option B: PHP & MySQL Local Server (XAMPP / WAMP / Docker)

#### 1. Setup Database
1. Open your MySQL interface (e.g. phpMyAdmin or MySQL CLI).
2. Execute the `schema.sql` script to create database and tables:
   ```bash
   mysql -u root -p < schema.sql
   ```

#### 2. Configure Connection (`db.php`)
Verify database credentials in `db.php`:
```php
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'auth_demo';
```

#### 3. Run Development Server
Start PHP built-in web server in the project directory:
```bash
php -S localhost:8000
```
Open `http://localhost:8000` in your web browser.

---

## 🔌 API Endpoints Reference

| Endpoint | Method | Input Parameters | Response / Behavior |
| :--- | :--- | :--- | :--- |
| `register.php` | `POST` | `username`, `email`, `password`, `password2` | Hashes password, inserts user into database, redirects or returns JSON |
| `login.php` | `POST` | `identifier` (username/email), `password` | Validates hash, starts `$_SESSION`, redirects to `dashboard.php` |
| `logout.php` | `POST`/`GET` | None | Destroys session, deletes session cookie, redirects to `index.html` |
| `db.php` | Included | Credentials env / variables | Establishes PDO connection with error mode set to exception |

---

## 🔐 Database Schema (`schema.sql`)

```sql
CREATE DATABASE IF NOT EXISTS auth_demo;
USE auth_demo;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🛠️ Built With

- **HTML5 & CSS3**: Semantic elements, CSS Custom Properties, Glassmorphism backdrop-filters, CSS Grid/Flexbox.
- **JavaScript (ES6+)**: Async/Fetch API, DOM manipulation, Lucide Icons, LocalStorage API.
- **PHP 8+**: PDO database handling, Session control, Password Hashing API.
- **MySQL**: Relational database storage with indexed unique keys.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
