<?php
declare(strict_types=1);

$pageTitle = 'Tag Management';
require_once __DIR__ . '/../../includes/header.php';
?>

<div class="page-header">
    <div>
        <h1 class="page-title">Blog Tags</h1>
        <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px;">Manage article keywords and tags</p>
    </div>
</div>

<div style="display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start;">
    <!-- Add Tag Card -->
    <div class="card">
        <h3 style="font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 16px;">Add New Tag</h3>
        <form id="tag-form">
            <div class="form-group">
                <label class="form-label" for="tag-name">Tag Name *</label>
                <input type="text" id="tag-name" class="form-input" placeholder="e.g. Next.js 16, SEO, React" required>
            </div>
            <button type="button" onclick="createTag()" class="btn-primary" style="width: 100%; text-align: center; justify-content: center;">Create Tag</button>
        </form>
    </div>

    <!-- Tag List Card -->
    <div class="card">
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Tag Name</th>
                        <th>Slug</th>
                        <th>Assigned Blogs</th>
                        <th style="text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody id="tags-tbody">
                    <tr><td colspan="4" style="text-align: center; padding: 24px; color: #94a3b8;">Loading tags...</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
    async function loadTags() {
        const tbody = document.getElementById('tags-tbody');
        try {
            const res = await fetch('../../api/admin/tags/list.php');
            const data = await res.json();

            if (!data.success || !data.data.tags || data.data.tags.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 24px; color: #94a3b8;">No tags created yet.</td></tr>';
                return;
            }

            tbody.innerHTML = data.data.tags.map(t => `
                <tr>
                    <td><strong style="color: #ffffff; font-size: 14px;">🏷️ ${escapeHtml(t.name)}</strong></td>
                    <td><span style="font-size: 12.5px; color: #3b82f6;">${escapeHtml(t.slug)}</span></td>
                    <td><span style="font-size: 13px; font-weight: 700; color: #ffffff;">${t.total_blogs} blogs</span></td>
                    <td style="text-align: right;">
                        <button onclick="deleteTag(${t.id}, '${escapeHtml(t.name)}')" class="btn-danger">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (e) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 24px; color: #fca5a5;">Failed to load tags.</td></tr>';
        }
    }

    async function createTag() {
        const name = document.getElementById('tag-name').value.trim();
        if (!name) { alert('Tag name is required.'); return; }

        try {
            const res = await fetch('../../api/admin/tags/create.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, csrf_token: window.CSRF_TOKEN })
            });

            const data = await res.json();
            if (data.success) {
                document.getElementById('tag-name').value = '';
                loadTags();
            } else {
                alert(data.message || 'Failed to create tag.');
            }
        } catch (e) {
            alert('Error creating tag.');
        }
    }

    async function deleteTag(id, name) {
        if (!confirm(`Are you sure you want to delete tag "${name}"?`)) return;

        try {
            const res = await fetch('../../api/admin/tags/delete.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, csrf_token: window.CSRF_TOKEN })
            });

            const data = await res.json();
            if (data.success) {
                loadTags();
            } else {
                alert(data.message || 'Failed to delete tag.');
            }
        } catch (e) {
            alert('Error deleting tag.');
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    document.addEventListener('DOMContentLoaded', loadTags);
</script>

</div>
</body>
</html>
