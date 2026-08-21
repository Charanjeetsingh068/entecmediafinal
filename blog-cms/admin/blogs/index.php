<?php
declare(strict_types=1);

$pageTitle = 'Blog Posts Management';
require_once __DIR__ . '/../../includes/header.php';

$pdo = getDBConnection();
$categoriesStmt = $pdo->query("SELECT id, name FROM categories ORDER BY name ASC");
$categories = $categoriesStmt->fetchAll();
?>

<div class="page-header">
    <div>
        <h1 class="page-title">Blog Posts</h1>
        <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px;">Manage draft &amp; published blogs</p>
    </div>
    <div>
        <a href="create.php" class="btn-primary">➕ Create New Blog Post</a>
    </div>
</div>

<!-- Filters Bar -->
<div class="card" style="padding: 16px 24px; margin-bottom: 24px;">
    <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <input type="text" id="search-input" placeholder="Search by title, author..." class="form-input" style="max-width: 280px;" onkeyup="handleSearch(event)">
        
        <select id="status-filter" class="form-select" style="max-width: 180px;" onchange="loadBlogs()">
            <option value="">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
        </select>

        <select id="category-filter" class="form-select" style="max-width: 200px;" onchange="loadBlogs()">
            <option value="0">All Categories</option>
            <?php foreach ($categories as $cat): ?>
                <option value="<?php echo $cat['id']; ?>"><?php echo htmlspecialchars($cat['name']); ?></option>
            <?php endforeach; ?>
        </select>

        <button onclick="loadBlogs()" class="btn-primary" style="padding: 10px 16px;">Refresh</button>
    </div>
</div>

<!-- Table Card -->
<div class="card">
    <div class="table-responsive">
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 70px;">Image</th>
                    <th>Title &amp; Slug</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Published</th>
                    <th style="text-align: right;">Actions</th>
                </tr>
            </thead>
            <tbody id="blogs-tbody">
                <tr>
                    <td colspan="7" style="text-align: center; color: #94a3b8; padding: 32px;">Loading blogs from database...</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div id="pagination-controls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color);">
        <span id="page-info" style="font-size: 13px; color: #94a3b8;">Page 1 of 1</span>
        <div style="display: flex; gap: 8px;">
            <button id="prev-btn" onclick="changePage(-1)" class="btn-primary" style="background: #334155; padding: 6px 14px; font-size: 13px;" disabled>Previous</button>
            <button id="next-btn" onclick="changePage(1)" class="btn-primary" style="background: #334155; padding: 6px 14px; font-size: 13px;" disabled>Next</button>
        </div>
    </div>
</div>

<script>
    let currentPage = 1;

    async function loadBlogs() {
        const search = document.getElementById('search-input').value.trim();
        const status = document.getElementById('status-filter').value;
        const categoryId = document.getElementById('category-filter').value;
        const tbody = document.getElementById('blogs-tbody');

        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:32px; color:#94a3b8;">Fetching records...</td></tr>';

        try {
            const url = `../../api/admin/blogs/list.php?page=${currentPage}&status=${status}&category_id=${categoryId}&search=${encodeURIComponent(search)}`;
            const res = await fetch(url);
            const data = await res.json();

            if (!data.success || !data.data.blogs || data.data.blogs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:32px; color:#94a3b8;">No blogs found matching filters.</td></tr>';
                document.getElementById('page-info').innerText = '0 Results';
                document.getElementById('prev-btn').disabled = true;
                document.getElementById('next-btn').disabled = true;
                return;
            }

            const blogs = data.data.blogs;
            const pagination = data.data.pagination;

            tbody.innerHTML = blogs.map(b => {
                const img = b.featured_image_url 
                    ? `<img src="${b.featured_image_url}" alt="${b.title}" style="width:48px; height:36px; object-fit:cover; border-radius:6px;">`
                    : `<div style="width:48px; height:36px; background:#334155; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:10px; color:#94a3b8;">No img</div>`;

                const statusClass = b.status === 'published' ? 'status-published' : 'status-draft';
                const pubDate = b.published_at ? new Date(b.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not Published';

                return `
                    <tr>
                        <td>${img}</td>
                        <td>
                            <strong style="color:#ffffff; font-size:14.5px;">${escapeHtml(b.title)}</strong>
                            <div style="font-size:11.5px; color:#64748b; margin-top:2px;">/blog/${escapeHtml(b.slug)}</div>
                        </td>
                        <td><span style="font-size:13px; color:#cbd5e1;">${escapeHtml(b.category_name || 'Uncategorized')}</span></td>
                        <td><span style="font-size:13px; color:#94a3b8;">${escapeHtml(b.author_name)}</span></td>
                        <td><span class="status-badge ${statusClass}">${b.status}</span></td>
                        <td><span style="font-size:12.5px; color:#94a3b8;">${pubDate}</span></td>
                        <td style="text-align:right;">
                            <div style="display:inline-flex; gap:6px;">
                                <button onclick="togglePublish(${b.id})" class="btn-primary" style="background:#334155; font-size:11.5px; padding:5px 10px;">
                                    ${b.status === 'published' ? 'Unpublish' : 'Publish'}
                                </button>
                                <a href="edit.php?id=${b.id}" class="btn-primary" style="font-size:11.5px; padding:5px 10px;">Edit</a>
                                <button onclick="deleteBlog(${b.id})" class="btn-danger">Delete</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');

            document.getElementById('page-info').innerText = `Page ${pagination.current_page} of ${pagination.total_pages} (${pagination.total} Total Posts)`;
            document.getElementById('prev-btn').disabled = pagination.current_page <= 1;
            document.getElementById('next-btn').disabled = pagination.current_page >= pagination.total_pages;

        } catch (e) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:32px; color:#fca5a5;">Failed to load blogs. Please check API server connection.</td></tr>';
        }
    }

    function handleSearch(e) {
        if (e.key === 'Enter' || e.target.value.length === 0) {
            currentPage = 1;
            loadBlogs();
        }
    }

    function changePage(delta) {
        currentPage += delta;
        loadBlogs();
    }

    async function togglePublish(id) {
        try {
            const res = await fetch('../../api/admin/blogs/publish.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, csrf_token: window.CSRF_TOKEN })
            });
            const data = await res.json();
            if (data.success) {
                loadBlogs();
            } else {
                alert(data.message || 'Failed to update publish status.');
            }
        } catch (e) {
            alert('Error connecting to API.');
        }
    }

    async function deleteBlog(id) {
        if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) return;
        try {
            const res = await fetch('../../api/admin/blogs/delete.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, csrf_token: window.CSRF_TOKEN })
            });
            const data = await res.json();
            if (data.success) {
                loadBlogs();
            } else {
                alert(data.message || 'Failed to delete blog.');
            }
        } catch (e) {
            alert('Error deleting blog.');
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    document.addEventListener('DOMContentLoaded', loadBlogs);
</script>

</div>
</body>
</html>
