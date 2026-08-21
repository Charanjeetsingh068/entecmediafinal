<?php
/**
 * Shared Admin Navigation Header Component
 */
declare(strict_types=1);

require_once __DIR__ . '/auth.php';
$adminUser = requireAdminAuth(false);
$csrfToken = generateCSRFToken();

$currentScript = basename($_SERVER['SCRIPT_NAME']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($pageTitle ?? 'Admin CMS'); ?> - Entec Media</title>
    <style>
        :root { --bg-dark: #0f172a; --bg-card: #1e293b; --border-color: #334155; --text-main: #f8fafc; --text-muted: #94a3b8; --accent: #2563eb; --accent-hover: #1d4ed8; }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
        body { background-color: var(--bg-dark); color: var(--text-main); min-height: 100vh; display: flex; flex-direction: column; }
        
        .admin-nav { background: var(--bg-card); border-bottom: 1px solid var(--border-color); padding: 0 24px; }
        .nav-wrapper { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 64px; }
        .brand-logo { font-size: 18px; font-weight: 800; color: #ffffff; text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .brand-badge { font-size: 10px; font-weight: 800; background: var(--accent); color: #fff; padding: 2px 8px; border-radius: 99px; text-transform: uppercase; }
        
        .menu-items { display: flex; align-items: center; gap: 20px; list-style: none; }
        .menu-link { color: var(--text-muted); text-decoration: none; font-size: 14px; font-weight: 600; padding: 8px 12px; border-radius: 6px; transition: all 0.2s; }
        .menu-link:hover, .menu-link.active { color: #ffffff; background: rgba(255,255,255,0.06); }
        
        .user-meta { display: flex; align-items: center; gap: 16px; }
        .user-name { font-size: 13.5px; color: var(--text-muted); font-weight: 500; }
        .btn-logout { background: #334155; color: #ffffff; font-size: 12px; font-weight: 700; padding: 6px 14px; border: none; border-radius: 6px; cursor: pointer; transition: background 0.2s; }
        .btn-logout:hover { background: #dc2626; }
        
        .admin-container { max-width: 1280px; margin: 32px auto; padding: 0 24px; flex: 1; width: 100%; }
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
        .page-title { font-size: 24px; font-weight: 800; color: #ffffff; }
        
        .btn-primary { background: var(--accent); color: #ffffff; font-size: 14px; font-weight: 700; padding: 10px 20px; border-radius: 8px; text-decoration: none; border: none; cursor: pointer; transition: background 0.2s; display: inline-flex; align-items: center; gap: 6px; }
        .btn-primary:hover { background: var(--accent-hover); }
        .btn-danger { background: #dc2626; color: #ffffff; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; }
        .btn-danger:hover { background: #b91c1c; }

        .card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px; margin-bottom: 24px; }
        
        /* Form & Inputs */
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .form-label { font-size: 13px; font-weight: 700; color: #cbd5e1; }
        .form-input, .form-select, .form-textarea { background: #0f172a; border: 1px solid #475569; border-radius: 8px; padding: 12px 16px; font-size: 14px; color: #ffffff; outline: none; width: 100%; }
        .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2); }
        
        /* Table Styles */
        .table-responsive { width: 100%; overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { background: #0f172a; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; padding: 14px 16px; border-bottom: 1px solid var(--border-color); }
        .data-table td { padding: 16px; border-bottom: 1px solid var(--border-color); font-size: 14px; color: #e2e8f0; vertical-align: middle; }
        .data-table tr:hover td { background: rgba(255,255,255,0.02); }
        
        .status-badge { font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 99px; text-transform: uppercase; }
        .status-published { background: #065f46; color: #6ee7b7; }
        .status-draft { background: #78350f; color: #fde68a; }
        .status-active { background: #065f46; color: #6ee7b7; }
        .status-inactive { background: #450a0a; color: #fca5a5; }

        @media (max-width: 768px) {
            .nav-wrapper { flex-direction: column; height: auto; padding: 16px 0; gap: 16px; }
            .form-grid { grid-template-columns: 1fr; }
        }
    </style>
    <script>
        window.CSRF_TOKEN = "<?php echo htmlspecialchars($csrfToken); ?>";
    </script>
</head>
<body>
    <nav class="admin-nav">
        <div class="nav-wrapper">
            <a href="<?php echo SITE_URL; ?>/blog-cms/admin/dashboard.php" class="brand-logo">
                Entec Media <span class="brand-badge">CMS ADMIN</span>
            </a>

            <ul class="menu-items">
                <li><a href="<?php echo SITE_URL; ?>/blog-cms/admin/dashboard.php" class="menu-link <?php echo $currentScript === 'dashboard.php' ? 'active' : ''; ?>">Dashboard</a></li>
                <li><a href="<?php echo SITE_URL; ?>/blog-cms/admin/blogs/index.php" class="menu-link <?php echo strpos($_SERVER['REQUEST_URI'], '/blogs/') !== false ? 'active' : ''; ?>">Blogs</a></li>
                <li><a href="<?php echo SITE_URL; ?>/blog-cms/admin/categories/index.php" class="menu-link <?php echo strpos($_SERVER['REQUEST_URI'], '/categories/') !== false ? 'active' : ''; ?>">Categories</a></li>
                <li><a href="<?php echo SITE_URL; ?>/blog-cms/admin/tags/index.php" class="menu-link <?php echo strpos($_SERVER['REQUEST_URI'], '/tags/') !== false ? 'active' : ''; ?>">Tags</a></li>
            </ul>

            <div class="user-meta">
                <span class="user-name">👤 <?php echo htmlspecialchars($adminUser['name']); ?></span>
                <button onclick="logoutAdmin()" class="btn-logout">Logout</button>
            </div>
        </div>
    </nav>

    <div class="admin-container">
    <script>
        async function logoutAdmin() {
            if (!confirm('Are you sure you want to log out?')) return;
            try {
                await fetch('<?php echo SITE_URL; ?>/blog-cms/api/admin/auth/logout.php', { method: 'POST' });
                window.location.href = '<?php echo SITE_URL; ?>/blog-cms/admin/login.php';
            } catch (e) {
                window.location.href = '<?php echo SITE_URL; ?>/blog-cms/admin/login.php';
            }
        }
    </script>
