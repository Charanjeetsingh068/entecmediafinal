<?php
declare(strict_types=1);

$pageTitle = 'Category Management';
require_once __DIR__ . '/../../includes/header.php';
?>

<div class="page-header">
    <div>
        <h1 class="page-title">Blog Categories</h1>
        <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px;">Manage blog topics and SEO metadata</p>
    </div>
</div>

<div style="display: grid; grid-template-columns: 340px 1fr; gap: 24px; align-items: start;">
    <!-- Add / Edit Category Form Card -->
    <div class="card">
        <h3 id="form-card-title" style="font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 16px;">Add New Category</h3>
        
        <form id="create-cat-form">
            <input type="hidden" id="cat-id" value="">
            
            <div class="form-group">
                <label class="form-label" for="cat-name">Category Name *</label>
                <input type="text" id="cat-name" class="form-input" placeholder="e.g. Artificial Intelligence" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="cat-desc">Description</label>
                <textarea id="cat-desc" rows="3" class="form-textarea" placeholder="Brief category description..."></textarea>
            </div>

            <div class="form-group">
                <label class="form-label" for="cat-meta-title">SEO Meta Title</label>
                <input type="text" id="cat-meta-title" class="form-input" placeholder="Optional SEO title">
            </div>

            <div class="form-group">
                <label class="form-label" for="cat-meta-desc">SEO Meta Description</label>
                <textarea id="cat-meta-desc" rows="2" class="form-textarea" placeholder="Optional SEO snippet"></textarea>
            </div>

            <div style="display: flex; gap: 8px;">
                <button type="button" id="save-cat-btn" onclick="saveCategory()" class="btn-primary" style="flex: 1; text-align: center; justify-content: center;">Create Category</button>
                <button type="button" id="cancel-edit-btn" onclick="cancelEdit()" class="btn-primary" style="background: #334155; display: none;">Cancel</button>
            </div>
        </form>
    </div>

    <!-- Category List Card -->
    <div class="card">
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Category Name</th>
                        <th>Slug</th>
                        <th>Assigned Blogs</th>
                        <th>Status</th>
                        <th style="text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody id="cat-tbody">
                    <tr><td colspan="5" style="text-align: center; padding: 24px; color: #94a3b8;">Loading categories...</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
    let categoryData = [];

    async function loadCategories() {
        const tbody = document.getElementById('cat-tbody');
        try {
            const res = await fetch('../../api/admin/categories/list.php');
            const data = await res.json();
            
            if (!data.success || !data.data.categories || data.data.categories.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 24px; color: #94a3b8;">No categories created yet.</td></tr>';
                categoryData = [];
                return;
            }

            categoryData = data.data.categories;

            tbody.innerHTML = categoryData.map(c => `
                <tr>
                    <td>
                        <strong style="color: #ffffff; font-size: 14.5px;">${escapeHtml(c.name)}</strong>
                        ${c.description ? `<div style="font-size:12px; color:#94a3b8; margin-top:2px;">${escapeHtml(c.description)}</div>` : ''}
                    </td>
                    <td><span style="font-size:12.5px; color:#3b82f6;">/blog/category/${escapeHtml(c.slug)}</span></td>
                    <td><span style="font-size:13px; font-weight:700; color:#ffffff;">${c.total_blogs} blogs</span></td>
                    <td><span class="status-badge ${c.status === 'active' ? 'status-active' : 'status-inactive'}">${c.status}</span></td>
                    <td style="text-align: right;">
                        <div style="display:inline-flex; gap:6px;">
                            <button onclick="editCategory(${c.id})" class="btn-primary" style="font-size:11.5px; padding:5px 10px;">Edit</button>
                            <button onclick="deleteCategory(${c.id}, '${escapeHtml(c.name)}', ${c.total_blogs})" class="btn-danger">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } catch (e) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 24px; color: #fca5a5;">Failed to load categories.</td></tr>';
        }
    }

    function editCategory(id) {
        const cat = categoryData.find(c => parseInt(c.id) === parseInt(id));
        if (!cat) return;

        document.getElementById('cat-id').value = cat.id;
        document.getElementById('cat-name').value = cat.name || '';
        document.getElementById('cat-desc').value = cat.description || '';
        document.getElementById('cat-meta-title').value = cat.meta_title || '';
        document.getElementById('cat-meta-desc').value = cat.meta_description || '';

        document.getElementById('form-card-title').innerText = `Edit Category #${cat.id}`;
        document.getElementById('save-cat-btn').innerText = 'Save Changes';
        document.getElementById('cancel-edit-btn').style.display = 'block';
    }

    function cancelEdit() {
        document.getElementById('create-cat-form').reset();
        document.getElementById('cat-id').value = '';
        document.getElementById('form-card-title').innerText = 'Add New Category';
        document.getElementById('save-cat-btn').innerText = 'Create Category';
        document.getElementById('cancel-edit-btn').style.display = 'none';
    }

    async function saveCategory() {
        const id = document.getElementById('cat-id').value;
        const name = document.getElementById('cat-name').value.trim();
        const description = document.getElementById('cat-desc').value.trim();
        const meta_title = document.getElementById('cat-meta-title').value.trim();
        const meta_description = document.getElementById('cat-meta-desc').value.trim();

        if (!name) { alert('Category name is required.'); return; }

        const isEdit = id !== '';
        const endpoint = isEdit ? '../../api/admin/categories/update.php' : '../../api/admin/categories/create.php';
        
        const payload = {
            name,
            description,
            meta_title,
            meta_description,
            csrf_token: window.CSRF_TOKEN
        };

        if (isEdit) {
            payload.id = parseInt(id);
        }

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                cancelEdit();
                loadCategories();
            } else {
                alert(data.message || 'Failed to save category.');
            }
        } catch (e) {
            alert('Error saving category.');
        }
    }

    async function deleteCategory(id, name, blogCount) {
        if (blogCount > 0) {
            alert(`Cannot delete category "${name}". There are currently ${blogCount} blog post(s) assigned to it. Reassign or delete those blogs first.`);
            return;
        }

        if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

        try {
            const res = await fetch('../../api/admin/categories/delete.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, csrf_token: window.CSRF_TOKEN })
            });

            const data = await res.json();
            if (data.success) {
                loadCategories();
            } else {
                alert(data.message || 'Failed to delete category.');
            }
        } catch (e) {
            alert('Error deleting category.');
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    document.addEventListener('DOMContentLoaded', loadCategories);
</script>

</div>
</body>
</html>
