<?php
/**
 * Entec Media — website mail settings (Hostinger SMTP).
 *
 * All website forms (project enquiry, job applications, newsletter) are delivered
 * by send-mail.php using the settings below.
 */

defined('ENTEC_MAIL') or exit;

// Check for local overrides or environment variables if available
$localConfigPath = __DIR__ . '/mail-config.local.php';
$localSettings = file_exists($localConfigPath) ? (array) require $localConfigPath : [];

$config = [
    // Where form submissions are delivered (all inboxes will receive every submission).
    'recipients' => [
        'info@entecmedia.com',
        'charanjeetsingh068@gmail.com',
        'Info.sumitchaudhary@gmail.com',
    ],

    // "From" identity used on outgoing mails. Must match the Hostinger SMTP username.
    'from_email' => 'info@entecmedia.com',
    'from_name'  => 'Entec Media',

    // Hostinger SMTP settings
    'smtp' => [
        'enabled'    => true,
        'host'       => 'smtp.hostinger.com',
        'port'       => 465,
        'encryption' => 'ssl',   // 'ssl' (port 465) or 'tls' (port 587)
        'username'   => 'info@entecmedia.com',
        'password'   => getenv('SMTP_PASSWORD') ?: getenv('MAIL_PASSWORD') ?: 'Entecmedia@7730',
        'timeout'    => 20,
    ],

    // Browsers on these origins may post to the endpoint (local development + live domain).
    'allowed_origins' => [
        'https://entecmedia.com',
        'https://www.entecmedia.com',
        'http://entecmedia.com',
        'http://www.entecmedia.com',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
    ],

    // Basic abuse protection: max submissions per IP inside the window (seconds).
    'rate_limit' => ['max' => 15, 'window' => 600],
];

return array_replace_recursive($config, $localSettings);

