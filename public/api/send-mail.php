<?php
/**
 * Entec Media — website form mail handler.
 * POST /api/send-mail.php   (JSON body)
 *
 * form_type:
 *   enquiry     – project enquiry forms (contact, home, service & portfolio pages)
 *   career      – job application forms (/careers/[slug])
 *   newsletter  – newsletter sign-up (footer)
 *
 * Settings (recipients, SMTP) live in mail-config.php.
 */

declare(strict_types=1);

define('ENTEC_MAIL', true);
$config = require __DIR__ . '/mail-config.php';

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $config['allowed_origins'], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

function respond(bool $success, string $message, int $status = 200): void
{
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    respond(true, 'OK');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(false, 'Method not allowed.', 405);
}

$input = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($input)) {
    respond(false, 'Invalid request.', 400);
}

// Honeypot: humans never fill this hidden field — pretend success for bots.
if (!empty($input['company_fax'])) {
    respond(true, 'Thank you!');
}

// ---------------------------------------------------------------------------
// Simple per-IP rate limit (file based, no database needed)
// ---------------------------------------------------------------------------
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/entec_mail_' . md5($ip);
$now = time();
$hits = [];
if (is_file($rateFile)) {
    $hits = array_filter(
        (array) json_decode((string) file_get_contents($rateFile), true),
        static fn($t) => is_int($t) && $t > $now - $config['rate_limit']['window']
    );
}
if (count($hits) >= $config['rate_limit']['max']) {
    respond(false, 'Too many submissions. Please try again in a few minutes.', 429);
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
$clean = static function ($value, int $max = 300): string {
    $value = is_string($value) ? trim(strip_tags($value)) : '';
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    return function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : substr($value, 0, $max);
};
$oneLine = static fn(string $v): string => trim(str_replace(["\n", "\r"], ' ', $v));

$type  = $clean($input['form_type'] ?? 'enquiry', 30);
$email = $oneLine($clean($input['email'] ?? '', 150));
$name  = $oneLine($clean($input['name'] ?? '', 120));
$source = $oneLine($clean($input['source'] ?? '', 120));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please enter a valid email address.', 422);
}

$rows = [];
switch ($type) {
    case 'newsletter':
        $subject = 'New newsletter subscriber: ' . $email;
        $heading = 'New newsletter subscription';
        $rows = ['Email' => $email];
        $thanks = 'Thanks for subscribing! You will hear from us soon.';
        break;

    case 'career':
        if ($name === '') {
            respond(false, 'Please enter your name.', 422);
        }
        $job = $oneLine($clean($input['job_title'] ?? '', 150));
        $subject = 'Job application: ' . ($job ?: 'General') . ' — ' . $name;
        $heading = 'New job application';
        $rows = [
            'Position'         => $job,
            'Name'             => $name,
            'Email'            => $email,
            'Phone'            => $clean($input['phone'] ?? '', 40),
            'Job type'         => $clean($input['job_type'] ?? '', 60),
            'Experience'       => $clean($input['experience'] ?? '', 60),
            'Portfolio / Website' => $clean($input['portfolio'] ?? '', 250),
            'LinkedIn'         => $clean($input['linkedin'] ?? '', 250),
            'Resume link'      => $clean($input['resume'] ?? '', 250),
            'Intention letter' => $clean($input['letter'] ?? '', 5000),
        ];
        $thanks = 'Thank you for applying! Our team will review your application and get back to you.';
        break;

    default:
        if ($name === '') {
            respond(false, 'Please enter your name.', 422);
        }
        $type = 'enquiry';
        $services = array_slice(array_filter(array_map(
            static fn($s) => is_string($s) ? trim(strip_tags($s)) : '',
            is_array($input['services'] ?? null) ? $input['services'] : []
        )), 0, 20);
        $subject = 'New website enquiry from ' . $name;
        $heading = 'New project enquiry';
        $rows = [
            'Name'            => $name,
            'Email'           => $email,
            'Phone'           => $clean($input['phone'] ?? '', 40),
            'Company'         => $clean($input['company'] ?? '', 150),
            'Website'         => $clean($input['website'] ?? '', 200),
            'Services'        => implode(', ', $services),
            'Budget'          => $clean($input['budget'] ?? '', 60),
            'Project details' => $clean($input['details'] ?? '', 5000),
        ];
        $thanks = 'Thank you! Your enquiry has been received. Our team will contact you within 24 hours.';
}

$rows['Submitted from'] = $source;
$rows['Submitted at']   = date('d M Y, h:i A T');
$rows['IP address']     = $ip;

// ---------------------------------------------------------------------------
// Build the message (plain text + HTML)
// ---------------------------------------------------------------------------
$text = $heading . "\n\n";
$htmlRows = '';
foreach ($rows as $label => $value) {
    if ($value === '' || $value === null) {
        continue;
    }
    $text .= $label . ': ' . $value . "\n";
    $htmlRows .= '<tr><td style="padding:10px 14px;border-bottom:1px solid #eee;color:#666;font:600 13px Arial,sans-serif;vertical-align:top;white-space:nowrap">'
        . htmlspecialchars($label) . '</td><td style="padding:10px 14px;border-bottom:1px solid #eee;color:#111;font:14px/1.5 Arial,sans-serif">'
        . nl2br(htmlspecialchars((string) $value)) . '</td></tr>';
}
$html = '<div style="background:#f5f5f5;padding:24px"><table cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden">'
    . '<tr><td colspan="2" style="background:#050505;color:#fff;padding:18px 14px;font:700 18px Arial,sans-serif">' . htmlspecialchars($heading) . '</td></tr>'
    . $htmlRows . '</table></div>';

$subject = $oneLine($subject);

try {
    $sent = !empty($config['smtp']['enabled'])
        ? smtp_send($config, $subject, $text, $html, $email, $name)
        : php_mail_send($config, $subject, $text, $html, $email, $name);
} catch (Throwable $e) {
    error_log('[entec-mail] ' . $e->getMessage());
    $sent = false;
}

if (!$sent) {
    respond(false, 'We could not send your message right now.', 500);
}

$hits[] = $now;
@file_put_contents($rateFile, json_encode(array_values($hits)));

respond(true, $thanks);

// ===========================================================================
// Transport helpers
// ===========================================================================

function build_mime(string $boundary, string $text, string $html): string
{
    return "--{$boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($text))
        . "--{$boundary}\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($html))
        . "--{$boundary}--\r\n";
}

function encode_header(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function php_mail_send(array $config, string $subject, string $text, string $html, string $replyTo, string $replyName): bool
{
    $boundary = 'b' . bin2hex(random_bytes(12));
    $headers = [
        'MIME-Version: 1.0',
        'From: ' . encode_header($config['from_name']) . ' <' . $config['from_email'] . '>',
        'Reply-To: ' . ($replyName !== '' ? encode_header($replyName) . ' ' : '') . '<' . $replyTo . '>',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
        'X-Mailer: EntecMedia-Website',
    ];
    return mail(
        implode(', ', $config['recipients']),
        encode_header($subject),
        build_mime($boundary, $text, $html),
        implode("\r\n", $headers),
        '-f' . $config['from_email']
    );
}

function smtp_send(array $config, string $subject, string $text, string $html, string $replyTo, string $replyName): bool
{
    $smtp = $config['smtp'];
    $host = ($smtp['encryption'] === 'ssl' ? 'ssl://' : '') . $smtp['host'];
    $socket = @stream_socket_client($host . ':' . $smtp['port'], $errno, $errstr, (float) $smtp['timeout']);
    if (!$socket) {
        throw new RuntimeException("SMTP connect failed: {$errstr} ({$errno})");
    }
    stream_set_timeout($socket, (int) $smtp['timeout']);

    $read = static function () use ($socket): string {
        $data = '';
        while (($line = fgets($socket, 515)) !== false) {
            $data .= $line;
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }
        return $data;
    };
    $cmd = static function (string $command, array $expect) use ($socket, $read): string {
        if ($command !== '') {
            fwrite($socket, $command . "\r\n");
        }
        $reply = $read();
        if (!in_array((int) substr($reply, 0, 3), $expect, true)) {
            throw new RuntimeException('SMTP error after "' . strtok($command, ' ') . '": ' . trim($reply));
        }
        return $reply;
    };

    $serverName = $_SERVER['SERVER_NAME'] ?? 'localhost';
    $cmd('', [220]);
    $cmd('EHLO ' . $serverName, [250]);
    if ($smtp['encryption'] === 'tls') {
        $cmd('STARTTLS', [220]);
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            throw new RuntimeException('SMTP STARTTLS failed');
        }
        $cmd('EHLO ' . $serverName, [250]);
    }
    if ($smtp['username'] !== '') {
        $cmd('AUTH LOGIN', [334]);
        $cmd(base64_encode($smtp['username']), [334]);
        $cmd(base64_encode($smtp['password']), [235]);
    }
    $cmd('MAIL FROM:<' . $config['from_email'] . '>', [250]);
    foreach ($config['recipients'] as $rcpt) {
        $cmd('RCPT TO:<' . $rcpt . '>', [250, 251]);
    }
    $cmd('DATA', [354]);

    $boundary = 'b' . bin2hex(random_bytes(12));
    $headers = [
        'Date: ' . date('r'),
        'From: ' . encode_header($config['from_name']) . ' <' . $config['from_email'] . '>',
        'To: ' . implode(', ', $config['recipients']),
        'Reply-To: ' . ($replyName !== '' ? encode_header($replyName) . ' ' : '') . '<' . $replyTo . '>',
        'Subject: ' . encode_header($subject),
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
        'X-Mailer: EntecMedia-Website',
    ];
    $body = implode("\r\n", $headers) . "\r\n\r\n" . build_mime($boundary, $text, $html);
    // Dot-stuffing per RFC 5321
    $body = preg_replace('/^\./m', '..', $body);
    $cmd($body . "\r\n.", [250]);
    $cmd('QUIT', [221]);
    fclose($socket);
    return true;
}
