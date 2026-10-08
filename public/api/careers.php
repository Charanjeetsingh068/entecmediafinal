<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';
$db = get_db_connection();

// GET: Careers List or Single Job
if ($method === 'GET') {
    // Admin action: View Job Applications
    if ($action === 'applications') {
        require_admin_auth();
        $job_id = isset($_GET['job_id']) ? (int)$_GET['job_id'] : null;
        $sql = "SELECT ja.*, c.title as job_title_name 
                FROM job_applications ja 
                LEFT JOIN careers c ON ja.career_id = c.id " .
                ($job_id ? "WHERE ja.career_id = :job_id " : "") .
                "ORDER BY ja.created_at DESC";
        $stmt = $db->prepare($sql);
        if ($job_id) $stmt->bindValue(':job_id', $job_id);
        $stmt->execute();
        send_json_response(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $slug = isset($_GET['slug']) ? trim($_GET['slug']) : null;

    if ($id || $slug) {
        $query = "SELECT * FROM careers WHERE " . ($id ? "id = :val" : "slug = :val");
        $stmt = $db->prepare($query);
        $stmt->execute([':val' => $id ?: $slug]);
        $career = $stmt->fetch();

        if (!$career) send_json_response(['error' => 'Job opening not found'], 404);
        send_json_response(['success' => true, 'data' => $career]);
    }

    $where = !isset($_GET['admin']) ? "WHERE status = 'open'" : "";
    $stmt = $db->query("SELECT * FROM careers {$where} ORDER BY created_at DESC");
    send_json_response(['success' => true, 'data' => $stmt->fetchAll()]);
}

// POST: Create Career (Admin) OR Submit Application (Public)
if ($method === 'POST') {
    // Public Applicant submission with Resume Upload
    if ($action === 'apply') {
        $career_id = isset($_POST['career_id']) ? (int)$_POST['career_id'] : null;
        $job_title = trim($_POST['job_title'] ?? '');
        $name = trim($_POST['applicant_name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $portfolio = trim($_POST['portfolio_url'] ?? '');
        $note = trim($_POST['cover_note'] ?? '');

        if (empty($name) || empty($email)) {
            send_json_response(['error' => 'Name and Email are required'], 400);
        }

        // Handle Resume Upload
        $resume_path = '';
        if (isset($_FILES['resume']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
            $allowed_exts = ['pdf', 'doc', 'docx'];
            $ext = strtolower(pathinfo($_FILES['resume']['name'], PATHINFO_EXTENSION));

            if (!in_array($ext, $allowed_exts)) {
                send_json_response(['error' => 'Only PDF and DOC files are allowed for resumes.'], 400);
            }

            $upload_dir = __DIR__ . '/../uploads/resumes/';
            if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

            $filename = 'resume_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
            if (move_uploaded_file($_FILES['resume']['tmp_name'], $upload_dir . $filename)) {
                $resume_path = '/uploads/resumes/' . $filename;
            }
        }

        if (empty($resume_path)) {
            send_json_response(['error' => 'Please upload a valid resume (PDF/DOC).'], 400);
        }

        $stmt = $db->prepare("INSERT INTO job_applications (career_id, job_title, applicant_name, email, phone, portfolio_url, resume_path, cover_note) 
                              VALUES (:career_id, :job_title, :name, :email, :phone, :portfolio, :resume_path, :note)");
        $stmt->execute([
            ':career_id'    => $career_id,
            ':job_title'    => $job_title ?: 'General Application',
            ':name'         => $name,
            ':email'        => $email,
            ':phone'        => $phone,
            ':portfolio'    => $portfolio,
            ':resume_path'  => $resume_path,
            ':note'         => $note
        ]);

        send_json_response(['success' => true, 'message' => 'Your application has been submitted successfully!']);
    }

    // Admin: Create Career
    require_admin_auth();
    $data = get_json_input();
    $title = trim($data['title'] ?? '');
    if (empty($title)) send_json_response(['error' => 'Job title is required'], 400);

    $slug = !empty($data['slug']) ? create_slug($data['slug']) : create_slug($title);

    $stmt = $db->prepare("INSERT INTO careers (title, slug, department, location, job_type, experience, description, requirements, responsibilities, status) 
                          VALUES (:title, :slug, :dept, :loc, :type, :exp, :desc, :req, :resp, :status)");
    $stmt->execute([
        ':title'  => $title,
        ':slug'   => $slug,
        ':dept'   => $data['department'] ?? 'Engineering',
        ':loc'    => $data['location'] ?? 'Remote / Mohali',
        ':type'   => $data['job_type'] ?? 'Full-time',
        ':exp'    => $data['experience'] ?? '1-3 Years',
        ':desc'   => $data['description'] ?? '',
        ':req'    => $data['requirements'] ?? '',
        ':resp'   => $data['responsibilities'] ?? '',
        ':status' => $data['status'] ?? 'open'
    ]);

    send_json_response(['success' => true, 'message' => 'Job opening created successfully', 'id' => $db->lastInsertId()], 201);
}

// PUT: Update Career (Admin)
if ($method === 'PUT') {
    require_admin_auth();
    $data = get_json_input();
    $id = (int)($data['id'] ?? $_GET['id'] ?? 0);

    // Update Application status if requested
    if ($action === 'application_status') {
        $app_id = (int)($data['app_id'] ?? 0);
        $status = $data['status'] ?? 'reviewed';
        $db->prepare("UPDATE job_applications SET status = ? WHERE id = ?")->execute([$status, $app_id]);
        send_json_response(['success' => true, 'message' => 'Application status updated']);
    }

    if (!$id) send_json_response(['error' => 'Job ID is required'], 400);

    $stmt = $db->prepare("UPDATE careers SET title = :title, slug = :slug, department = :dept, location = :loc, 
                          job_type = :type, experience = :exp, description = :desc, requirements = :req, responsibilities = :resp, status = :status WHERE id = :id");
    $stmt->execute([
        ':id'     => $id,
        ':title'  => $data['title'] ?? '',
        ':slug'   => create_slug($data['slug'] ?? $data['title']),
        ':dept'   => $data['department'] ?? 'Engineering',
        ':loc'    => $data['location'] ?? 'Remote / Mohali',
        ':type'   => $data['job_type'] ?? 'Full-time',
        ':exp'    => $data['experience'] ?? '1-3 Years',
        ':desc'   => $data['description'] ?? '',
        ':req'    => $data['requirements'] ?? '',
        ':resp'   => $data['responsibilities'] ?? '',
        ':status' => $data['status'] ?? 'open'
    ]);

    send_json_response(['success' => true, 'message' => 'Job opening updated successfully']);
}

// DELETE: Delete Career (Admin)
if ($method === 'DELETE') {
    require_admin_auth();
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) send_json_response(['error' => 'Job ID is required'], 400);

    $db->prepare("DELETE FROM careers WHERE id = ?")->execute([$id]);
    send_json_response(['success' => true, 'message' => 'Job opening deleted successfully']);
}

send_json_response(['error' => 'Method not allowed'], 405);
