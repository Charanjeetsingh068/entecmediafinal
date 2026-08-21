<?php
declare(strict_types=1);

$pageTitle = 'Dashboard';
require_once __DIR__ . '/../includes/header.php';

$pdo = getDBConnection();

// Fetch Real Statistics from MySQL Database
$totalBlogs = (int)$pdo->query("SELECT COUNT(*) FROM blogs")->fetchColumn();
$publishedBlogs = (int)$pdo->query("SELECT COUNT(*) FROM blogs WHERE status = 'published'")->fetchColumn();
$draftBlogs = (int)$pdo->query("SELECT COUNT(*) FROM blogs WHERE status = 'draft'")->fetchColumn();
$totalCategories = (int)$pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
$totalTags = (int)$pdo->query("SELECT COUNT(*) FROM tags")->fetchColumn();

// Fetch Recently Published Blogs
$recentPublishedStmt = $pdo->query("SELECT b.id, b.title, b.slug, b.author_name, b.published_at, c.name as category_name FROM blogs b LEFT JOIN categories c ON b.category_id = c.id WHERE b.status = 'published' ORDER BY b.published_at DESC LIMIT 5");
$recentPublished = $recentPublishedStmt->fetchAll();

// Fetch Recently Updated Blogs
$recentUpdatedStmt = $pdo->query("SELECT b.id, b.title, b.slug, b.status, b.updated_at, c.name as category_name FROM blogs b LEFT JOIN categories c ON b.category_id = c.id ORDER BY b.updated_at DESC LIMIT 5");
$recentUpdated = $recentUpdatedStmt->fetchAll();
?>

<div class="page-header">
    <div>
        <h1 class="page-title">Dashboard Overview</h1>
        <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px;">Real-time CMS metrics and content activity</p>
    </div>
    <div style="display: flex; gap: 12px;">
        <a href="blogs/create.php" class="btn-primary">✏️ Create New Blog Post</a>
        <a href="categories/index.php" class="btn-primary" style="background: #334155;">📁 Manage Categories</a>
    </div>
</div>

<!-- Real Database Statistics Cards Grid -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px;">
    <div class="card" style="padding: 20px;">
        <span style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Total Blogs</span>
        <h2 style="font-size: 36px; font-weight: 900; color: #ffffff; margin-top: 8px;"><?php echo $totalBlogs; ?></h2>
    </div>

    <div class="card" style="padding: 20px;">
        <span style="font-size: 12px; font-weight: 700; color: #6ee7b7; text-transform: uppercase;">Published</span>
        <h2 style="font-size: 36px; font-weight: 900; color: #10b981; margin-top: 8px;"><?php echo $publishedBlogs; ?></h2>
    </div>

    <div class="card" style="padding: 20px;">
        <span style="font-size: 12px; font-weight: 700; color: #fde68a; text-transform: uppercase;">Drafts</span>
        <h2 style="font-size: 36px; font-weight: 900; color: #f59e0b; margin-top: 8px;"><?php echo $draftBlogs; ?></h2>
    </div>

    <div class="card" style="padding: 20px;">
        <span style="font-size: 12px; font-weight: 700; color: #93c5fd; text-transform: uppercase;">Categories</span>
        <h2 style="font-size: 36px; font-weight: 900; color: #3b82f6; margin-top: 8px;"><?php echo $totalCategories; ?></h2>
    </div>

    <div class="card" style="padding: 20px;">
        <span style="font-size: 12px; font-weight: 700; color: #c084fc; text-transform: uppercase;">Tags</span>
        <h2 style="font-size: 36px; font-weight: 900; color: #a855f7; margin-top: 8px;"><?php echo $totalTags; ?></h2>
    </div>
</div>

<!-- Tables Container -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(480px, 1fr)); gap: 24px;">
    <!-- Recently Published -->
    <div class="card">
        <h3 style="font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 16px;">Recently Published Blogs</h3>
        <?php if (empty($recentPublished)): ?>
            <p style="color: #94a3b8; font-size: 14px;">No published blogs yet.</p>
        <?php else: ?>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recentPublished as $b): ?>
                            <tr>
                                <td>
                                    <a href="blogs/edit.php?id=<?php echo $b['id']; ?>" style="color: #3b82f6; font-weight: 700; text-decoration: none;">
                                        <?php echo htmlspecialchars($b['title']); ?>
                                    </a>
                                </td>
                                <td><span style="color: #94a3b8; font-size: 12.5px;"><?php echo htmlspecialchars($b['category_name'] ?? 'Uncategorized'); ?></span></td>
                                <td style="font-size: 12.5px; color: #64748b;"><?php echo date('M j, Y', strtotime($b['published_at'])); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>

    <!-- Recently Updated -->
    <div class="card">
        <h3 style="font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 16px;">Recently Updated Activity</h3>
        <?php if (empty($recentUpdated)): ?>
            <p style="color: #94a3b8; font-size: 14px;">No activity recorded.</p>
        <?php else: ?>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recentUpdated as $b): ?>
                            <tr>
                                <td>
                                    <a href="blogs/edit.php?id=<?php echo $b['id']; ?>" style="color: #f8fafc; font-weight: 600; text-decoration: none;">
                                        <?php echo htmlspecialchars($b['title']); ?>
                                    </a>
                                </td>
                                <td>
                                    <span class="status-badge <?php echo $b['status'] === 'published' ? 'status-published' : 'status-draft'; ?>">
                                        <?php echo $b['status']; ?>
                                    </span>
                                </td>
                                <td style="font-size: 12.5px; color: #64748b;"><?php echo date('M j, H:i', strtotime($b['updated_at'])); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</div>

</div>
</body>
</html>
