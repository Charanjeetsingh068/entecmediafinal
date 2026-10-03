<?php
/**
 * Entec Media — website mail settings.
 *
 * All website forms (project enquiry, job applications, newsletter) are delivered
 * by send-mail.php using the settings below.
 *
 * TO SWITCH TO SMTP LATER: set 'enabled' => true inside 'smtp' and fill in the
 * host / port / username / password / encryption given by your mail provider
 * (e.g. Hostinger: smtp.hostinger.com, port 465, encryption 'ssl').
 * While SMTP is disabled, PHP's built-in mail() function is used.
 */

defined('ENTEC_MAIL') or exit;

return [
    // Where form submissions are delivered. Add more addresses to the array if needed.
    'recipients' => ['info@entecmedia.com', 'charanjeetsingh068@gmail.com'],

    // "From" identity used on outgoing mails. With SMTP this must usually match the SMTP username.
    'from_email' => 'no-reply@entecmedia.com',
    'from_name'  => 'Entec Media Website',

    'smtp' => [
        'enabled'    => false,
        'host'       => 'smtp.hostinger.com',
        'port'       => 465,
        'encryption' => 'ssl',   // 'ssl' (port 465), 'tls' (STARTTLS, port 587) or '' (none)
        'username'   => '',
        'password'   => '',
        'timeout'    => 20,
    ],

    // Browsers on these origins may post to the endpoint (local development + live domain).
    'allowed_origins' => [
        'https://entecmedia.com',
        'https://www.entecmedia.com',
        'http://localhost:3000',
    ],

    // Basic abuse protection: max submissions per IP inside the window (seconds).
    'rate_limit' => ['max' => 6, 'window' => 600],
];
