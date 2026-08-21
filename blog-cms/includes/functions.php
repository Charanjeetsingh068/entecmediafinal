<?php
/**
 * Entec Media Blog CMS - Core Utility Functions
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

/**
 * Output consistent JSON response and terminate script
 */
function jsonResponse(bool $success, string $message, $data = null, int $statusCode = 200, array $extraProps = []): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');

    // Configure CORS for public API
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit;
    }

    $response = array_merge([
        'success' => $success,
        'message' => $message,
        'data'    => $data,
    ], $extraProps);

    echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Converts input text to a URL-safe lowercase slug.
 */
function generateSlug(string $text): string
{
    // Convert to lowercase & replace special characters
    $text = mb_strtolower(trim($text), 'UTF-8');
    $text = preg_replace('/[^\p{L}\p{N}\s-]/u', '', $text);
    $text = preg_replace('/[\s-]+/', '-', $text);
    $text = trim($text, '-');

    return $text !== '' ? $text : 'post-' . time();
}

/**
 * Generates a unique slug for a given table (e.g. blogs or categories).
 */
function makeUniqueSlug(PDO $pdo, string $table, string $title, ?int $excludeId = null): string
{
    $baseSlug = generateSlug($title);
    $slug = $baseSlug;
    $counter = 2;

    while (true) {
        if ($excludeId !== null) {
            $stmt = $pdo->prepare("SELECT id FROM `{$table}` WHERE `slug` = :slug AND `id` != :id LIMIT 1");
            $stmt->execute([':slug' => $slug, ':id' => $excludeId]);
        } else {
            $stmt = $pdo->prepare("SELECT id FROM `{$table}` WHERE `slug` = :slug LIMIT 1");
            $stmt->execute([':slug' => $slug]);
        }

        if (!$stmt->fetch()) {
            return $slug;
        }

        $slug = $baseSlug . '-' . $counter;
        $counter++;
    }
}

/**
 * Sanitizes rich text editor HTML to prevent XSS, script injection, and unsafe event handlers.
 */
function sanitizeHTML(string $html): string
{
    // Remove script tags and contents
    $html = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $html);

    // Remove inline event handlers (e.g., onclick=..., onerror=...)
    $html = preg_replace('/on[a-z]+\s*=\s*(["\']).*?\1/i', '', $html);
    $html = preg_replace('/on[a-z]+\s*=\s*[^"\'>\s]+/i', '', $html);

    // Remove javascript: URLs in href/src
    $html = preg_replace('/(href|src)\s*=\s*(["\'])\s*javascript:[^"\']*\2/i', '$1="#"', $html);

    return trim($html);
}

/**
 * Returns full public URL for uploaded featured image.
 */
function getFeaturedImageUrl(?string $filename): ?string
{
    if (empty($filename)) {
        return null;
    }

    if (strpos($filename, 'http://') === 0 || strpos($filename, 'https://') === 0) {
        return $filename;
    }

    return rtrim(UPLOADS_BASE_URL, '/') . '/' . ltrim($filename, '/');
}
