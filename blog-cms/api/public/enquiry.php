<?php
/**
 * Public API: Submit a project enquiry from the website contact forms
 * POST /api/public/enquiry.php  (JSON body)
 *
 * Stores the enquiry in the `enquiries` table and emails it to ENQUIRY_NOTIFY_EMAIL.
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    jsonResponse(true, 'OK');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed. Use POST.', null, 405);
}

$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) {
    jsonResponse(false, 'Invalid request body.', null, 400);
}

// Honeypot: real users never fill this hidden field
if (!empty($input['company_fax'])) {
    jsonResponse(true, 'Thank you! Your enquiry has been received.');
}

$clean = static function ($value, int $maxLength): string {
    $value = is_string($value) ? trim(strip_tags($value)) : '';
    return mb_substr($value, 0, $maxLength, 'UTF-8');
};

$name     = $clean($input['name'] ?? '', 120);
$email    = $clean($input['email'] ?? '', 150);
$phone    = $clean($input['phone'] ?? '', 30);
$company  = $clean($input['company'] ?? '', 150);
$website  = $clean($input['website'] ?? '', 200);
$budget   = $clean($input['budget'] ?? '', 50);
$details  = $clean($input['details'] ?? '', 5000);
$source   = $clean($input['source'] ?? '', 100);
$services = array_slice(array_filter(array_map(
    static fn($s) => is_string($s) ? mb_substr(trim(strip_tags($s)), 0, 60, 'UTF-8') : '',
    is_array($input['services'] ?? null) ? $input['services'] : []
)), 0, 20);

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, 'Please provide your name and a valid email address.', null, 422);
}

$pdo = getDBConnection();
$stmt = $pdo->prepare(
    'INSERT INTO enquiries (name, email, phone, company, website, services, budget, details, source_page, ip_address)
     VALUES (:name, :email, :phone, :company, :website, :services, :budget, :details, :source, :ip)'
);
$stmt->execute([
    ':name'     => $name,
    ':email'    => $email,
    ':phone'    => $phone,
    ':company'  => $company,
    ':website'  => $website,
    ':services' => implode(', ', $services),
    ':budget'   => $budget,
    ':details'  => $details,
    ':source'   => $source,
    ':ip'       => $_SERVER['REMOTE_ADDR'] ?? null,
]);

$notifyEmail = getenv('ENQUIRY_NOTIFY_EMAIL') ?: 'info@entecmedia.com';
$subject = 'New website enquiry from ' . str_replace(["\r", "\n"], '', $name);
$body = implode("\n", [
    "Name: {$name}",
    "Email: {$email}",
    "Phone: {$phone}",
    "Company: {$company}",
    "Website: {$website}",
    'Services: ' . implode(', ', $services),
    "Budget: {$budget}",
    "Page: {$source}",
    '',
    'Project details:',
    $details,
]);
$headers = [
    'From: Entec Media Website <no-reply@entecmedia.com>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
];
@mail($notifyEmail, $subject, $body, implode("\r\n", $headers));

jsonResponse(true, 'Thank you! Your enquiry has been received.');
