# Hostinger Deployment Guide - Dynamic PHP Blog CMS & Next.js Integration

This guide provides step-by-step instructions for deploying the **Dynamic PHP Blog CMS** and connecting it with your **Next.js Website** on Hostinger (or any standard Apache + PHP 8.x + MySQL hosting).

---

## 1. Database Setup (Hostinger MySQL)

1. Log into your **Hostinger hPanel**.
2. Navigate to **Databases** → **MySQL Databases**.
3. Create a new MySQL database:
   - **Database Name**: `u123456789_blog_db` (example)
   - **Username**: `u123456789_blog_user`
   - **Password**: Create a strong password (e.g. `StrongBlogPass2026!`)
4. Open **phpMyAdmin** for your new database.
5. Click **Import** and select the schema SQL file located at:
   `blog-cms/database/schema.sql`
6. Execute the SQL script. This creates all 6 relational tables (`admins`, `categories`, `blogs`, `tags`, `blog_tags`, `blog_views`) with optimized indexes and foreign key constraints.

---

## 2. Seed Initial Admin Account

1. Open `blog-cms/database/seed_admin.php` in your browser or run via SSH CLI:
   ```bash
   php blog-cms/database/seed_admin.php admin@entecmedia.com MySecretPassword2026!
   ```
2. Verify that the admin record is inserted into the `admins` table with a secure `password_hash()`.
3. **IMPORTANT**: For security, delete or restrict access to `seed_admin.php` after initializing your account.

---

## 3. Upload PHP Backend & Admin Panel Files

1. Compress the `/blog-cms/` directory into a `.zip` archive.
2. In Hostinger hPanel, open **File Manager** (`public_html`).
3. Create a folder named `blog-cms` inside `public_html`.
4. Upload and extract your `.zip` file so that your structure looks like:
   ```
   public_html/
     ├── blog-cms/
     │    ├── api/
     │    ├── admin/
     │    ├── config/
     │    ├── database/
     │    ├── includes/
     │    ├── uploads/
     │    │    └── blogs/
     │    └── .htaccess
   ```

---

## 4. Database & URL Configuration

Edit `public_html/blog-cms/config/database.php`:

```php
define('DB_HOST', 'localhost'); // Usually localhost on Hostinger
define('DB_PORT', '3306');
define('DB_NAME', 'u123456789_blog_db');
define('DB_USER', 'u123456789_blog_user');
define('DB_PASS', 'StrongBlogPass2026!');

define('SITE_URL', 'https://yourdomain.com');
define('API_BASE_URL', 'https://yourdomain.com/blog-cms/api');
define('UPLOADS_BASE_URL', 'https://yourdomain.com/blog-cms/uploads/blogs');
```

---

## 5. File Permissions & Security Verification

1. Set directory permission for `blog-cms/uploads/blogs/` to `755` (Read/Write for owner, Read for public).
2. Ensure `blog-cms/uploads/.htaccess` is present to prevent PHP execution inside the media uploads folder.

---

## 6. Next.js Environment Configuration & Build

1. In your local or deployment environment, edit `.env.local` (or Hostinger Environment Variables):
   ```env
   NEXT_PUBLIC_BLOG_API_URL=https://yourdomain.com/blog-cms/api
   ```
2. Build the production bundle:
   ```bash
   npm run build
   ```
3. Deploy your Next.js application to Hostinger Node.js Web App runner, Vercel, or static exporter.

---

## 7. Operational Workflow Test

1. Navigate to: `https://yourdomain.com/blog-cms/admin/login.php`
2. Log in with your admin credentials.
3. Go to **Categories** → Create a category (e.g. `Technology`).
4. Go to **Blogs** → **Create New Blog Post**:
   - Title: `How Artificial Intelligence Is Changing Business`
   - Upload a featured WebP image.
   - Select status: **Draft**.
   - Click **Save as Draft** and verify that it does NOT appear on `https://yourdomain.com/blog`.
   - Change status to **Published** and click **Publish Article**.
5. Visit `https://yourdomain.com/blog`:
   - Verify the published article appears dynamically.
   - Click the article to open `https://yourdomain.com/blog/how-artificial-intelligence-is-changing-business`.
   - Verify SEO tags, JSON-LD structured data, category filter, search, and related articles.
