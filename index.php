<?php
// ========================================================
// ENTEC MEDIA - Hostinger Production Router & Fallback
// Guarantees 0% "403 Forbidden" and routes to compiled Next.js export or PHP APIs
// ========================================================

$raw_uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri = parse_url($raw_uri, PHP_URL_PATH);

// 1. Admin Login Redirects
if ($uri === '/login' || $uri === '/adminlogin' || $uri === '/login/' || $uri === '/adminlogin/') {
    header('Location: /admin/');
    exit;
}

// 2. Admin Portal & Assets
if ($uri === '/admin') {
    header('Location: /admin/', true, 301);
    exit;
}

if ($uri === '/admin/' || $uri === '/admin/index.html') {
    if (file_exists(__DIR__ . '/public/admin/index.html')) {
        include __DIR__ . '/public/admin/index.html';
        exit;
    }
    if (file_exists(__DIR__ . '/out/admin/index.html')) {
        include __DIR__ . '/out/admin/index.html';
        exit;
    }
}

if (strpos($uri, '/admin/') === 0) {
    $asset = substr($uri, 7); // e.g. "admin.css", "admin.js"
    $filePath = '';
    if (file_exists(__DIR__ . '/public/admin/' . $asset) && is_file(__DIR__ . '/public/admin/' . $asset)) {
        $filePath = __DIR__ . '/public/admin/' . $asset;
    } elseif (file_exists(__DIR__ . '/out/admin/' . $asset) && is_file(__DIR__ . '/out/admin/' . $asset)) {
        $filePath = __DIR__ . '/out/admin/' . $asset;
    }

    if ($filePath) {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $mimes = [
            'css'   => 'text/css',
            'js'    => 'application/javascript',
            'svg'   => 'image/svg+xml',
            'webp'  => 'image/webp',
            'png'   => 'image/png',
            'jpg'   => 'image/jpeg',
            'jpeg'  => 'image/jpeg',
            'ico'   => 'image/x-icon',
            'json'  => 'application/json',
            'woff2' => 'font/woff2',
            'woff'  => 'font/woff',
        ];
        header('Content-Type: ' . ($mimes[$ext] ?? 'application/octet-stream'));
        readfile($filePath);
        exit;
    }

    // Default SPA fallback within /admin/
    if (file_exists(__DIR__ . '/public/admin/index.html')) {
        include __DIR__ . '/public/admin/index.html';
        exit;
    }
    if (file_exists(__DIR__ . '/out/admin/index.html')) {
        include __DIR__ . '/out/admin/index.html';
        exit;
    }
}

// 2. Direct API Router
if (strpos($uri, '/api/') === 0) {
    $script = substr($uri, 5);
    if (file_exists(__DIR__ . '/public/api/' . $script)) {
        require __DIR__ . '/public/api/' . $script;
        exit;
    }
    if (file_exists(__DIR__ . '/out/api/' . $script)) {
        require __DIR__ . '/out/api/' . $script;
        exit;
    }
}

// 3. Static Next.js Pages
$clean = trim($uri, '/');
if (empty($clean)) {
    if (file_exists(__DIR__ . '/index.html')) {
        include __DIR__ . '/index.html';
        exit;
    }
    if (file_exists(__DIR__ . '/out/index.html')) {
        include __DIR__ . '/out/index.html';
        exit;
    }
    if (file_exists(__DIR__ . '/public/index.html')) {
        include __DIR__ . '/public/index.html';
        exit;
    }
} else {
    // Check directory with index.html
    if (file_exists(__DIR__ . '/out/' . $clean . '/index.html')) {
        include __DIR__ . '/out/' . $clean . '/index.html';
        exit;
    }
    // Check clean html file
    if (file_exists(__DIR__ . '/out/' . $clean . '.html')) {
        include __DIR__ . '/out/' . $clean . '.html';
        exit;
    }
    // Check direct static asset (css, js, images, etc.)
    if (file_exists(__DIR__ . '/out/' . $clean)) {
        $file = __DIR__ . '/out/' . $clean;
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        $mimes = [
            'css'   => 'text/css',
            'js'    => 'application/javascript',
            'svg'   => 'image/svg+xml',
            'webp'  => 'image/webp',
            'png'   => 'image/png',
            'jpg'   => 'image/jpeg',
            'jpeg'  => 'image/jpeg',
            'ico'   => 'image/x-icon',
            'json'  => 'application/json',
            'woff2' => 'font/woff2',
            'woff'  => 'font/woff',
        ];
        header('Content-Type: ' . ($mimes[$ext] ?? 'application/octet-stream'));
        readfile($file);
        exit;
    }
}

// 4. Fallback 404
if (file_exists(__DIR__ . '/out/404.html')) {
    http_response_code(404);
    include __DIR__ . '/out/404.html';
    exit;
}

http_response_code(200);
echo "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Entec Media</title></head><body style='font-family:sans-serif;text-align:center;padding:60px 20px;background:#0b0c16;color:#fff;'><h2>Entec Media is Deploying...</h2><p style='color:#a0a5b8;'>Please refresh this page in a moment.</p></body></html>";
