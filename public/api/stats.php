<?php
require_once __DIR__ . '/config.php';

require_admin_auth();

$db = get_db_connection();

$stats = [
    'blogs_count'        => (int)$db->query("SELECT COUNT(*) FROM blogs")->fetchColumn(),
    'projects_count'     => (int)$db->query("SELECT COUNT(*) FROM projects")->fetchColumn(),
    'services_count'     => (int)$db->query("SELECT COUNT(*) FROM services WHERE status = 'active'")->fetchColumn(),
    'careers_open_count' => (int)$db->query("SELECT COUNT(*) FROM careers WHERE status = 'open'")->fetchColumn(),
    'applications_count' => (int)$db->query("SELECT COUNT(*) FROM job_applications")->fetchColumn(),
    'new_leads_count'    => (int)$db->query("SELECT COUNT(*) FROM leads WHERE status = 'new'")->fetchColumn(),
    'total_leads_count'  => (int)$db->query("SELECT COUNT(*) FROM leads")->fetchColumn(),
    'recent_leads'       => $db->query("SELECT * FROM leads ORDER BY created_at DESC LIMIT 5")->fetchAll(),
    'recent_applications'=> $db->query("SELECT ja.*, c.title as job_title FROM job_applications ja LEFT JOIN careers c ON ja.career_id = c.id ORDER BY ja.created_at DESC LIMIT 5")->fetchAll(),
];

send_json_response(['success' => true, 'data' => $stats]);
