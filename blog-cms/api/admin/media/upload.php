<?php
/**
 * Admin API: Media Upload (Featured Images)
 * POST /api/admin/media/upload.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../../../includes/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed. Use POST.', null, 405);
}

$admin = requireAdminAuth(true);

if (empty($_FILES['file'])) {
    jsonResponse(false, 'No image file uploaded.', null, 400);
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(false, 'Upload error code: ' . $file['error'], null, 400);
}

// Max 5MB file size limit
$maxSizeBytes = 5 * 1024 * 1024;
if ($file['size'] > $maxSizeBytes) {
    jsonResponse(false, 'File size exceeds maximum limit of 5MB.', null, 400);
}

// Allowed File Extensions and MIME Types
$allowedTypes = [
    'image/jpeg' => 'jpg',
    'image/jpg'  => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
];

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);

if (!array_key_exists($mimeType, $allowedTypes)) {
    jsonResponse(false, 'Invalid image format. Allowed formats: JPG, PNG, WebP.', null, 400);
}

$extension = $allowedTypes[$mimeType];
$filename = 'blog-' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.' . $extension;

$uploadDir = __DIR__ . '/../../../uploads/blogs/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$targetPath = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    jsonResponse(false, 'Failed to save uploaded image file server-side.', null, 500);
}

$imageUrl = getFeaturedImageUrl($filename);

jsonResponse(true, 'Image uploaded successfully.', [
    'filename'  => $filename,
    'image_url' => $imageUrl,
]);
