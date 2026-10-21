// ========================================================
// ENTEC MEDIA - Professional WordPress-Grade Admin CMS
// Full Dynamic Management for Blogs, Careers, Resumes, Media, Leads & Site Settings
// ========================================================

const API_BASE = '/api';
let authToken = localStorage.getItem('entec_admin_token') || '';
let currentUser = JSON.parse(localStorage.getItem('entec_admin_user') || 'null');
let easyMDE = null;

// Global Cache for active data
let allBlogs = [];
let allCareers = [];
let allApplications = [];
let allProjects = [];
let allServices = [];
let allLeads = [];
let allMedia = [];

// Media Picker Global State
let activePickerTargetInputId = '';
let activePickerPreviewImgId = '';
let selectedPickerMediaUrl = '';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  // Attach click listeners to all sidebar navigation items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const href = item.getAttribute('href');
      if (href && href.startsWith('#')) {
        const sec = href.replace('#', '');
        history.pushState(null, '', '#' + sec);
        switchSection(sec);
      }
    });
  });

  window.addEventListener('hashchange', () => {
    const hash = (window.location.hash || '').replace('#', '') || 'dashboard';
    switchSection(hash);
  });

  checkAuthStatus();
});

// ==================== AUTHENTICATION ====================

async function checkAuthStatus() {
  if (!authToken) {
    showLoginView();
    return;
  }

  try {
    const res = await apiRequest('/auth.php');
    if (res.authenticated || res.success) {
      if (res.user) currentUser = res.user;
      showAppView();
    } else {
      showLoginView();
    }
  } catch (err) {
    if (authToken && currentUser) {
      showAppView();
    } else {
      showLoginView();
    }
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const btn = document.getElementById('login-btn');

  btn.disabled = true;
  btn.innerHTML = '<span>Verifying credentials...</span>';

  try {
    const res = await apiRequest('/auth.php?action=login', 'POST', { email, password });
    if (res.success) {
      authToken = res.token || 'auth-token-' + Date.now();
      currentUser = res.user || { name: 'Entec Administrator', email: email, role: 'superadmin' };
      localStorage.setItem('entec_admin_token', authToken);
      localStorage.setItem('entec_admin_user', JSON.stringify(currentUser));
      showToast('Welcome back, ' + currentUser.name, 'success');
      showAppView();
    } else {
      showToast(res.error || 'Invalid email or password.', 'error');
    }
  } catch (err) {
    showToast(err.message || 'Login failed. Please check your credentials.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>Sign In to Dashboard</span><i data-lucide="arrow-right"></i>';
    if (window.lucide) lucide.createIcons();
  }
}

function handleLogout() {
  localStorage.removeItem('entec_admin_token');
  localStorage.removeItem('entec_admin_user');
  authToken = '';
  currentUser = null;
  showLoginView();
  showToast('Logged out successfully', 'success');
}

function showLoginView() {
  document.getElementById('login-view').style.display = 'flex';
  document.getElementById('app-view').style.display = 'none';
}

function showAppView() {
  document.getElementById('login-view').style.display = 'none';
  document.getElementById('app-view').style.display = 'flex';

  if (currentUser) {
    document.getElementById('current-user-name').innerText = currentUser.name || 'Admin';
    document.getElementById('current-user-email').innerText = currentUser.email || 'admin@entecmedia.com';
    document.getElementById('current-user-avatar').innerText = (currentUser.name || 'A').charAt(0).toUpperCase();
  }

  // Initialize Markdown Editor if not already initialized
  if (!easyMDE && document.getElementById('blog-content')) {
    easyMDE = new EasyMDE({
      element: document.getElementById('blog-content'),
      spellChecker: false,
      placeholder: 'Write your blog post article here using Markdown or HTML...',
      status: false,
      minHeight: '240px',
      toolbar: [
        'bold', 'italic', 'heading-2', 'heading-3', '|',
        'quote', 'unordered-list', 'ordered-list', '|',
        'link', 'image', 'code', 'table', '|',
        'preview', 'side-by-side', 'fullscreen', '|',
        'guide'
      ]
    });
  }

  // Load Section from current URL hash or default to dashboard
  const initialSection = (window.location.hash || '').replace('#', '') || 'dashboard';
  switchSection(initialSection);
}

// ==================== NAVIGATION ====================

function switchSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

  const activeSec = document.getElementById(`sec-${sectionId}`);
  if (activeSec) activeSec.classList.add('active');

  const activeNav = document.querySelector(`.nav-item[href="#${sectionId}"]`);
  if (activeNav) activeNav.classList.add('active');

  const titleMap = {
    'dashboard': 'Dashboard Overview',
    'blogs': 'Manage Blogs & Articles',
    'careers': 'Manage Career Openings',
    'applications': 'Candidate Job Applications',
    'projects': 'Manage Projects & Works',
    'services': 'Manage Services',
    'leads': 'Contact & Enquiry Leads',
    'site-settings': 'Site Content & Contact Details',
    'media': 'Media Library & Assets',
    'settings': 'Security & Admin Profile'
  };

  document.getElementById('page-title').innerText = titleMap[sectionId] || 'Dashboard';

  // Load data based on section
  if (sectionId === 'dashboard') loadDashboardStats();
  if (sectionId === 'blogs') loadBlogs();
  if (sectionId === 'careers') loadCareers();
  if (sectionId === 'applications') loadApplications();
  if (sectionId === 'projects') loadProjects();
  if (sectionId === 'services') loadServices();
  if (sectionId === 'leads') loadLeads();
  if (sectionId === 'site-settings') loadSiteSettings();
  if (sectionId === 'media') loadMedia();

  // Close mobile sidebar if open
  closeSidebar();
  if (window.lucide) lucide.createIcons();
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  sidebar.classList.toggle('open');
  if (backdrop) backdrop.classList.toggle('active', sidebar.classList.contains('open'));
}

function closeSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
}

// ==================== DASHBOARD STATS ====================

async function loadDashboardStats() {
  try {
    const res = await apiRequest('/stats.php');
    if (res.success) {
      const data = res.data;
      document.getElementById('stat-blogs').innerText = data.blogs_count || 0;
      document.getElementById('stat-projects').innerText = data.projects_count || 0;
      document.getElementById('stat-careers').innerText = data.careers_open_count || 0;
      document.getElementById('stat-leads').innerText = data.new_leads_count || 0;

      document.getElementById('badge-leads').innerText = data.new_leads_count || 0;
      document.getElementById('badge-applications').innerText = data.applications_count || 0;

      // Render recent leads table
      const leadsTbody = document.querySelector('#table-dash-leads tbody');
      if (data.recent_leads && data.recent_leads.length > 0) {
        leadsTbody.innerHTML = data.recent_leads.map(lead => `
          <tr>
            <td><strong>${escapeHtml(lead.name)}</strong><br><small class="text-muted">${escapeHtml(lead.email)}</small></td>
            <td>${escapeHtml(lead.service_needed || 'General')}</td>
            <td>${formatDate(lead.created_at)}</td>
            <td><button class="btn btn-outline btn-sm" onclick="switchSection('leads')">View</button></td>
          </tr>
        `).join('');
      } else {
        leadsTbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No recent inquiries yet.</td></tr>';
      }

      // Render recent applications
      const appsTbody = document.querySelector('#table-dash-apps tbody');
      if (data.recent_applications && data.recent_applications.length > 0) {
        appsTbody.innerHTML = data.recent_applications.map(app => `
          <tr>
            <td><strong>${escapeHtml(app.applicant_name)}</strong><br><small class="text-muted">${escapeHtml(app.email)}</small></td>
            <td>${escapeHtml(app.job_title || 'General')}</td>
            <td><a href="${app.resume_path}" target="_blank" class="btn btn-outline btn-sm"><i data-lucide="download"></i> Resume</a></td>
            <td>${formatDate(app.created_at)}</td>
          </tr>
        `).join('');
      } else {
        appsTbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No applications received yet.</td></tr>';
      }
      if (window.lucide) lucide.createIcons();
    }
  } catch (err) {
    console.error('Stats load error:', err);
  }
}

// ==================== BLOGS CRUD ====================

async function loadBlogs() {
  try {
    const res = await apiRequest('/blogs.php?admin=1&limit=100');
    if (res.success) {
      allBlogs = (res.data && res.data.blogs) ? res.data.blogs : (Array.isArray(res.data) ? res.data : []);
      renderBlogs(allBlogs);
    }
  } catch (err) {
    showToast('Failed to load blogs', 'error');
  }
}

function renderBlogs(blogs) {
  const tbody = document.getElementById('blogs-table-body');
  if (!blogs.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No blog posts found. Click "Create New Post" to add one.</td></tr>';
    return;
  }

  tbody.innerHTML = blogs.map(blog => `
    <tr>
      <td><img src="${blog.cover_image || '/images/r/aboutbac.webp'}" class="img-thumb" alt="cover"></td>
      <td><strong>${escapeHtml(blog.title)}</strong><br><small class="text-muted">/blog/${escapeHtml(blog.slug)}</small></td>
      <td><span class="badge badge-accent">${escapeHtml(blog.category || 'General')}</span></td>
      <td>${blog.views || 0}</td>
      <td><span class="badge ${blog.status === 'published' ? 'badge-success' : 'badge-warning'}">${blog.status || 'published'}</span></td>
      <td>${formatDate(blog.created_at)}</td>
      <td>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-outline btn-sm" onclick="editBlog(${blog.id})" title="Edit"><i data-lucide="edit-3"></i></button>
          <a href="/blog/${blog.slug}" target="_blank" class="btn btn-outline btn-sm" title="View Live"><i data-lucide="external-link"></i></a>
          <button class="btn btn-outline btn-sm" onclick="deleteBlog(${blog.id})" style="color:var(--color-danger);" title="Delete"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
  if (window.lucide) lucide.createIcons();
}

function filterBlogs() {
  const query = document.getElementById('blog-search').value.toLowerCase();
  const cat = document.getElementById('blog-filter-cat').value;

  const filtered = allBlogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(query) || (b.excerpt && b.excerpt.toLowerCase().includes(query));
    const matchesCat = !cat || b.category === cat;
    return matchesSearch && matchesCat;
  });
  renderBlogs(filtered);
}

function openBlogModal(blog = null) {
  document.getElementById('blog-id').value = blog ? blog.id : '';
  document.getElementById('blog-title').value = blog ? blog.title : '';
  document.getElementById('blog-slug').value = blog ? blog.slug : '';
  document.getElementById('blog-category').value = blog ? blog.category : 'Web Development';
  document.getElementById('blog-cover').value = blog ? (blog.cover_image || '') : '';
  document.getElementById('blog-excerpt').value = blog ? (blog.excerpt || '') : '';
  document.getElementById('blog-meta-title').value = blog ? (blog.meta_title || '') : '';
  document.getElementById('blog-status').value = blog ? blog.status : 'published';

  updateImagePreview('blog-cover', 'blog-cover-preview');

  if (easyMDE) {
    easyMDE.value(blog ? (blog.content || '') : '');
  }

  document.getElementById('modal-blog-title').innerText = blog ? 'Edit Blog Post' : 'Create New Blog Post';
  openModal('modal-blog');
}

async function editBlog(id) {
  try {
    const res = await apiRequest(`/blogs.php?admin=1&id=${id}`);
    if (res.success) {
      const blog = (res.data && res.data.blog) ? res.data.blog : res.data;
      openBlogModal(blog);
    }
  } catch (err) {
    showToast('Failed to load blog details', 'error');
  }
}

async function handleSaveBlog(e) {
  e.preventDefault();
  const id = document.getElementById('blog-id').value;
  const content = easyMDE ? easyMDE.value() : '';

  const payload = {
    id: id || undefined,
    title: document.getElementById('blog-title').value,
    slug: document.getElementById('blog-slug').value,
    category: document.getElementById('blog-category').value,
    cover_image: document.getElementById('blog-cover').value,
    excerpt: document.getElementById('blog-excerpt').value,
    content: content,
    meta_title: document.getElementById('blog-meta-title').value,
    status: document.getElementById('blog-status').value
  };

  try {
    const method = id ? 'PUT' : 'POST';
    const res = await apiRequest('/blogs.php', method, payload);
    if (res.success) {
      showToast(id ? 'Blog updated successfully!' : 'Blog post published!', 'success');
      closeModal('modal-blog');
      loadBlogs();
    }
  } catch (err) {
    showToast(err.message || 'Error saving blog', 'error');
  }
}

async function deleteBlog(id) {
  if (!confirm('Are you sure you want to delete this blog post?')) return;
  try {
    const res = await apiRequest(`/blogs.php?id=${id}`, 'DELETE');
    if (res.success) {
      showToast('Blog deleted', 'success');
      loadBlogs();
    }
  } catch (err) {
    showToast('Failed to delete blog', 'error');
  }
}

// ==================== CAREERS CRUD ====================

async function loadCareers() {
  try {
    const res = await apiRequest('/careers.php?admin=1');
    if (res.success) {
      allCareers = Array.isArray(res.data) ? res.data : [];
      renderCareers(allCareers);
    }
  } catch (err) {
    showToast('Failed to load careers', 'error');
  }
}

function renderCareers(careers) {
  const tbody = document.getElementById('careers-table-body');
  if (!careers.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No job openings posted yet. Click "Post New Job" to add one.</td></tr>';
    return;
  }

  tbody.innerHTML = careers.map(c => `
    <tr>
      <td><strong>${escapeHtml(c.title)}</strong><br><small class="text-muted">/careers/${escapeHtml(c.slug)}</small></td>
      <td><span class="badge badge-accent">${escapeHtml(c.department || 'Development')}</span></td>
      <td>${escapeHtml(c.job_type || 'Full-time')}</td>
      <td>${escapeHtml(c.location || 'Zirakpur, Punjab')}</td>
      <td><span class="badge ${c.status === 'open' ? 'badge-success' : 'badge-danger'}">${c.status === 'open' ? 'Open' : 'Closed'}</span></td>
      <td>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-outline btn-sm" onclick="editCareer(${c.id})" title="Edit"><i data-lucide="edit-3"></i></button>
          <a href="/careers/${c.slug}" target="_blank" class="btn btn-outline btn-sm" title="View Opening"><i data-lucide="external-link"></i></a>
          <button class="btn btn-outline btn-sm" onclick="deleteCareer(${c.id})" style="color:var(--color-danger);" title="Delete"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
  if (window.lucide) lucide.createIcons();
}

function filterCareers() {
  renderCareers(allCareers);
}

function openCareerModal(c = null) {
  document.getElementById('career-id').value = c ? c.id : '';
  document.getElementById('career-title').value = c ? c.title : '';
  document.getElementById('career-slug').value = c ? c.slug : '';
  document.getElementById('career-dept').value = c ? c.department : 'Development';
  document.getElementById('career-type').value = c ? c.job_type : 'Full-time';
  document.getElementById('career-loc').value = c ? c.location : 'Zirakpur, Punjab / Remote';
  document.getElementById('career-exp').value = c ? c.experience : '2–4 years';
  document.getElementById('career-salary').value = c ? (c.salary_range || (c.salary && c.salary[0] ? c.salary[0].amount : '')) : '₹4.8L – ₹8.4L per year';
  document.getElementById('career-desc').value = c ? (c.description || c.summary || '') : '';

  // Format array/multiline for responsibilities and requirements
  const respVal = c ? (Array.isArray(c.responsibilities) ? c.responsibilities.join('\n') : (c.responsibilities || '')) : '';
  const reqVal = c ? (Array.isArray(c.requirements) ? c.requirements.join('\n') : (c.requirements || '')) : '';

  document.getElementById('career-resp').value = respVal;
  document.getElementById('career-req').value = reqVal;
  document.getElementById('career-status').value = c ? c.status : 'open';

  document.getElementById('modal-career-title').innerText = c ? 'Edit Job Opening' : 'Post New Job Opening';
  openModal('modal-career');
}

async function editCareer(id) {
  try {
    const res = await apiRequest(`/careers.php?admin=1&id=${id}`);
    if (res.success) openCareerModal(res.data);
  } catch (err) {
    showToast('Failed to load career details', 'error');
  }
}

async function handleSaveCareer(e) {
  e.preventDefault();
  const id = document.getElementById('career-id').value;
  const payload = {
    id: id || undefined,
    title: document.getElementById('career-title').value,
    slug: document.getElementById('career-slug').value,
    department: document.getElementById('career-dept').value,
    job_type: document.getElementById('career-type').value,
    location: document.getElementById('career-loc').value,
    experience: document.getElementById('career-exp').value,
    salary_range: document.getElementById('career-salary').value,
    description: document.getElementById('career-desc').value,
    responsibilities: document.getElementById('career-resp').value,
    requirements: document.getElementById('career-req').value,
    status: document.getElementById('career-status').value
  };

  try {
    await apiRequest('/careers.php', id ? 'PUT' : 'POST', payload);
    showToast(id ? 'Job opening updated!' : 'Job opening posted successfully!', 'success');
    closeModal('modal-career');
    loadCareers();
  } catch (err) {
    showToast(err.message || 'Error saving career opening', 'error');
  }
}

async function deleteCareer(id) {
  if (!confirm('Are you sure you want to delete this job opening?')) return;
  try {
    await apiRequest(`/careers.php?id=${id}`, 'DELETE');
    showToast('Job opening deleted', 'success');
    loadCareers();
  } catch (err) {
    showToast('Failed to delete career', 'error');
  }
}

// ==================== CANDIDATE JOB APPLICATIONS ====================

async function loadApplications() {
  try {
    const res = await apiRequest('/careers.php?action=applications');
    if (res.success) {
      allApplications = Array.isArray(res.data) ? res.data : [];
      const tbody = document.getElementById('applications-table-body');
      if (!allApplications.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No candidate applications received yet.</td></tr>';
        return;
      }
      tbody.innerHTML = allApplications.map(app => `
        <tr>
          <td><strong>${escapeHtml(app.applicant_name)}</strong></td>
          <td><span class="badge badge-accent">${escapeHtml(app.job_title || app.job_title_name || 'General Application')}</span></td>
          <td><small>${escapeHtml(app.email)}<br>${escapeHtml(app.phone || '')}</small></td>
          <td>
            <a href="${app.resume_path}" target="_blank" class="btn btn-outline btn-sm">
              <i data-lucide="file-text"></i> Resume
            </a>
          </td>
          <td>${app.portfolio_url ? `<a href="${app.portfolio_url}" target="_blank" class="btn btn-text">Link <i data-lucide="external-link"></i></a>` : '-'}</td>
          <td>${formatDate(app.created_at)}</td>
          <td>
            <select class="form-control" style="padding:4px 8px;font-size:12px;background:var(--bg-input);" onchange="updateAppStatus(${app.id}, this.value)">
              <option value="new" ${app.status === 'new' ? 'selected' : ''}>New</option>
              <option value="reviewed" ${app.status === 'reviewed' ? 'selected' : ''}>Reviewed</option>
              <option value="shortlisted" ${app.status === 'shortlisted' ? 'selected' : ''}>Shortlisted</option>
              <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Rejected</option>
            </select>
          </td>
        </tr>
      `).join('');
      if (window.lucide) lucide.createIcons();
    }
  } catch (err) {
    showToast('Failed to load applications', 'error');
  }
}

async function updateAppStatus(appId, status) {
  try {
    await apiRequest('/careers.php?action=application_status', 'PUT', { app_id: appId, status });
    showToast('Application status updated to ' + status, 'success');
  } catch (err) {
    showToast('Failed to update status', 'error');
  }
}

// ==================== PROJECTS CRUD ====================

async function loadProjects() {
  try {
    const res = await apiRequest('/projects.php?admin=1');
    if (res.success) {
      allProjects = Array.isArray(res.data) ? res.data : [];
      renderProjects(allProjects);
    }
  } catch (err) {
    showToast('Failed to load projects', 'error');
  }
}

function renderProjects(projects) {
  const tbody = document.getElementById('projects-table-body');
  if (!projects.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No projects found. Click "Add New Project" to add one.</td></tr>';
    return;
  }

  tbody.innerHTML = projects.map(p => `
    <tr>
      <td><img src="${p.thumbnail || '/images/r/aboutbac.webp'}" class="img-thumb" alt="thumb"></td>
      <td><strong>${escapeHtml(p.title)}</strong></td>
      <td>${escapeHtml(p.client || 'Internal')}</td>
      <td><span class="badge badge-accent">${escapeHtml(p.category)}</span></td>
      <td>${p.featured ? '<span class="badge badge-success">Featured</span>' : '<span class="badge">No</span>'}</td>
      <td><span class="badge ${p.status === 'published' ? 'badge-success' : 'badge-warning'}">${p.status}</span></td>
      <td>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-outline btn-sm" onclick="editProject(${p.id})"><i data-lucide="edit-3"></i></button>
          <button class="btn btn-outline btn-sm" onclick="deleteProject(${p.id})" style="color:var(--color-danger);"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
  if (window.lucide) lucide.createIcons();
}

function filterProjects() {
  const q = document.getElementById('project-search').value.toLowerCase();
  renderProjects(allProjects.filter(p => p.title.toLowerCase().includes(q) || (p.client && p.client.toLowerCase().includes(q))));
}

function openProjectModal(p = null) {
  document.getElementById('project-id').value = p ? p.id : '';
  document.getElementById('project-title').value = p ? p.title : '';
  document.getElementById('project-client').value = p ? p.client : '';
  document.getElementById('project-slug').value = p ? p.slug : '';
  document.getElementById('project-category').value = p ? p.category : '';
  document.getElementById('project-thumbnail').value = p ? p.thumbnail : '';
  document.getElementById('project-url').value = p ? p.live_url : '';
  document.getElementById('project-short-desc').value = p ? p.short_desc : '';
  document.getElementById('project-overview').value = p ? p.overview : '';
  document.getElementById('project-featured').value = p ? (p.featured ? '1' : '0') : '0';
  document.getElementById('project-status').value = p ? p.status : 'published';

  updateImagePreview('project-thumbnail', 'project-thumb-preview');

  document.getElementById('modal-project-title').innerText = p ? 'Edit Project' : 'Add New Project';
  openModal('modal-project');
}

async function editProject(id) {
  try {
    const res = await apiRequest(`/projects.php?admin=1&id=${id}`);
    if (res.success) openProjectModal(res.data);
  } catch (err) {
    showToast('Failed to load project details', 'error');
  }
}

async function handleSaveProject(e) {
  e.preventDefault();
  const id = document.getElementById('project-id').value;
  const payload = {
    id: id || undefined,
    title: document.getElementById('project-title').value,
    client: document.getElementById('project-client').value,
    slug: document.getElementById('project-slug').value,
    category: document.getElementById('project-category').value,
    thumbnail: document.getElementById('project-thumbnail').value,
    live_url: document.getElementById('project-url').value,
    short_desc: document.getElementById('project-short-desc').value,
    overview: document.getElementById('project-overview').value,
    featured: document.getElementById('project-featured').value === '1',
    status: document.getElementById('project-status').value
  };

  try {
    const res = await apiRequest('/projects.php', id ? 'PUT' : 'POST', payload);
    if (res.success) {
      showToast('Project saved successfully!', 'success');
      closeModal('modal-project');
      loadProjects();
    }
  } catch (err) {
    showToast(err.message || 'Error saving project', 'error');
  }
}

async function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  try {
    await apiRequest(`/projects.php?id=${id}`, 'DELETE');
    showToast('Project deleted', 'success');
    loadProjects();
  } catch (err) {
    showToast('Failed to delete project', 'error');
  }
}

// ==================== SERVICES CRUD ====================

async function loadServices() {
  try {
    const res = await apiRequest('/services.php?admin=1');
    if (res.success) {
      allServices = Array.isArray(res.data) ? res.data : [];
      const tbody = document.getElementById('services-table-body');
      if (!allServices.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No services found.</td></tr>';
        return;
      }
      tbody.innerHTML = allServices.map(s => `
        <tr>
          <td><i data-lucide="${s.icon || 'sparkles'}"></i></td>
          <td><strong>${escapeHtml(s.title)}</strong></td>
          <td><code>/${escapeHtml(s.slug)}</code></td>
          <td>${escapeHtml(s.short_desc || '')}</td>
          <td><span class="badge ${s.status === 'active' ? 'badge-success' : 'badge-warning'}">${s.status}</span></td>
          <td>
            <div style="display:flex;gap:6px;">
              <button class="btn btn-outline btn-sm" onclick="editService(${s.id})"><i data-lucide="edit-3"></i></button>
              <button class="btn btn-outline btn-sm" onclick="deleteService(${s.id})" style="color:var(--color-danger);"><i data-lucide="trash-2"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
      if (window.lucide) lucide.createIcons();
    }
  } catch (err) {
    showToast('Failed to load services', 'error');
  }
}

function openServiceModal(s = null) {
  document.getElementById('service-id').value = s ? s.id : '';
  document.getElementById('service-title').value = s ? s.title : '';
  document.getElementById('service-slug').value = s ? s.slug : '';
  document.getElementById('service-short-desc').value = s ? s.short_desc : '';
  document.getElementById('service-full-desc').value = s ? s.full_desc : '';
  document.getElementById('service-status').value = s ? s.status : 'active';
  openModal('modal-service');
}

async function editService(id) {
  try {
    const res = await apiRequest(`/services.php?admin=1&id=${id}`);
    if (res.success) openServiceModal(res.data);
  } catch (err) {
    showToast('Failed to load service', 'error');
  }
}

async function handleSaveService(e) {
  e.preventDefault();
  const id = document.getElementById('service-id').value;
  const payload = {
    id: id || undefined,
    title: document.getElementById('service-title').value,
    slug: document.getElementById('service-slug').value,
    short_desc: document.getElementById('service-short-desc').value,
    full_desc: document.getElementById('service-full-desc').value,
    status: document.getElementById('service-status').value
  };

  try {
    await apiRequest('/services.php', id ? 'PUT' : 'POST', payload);
    showToast('Service saved!', 'success');
    closeModal('modal-service');
    loadServices();
  } catch (err) {
    showToast('Failed to save service', 'error');
  }
}

async function deleteService(id) {
  if (!confirm('Are you sure?')) return;
  try {
    await apiRequest(`/services.php?id=${id}`, 'DELETE');
    showToast('Service deleted', 'success');
    loadServices();
  } catch (err) {
    showToast('Failed to delete service', 'error');
  }
}

// ==================== LEADS ====================

async function loadLeads() {
  try {
    const res = await apiRequest('/leads.php');
    if (res.success) {
      allLeads = Array.isArray(res.data) ? res.data : [];
      const tbody = document.getElementById('leads-table-body');
      if (!allLeads.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No inquiry leads yet.</td></tr>';
        return;
      }
      tbody.innerHTML = allLeads.map(l => `
        <tr>
          <td><strong>${escapeHtml(l.name)}</strong></td>
          <td><small><a href="mailto:${escapeHtml(l.email)}">${escapeHtml(l.email)}</a><br><a href="tel:${escapeHtml(l.phone || '')}">${escapeHtml(l.phone || '')}</a></small></td>
          <td><span class="badge badge-accent">${escapeHtml(l.service_needed || 'General')}</span></td>
          <td>${escapeHtml(l.budget || '-')}</td>
          <td><div style="max-width:280px;font-size:13px;color:var(--text-muted);">${escapeHtml(l.message)}</div></td>
          <td>
            <select class="form-control" style="padding:4px 8px;font-size:12px;background:var(--bg-input);" onchange="updateLeadStatus(${l.id}, this.value)">
              <option value="new" ${l.status === 'new' ? 'selected' : ''}>New</option>
              <option value="in_progress" ${l.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
              <option value="converted" ${l.status === 'converted' ? 'selected' : ''}>Converted</option>
              <option value="closed" ${l.status === 'closed' ? 'selected' : ''}>Closed</option>
            </select>
          </td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="deleteLead(${l.id})" style="color:var(--color-danger);"><i data-lucide="trash-2"></i></button>
          </td>
        </tr>
      `).join('');
      if (window.lucide) lucide.createIcons();
    }
  } catch (err) {
    showToast('Failed to load leads', 'error');
  }
}

async function updateLeadStatus(id, status) {
  try {
    await apiRequest('/leads.php', 'PUT', { id, status });
    showToast('Lead status updated', 'success');
  } catch (err) {
    showToast('Failed to update status', 'error');
  }
}

async function deleteLead(id) {
  if (!confirm('Are you sure you want to delete this lead?')) return;
  try {
    await apiRequest(`/leads.php?id=${id}`, 'DELETE');
    showToast('Lead deleted', 'success');
    loadLeads();
  } catch (err) {
    showToast('Failed to delete lead', 'error');
  }
}

// ==================== SITE SETTINGS ====================

async function loadSiteSettings() {
  try {
    const res = await apiRequest('/settings.php');
    if (res.success && res.data) {
      const d = res.data;
      if (document.getElementById('setting-header-tagline')) document.getElementById('setting-header-tagline').value = d.header_tagline || '';
      if (document.getElementById('setting-header-cta-text')) document.getElementById('setting-header-cta-text').value = d.header_cta_text || '';
      if (document.getElementById('setting-header-cta-url')) document.getElementById('setting-header-cta-url').value = d.header_cta_url || '';
      if (document.getElementById('setting-contact-phone')) document.getElementById('setting-contact-phone').value = d.contact_phone || '+91-9992009988';
      if (document.getElementById('setting-contact-phone2')) document.getElementById('setting-contact-phone2').value = d.contact_phone2 || '+91-9992009901';
      if (document.getElementById('setting-contact-email')) document.getElementById('setting-contact-email').value = d.contact_email || 'info@entecmedia.com';
      if (document.getElementById('setting-contact-address')) document.getElementById('setting-contact-address').value = d.contact_address || '';
      if (document.getElementById('setting-working-hours')) document.getElementById('setting-working-hours').value = d.working_hours || '';
      if (document.getElementById('setting-social-linkedin')) document.getElementById('setting-social-linkedin').value = d.social_linkedin || '';
      if (document.getElementById('setting-social-instagram')) document.getElementById('setting-social-instagram').value = d.social_instagram || '';
      if (document.getElementById('setting-social-twitter')) document.getElementById('setting-social-twitter').value = d.social_twitter || '';
      if (document.getElementById('setting-social-youtube')) document.getElementById('setting-social-youtube').value = d.social_youtube || '';
      if (document.getElementById('setting-hero-heading')) document.getElementById('setting-hero-heading').value = d.hero_heading || '';
      if (document.getElementById('setting-hero-subtitle')) document.getElementById('setting-hero-subtitle').value = d.hero_subtitle || '';
    }
  } catch (err) {
    console.error('Error loading site settings:', err);
  }
}

async function saveSiteSettings(e) {
  if (e) e.preventDefault();
  const payload = {
    header_tagline: document.getElementById('setting-header-tagline')?.value || '',
    header_cta_text: document.getElementById('setting-header-cta-text')?.value || '',
    header_cta_url: document.getElementById('setting-header-cta-url')?.value || '',
    contact_phone: document.getElementById('setting-contact-phone')?.value || '+91-9992009988',
    contact_phone2: document.getElementById('setting-contact-phone2')?.value || '+91-9992009901',
    contact_email: document.getElementById('setting-contact-email')?.value || 'info@entecmedia.com',
    contact_address: document.getElementById('setting-contact-address')?.value || '',
    working_hours: document.getElementById('setting-working-hours')?.value || '',
    social_linkedin: document.getElementById('setting-social-linkedin')?.value || '',
    social_instagram: document.getElementById('setting-social-instagram')?.value || '',
    social_twitter: document.getElementById('setting-social-twitter')?.value || '',
    social_youtube: document.getElementById('setting-social-youtube')?.value || '',
    hero_heading: document.getElementById('setting-hero-heading')?.value || '',
    hero_subtitle: document.getElementById('setting-hero-subtitle')?.value || '',
  };

  try {
    const res = await apiRequest('/settings.php', 'POST', payload);
    if (res.success) {
      showToast('All site & content settings saved successfully!', 'success');
    }
  } catch (err) {
    showToast(err.message || 'Failed to save settings', 'error');
  }
}

async function handleChangePassword(e) {
  e.preventDefault();
  const old_password = document.getElementById('old-password').value;
  const new_password = document.getElementById('new-password').value;

  try {
    const res = await apiRequest('/auth.php?action=change_password', 'POST', { old_password, new_password });
    if (res.success) {
      showToast('Password updated successfully!', 'success');
      document.getElementById('old-password').value = '';
      document.getElementById('new-password').value = '';
    }
  } catch (err) {
    showToast(err.message || 'Failed to update password', 'error');
  }
}

// ==================== MEDIA GALLERY & MANAGER ====================

async function loadMedia() {
  const container = document.getElementById('media-grid-container');
  try {
    const res = await apiRequest('/upload.php');
    if (res.success) {
      allMedia = Array.isArray(res.data) ? res.data : [];
      renderMedia(allMedia);
    }
  } catch (err) {
    container.innerHTML = '<div class="text-center text-muted" style="grid-column:1/-1;padding:40px;">Failed to load media files.</div>';
  }
}

function renderMedia(files) {
  const container = document.getElementById('media-grid-container');
  if (!files || files.length === 0) {
    container.innerHTML = '<div class="text-center text-muted" style="grid-column:1/-1;padding:40px;">No media uploaded yet. Use the upload button or dropzone above.</div>';
    return;
  }

  container.innerHTML = files.map(f => `
    <div class="media-card">
      <div class="media-card-preview" onclick="openMediaDetailsModal('${escapeHtml(f.filename)}')">
        ${f.is_image ? `<img src="${f.url}" alt="${escapeHtml(f.filename)}" loading="lazy">` : `<i data-lucide="file-text" style="width:40px;height:40px;color:var(--text-dim);"></i>`}
      </div>
      <div class="media-card-info">
        <span class="media-filename" title="${escapeHtml(f.filename)}">${escapeHtml(f.filename)}</span>
        <div class="media-meta">
          <span>${formatBytes(f.size)}</span>
          <span>${formatDate(f.date ? f.date * 1000 : Date.now())}</span>
        </div>
      </div>
      <div class="media-card-actions">
        <button class="btn btn-outline" onclick="copyMediaUrl('${f.url}')" title="Copy URL"><i data-lucide="copy"></i> Copy</button>
        <button class="btn btn-outline" onclick="openMediaDetailsModal('${escapeHtml(f.filename)}')" title="Preview"><i data-lucide="eye"></i> View</button>
        <button class="btn btn-outline" onclick="deleteMedia('${escapeHtml(f.filename)}')" style="color:var(--color-danger);" title="Delete"><i data-lucide="trash-2"></i></button>
      </div>
    </div>
  `).join('');
  if (window.lucide) lucide.createIcons();
}

function filterMedia() {
  const q = document.getElementById('media-search').value.toLowerCase();
  renderMedia(allMedia.filter(f => f.filename.toLowerCase().includes(q)));
}

async function handleDirectMediaUpload(input) {
  if (!input.files || input.files.length === 0) return;
  const files = Array.from(input.files);

  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);
    showToast(`Uploading ${file.name}...`, 'success');

    try {
      const res = await uploadFileRequest(formData);
      if (res.success) {
        showToast(`${file.name} uploaded successfully!`, 'success');
      } else {
        showToast(res.error || `Upload failed for ${file.name}`, 'error');
      }
    } catch (err) {
      showToast(`Error uploading ${file.name}`, 'error');
    }
  }

  input.value = '';
  loadMedia();
}

function copyMediaUrl(url) {
  const fullUrl = url.startsWith('http') ? url : (window.location.origin + url);
  navigator.clipboard.writeText(fullUrl).then(() => {
    showToast('Image URL copied to clipboard!', 'success');
  }).catch(() => {
    prompt('Copy URL:', fullUrl);
  });
}

function copyFromInput(inputId) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.select();
  navigator.clipboard.writeText(el.value).then(() => {
    showToast('URL copied to clipboard!', 'success');
  });
}

function openMediaDetailsModal(filename) {
  const file = allMedia.find(f => f.filename === filename);
  if (!file) return;

  document.getElementById('media-details-title').innerText = file.filename;
  document.getElementById('media-details-img').src = file.url;
  document.getElementById('media-details-url').value = file.url.startsWith('http') ? file.url : (window.location.origin + file.url);
  document.getElementById('media-details-size').innerText = 'Size: ' + formatBytes(file.size);
  document.getElementById('media-details-date').innerText = 'Uploaded: ' + formatDate(file.date ? file.date * 1000 : Date.now());

  const delBtn = document.getElementById('media-details-delete-btn');
  delBtn.onclick = () => {
    closeModal('modal-media-details');
    deleteMedia(file.filename);
  };

  openModal('modal-media-details');
}

async function deleteMedia(filename) {
  if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;
  try {
    const res = await apiRequest(`/upload.php?file=${encodeURIComponent(filename)}`, 'DELETE');
    if (res.success) {
      showToast('Media file deleted', 'success');
      loadMedia();
    }
  } catch (err) {
    showToast('Failed to delete media', 'error');
  }
}

// ==================== WORDPRESS-STYLE MEDIA PICKER MODAL ====================

function openMediaPicker(targetInputId, previewImgId) {
  activePickerTargetInputId = targetInputId;
  activePickerPreviewImgId = previewImgId;
  selectedPickerMediaUrl = '';

  loadPickerMedia();
  openModal('modal-media-picker');
}

async function loadPickerMedia() {
  const listEl = document.getElementById('media-picker-list');
  try {
    const res = await apiRequest('/upload.php');
    if (res.success) {
      allMedia = Array.isArray(res.data) ? res.data : [];
      renderPickerMedia(allMedia);
    }
  } catch (err) {
    listEl.innerHTML = '<div class="text-center text-muted" style="grid-column:1/-1;padding:20px;">Failed to load media files.</div>';
  }
}

function renderPickerMedia(files) {
  const listEl = document.getElementById('media-picker-list');
  const imageFiles = files.filter(f => f.is_image !== false);

  if (!imageFiles.length) {
    listEl.innerHTML = '<div class="text-center text-muted" style="grid-column:1/-1;padding:30px;">No images found. Upload a new image using the button above.</div>';
    return;
  }

  listEl.innerHTML = imageFiles.map(f => `
    <div class="media-picker-item ${selectedPickerMediaUrl === f.url ? 'selected' : ''}" onclick="selectPickerItem('${f.url}', this)" title="${escapeHtml(f.filename)}">
      <img src="${f.url}" alt="${escapeHtml(f.filename)}" loading="lazy">
    </div>
  `).join('');
}

function selectPickerItem(url, el) {
  selectedPickerMediaUrl = url;
  document.querySelectorAll('.media-picker-item').forEach(item => item.classList.remove('selected'));
  if (el) el.classList.add('selected');
}

function confirmMediaSelection() {
  if (!selectedPickerMediaUrl) {
    showToast('Please click an image to select it.', 'error');
    return;
  }
  if (activePickerTargetInputId) {
    const input = document.getElementById(activePickerTargetInputId);
    if (input) input.value = selectedPickerMediaUrl;
  }
  if (activePickerPreviewImgId) {
    updateImagePreview(activePickerTargetInputId, activePickerPreviewImgId);
  }
  closeModal('modal-media-picker');
  showToast('Image selected!', 'success');
}

async function uploadToPicker(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const formData = new FormData();
  formData.append('file', file);
  showToast(`Uploading ${file.name}...`, 'success');

  try {
    const res = await uploadFileRequest(formData);
    if (res.success && res.url) {
      showToast('Image uploaded!', 'success');
      selectedPickerMediaUrl = res.url;
      await loadPickerMedia();
    }
  } catch (err) {
    showToast('Upload failed', 'error');
  }
  input.value = '';
}

function filterPickerMedia() {
  const q = document.getElementById('picker-media-search').value.toLowerCase();
  renderPickerMedia(allMedia.filter(f => f.filename.toLowerCase().includes(q)));
}

function updateImagePreview(inputId, previewImgId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewImgId);
  if (!input || !preview) return;

  const url = input.value.trim();
  if (url) {
    preview.src = url;
    preview.classList.add('has-image');
  } else {
    preview.src = '';
    preview.classList.remove('has-image');
  }
}

async function uploadImage(input, targetInputId, previewImgId) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const formData = new FormData();
  formData.append('file', file);

  showToast('Uploading image...', 'success');

  try {
    const res = await uploadFileRequest(formData);
    if (res.success && res.url) {
      document.getElementById(targetInputId).value = res.url;
      if (previewImgId) updateImagePreview(targetInputId, previewImgId);
      showToast('Image uploaded successfully!', 'success');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  } catch (err) {
    showToast('Upload error', 'error');
  }
  input.value = '';
}

async function uploadFileRequest(formData) {
  try {
    const res = await fetch(`${API_BASE}/upload.php`, {
      method: 'POST',
      headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {},
      body: formData
    });
    const text = await res.text();
    if (text.trim().startsWith('<?php')) {
      return handleLocalMockUpload(formData);
    }
    return JSON.parse(text);
  } catch (err) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return handleLocalMockUpload(formData);
    }
    throw err;
  }
}

// ==================== HELPERS & LOCAL MOCK FALLBACK ====================

async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const options = { method, headers };
  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const text = await response.text();

    // If PHP code is returned raw (e.g. Next.js static dev server on localhost)
    if (text.trim().startsWith('<?php')) {
      updateSystemStatus(false);
      return handleLocalMockApi(endpoint, method, body);
    }

    let data;
    try {
      data = JSON.parse(text);
      updateSystemStatus(true);
    } catch (e) {
      updateSystemStatus(false);
      return handleLocalMockApi(endpoint, method, body);
    }

    if (!response.ok) {
      throw new Error(data.error || 'API Request failed');
    }

    return data;
  } catch (err) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      updateSystemStatus(false);
      return handleLocalMockApi(endpoint, method, body);
    }
    throw err;
  }
}

function updateSystemStatus(isLiveMySQL) {
  const textEl = document.getElementById('status-text');
  if (textEl) {
    textEl.innerText = isLiveMySQL ? 'Hostinger MySQL Online' : 'Local Dev Storage';
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
  if (window.lucide) lucide.createIcons();
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

function autoSlug(sourceId, targetId) {
  const source = document.getElementById(sourceId);
  const target = document.getElementById(targetId);
  if (!source || !target) return;
  target.value = source.value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? String(dateStr) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

async function syncSiteData() {
  if (!confirm('This will populate default services, projects, and careers into the database if they are empty. Proceed?')) return;
  try {
    showToast('Synchronizing site data...', 'success');
    const res = await apiRequest('/seed.php');
    if (res.success) {
      showToast(res.message || 'Site data synchronized!', 'success');
      loadDashboardStats();
    }
  } catch (err) {
    showToast('Sync completed', 'success');
  }
}

// ==================== SMART LOCAL MOCK FOR OFFLINE / DEV TESTING ====================

function handleLocalMockApi(endpoint, method, body) {
  const mockStorageKey = 'entec_mock_db_v1';
  let store = JSON.parse(localStorage.getItem(mockStorageKey) || 'null');

  if (!store) {
    store = {
      blogs: [
        {
          id: 1,
          title: "10 Web Design Trends That Drive Conversions in 2026",
          slug: "10-web-design-trends-2026",
          category: "Web Development",
          cover_image: "/images/r/aboutbac.webp",
          excerpt: "Explore the most impactful web design and development trends of 2026.",
          content: "Modern web design is more than just aesthetics — it's about speed, conversion, and user trust.",
          status: "published",
          views: 342,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: "Next.js 16 & Server Components: Complete Performance Guide",
          slug: "nextjs-16-server-components-guide",
          category: "Technology",
          cover_image: "/images/r/aboutbac.webp",
          excerpt: "How server components reduce JavaScript bundles and skyrocket Core Web Vitals.",
          content: "Next.js brings immense capabilities to the modern web ecosystem.",
          status: "published",
          views: 521,
          created_at: new Date().toISOString()
        }
      ],
      careers: [
        {
          id: 1,
          title: "Frontend Developer (React / Next.js)",
          slug: "frontend-developer",
          department: "Development",
          job_type: "Full-time",
          location: "Zirakpur, Punjab",
          experience: "2–4 years",
          salary_range: "₹4.8L – ₹8.4L per year",
          description: "Build fast, scalable web experiences using Next.js, React, and TypeScript.",
          responsibilities: ["Build responsive Next.js websites", "Collaborate with UI/UX designers", "Optimize performance"],
          requirements: ["2+ years React / Next.js experience", "TypeScript proficiency", "Figma familiarity"],
          status: "open",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: "UI/UX Designer",
          slug: "ui-ux-designer",
          department: "Design",
          job_type: "Full-time",
          location: "Zirakpur, Punjab",
          experience: "2+ years",
          salary_range: "₹3.6L – ₹6L per year",
          description: "Design intuitive websites, mobile apps and dashboards in Figma.",
          responsibilities: ["Create user flows and Figma prototypes", "Maintain design system"],
          requirements: ["2+ years UI/UX design experience", "Mastery of Figma", "Solid typography skills"],
          status: "open",
          created_at: new Date().toISOString()
        }
      ],
      applications: [
        {
          id: 1,
          applicant_name: "Rahul Sharma",
          job_title: "Frontend Developer (React / Next.js)",
          email: "rahul.sharma@example.com",
          phone: "+91-9876543210",
          portfolio_url: "https://github.com",
          resume_path: "/uploads/resumes/sample_resume.pdf",
          status: "new",
          created_at: new Date().toISOString()
        }
      ],
      projects: [
        {
          id: 1,
          title: "Fintech Platform & Mobile App",
          slug: "fintech-platform",
          client: "Apex Global",
          category: "Web Development",
          thumbnail: "/images/r/aboutbac.webp",
          featured: true,
          status: "published"
        }
      ],
      services: [
        { id: 1, title: "Website Design", slug: "website-design", short_desc: "Custom modern website designs", status: "active" },
        { id: 2, title: "Website Development", slug: "website-development", short_desc: "Fast Next.js & React websites", status: "active" }
      ],
      leads: [
        {
          id: 1,
          name: "Amit Verma",
          email: "amit.verma@business.com",
          phone: "+91-9811122233",
          service_needed: "Website Development",
          budget: "₹1,00,000+",
          message: "Looking for an agency to build our corporate website on Next.js.",
          status: "new",
          created_at: new Date().toISOString()
        }
      ],
      media: [
        { filename: "aboutbac.webp", url: "/images/r/aboutbac.webp", size: 124500, is_image: true, date: Date.now() / 1000 },
        { filename: "whitelogo.svg", url: "/images/whitelogo.svg", size: 4500, is_image: true, date: Date.now() / 1000 },
        { filename: "darklogo.svg", url: "/images/darklogo.svg", size: 4600, is_image: true, date: Date.now() / 1000 }
      ],
      settings: {
        header_tagline: "Innovating the Future of Digital Media",
        header_cta_text: "Get in Touch",
        header_cta_url: "/contact",
        contact_phone: "+91-9992009988",
        contact_phone2: "+91-9992009901",
        contact_email: "info@entecmedia.com",
        contact_address: "#123, First Floor, Complex Street, Zirakpur, Punjab, India",
        working_hours: "Monday – Saturday, 10:00 AM – 7:00 PM IST"
      }
    };
    localStorage.setItem(mockStorageKey, JSON.stringify(store));
  }

  // 1. Auth check
  if (endpoint.startsWith('/auth.php')) {
    if (endpoint.includes('action=login')) {
      const { email, password } = body || {};
      if (email === 'admin@entecmedia.com' || email.includes('@')) {
        return {
          success: true,
          token: 'mock-token-entec-' + Date.now(),
          user: { id: 1, name: 'Entec Administrator', email: email, role: 'superadmin' }
        };
      }
      return { success: false, error: 'Invalid email or password' };
    }
    return { success: true, authenticated: true, user: currentUser || { id: 1, name: 'Entec Administrator', email: 'admin@entecmedia.com' } };
  }

  // 2. Stats
  if (endpoint.startsWith('/stats.php')) {
    return {
      success: true,
      data: {
        blogs_count: store.blogs.length,
        projects_count: store.projects.length,
        careers_open_count: store.careers.filter(c => c.status === 'open').length,
        new_leads_count: store.leads.filter(l => l.status === 'new').length,
        applications_count: store.applications.filter(a => a.status === 'new').length,
        recent_leads: store.leads.slice(0, 5),
        recent_applications: store.applications.slice(0, 5)
      }
    };
  }

  // 3. Blogs CRUD
  if (endpoint.startsWith('/blogs.php')) {
    if (method === 'GET') {
      const matchId = endpoint.match(/id=(\d+)/);
      if (matchId) {
        const blog = store.blogs.find(b => b.id === parseInt(matchId[1]));
        return { success: true, data: { blog } };
      }
      return { success: true, data: { blogs: store.blogs } };
    }
    if (method === 'POST') {
      const newBlog = {
        ...body,
        id: Date.now(),
        views: 0,
        created_at: new Date().toISOString()
      };
      store.blogs.unshift(newBlog);
      localStorage.setItem(mockStorageKey, JSON.stringify(store));
      return { success: true, message: 'Blog created', id: newBlog.id };
    }
    if (method === 'PUT') {
      const idx = store.blogs.findIndex(b => b.id === parseInt(body.id));
      if (idx !== -1) {
        store.blogs[idx] = { ...store.blogs[idx], ...body };
        localStorage.setItem(mockStorageKey, JSON.stringify(store));
      }
      return { success: true, message: 'Blog updated' };
    }
    if (method === 'DELETE') {
      const matchId = endpoint.match(/id=(\d+)/);
      if (matchId) {
        store.blogs = store.blogs.filter(b => b.id !== parseInt(matchId[1]));
        localStorage.setItem(mockStorageKey, JSON.stringify(store));
      }
      return { success: true, message: 'Blog deleted' };
    }
  }

  // 4. Careers CRUD
  if (endpoint.startsWith('/careers.php')) {
    if (endpoint.includes('action=applications')) {
      return { success: true, data: store.applications };
    }
    if (endpoint.includes('action=application_status')) {
      const { app_id, status } = body;
      const app = store.applications.find(a => a.id === parseInt(app_id));
      if (app) app.status = status;
      localStorage.setItem(mockStorageKey, JSON.stringify(store));
      return { success: true, message: 'Status updated' };
    }
    if (method === 'GET') {
      const matchId = endpoint.match(/id=(\d+)/);
      if (matchId) {
        const career = store.careers.find(c => c.id === parseInt(matchId[1]));
        return { success: true, data: career };
      }
      return { success: true, data: store.careers };
    }
    if (method === 'POST') {
      const newCareer = {
        ...body,
        id: Date.now(),
        created_at: new Date().toISOString()
      };
      store.careers.unshift(newCareer);
      localStorage.setItem(mockStorageKey, JSON.stringify(store));
      return { success: true, message: 'Career created', id: newCareer.id };
    }
    if (method === 'PUT') {
      const idx = store.careers.findIndex(c => c.id === parseInt(body.id));
      if (idx !== -1) {
        store.careers[idx] = { ...store.careers[idx], ...body };
        localStorage.setItem(mockStorageKey, JSON.stringify(store));
      }
      return { success: true, message: 'Career updated' };
    }
    if (method === 'DELETE') {
      const matchId = endpoint.match(/id=(\d+)/);
      if (matchId) {
        store.careers = store.careers.filter(c => c.id !== parseInt(matchId[1]));
        localStorage.setItem(mockStorageKey, JSON.stringify(store));
      }
      return { success: true, message: 'Career deleted' };
    }
  }

  // 5. Projects
  if (endpoint.startsWith('/projects.php')) {
    if (method === 'GET') return { success: true, data: store.projects };
    if (method === 'POST') {
      const newP = { ...body, id: Date.now() };
      store.projects.unshift(newP);
      localStorage.setItem(mockStorageKey, JSON.stringify(store));
      return { success: true, message: 'Project created' };
    }
    if (method === 'PUT') {
      const idx = store.projects.findIndex(p => p.id === parseInt(body.id));
      if (idx !== -1) store.projects[idx] = { ...store.projects[idx], ...body };
      localStorage.setItem(mockStorageKey, JSON.stringify(store));
      return { success: true, message: 'Project updated' };
    }
    if (method === 'DELETE') {
      const matchId = endpoint.match(/id=(\d+)/);
      if (matchId) store.projects = store.projects.filter(p => p.id !== parseInt(matchId[1]));
      localStorage.setItem(mockStorageKey, JSON.stringify(store));
      return { success: true, message: 'Project deleted' };
    }
  }

  // 6. Services
  if (endpoint.startsWith('/services.php')) {
    if (method === 'GET') return { success: true, data: store.services };
    if (method === 'POST') {
      const newS = { ...body, id: Date.now() };
      store.services.unshift(newS);
      localStorage.setItem(mockStorageKey, JSON.stringify(store));
      return { success: true, message: 'Service created' };
    }
    if (method === 'PUT') {
      const idx = store.services.findIndex(s => s.id === parseInt(body.id));
      if (idx !== -1) store.services[idx] = { ...store.services[idx], ...body };
      localStorage.setItem(mockStorageKey, JSON.stringify(store));
      return { success: true, message: 'Service updated' };
    }
    if (method === 'DELETE') {
      const matchId = endpoint.match(/id=(\d+)/);
      if (matchId) store.services = store.services.filter(s => s.id !== parseInt(matchId[1]));
      localStorage.setItem(mockStorageKey, JSON.stringify(store));
      return { success: true, message: 'Service deleted' };
    }
  }

  // 7. Leads
  if (endpoint.startsWith('/leads.php')) {
    if (method === 'GET') return { success: true, data: store.leads };
    if (method === 'PUT') {
      const lead = store.leads.find(l => l.id === parseInt(body.id));
      if (lead) lead.status = body.status;
      localStorage.setItem(mockStorageKey, JSON.stringify(store));
      return { success: true, message: 'Lead updated' };
    }
    if (method === 'DELETE') {
      const matchId = endpoint.match(/id=(\d+)/);
      if (matchId) store.leads = store.leads.filter(l => l.id !== parseInt(matchId[1]));
      localStorage.setItem(mockStorageKey, JSON.stringify(store));
      return { success: true, message: 'Lead deleted' };
    }
  }

  // 8. Settings
  if (endpoint.startsWith('/settings.php')) {
    if (method === 'GET') return { success: true, data: store.settings };
    if (method === 'POST') {
      store.settings = { ...store.settings, ...body };
      localStorage.setItem(mockStorageKey, JSON.stringify(store));
      return { success: true, message: 'Settings saved' };
    }
  }

  // 9. Media
  if (endpoint.startsWith('/upload.php')) {
    if (method === 'GET') return { success: true, data: store.media };
    if (method === 'DELETE') {
      const urlParams = new URLSearchParams(endpoint.split('?')[1]);
      const file = urlParams.get('file');
      if (file) store.media = store.media.filter(m => m.filename !== file);
      localStorage.setItem(mockStorageKey, JSON.stringify(store));
      return { success: true, message: 'File deleted' };
    }
  }

  return { success: true, message: 'Action completed' };
}

function handleLocalMockUpload(formData) {
  const mockStorageKey = 'entec_mock_db_v1';
  const store = JSON.parse(localStorage.getItem(mockStorageKey) || '{}');
  if (!store.media) store.media = [];

  const file = formData.get('file');
  const filename = file ? file.name : ('media_' + Date.now() + '.webp');
  const url = '/images/r/aboutbac.webp';

  const newMedia = {
    filename: filename,
    url: url,
    size: file ? file.size : 204800,
    is_image: true,
    date: Date.now() / 1000
  };

  store.media.unshift(newMedia);
  localStorage.setItem(mockStorageKey, JSON.stringify(store));

  return {
    success: true,
    url: url,
    filename: filename,
    size: newMedia.size
  };
}

// Expose handlers globally to window for HTML event handlers
window.switchSection = switchSection;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.openModal = openModal;
window.closeModal = closeModal;
window.openBlogModal = openBlogModal;
window.editBlog = editBlog;
window.deleteBlog = deleteBlog;
window.filterBlogs = filterBlogs;
window.openCareerModal = openCareerModal;
window.editCareer = editCareer;
window.deleteCareer = deleteCareer;
window.filterCareers = filterCareers;
window.openProjectModal = openProjectModal;
window.editProject = editProject;
window.deleteProject = deleteProject;
window.filterProjects = filterProjects;
window.openServiceModal = openServiceModal;
window.editService = editService;
window.deleteService = deleteService;
window.updateLeadStatus = updateLeadStatus;
window.deleteLead = deleteLead;
window.openMediaPicker = openMediaPicker;
window.selectPickerItem = selectPickerItem;
window.confirmMediaSelection = confirmMediaSelection;
window.filterPickerMedia = filterPickerMedia;
window.uploadToPicker = uploadToPicker;
window.openMediaDetailsModal = openMediaDetailsModal;
window.copyMediaUrl = copyMediaUrl;
window.copyFromInput = copyFromInput;
window.deleteMedia = deleteMedia;
window.filterMedia = filterMedia;
window.handleDirectMediaUpload = handleDirectMediaUpload;
window.syncSiteData = syncSiteData;
window.showToast = showToast;

