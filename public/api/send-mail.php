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

// JSON body (most forms) or multipart/form-data (forms with a file, e.g. a job application with a CV)
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data') !== false) {
    $input = $_POST;
} else {
    $input = json_decode((string) file_get_contents('php://input'), true);
}
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
$ip = client_ip();
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
$attachments = [];
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

        // The CV arrives as an uploaded file (attached to the email) or, from older forms, as a link
        $resumeLink = $clean($input['resume'] ?? '', 250);
        if (!empty($_FILES['resume_file']) && is_array($_FILES['resume_file']) && ($_FILES['resume_file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
            $cv = resume_attachment($_FILES['resume_file']);
            if (is_string($cv)) {
                respond(false, $cv, 422);
            }
            $attachments[] = $cv;
        } elseif ($resumeLink === '') {
            respond(false, 'Please attach your CV.', 422);
        }

        $rows = [
            'Position'         => $job,
            'Name'             => $name,
            'Email'            => $email,
            'Phone'            => $clean($input['phone'] ?? '', 40),
            'Phone country'    => $clean($input['phone_country'] ?? '', 80),
            'Current city'     => $clean($input['city'] ?? '', 100),
            'Experience'       => $clean($input['experience'] ?? '', 60),
            'Preferred job type' => $clean($input['job_type'] ?? '', 60),
            'Notice period'    => $clean($input['notice'] ?? '', 60),
            'Expected salary'  => $clean($input['salary'] ?? '', 80),
            'Portfolio / Website' => $clean($input['portfolio'] ?? '', 250),
            'LinkedIn'         => $clean($input['linkedin'] ?? '', 250),
            'CV'               => isset($cv) && is_array($cv) ? $cv['name'] . ' (' . format_bytes($cv['size']) . ', attached)' : $resumeLink,
            'Why join us'      => $clean($input['letter'] ?? '', 5000),
        ];
        $rows = array_filter($rows, static fn($v) => $v !== '');
        $thanks = 'Thank you for applying! Our team will review your application and get back to you within 5 working days.';
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
            'Phone country'   => $clean($input['phone_country'] ?? '', 80),
            'Company'         => $clean($input['company'] ?? '', 150),
            'Website'         => $clean($input['website'] ?? '', 200),
            'Services'        => implode(', ', $services),
            'Budget'          => $clean($input['budget'] ?? '', 60),
            'Heard about us'  => $clean($input['heard_from'] ?? '', 80),
            'Project details' => $clean($input['details'] ?? '', 5000),
        ];
        // Leave out optional fields the form didn't send (e.g. the contact page has no budget)
        $rows = array_filter($rows, static fn($v) => $v !== '');
        $thanks = 'Thank you! Your enquiry has been received. Our team will contact you within 24 hours.';
}

$rows['Submitted from'] = $source;
$rows['Submitted at']   = date('d M Y, h:i A T');

// Visitor details: the IP address with its approximate location (looked up here, on the server),
// plus what the browser reported about the page, device and time zone.
$rows['IP address'] = $ip;
$geo = ip_location($ip);
if ($geo) {
    $rows['Location']      = $geo['location'];
    $rows['ISP / network'] = $geo['isp'];
    $rows['IP time zone']  = $geo['timezone'];
    $rows['Map']           = $geo['map'];
}
$rows['Page']             = $oneLine($clean($input['page_url'] ?? '', 300));
$rows['Came from']        = $oneLine($clean($input['referrer'] ?? '', 300));
$rows['Browser time zone'] = $oneLine($clean($input['timezone'] ?? '', 60));
$rows['Browser language'] = $oneLine($clean($input['language'] ?? '', 20));
$rows['Screen']           = $oneLine($clean($input['screen'] ?? '', 20));
$rows['Device / browser'] = $oneLine($clean($_SERVER['HTTP_USER_AGENT'] ?? '', 300));

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
        ? smtp_send($config, $subject, $text, $html, $email, $name, $attachments)
        : php_mail_send($config, $subject, $text, $html, $email, $name, $attachments);
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
// Visitor helpers
// ===========================================================================

/** The visitor's real IP — behind Cloudflare or a proxy the original address is in a header. */
function client_ip(): string
{
    $candidates = [
        $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '',
        trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '')[0]),
        $_SERVER['HTTP_X_REAL_IP'] ?? '',
        $_SERVER['REMOTE_ADDR'] ?? '',
    ];
    foreach ($candidates as $candidate) {
        if (filter_var($candidate, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            return $candidate;
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

/** GET a JSON URL with a short timeout (cURL when available, else file_get_contents). */
function fetch_json(string $url, int $timeout = 3): ?array
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_CONNECTTIMEOUT => $timeout,
            CURLOPT_USERAGENT      => 'EntecMedia-Website',
        ]);
        $body = curl_exec($ch);
        curl_close($ch);
    } else {
        $ctx = stream_context_create(['http' => ['timeout' => $timeout, 'header' => "User-Agent: EntecMedia-Website\r\n"]]);
        $body = @file_get_contents($url, false, $ctx);
    }
    $data = is_string($body) ? json_decode($body, true) : null;
    return is_array($data) ? $data : null;
}

/**
 * Approximate location of an IP address (city, region, country, ISP, time zone, map link).
 * Uses the free ipwho.is service, falling back to ip-api.com. Returns null for private/unknown
 * addresses or when both lookups fail — the email is sent either way.
 */
function ip_location(string $ip): ?array
{
    if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
        return null;
    }
    $join = static fn(array $parts): string => implode(', ', array_filter(array_map('trim', $parts)));

    $d = fetch_json('https://ipwho.is/' . rawurlencode($ip));
    if ($d && !empty($d['success'])) {
        $lat = $d['latitude'] ?? null;
        $lon = $d['longitude'] ?? null;
        return [
            'location' => $join([$d['city'] ?? '', $d['region'] ?? '', ($d['country'] ?? '') . (!empty($d['country_code']) ? ' (' . $d['country_code'] . ')' : ''), $d['postal'] ?? '']),
            'isp'      => (string) ($d['connection']['isp'] ?? $d['connection']['org'] ?? ''),
            'timezone' => (string) ($d['timezone']['id'] ?? ''),
            'map'      => ($lat !== null && $lon !== null) ? 'https://www.google.com/maps?q=' . $lat . ',' . $lon : '',
        ];
    }

    $d = fetch_json('http://ip-api.com/json/' . rawurlencode($ip) . '?fields=status,country,countryCode,regionName,city,zip,lat,lon,timezone,isp');
    if ($d && ($d['status'] ?? '') === 'success') {
        return [
            'location' => $join([$d['city'] ?? '', $d['regionName'] ?? '', ($d['country'] ?? '') . (!empty($d['countryCode']) ? ' (' . $d['countryCode'] . ')' : ''), $d['zip'] ?? '']),
            'isp'      => (string) ($d['isp'] ?? ''),
            'timezone' => (string) ($d['timezone'] ?? ''),
            'map'      => isset($d['lat'], $d['lon']) ? 'https://www.google.com/maps?q=' . $d['lat'] . ',' . $d['lon'] : '',
        ];
    }
    return null;
}

// ===========================================================================
// Attachment helpers (CV uploads)
// ===========================================================================

/**
 * Validates an uploaded CV and returns it as an attachment, or an error message for the visitor.
 * Allowed: PDF, Word (DOC/DOCX), RTF, ODT, Pages, TXT and JPG/PNG images, up to 8 MB. The real file type
 * is checked from its contents (not just the extension) so scripts or executables can't be attached.
 */
function resume_attachment(array $file)
{
    $maxBytes = 8 * 1024 * 1024;
    $error = (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE);
    if ($error === UPLOAD_ERR_INI_SIZE || $error === UPLOAD_ERR_FORM_SIZE || (int) ($file['size'] ?? 0) > $maxBytes) {
        return 'Your CV is larger than 8 MB — please upload a smaller file.';
    }
    if ($error !== UPLOAD_ERR_OK || !is_uploaded_file((string) ($file['tmp_name'] ?? ''))) {
        return 'We could not read your CV. Please try again or email it to us.';
    }

    $allowed = [
        'pdf'   => ['application/pdf'],
        'doc'   => ['application/msword', 'application/vnd.ms-office', 'application/octet-stream', 'application/CDFV2'],
        'docx'  => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'],
        'rtf'   => ['application/rtf', 'text/rtf', 'text/plain'],
        'odt'   => ['application/vnd.oasis.opendocument.text', 'application/zip', 'application/octet-stream'],
        'pages' => ['application/x-iwork-pages-sffpages', 'application/vnd.apple.pages', 'application/zip', 'application/octet-stream'],
        'txt'   => ['text/plain'],
        'jpg'   => ['image/jpeg'],
        'jpeg'  => ['image/jpeg'],
        'png'   => ['image/png'],
    ];
    $name = basename((string) ($file['name'] ?? 'cv'));
    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    if (!isset($allowed[$ext])) {
        return 'Please upload your CV as a PDF, Word, RTF, ODT, Pages, TXT or image file.';
    }

    $mime = 'application/octet-stream';
    if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $detected = $finfo ? (string) finfo_file($finfo, $file['tmp_name']) : '';
        if ($finfo) {
            finfo_close($finfo);
        }
        if ($detected !== '' && !in_array($detected, $allowed[$ext], true)) {
            return 'That file doesn\'t look like a valid CV. Please upload a PDF, Word, RTF, ODT, Pages, TXT or image file.';
        }
        $mime = $detected !== '' ? $detected : $mime;
    }

    $data = file_get_contents($file['tmp_name']);
    if ($data === false) {
        return 'We could not read your CV. Please try again or email it to us.';
    }
    // Safe file name for the email: letters, numbers, dots, dashes and underscores only
    $safe = preg_replace('/[^A-Za-z0-9._-]+/', '-', pathinfo($name, PATHINFO_FILENAME)) ?: 'cv';
    return ['name' => substr($safe, 0, 80) . '.' . $ext, 'mime' => $mime, 'data' => $data, 'size' => strlen($data)];
}

function format_bytes(int $bytes): string
{
    return $bytes >= 1048576 ? round($bytes / 1048576, 1) . ' MB' : max(1, (int) round($bytes / 1024)) . ' KB';
}

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

/**
 * The message body and its Content-Type header: multipart/alternative (text + HTML), wrapped in
 * multipart/mixed when there are attachments.
 */
function build_body(string $text, string $html, array $attachments): array
{
    $alt = 'b' . bin2hex(random_bytes(12));
    if (!$attachments) {
        return ['multipart/alternative; boundary="' . $alt . '"', build_mime($alt, $text, $html)];
    }
    $mixed = 'm' . bin2hex(random_bytes(12));
    $body = "--{$mixed}\r\nContent-Type: multipart/alternative; boundary=\"{$alt}\"\r\n\r\n" . build_mime($alt, $text, $html);
    foreach ($attachments as $a) {
        $fname = str_replace(['"', "\r", "\n"], '', $a['name']);
        $body .= "--{$mixed}\r\nContent-Type: {$a['mime']}; name=\"{$fname}\"\r\n"
            . "Content-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=\"{$fname}\"\r\n\r\n"
            . chunk_split(base64_encode($a['data']));
    }
    $body .= "--{$mixed}--\r\n";
    return ['multipart/mixed; boundary="' . $mixed . '"', $body];
}

function encode_header(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function php_mail_send(array $config, string $subject, string $text, string $html, string $replyTo, string $replyName, array $attachments = []): bool
{
    [$contentType, $body] = build_body($text, $html, $attachments);
    $headers = [
        'MIME-Version: 1.0',
        'From: ' . encode_header($config['from_name']) . ' <' . $config['from_email'] . '>',
        'Reply-To: ' . ($replyName !== '' ? encode_header($replyName) . ' ' : '') . '<' . $replyTo . '>',
        'Content-Type: ' . $contentType,
        'X-Mailer: EntecMedia-Website',
    ];
    return mail(
        implode(', ', $config['recipients']),
        encode_header($subject),
        $body,
        implode("\r\n", $headers),
        '-f' . $config['from_email']
    );
}

function smtp_send(array $config, string $subject, string $text, string $html, string $replyTo, string $replyName, array $attachments = []): bool
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

    [$contentType, $mime] = build_body($text, $html, $attachments);
    $headers = [
        'Date: ' . date('r'),
        'From: ' . encode_header($config['from_name']) . ' <' . $config['from_email'] . '>',
        'To: ' . implode(', ', $config['recipients']),
        'Reply-To: ' . ($replyName !== '' ? encode_header($replyName) . ' ' : '') . '<' . $replyTo . '>',
        'Subject: ' . encode_header($subject),
        'MIME-Version: 1.0',
        'Content-Type: ' . $contentType,
        'X-Mailer: EntecMedia-Website',
    ];
    $body = implode("\r\n", $headers) . "\r\n\r\n" . $mime;
    // Dot-stuffing per RFC 5321
    $body = preg_replace('/^\./m', '..', $body);
    $cmd($body . "\r\n.", [250]);
    $cmd('QUIT', [221]);
    fclose($socket);
    return true;
}
