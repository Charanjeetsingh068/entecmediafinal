<?php
require_once __DIR__ . '/config.php';

// Only Admin can upload general media assets
require_admin_auth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response(['error' => 'Method not allowed'], 405);
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    send_json_response(['error' => 'No file uploaded or upload error occurred.'], 400);
}

$file = $_FILES['file'];
$max_size = 15 * 1024 * 1024; // 15MB limit

if ($file['size'] > $max_size) {
    send_json_response(['error' => 'File size exceeds maximum allowed size (15MB).'], 400);
}

$allowed_mime_types = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
    'image/svg+xml' => 'svg',
    'application/pdf' => 'pdf'
];

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!array_key_exists($mime, $allowed_mime_types)) {
    send_json_response(['error' => 'Invalid file type. Allowed: JPG, PNG, WEBP, GIF, SVG, PDF'], 400);
}

$ext = $allowed_mime_types[$mime];
$target_dir = __DIR__ . '/../uploads/media/';
if (!is_dir($target_dir)) {
    mkdir($target_dir, 0755, true);
}

$filename = 'media_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$target_file = $target_dir . $filename;

if (move_uploaded_file($file['tmp_name'], $target_file)) {
    $url = '/uploads/media/' . $filename;
    send_json_response([
        'success'  => true,
        'message'  => 'File uploaded successfully',
        'url'      => $url,
        'filename' => $filename,
        'size'     => $file['size']
    ]);
} else {
    send_json_response(['error' => 'Failed to save uploaded file.'], 500);
}
