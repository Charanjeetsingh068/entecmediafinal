<?php
require_once __DIR__ . '/config.php';

require_admin_auth();

$method = $_SERVER['REQUEST_METHOD'];
$target_dir = __DIR__ . '/../uploads/media/';

if (!is_dir($target_dir)) {
    @mkdir($target_dir, 0755, true);
}

// GET: List all media files in the upload directory
if ($method === 'GET') {
    $files = [];
    if (is_dir($target_dir)) {
        $scanned = scandir($target_dir);
        foreach ($scanned as $f) {
            if ($f === '.' || $f === '..') continue;
            $full_path = $target_dir . $f;
            if (is_file($full_path)) {
                $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
                $files[] = [
                    'filename' => $f,
                    'url'      => '/uploads/media/' . $f,
                    'size'     => filesize($full_path),
                    'ext'      => $ext,
                    'is_image' => in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']),
                    'date'     => filemtime($full_path)
                ];
            }
        }
    }

    // Sort newest first
    usort($files, fn($a, $b) => $b['date'] - $a['date']);
    send_json_response(['success' => true, 'data' => $files]);
}

// DELETE: Delete a specific file
if ($method === 'DELETE') {
    $filename = basename($_GET['file'] ?? '');
    if (empty($filename)) {
        send_json_response(['error' => 'File name is required'], 400);
    }

    $filepath = $target_dir . $filename;
    if (file_exists($filepath)) {
        @unlink($filepath);
        send_json_response(['success' => true, 'message' => 'File deleted successfully']);
    } else {
        send_json_response(['error' => 'File not found'], 404);
    }
}

// POST: Upload a file
if ($method === 'POST') {
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        send_json_response(['error' => 'No file uploaded or upload error occurred.'], 400);
    }

    $file = $_FILES['file'];
    $max_size = 20 * 1024 * 1024; // 20MB limit

    if ($file['size'] > $max_size) {
        send_json_response(['error' => 'File size exceeds maximum allowed size (20MB).'], 400);
    }

    $allowed_mime_types = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'image/gif'  => 'gif',
        'image/svg+xml' => 'svg',
        'application/pdf' => 'pdf',
        'application/msword' => 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx'
    ];

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!array_key_exists($mime, $allowed_mime_types)) {
        send_json_response(['error' => 'Invalid file type. Allowed: JPG, PNG, WEBP, GIF, SVG, PDF, DOC, DOCX'], 400);
    }

    $ext = $allowed_mime_types[$mime];
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
}

send_json_response(['error' => 'Method not allowed'], 405);
