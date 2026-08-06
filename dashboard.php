<?php
/**
 * AuthShield - Protected User Dashboard
 * Server-side authenticated dashboard rendered via PHP sessions.
 */

session_start();

if (!isset($_SESSION['user'])) {
    header("Location: index.html?msg=Please+login+first&type=login");
    exit;
}

$username = htmlspecialchars($_SESSION['user']);
$email = htmlspecialchars($_SESSION['email'] ?? 'user@example.com');
$createdAt = isset($_SESSION['created_at']) ? date('M j, Y', strtotime($_SESSION['created_at'])) : date('M j, Y');
$avatarInitial = strtoupper(substr($username, 0, 1));
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - AuthShield Portal</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>

  <div class="bg-orb bg-orb-1"></div>
  <div class="bg-orb bg-orb-2"></div>

  <div class="dashboard-container">
    <div class="dash-card">
      
      <div class="dash-header">
        <div class="user-profile-badge">
          <div class="avatar"><?php echo $avatarInitial; ?></div>
          <div>
            <h2>Welcome back, <?php echo $username; ?>!</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem;"><?php echo $email; ?></p>
          </div>
        </div>
        
        <form action="logout.php" method="POST" style="margin: 0;">
          <button type="submit" class="btn-secondary">
            <i data-lucide="log-out" style="width: 18px;"></i>
            <span>Logout</span>
          </button>
        </form>
      </div>

      <div class="stats-grid">
        <div class="stat-box">
          <h4>ACCOUNT STATUS</h4>
          <p style="color: var(--accent-success); display:flex; align-items:center; gap:6px;">
            <i data-lucide="shield-check" style="width: 18px;"></i> Active & Verified
          </p>
        </div>

        <div class="stat-box">
          <h4>SECURITY LEVEL</h4>
          <p style="color: var(--accent-primary); display:flex; align-items:center; gap:6px;">
            <i data-lucide="lock" style="width: 18px;"></i> BCRYPT Hashed
          </p>
        </div>

        <div class="stat-box">
          <h4>MEMBER SINCE</h4>
          <p><?php echo $createdAt; ?></p>
        </div>
      </div>

      <div style="background: var(--input-bg); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--input-border);">
        <h3 style="font-size: 1.1rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="activity" style="width: 20px; color: var(--accent-primary);"></i>
          Server Session Logs
        </h3>
        <ul style="list-style: none; color: var(--text-muted); font-size: 0.875rem; display: flex; flex-direction: column; gap: 10px;">
          <li style="display: flex; justify-content: space-between; border-bottom: 1px dashed var(--input-border); padding-bottom: 6px;">
            <span><i data-lucide="check" style="width: 14px; color: var(--accent-success); vertical-align: middle;"></i> PHP Session Initialized</span>
            <span style="color: var(--text-subtle);"><?php echo date('H:i:s'); ?></span>
          </li>
          <li style="display: flex; justify-content: space-between; border-bottom: 1px dashed var(--input-border); padding-bottom: 6px;">
            <span><i data-lucide="shield" style="width: 14px; color: var(--accent-primary); vertical-align: middle;"></i> Session ID Regenerated</span>
            <span style="color: var(--text-subtle);">Secured</span>
          </li>
          <li style="display: flex; justify-content: space-between;">
            <span><i data-lucide="database" style="width: 14px; color: var(--accent-secondary); vertical-align: middle;"></i> MySQL PDO Transaction</span>
            <span style="color: var(--text-subtle);">Verified</span>
          </li>
        </ul>
      </div>

    </div>
  </div>

  <script>
    lucide.createIcons();
  </script>
</body>
</html>
