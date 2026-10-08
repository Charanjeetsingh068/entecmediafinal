<?php
require_once __DIR__ . '/config.php';

require_admin_auth();

$db = get_db_connection();

// 1. Seed Site Settings
$settings = [
    'header_tagline'    => 'Innovating the Future of Digital Media',
    'header_cta_text'   => 'Get in Touch',
    'header_cta_url'    => '/contact',
    'contact_phone'     => '+91 98765 43210',
    'contact_email'     => 'contact@entecmedia.com',
    'contact_address'   => 'Phase 8B, Industrial Area, Sector 74, Mohali, Punjab 160055',
    'working_hours'     => 'Mon - Fri: 9:30 AM - 6:30 PM',
    'social_linkedin'   => 'https://linkedin.com/company/entecmedia',
    'social_instagram'  => 'https://instagram.com/entecmedia',
    'social_twitter'    => 'https://x.com/entecmedia',
    'social_youtube'    => 'https://youtube.com/@entecmedia',
    'hero_heading'      => 'We Build Iconic Digital Brands & High-Performance Web Apps',
    'hero_subtitle'     => 'Entec Media helps ambitious companies scale with cutting-edge web design, next-gen technology, and data-driven marketing.'
];

$stmt_set = $db->prepare("INSERT INTO site_settings (key_name, value_data) VALUES (:k, :v) ON DUPLICATE KEY UPDATE value_data = VALUES(value_data)");
foreach ($settings as $k => $v) {
    $stmt_set->execute([':k' => $k, ':v' => $v]);
}

// 2. Seed Services if empty
$svc_count = (int)$db->query("SELECT COUNT(*) FROM services")->fetchColumn();
if ($svc_count === 0) {
    $services = [
        [
            'title' => 'Website Design',
            'slug' => 'website-design',
            'icon' => 'layout',
            'short_desc' => 'Modern, responsive website designs that reflect your brand, build trust and turn visitors into enquiries.',
            'full_desc' => 'Your website is often the first impression of your business. We design custom, mobile-friendly websites with a clear structure, strong visuals and persuasive calls-to-action so every visitor understands what you do and how to reach you.',
            'deliverables' => json_encode(['Custom UI Layouts', 'Responsive Mobile-First Design', 'Landing Pages', 'Brand Color System', 'Figma & Prototype Files']),
            'display_order' => 1
        ],
        [
            'title' => 'Website Development',
            'slug' => 'website-development',
            'icon' => 'code',
            'short_desc' => 'Fast, scalable and secure websites built on Next.js, React and modern CMS platforms.',
            'full_desc' => 'We engineer lightning-fast websites engineered for performance, SEO ranking, and effortless content management.',
            'deliverables' => json_encode(['Next.js & React Architecture', 'Custom Headless CMS', 'Speed & Core Web Vitals 95+', 'API & Database Integrations', 'SSL & Cloud Hosting Setup']),
            'display_order' => 2
        ],
        [
            'title' => 'Mobile App Design & Development',
            'slug' => 'mobile-app-development',
            'icon' => 'smartphone',
            'short_desc' => 'Native iOS & Android apps and cross-platform Flutter/React Native solutions designed for high engagement.',
            'full_desc' => 'From wireframing to App Store release, we craft intuitive mobile experiences tailored for global scale.',
            'deliverables' => json_encode(['iOS & Android Apps', 'Cross-Platform Flutter Codebase', 'Push Notifications & Auth', 'Payment Gateway Integration']),
            'display_order' => 3
        ],
        [
            'title' => 'Performance Marketing & Ads',
            'slug' => 'performance-marketing',
            'icon' => 'trending-up',
            'short_desc' => 'ROI-focused Google Ads, Meta Ads and LinkedIn advertising campaigns that generate qualified leads.',
            'full_desc' => 'Maximize your conversion rate with hyper-targeted paid acquisition strategies, landing page optimization, and deep analytics tracking.',
            'deliverables' => json_encode(['Google Search & Display Ads', 'Meta (Instagram & FB) Campaigns', 'Retargeting Funnels', 'ROAS Tracking & Dashboards']),
            'display_order' => 4
        ],
        [
            'title' => 'Search Engine Optimization (SEO)',
            'slug' => 'seo-services',
            'icon' => 'search',
            'short_desc' => 'Technical SEO, keyword strategy, and authority link-building to rank #1 on Google search results.',
            'full_desc' => 'Drive sustainable organic traffic that converts without paying per click on search engines.',
            'deliverables' => json_encode(['Technical SEO Audit', 'Keyword & Competitor Strategy', 'On-Page Content Optimization', 'Local & National SEO']),
            'display_order' => 5
        ],
        [
            'title' => 'Brand Identity & Strategy',
            'slug' => 'brand-identity',
            'icon' => 'palette',
            'short_desc' => 'Memorable logo design, comprehensive brand guidelines, typography, and brand positioning.',
            'full_desc' => 'We help your company stand out with a distinct, iconic visual identity that commands premium value.',
            'deliverables' => json_encode(['Logo & Iconography Suite', 'Color & Typography System', 'Brand Style Guide PDF', 'Stationery & Social Kit']),
            'display_order' => 6
        ]
    ];

    $ins_svc = $db->prepare("INSERT INTO services (title, slug, icon, short_desc, full_desc, deliverables, display_order, status) 
                             VALUES (:title, :slug, :icon, :short_desc, :full_desc, :deliverables, :display_order, 'active')");
    foreach ($services as $s) {
        $ins_svc->execute($s);
    }
}

// 3. Seed Sample Projects if empty
$prj_count = (int)$db->query("SELECT COUNT(*) FROM projects")->fetchColumn();
if ($prj_count === 0) {
    $projects = [
        [
            'title' => 'Nexatech Global Cloud Platform',
            'slug' => 'nexatech-cloud-platform',
            'client' => 'Nexatech Enterprises',
            'category' => 'Web Development',
            'thumbnail' => '/images/r/aboutbac.webp',
            'short_desc' => 'High-performance cloud portal built with Next.js and real-time dashboard analytics.',
            'overview' => 'We designed and engineered a full-stack dashboard and public website for Nexatech, improving their user sign-up speed by 300%.',
            'services_used' => 'Next.js, UI/UX Design, Cloud Architecture',
            'live_url' => 'https://nexatech.example.com',
            'featured' => 1
        ],
        [
            'title' => 'Lumina Luxury Interior Brand',
            'slug' => 'lumina-luxury-interiors',
            'client' => 'Lumina Living UK',
            'category' => 'Branding & UI/UX',
            'thumbnail' => '/images/r/aboutbac.webp',
            'short_desc' => 'Premium e-commerce catalog and interactive 3D room visualizer.',
            'overview' => 'Created an elegant, minimalist digital brand identity that elevated the client to top luxury European interior awards.',
            'services_used' => 'Brand Identity, Web Design, 3D Renderings',
            'live_url' => 'https://lumina.example.com',
            'featured' => 1
        ]
    ];

    $ins_prj = $db->prepare("INSERT INTO projects (title, slug, client, category, thumbnail, short_desc, overview, services_used, live_url, featured, status) 
                             VALUES (:title, :slug, :client, :category, :thumbnail, :short_desc, :overview, :services_used, :live_url, :featured, 'published')");
    foreach ($projects as $p) {
        $ins_prj->execute($p);
    }
}

// 4. Seed Sample Careers if empty
$car_count = (int)$db->query("SELECT COUNT(*) FROM careers")->fetchColumn();
if ($car_count === 0) {
    $careers = [
        [
            'title' => 'Senior Frontend Developer (Next.js / React)',
            'slug' => 'senior-frontend-developer',
            'department' => 'Engineering',
            'location' => 'Remote / Mohali Office',
            'job_type' => 'Full-time',
            'experience' => '2-5 Years',
            'description' => 'We are looking for a skilled Frontend Engineer passionate about crafting beautiful, smooth 60fps web experiences.',
            'requirements' => 'Proficiency with Next.js, React, TypeScript, TailwindCSS, CSS animations, and REST APIs.',
            'responsibilities' => 'Develop scalable user interfaces, collaborate with UI/UX designers, optimize core web vitals.'
        ],
        [
            'title' => 'UI/UX Product Designer',
            'slug' => 'ui-ux-product-designer',
            'department' => 'Design',
            'location' => 'Remote / Mohali Office',
            'job_type' => 'Full-time',
            'experience' => '2+ Years',
            'description' => 'Lead product UI design for global clients across web applications, mobile apps, and interactive marketing platforms.',
            'requirements' => 'Mastery in Figma, design systems, wireframing, interactive prototyping and typography.',
            'responsibilities' => 'Create user journeys, high-fidelity mockups, and work closely with developers to bring designs to life.'
        ]
    ];

    $ins_car = $db->prepare("INSERT INTO careers (title, slug, department, location, job_type, experience, description, requirements, responsibilities, status) 
                             VALUES (:title, :slug, :department, :location, :job_type, :experience, :description, :requirements, :responsibilities, 'open')");
    foreach ($careers as $c) {
        $ins_car->execute($c);
    }
}

send_json_response(['success' => true, 'message' => 'Database successfully synchronized with all website content, services, projects and settings!']);
