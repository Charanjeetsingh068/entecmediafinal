<?php
/**
 * Entec Media - Dynamic Pages & Sections API
 * Supports retrieving and updating page sections, content, and metadata
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = get_db_connection();

function get_default_pages() {
    return [
        [
            'id' => 1,
            'title' => 'Home Page',
            'slug' => 'home',
            'meta_title' => 'Entec Media - IT & Digital Marketing Company',
            'meta_description' => 'Entec Media provides websites, mobile apps, UI/UX design, SEO, Google Ads, and Meta Ads for high-growth businesses.',
            'status' => 'published',
            'sections' => [
                [
                    'id' => 'sec_hero',
                    'name' => 'Hero Banner',
                    'type' => 'hero',
                    'visible' => true,
                    'order' => 1,
                    'badge' => 'IT & Digital Marketing Company',
                    'title' => 'We design, build & grow brands',
                    'subtitle' => 'Entec Media is an IT & digital marketing company — websites, mobile apps, UI/UX, graphic design, SEO, Google Ads and Meta Ads that turn your business goals into measurable growth.',
                    'button_text' => "Let's Collaborate",
                    'button_link' => '/contact',
                    'secondary_button_text' => 'View Projects',
                    'secondary_button_link' => '/portfolio',
                    'image' => '/images/ENTEC.png',
                    'rating_value' => '4.9/5',
                    'rating_label' => 'Trusted by Top Brands'
                ],
                [
                    'id' => 'sec_mission',
                    'name' => 'Mission & Impact',
                    'type' => 'mission',
                    'visible' => true,
                    'order' => 2,
                    'badge' => 'Our Core Mission',
                    'title' => 'We design, develop and market digital products that drive growth.',
                    'subtitle' => 'At the end of the day, we’re here to help your business grow. That means combining smart design, solid technology and data-driven marketing into one strategy that supports your goals, your team and your future plans.',
                    'button_text' => 'Learn About Us',
                    'button_link' => '/about',
                    'items' => [
                        ['number' => '10+', 'label' => 'Years Experience'],
                        ['number' => '150+', 'label' => 'Projects Completed'],
                        ['number' => '98%', 'label' => 'Client Satisfaction'],
                        ['number' => '24/7', 'label' => 'Dedicated Support']
                    ]
                ],
                [
                    'id' => 'sec_why_choose_us',
                    'name' => 'Why Choose Us',
                    'type' => 'features',
                    'visible' => true,
                    'order' => 3,
                    'badge' => 'The Entec Advantage',
                    'title' => 'Why Choose Entec Media',
                    'subtitle' => 'Strategy > aesthetics. Results that accelerate your digital growth.',
                    'items' => [
                        ['title' => 'Clarity', 'desc' => 'Crystal clear project roadmap, regular communication, and 0% hidden surprises.', 'icon' => 'compass'],
                        ['title' => 'Performance', 'desc' => 'Blazing fast load speeds, clean architecture, and conversion-focused UX.', 'icon' => 'zap'],
                        ['title' => 'Scale', 'desc' => 'Enterprise-ready foundations built to scale smoothly as your company expands.', 'icon' => 'trending-up']
                    ]
                ],
                [
                    'id' => 'sec_services_highlight',
                    'name' => 'Services Highlight',
                    'type' => 'services',
                    'visible' => true,
                    'order' => 4,
                    'badge' => 'What We Do Best',
                    'title' => 'End-to-End Digital Solutions',
                    'subtitle' => 'From brand discovery to high-ROI paid ad campaigns, we handle everything under one roof.',
                    'button_text' => 'Explore All Services',
                    'button_link' => '/services'
                ],
                [
                    'id' => 'sec_testimonials',
                    'name' => 'Client Testimonials',
                    'type' => 'testimonials',
                    'visible' => true,
                    'order' => 5,
                    'badge' => 'Social Proof',
                    'title' => 'Trusted by Industry Leaders',
                    'subtitle' => 'Here is what founders, product managers, and marketing directors say about partnering with Entec Media.',
                    'items' => [
                        [
                            'name' => 'Amit Patel',
                            'role' => 'Founder & CEO, TechVentures',
                            'quote' => 'Entec Media redesigned our web platform and scaled our lead pipeline by 300% in under 90 days. Their engineering and design expertise is unmatched.',
                            'service' => 'Web Development',
                            'rating' => 5,
                            'avatar' => '/images/team1-avatar.webp'
                        ],
                        [
                            'name' => 'Sarah Jenkins',
                            'role' => 'VP Marketing, Lumina Global',
                            'quote' => 'The team delivered our mobile app ahead of schedule with flawless UI/UX. Our users love the experience and conversions have doubled.',
                            'service' => 'Mobile App Design',
                            'rating' => 5,
                            'avatar' => '/images/team2-avatar.webp'
                        ],
                        [
                            'name' => 'Vikram Malhotra',
                            'role' => 'Managing Director, Apex Retail',
                            'quote' => 'Our Google Ads and SEO ROI turned profitable from month one. Highly transparent reporting and proactive campaign management.',
                            'service' => 'Digital Marketing',
                            'rating' => 5,
                            'avatar' => '/images/team3-avatar.webp'
                        ]
                    ]
                ],
                [
                    'id' => 'sec_cta',
                    'name' => 'Call to Action Banner',
                    'type' => 'cta',
                    'visible' => true,
                    'order' => 6,
                    'badge' => 'Start Your Project',
                    'title' => 'Ready to start something great?',
                    'subtitle' => 'Schedule a discovery session with our specialists and receive a customized technical and growth strategy.',
                    'button_text' => "Let's Collaborate",
                    'button_link' => '/contact'
                ]
            ]
        ],
        [
            'id' => 2,
            'title' => 'About Us',
            'slug' => 'about',
            'meta_title' => 'About Entec Media - Team, Culture & Vision',
            'meta_description' => 'Discover the story behind Entec Media — a dedicated team of engineers, designers, and growth marketers based in Zirakpur, Punjab.',
            'status' => 'published',
            'sections' => [
                [
                    'id' => 'sec_about_hero',
                    'name' => 'About Hero',
                    'type' => 'hero',
                    'visible' => true,
                    'order' => 1,
                    'badge' => 'Who We Are',
                    'title' => 'We are Entec Media',
                    'subtitle' => 'An IT & digital marketing powerhouse helping companies build remarkable digital products and scale profitably.',
                    'image' => '/images/aboutbac.webp',
                    'button_text' => 'View Careers',
                    'button_link' => '/careers'
                ],
                [
                    'id' => 'sec_about_story',
                    'name' => 'Company Story',
                    'type' => 'mission',
                    'visible' => true,
                    'order' => 2,
                    'badge' => 'Our Journey',
                    'title' => 'Crafting digital experiences with purpose',
                    'subtitle' => 'Established with a vision to deliver world-standard digital products, Entec Media brings together veteran engineers, creative UI/UX designers, and analytical performance marketers to solve complex business challenges.',
                    'items' => [
                        ['number' => '10+', 'label' => 'Years of Excellence'],
                        ['number' => '50+', 'label' => 'Talented Creators'],
                        ['number' => '250+', 'label' => 'Projects Delivered'],
                        ['number' => '12+', 'label' => 'Countries Served']
                    ]
                ],
                [
                    'id' => 'sec_about_values',
                    'name' => 'Core Values',
                    'type' => 'features',
                    'visible' => true,
                    'order' => 3,
                    'badge' => 'Our Principles',
                    'title' => 'Principles That Guide Our Craft',
                    'items' => [
                        ['title' => 'Relentless Innovation', 'desc' => 'We push creative boundaries and leverage modern frameworks to keep our clients ahead.', 'icon' => 'sparkles'],
                        ['title' => 'Radical Transparency', 'desc' => 'Clear communication, measurable ROI metrics, and transparent roadmaps always.', 'icon' => 'shield-check'],
                        ['title' => 'Craftsmanship', 'desc' => 'Every pixel, line of code, and ad copy is crafted with obsessive attention to detail.', 'icon' => 'award']
                    ]
                ],
                [
                    'id' => 'sec_about_team',
                    'name' => 'Leadership Team',
                    'type' => 'team',
                    'visible' => true,
                    'order' => 4,
                    'badge' => 'The People Behind Entec',
                    'title' => 'Leadership & Visionaries',
                    'subtitle' => 'Passionate builders dedicated to digital excellence and client success.',
                    'items' => [
                        ['name' => 'Charanjeet Singh', 'role' => 'Managing Director & Founder', 'image' => '/images/team1-avatar.webp', 'bio' => 'Visionary leader with 12+ years driving digital innovation and tech transformation.'],
                        ['name' => 'Gurpreet Kaur', 'role' => 'Head of Design & UX', 'image' => '/images/team2-avatar.webp', 'bio' => 'Design specialist championing human-centered UI/UX and brand identities.'],
                        ['name' => 'Rajesh Sharma', 'role' => 'Chief Technology Officer', 'image' => '/images/team3-avatar.webp', 'bio' => 'Full-stack architect overseeing scalable cloud and application infrastructure.']
                    ]
                ]
            ]
        ],
        [
            'id' => 3,
            'title' => 'Contact Us',
            'slug' => 'contact',
            'meta_title' => 'Contact Entec Media - Start Your Project Today',
            'meta_description' => 'Get in touch with Entec Media for web development, mobile apps, UI/UX, and digital marketing inquiries.',
            'status' => 'published',
            'sections' => [
                [
                    'id' => 'sec_contact_hero',
                    'name' => 'Contact Hero',
                    'type' => 'hero',
                    'visible' => true,
                    'order' => 1,
                    'badge' => 'Get In Touch',
                    'title' => 'Let’s build something extraordinary together',
                    'subtitle' => 'Have a project in mind, an idea to validate, or questions about scaling your digital presence? We are here to help.'
                ],
                [
                    'id' => 'sec_contact_info',
                    'name' => 'Contact Information & Office',
                    'type' => 'contact_details',
                    'visible' => true,
                    'order' => 2,
                    'badge' => 'Reach Us Directly',
                    'title' => 'Contact Details',
                    'phone1' => '+91-9992009988',
                    'phone2' => '+91-9992009901',
                    'email' => 'info@entecmedia.com',
                    'address' => '#123, First Floor, Complex Street, Zirakpur, Punjab, India',
                    'hours' => 'Monday – Saturday, 10:00 AM – 7:00 PM IST',
                    'map_query' => 'Zirakpur, Punjab, India'
                ],
                [
                    'id' => 'sec_contact_form_info',
                    'name' => 'Inquiry Form Section',
                    'type' => 'cta',
                    'visible' => true,
                    'order' => 3,
                    'badge' => 'Fast Response Guaranteed',
                    'title' => 'Send Us a Project Brief',
                    'subtitle' => 'We usually reply within 2 to 4 business hours with an initial estimation and consultation proposal.'
                ]
            ]
        ],
        [
            'id' => 4,
            'title' => 'Services',
            'slug' => 'services',
            'meta_title' => 'Digital Services - Web, Mobile, Design, Marketing | Entec Media',
            'meta_description' => 'Explore our full spectrum of digital services: Web Development, Mobile Apps, UI/UX, SEO, Google Ads, Meta Ads, Graphic Design.',
            'status' => 'published',
            'sections' => [
                [
                    'id' => 'sec_services_hero',
                    'name' => 'Services Hero',
                    'type' => 'hero',
                    'visible' => true,
                    'order' => 1,
                    'badge' => 'Comprehensive Solutions',
                    'title' => 'High-Impact Digital Services Built for Growth',
                    'subtitle' => 'We craft robust web applications, native and cross-platform mobile apps, bespoke brand identities, and high-conversion ad campaigns.'
                ],
                [
                    'id' => 'sec_services_process',
                    'name' => 'Our 4-Step Process',
                    'type' => 'features',
                    'visible' => true,
                    'order' => 2,
                    'badge' => 'How We Work',
                    'title' => 'A Proven Delivery Methodology',
                    'items' => [
                        ['title' => '1. Discovery & Strategy', 'desc' => 'We analyze your target market, competitors, and core KPIs to create a crystal-clear execution roadmap.'],
                        ['title' => '2. Architecture & Design', 'desc' => 'Wireframes, interactive Figma prototypes, and technical architecture designed for peak performance.'],
                        ['title' => '3. Agile Engineering', 'desc' => 'Iterative sprints, clean code reviews, and automated testing to ensure rock-solid stability.'],
                        ['title' => '4. Launch & Optimization', 'desc' => 'Deployment to high-performance servers followed by telemetry, SEO monitoring, and growth optimization.']
                    ]
                ]
            ]
        ],
        [
            'id' => 5,
            'title' => 'Portfolio / Works',
            'slug' => 'portfolio',
            'meta_title' => 'Our Portfolio & Case Studies | Entec Media',
            'meta_description' => 'Browse our successful client case studies across web apps, e-commerce, mobile applications, and paid media.',
            'status' => 'published',
            'sections' => [
                [
                    'id' => 'sec_portfolio_hero',
                    'name' => 'Portfolio Hero',
                    'type' => 'hero',
                    'visible' => true,
                    'order' => 1,
                    'badge' => 'Selected Case Studies',
                    'title' => 'Work That Drives Real Business Impact',
                    'subtitle' => 'Explore how we have engineered scalable platforms and profitable marketing engines for ambitious brands.'
                ]
            ]
        ],
        [
            'id' => 6,
            'title' => 'Careers',
            'slug' => 'careers',
            'meta_title' => 'Careers at Entec Media - Join Our Team',
            'meta_description' => 'Explore career opportunities at Entec Media in engineering, UI/UX design, and performance marketing.',
            'status' => 'published',
            'sections' => [
                [
                    'id' => 'sec_careers_hero',
                    'name' => 'Careers Hero',
                    'type' => 'hero',
                    'visible' => true,
                    'order' => 1,
                    'badge' => 'We Are Hiring',
                    'title' => 'Build Your Career With Digital Innovators',
                    'subtitle' => 'Join a high-energy team of developers, designers, and marketers solving exciting challenges with modern technologies.'
                ],
                [
                    'id' => 'sec_careers_perks',
                    'name' => 'Benefits & Perks',
                    'type' => 'features',
                    'visible' => true,
                    'order' => 2,
                    'badge' => 'Why Join Entec',
                    'title' => 'Perks That Support Your Growth',
                    'items' => [
                        ['title' => 'Competitive Compensation', 'desc' => 'Above-market salaries with bi-annual performance bonuses.'],
                        ['title' => 'Flexible Work Culture', 'desc' => 'Hybrid and remote flexibility with sensible working hours.'],
                        ['title' => 'Continuous Learning', 'desc' => 'Paid courses, certifications, and technical book allowances.'],
                        ['title' => 'Modern Tech Stack', 'desc' => 'Work with Next.js, Flutter, React Native, Tailwind, Python, and cloud services.']
                    ]
                ]
            ]
        ]
    ];
}

// --------------------------------------------------------------------
// Seed default pages if table is empty
// --------------------------------------------------------------------
function seed_pages_if_empty($db) {
    try {
        $db->exec("
            CREATE TABLE IF NOT EXISTS `pages` (
              `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              `title` VARCHAR(255) NOT NULL,
              `slug` VARCHAR(100) NOT NULL UNIQUE,
              `meta_title` VARCHAR(255) NULL,
              `meta_description` TEXT NULL,
              `status` ENUM('published', 'draft') DEFAULT 'published',
              `sections` LONGTEXT NOT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              INDEX `idx_page_slug` (`slug`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        $check = $db->query("SELECT COUNT(*) FROM pages");
        if ($check && (int)$check->fetchColumn() === 0) {
            $defaults = get_default_pages();
            $stmt = $db->prepare("INSERT INTO pages (title, slug, meta_title, meta_description, status, sections) VALUES (:title, :slug, :meta_title, :meta_description, :status, :sections)");
            foreach ($defaults as $p) {
                $stmt->execute([
                    ':title' => $p['title'],
                    ':slug' => $p['slug'],
                    ':meta_title' => $p['meta_title'],
                    ':meta_description' => $p['meta_description'],
                    ':status' => $p['status'],
                    ':sections' => json_encode($p['sections'], JSON_UNESCAPED_UNICODE)
                ]);
            }
        }
    } catch (Exception $e) {
        error_log("Seed pages error: " . $e->getMessage());
    }
}

// --------------------------------------------------------------------
// Handle GET Request
// --------------------------------------------------------------------
if ($method === 'GET') {
    seed_pages_if_empty($db);
    $slug = $_GET['slug'] ?? null;
    $id = $_GET['id'] ?? null;

    if ($slug || $id) {
        try {
            if ($id) {
                $stmt = $db->prepare("SELECT * FROM pages WHERE id = :id LIMIT 1");
                $stmt->execute([':id' => $id]);
            } else {
                $stmt = $db->prepare("SELECT * FROM pages WHERE slug = :slug LIMIT 1");
                $stmt->execute([':slug' => $slug]);
            }

            $row = $stmt ? $stmt->fetch() : null;
            if ($row) {
                $row['sections'] = json_decode($row['sections'], true) ?? [];
                send_json_response(['success' => true, 'page' => $row]);
            }
        } catch (Exception $e) {
            // fallback to default
        }

        // If not found in DB or DB error, search default fallback
        $defaults = get_default_pages();
        foreach ($defaults as $d) {
            if (($slug && $d['slug'] === $slug) || ($id && $d['id'] == $id)) {
                send_json_response(['success' => true, 'page' => $d]);
            }
        }
        send_json_response(['error' => 'Page not found'], 404);
    }

    // List all pages
    $raw_pages = [];
    try {
        $stmt = $db->query("SELECT id, title, slug, status, meta_title, meta_description, updated_at, sections FROM pages ORDER BY id ASC");
        if ($stmt) {
            $raw_pages = $stmt->fetchAll();
        }
    } catch (Exception $e) {
        $raw_pages = [];
    }

    if (empty($raw_pages)) {
        $raw_pages = get_default_pages();
    } else {
        foreach ($raw_pages as &$p) {
            $decoded = json_decode($p['sections'], true) ?? [];
            $p['section_count'] = count($decoded);
            unset($p['sections']); // Keep list lightweight
        }
    }

    send_json_response(['success' => true, 'pages' => $raw_pages]);
}

// --------------------------------------------------------------------
// Handle POST / PUT Request (Save / Update Page & Sections)
// --------------------------------------------------------------------
if ($method === 'POST' || $method === 'PUT') {
    require_admin_auth();
    $data = get_json_input();

    $id = $data['id'] ?? null;
    $slug = trim($data['slug'] ?? '');
    $title = trim($data['title'] ?? '');
    $meta_title = trim($data['meta_title'] ?? '');
    $meta_description = trim($data['meta_description'] ?? '');
    $status = in_array($data['status'] ?? '', ['published', 'draft']) ? $data['status'] : 'published';
    $sections = $data['sections'] ?? [];

    if (empty($slug) || empty($title)) {
        send_json_response(['error' => 'Page title and slug are required'], 400);
    }

    $sections_json = is_string($sections) ? $sections : json_encode($sections, JSON_UNESCAPED_UNICODE);

    try {
        if ($id) {
            $stmt = $db->prepare("UPDATE pages SET title = :title, slug = :slug, meta_title = :meta_title, meta_description = :meta_description, status = :status, sections = :sections WHERE id = :id");
            $stmt->execute([
                ':title' => $title,
                ':slug' => $slug,
                ':meta_title' => $meta_title,
                ':meta_description' => $meta_description,
                ':status' => $status,
                ':sections' => $sections_json,
                ':id' => $id
            ]);
            send_json_response(['success' => true, 'message' => 'Page updated successfully', 'page_id' => $id]);
        } else {
            $stmt = $db->prepare("INSERT INTO pages (title, slug, meta_title, meta_description, status, sections) VALUES (:title, :slug, :meta_title, :meta_description, :status, :sections) ON DUPLICATE KEY UPDATE title = VALUES(title), meta_title = VALUES(meta_title), meta_description = VALUES(meta_description), status = VALUES(status), sections = VALUES(sections)");
            $stmt->execute([
                ':title' => $title,
                ':slug' => $slug,
                ':meta_title' => $meta_title,
                ':meta_description' => $meta_description,
                ':status' => $status,
                ':sections' => $sections_json
            ]);
            $inserted_id = $db->lastInsertId();
            send_json_response(['success' => true, 'message' => 'Page created/updated successfully', 'page_id' => $inserted_id]);
        }
    } catch (PDOException $e) {
        send_json_response(['error' => 'Database error: ' . $e->getMessage()], 500);
    }
}

// --------------------------------------------------------------------
// Handle DELETE Request
// --------------------------------------------------------------------
if ($method === 'DELETE') {
    require_admin_auth();
    $id = $_GET['id'] ?? null;
    if (!$id) {
        send_json_response(['error' => 'Page ID is required'], 400);
    }

    try {
        $stmt = $db->prepare("DELETE FROM pages WHERE id = :id");
        $stmt->execute([':id' => $id]);
        send_json_response(['success' => true, 'message' => 'Page deleted successfully']);
    } catch (PDOException $e) {
        send_json_response(['error' => 'Database error: ' . $e->getMessage()], 500);
    }
}

send_json_response(['error' => 'Method not allowed'], 405);
