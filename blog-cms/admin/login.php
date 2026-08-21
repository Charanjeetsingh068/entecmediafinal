<?php
declare(strict_types=1);
require_once __DIR__ . '/../includes/auth.php';
startAdminSession();

// If already logged in, redirect to dashboard
if (!empty($_SESSION['admin_logged_in']) && !empty($_SESSION['admin_id'])) {
    header('Location: dashboard.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Entec Media Blog CMS</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
        body { background-color: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
        .login-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; width: 100%; max-width: 420px; padding: 40px 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .login-header { text-align: center; margin-bottom: 32px; }
        .login-title { font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 8px; }
        .login-subtitle { font-size: 14px; color: #94a3b8; }
        .form-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
        .form-label { font-size: 13px; font-weight: 600; color: #cbd5e1; }
        .form-input { background: #0f172a; border: 1px solid #475569; border-radius: 8px; padding: 12px 16px; font-size: 14px; color: #ffffff; outline: none; transition: border-color 0.2s; }
        .form-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }
        .btn-submit { background: #2563eb; color: #ffffff; font-weight: 700; font-size: 14px; padding: 14px; border: none; border-radius: 8px; cursor: pointer; transition: background 0.2s; margin-top: 10px; }
        .btn-submit:hover { background: #1d4ed8; }
        .alert { padding: 12px 16px; border-radius: 8px; font-size: 13.5px; margin-bottom: 20px; display: none; }
        .alert-error { background: #450a0a; color: #fca5a5; border: 1px solid #991b1b; }
        .alert-info { background: #1e3a8a; color: #93c5fd; border: 1px solid #1d4ed8; display: block; }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="login-header">
            <h1 class="login-title">Entec Media Admin</h1>
            <p class="login-subtitle">Sign in to manage dynamic Blog CMS</p>
        </div>

        <?php if (isset($_GET['error']) && $_GET['error'] === 'expired'): ?>
            <div class="alert alert-info">Session expired. Please log in again.</div>
        <?php endif; ?>

        <div id="alert-box" class="alert alert-error"></div>

        <form id="login-form">
            <div class="form-group">
                <label class="form-label" for="email">Admin Email Address</label>
                <input type="email" id="email" class="form-input" placeholder="admin@entecmedia.com" required autocomplete="email">
            </div>

            <div class="form-group">
                <label class="form-label" for="password">Password</label>
                <input type="password" id="password" class="form-input" placeholder="••••••••••••" required autocomplete="current-password">
            </div>

            <button type="submit" id="submit-btn" class="btn-submit">Sign In to Dashboard</button>
        </form>
    </div>

    <script>
        document.getElementById('login-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const alertBox = document.getElementById('alert-box');
            const submitBtn = document.getElementById('submit-btn');

            alertBox.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.innerText = 'Authenticating...';

            try {
                const res = await fetch('../api/admin/auth/login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (data.success) {
                    if (data.data && data.data.csrf_token) {
                        sessionStorage.setItem('csrf_token', data.data.csrf_token);
                    }
                    window.location.href = 'dashboard.php';
                } else {
                    alertBox.innerText = data.message || 'Invalid login credentials.';
                    alertBox.style.display = 'block';
                }
            } catch (err) {
                alertBox.innerText = 'Server error or network failure. Please try again.';
                alertBox.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Sign In to Dashboard';
            }
        });
    </script>
</body>
</html>
