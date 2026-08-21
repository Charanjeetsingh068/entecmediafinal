<?php
declare(strict_types=1);

$pageTitle = 'Create New Blog Post';
require_once __DIR__ . '/../../includes/header.php';

$pdo = getDBConnection();
$categories = $pdo->query("SELECT id, name FROM categories ORDER BY name ASC")->fetchAll();
$tags = $pdo->query("SELECT id, name FROM tags ORDER BY name ASC")->fetchAll();
?>

<div class="page-header">
    <div>
        <h1 class="page-title">Create New Blog Post</h1>
        <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px;">Compose a rich article with SEO &amp; media assets</p>
    </div>
    <div>
        <a href="index.php" class="btn-primary" style="background: #334155;">← Back to Blogs</a>
    </div>
</div>

<form id="blog-form">
    <div style="display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start;">
        <!-- Left Main Form Column -->
        <div>
            <!-- Basic Details Card -->
            <div class="card">
                <div class="form-group">
                    <label class="form-label" for="title">Article Title *</label>
                    <input type="text" id="title" class="form-input" placeholder="e.g. How Artificial Intelligence Is Changing Business" required onkeyup="autoGenerateSlug()">
                </div>

                <div class="form-group">
                    <label class="form-label" for="slug">URL Slug (Auto-generated or custom) *</label>
                    <input type="text" id="slug" class="form-input" placeholder="how-artificial-intelligence-is-changing-business" required>
                    <span style="font-size: 11.5px; color: #64748b;">Public URL: /blog/<span id="slug-preview">how-artificial-intelligence-is-changing-business</span></span>
                </div>

                <div class="form-group">
                    <label class="form-label" for="excerpt">Short Description / Excerpt</label>
                    <textarea id="excerpt" rows="3" class="form-textarea" placeholder="Brief summary for social shares and listing cards (140-160 characters recommended)..."></textarea>
                </div>
            </div>

            <!-- Rich Content Editor Card -->
            <div class="card">
                <label class="form-label" style="margin-bottom: 12px; display: block;">Article Content *</label>
                
                <!-- Rich Editor Formatting Toolbar -->
                <div style="background: #0f172a; border: 1px solid #475569; border-bottom: none; border-radius: 8px 8px 0 0; padding: 10px; display: flex; gap: 6px; flex-wrap: wrap;">
                    <button type="button" onclick="execCmd('bold')" class="editor-btn" title="Bold"><b>B</b></button>
                    <button type="button" onclick="execCmd('italic')" class="editor-btn" title="Italic"><i>I</i></button>
                    <button type="button" onclick="execCmd('formatBlock', '<h2>')" class="editor-btn">H2</button>
                    <button type="button" onclick="execCmd('formatBlock', '<h3>')" class="editor-btn">H3</button>
                    <button type="button" onclick="execCmd('insertUnorderedList')" class="editor-btn">• Bullet List</button>
                    <button type="button" onclick="execCmd('insertOrderedList')" class="editor-btn">1. Num List</button>
                    <button type="button" onclick="execCmd('formatBlock', '<blockquote>')" class="editor-btn">“ Quote</button>
                    <button type="button" onclick="insertLink()" class="editor-btn">🔗 Link</button>
                    <button type="button" onclick="execCmd('unlink')" class="editor-btn">Unlink</button>
                    <button type="button" onclick="execCmd('removeFormat')" class="editor-btn">Clear Format</button>
                </div>

                <!-- Editable Content Area -->
                <div id="editor" contenteditable="true" style="background: #0f172a; border: 1px solid #475569; border-radius: 0 0 8px 8px; padding: 16px; min-height: 380px; color: #ffffff; font-size: 15px; line-height: 1.6; outline: none; overflow-y: auto;">
                    <p>Start writing your article here...</p>
                </div>
            </div>

            <!-- SEO Settings Card -->
            <div class="card">
                <h3 style="font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 16px;">SEO Metadata Configuration</h3>
                
                <div class="form-group">
                    <label class="form-label" for="meta-title">SEO Meta Title</label>
                    <input type="text" id="meta-title" class="form-input" placeholder="Leave blank to use Article Title">
                </div>

                <div class="form-group">
                    <label class="form-label" for="meta-desc">SEO Meta Description</label>
                    <textarea id="meta-desc" rows="3" class="form-textarea" placeholder="Search engine snippet description (150-160 characters)..."></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label" for="canonical-url">Canonical URL (Optional)</label>
                    <input type="url" id="canonical-url" class="form-input" placeholder="https://entecmedia.com/blog/my-original-post">
                </div>
            </div>
        </div>

        <!-- Right Sidebar Settings Column -->
        <div>
            <!-- Publish Controls Card -->
            <div class="card">
                <h3 style="font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 16px;">Publishing Actions</h3>
                
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select id="status" class="form-select">
                        <option value="draft" selected>Draft (Private)</option>
                        <option value="published">Published (Public)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label" for="author">Author Name</label>
                    <input type="text" id="author" class="form-input" value="Entec Media Team" required>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
                    <button type="button" onclick="submitBlog('draft')" class="btn-primary" style="background: #334155; text-align: center; justify-content: center;">Save as Draft</button>
                    <button type="button" onclick="submitBlog('published')" class="btn-primary" style="text-align: center; justify-content: center;">🚀 Publish Article</button>
                </div>
            </div>

            <!-- Category & Tags Card -->
            <div class="card">
                <h3 style="font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 16px;">Category &amp; Tags</h3>
                
                <div class="form-group">
                    <label class="form-label" for="category">Category *</label>
                    <select id="category" class="form-select" required>
                        <option value="">Select Category...</option>
                        <?php foreach ($categories as $cat): ?>
                            <option value="<?php echo $cat['id']; ?>"><?php echo htmlspecialchars($cat['name']); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Tags</label>
                    <div style="max-height: 180px; overflow-y: auto; background: #0f172a; border: 1px solid #475569; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px;">
                        <?php if (empty($tags)): ?>
                            <span style="font-size: 12px; color: #64748b;">No tags available.</span>
                        <?php else: ?>
                            <?php foreach ($tags as $t): ?>
                                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #cbd5e1; cursor: pointer;">
                                    <input type="checkbox" name="tag_ids" value="<?php echo $t['id']; ?>">
                                    <?php echo htmlspecialchars($t['name']); ?>
                                </label>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Featured Image Upload Card -->
            <div class="card">
                <h3 style="font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 16px;">Featured Image</h3>
                
                <div id="image-preview-box" style="width: 100%; height: 160px; background: #0f172a; border: 2px dashed #475569; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 12px; position: relative;">
                    <span id="upload-placeholder" style="font-size: 12px; color: #94a3b8; text-align: center; padding: 12px;">Click below to upload WebP/JPG/PNG</span>
                    <img id="image-preview" src="" alt="Preview" style="display: none; width: 100%; height: 100%; object-fit: cover;">
                </div>

                <input type="file" id="image-file" accept="image/jpeg,image/png,image/webp" style="display: none;" onchange="uploadImage()">
                <button type="button" onclick="document.getElementById('image-file').click()" class="btn-primary" style="background: #334155; width: 100%; font-size: 13px; text-align: center; justify-content: center;">Choose Image File</button>
                <input type="hidden" id="featured-image-name" value="">

                <div class="form-group" style="margin-top: 16px;">
                    <label class="form-label" for="image-alt">Image Alt Text</label>
                    <input type="text" id="image-alt" class="form-input" placeholder="Descriptive image caption for accessibility">
                </div>
            </div>
        </div>
    </div>
</form>

<style>
    .editor-btn { background: #1e293b; color: #f8fafc; border: 1px solid #334155; border-radius: 4px; padding: 4px 10px; font-size: 12px; cursor: pointer; }
    .editor-btn:hover { background: #3b82f6; border-color: #3b82f6; }
</style>

<script>
    function execCmd(cmd, value = null) {
        document.execCommand(cmd, false, value);
        document.getElementById('editor').focus();
    }

    function insertLink() {
        const url = prompt('Enter destination URL:', 'https://');
        if (url) execCmd('createLink', url);
    }

    function autoGenerateSlug() {
        const title = document.getElementById('title').value;
        const slug = title.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        document.getElementById('slug').value = slug;
        document.getElementById('slug-preview').innerText = slug || 'your-slug';
    }

    document.getElementById('slug').addEventListener('keyup', function() {
        document.getElementById('slug-preview').innerText = this.value || 'your-slug';
    });

    async function uploadImage() {
        const fileInput = document.getElementById('image-file');
        if (!fileInput.files || fileInput.files.length === 0) return;

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('csrf_token', window.CSRF_TOKEN);

        const placeholder = document.getElementById('upload-placeholder');
        placeholder.innerText = 'Uploading image...';

        try {
            const res = await fetch('../../api/admin/media/upload.php', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                document.getElementById('featured-image-name').value = data.data.filename;
                const img = document.getElementById('image-preview');
                img.src = data.data.image_url;
                img.style.display = 'block';
                placeholder.style.display = 'none';
            } else {
                alert(data.message || 'Image upload failed.');
                placeholder.innerText = 'Click below to upload WebP/JPG/PNG';
            }
        } catch (e) {
            alert('Upload request failed.');
            placeholder.innerText = 'Click below to upload WebP/JPG/PNG';
        }
    }

    async function submitBlog(targetStatus) {
        const title = document.getElementById('title').value.trim();
        const slug = document.getElementById('slug').value.trim();
        const categoryId = document.getElementById('category').value;
        const excerpt = document.getElementById('excerpt').value.trim();
        const content = document.getElementById('editor').innerHTML;
        const featuredImage = document.getElementById('featured-image-name').value;
        const featuredImageAlt = document.getElementById('image-alt').value.trim();
        const authorName = document.getElementById('author').value.trim();
        const metaTitle = document.getElementById('meta-title').value.trim();
        const metaDescription = document.getElementById('meta-desc').value.trim();
        const canonicalUrl = document.getElementById('canonical-url').value.trim();

        const selectedTagCheckboxes = document.querySelectorAll('input[name="tag_ids"]:checked');
        const tagIds = Array.from(selectedTagCheckboxes).map(cb => parseInt(cb.value));

        if (!title) { alert('Article title is required.'); return; }
        if (!categoryId) { alert('Please select a category.'); return; }

        const payload = {
            title,
            slug,
            category_id: categoryId,
            excerpt,
            content,
            featured_image: featuredImage,
            featured_image_alt: featuredImageAlt,
            author_name: authorName,
            status: targetStatus,
            meta_title: metaTitle,
            meta_description: metaDescription,
            canonical_url: canonicalUrl,
            tag_ids: tagIds,
            csrf_token: window.CSRF_TOKEN
        };

        try {
            const res = await fetch('../../api/admin/blogs/create.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                alert(`Blog successfully saved as ${targetStatus}!`);
                window.location.href = 'index.php';
            } else {
                alert(data.message || 'Failed to save blog post.');
            }
        } catch (e) {
            alert('Error submitting blog post.');
        }
    }
</script>

</div>
</body>
</html>
