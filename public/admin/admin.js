// ========================================================
// ENTEC MEDIA - Admin Panel JavaScript Application
// ========================================================

const API_BASE = '/api';
let authToken = localStorage.getItem('entec_admin_token') || '';
let currentUser = JSON.parse(localStorage.getItem('entec_admin_user') || 'null');
let easyMDE = null;

// Global Cache for active data
let allBlogs = [];
let allProjects = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
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
    if (res.authenticated) {
      currentUser = res.user;
      showAppView();
    } else {
      showLoginView();
    }
  } catch (err) {
    showLoginView();
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');

  btn.disabled = true;
  btn.innerHTML = '<span>Signing in...</span>';

  try {
    const res = await apiRequest('/auth.php?action=login', 'POST', { email, password });
    if (res.success) {
      authToken = res.token;
      currentUser = res.user;
      localStorage.setItem('entec_admin_token', authToken);
      localStorage.setItem('entec_admin_user', JSON.stringify(currentUser));
      showToast('Welcome back, ' + currentUser.name, 'success');
      showAppView();
    }
  } catch (err) {
    showToast(err.message || 'Login failed. Invalid credentials.', 'error');
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
    document.getElementById('current-user-name').innerText = currentUser.name;
    document.getElementById('current-user-email').innerText = currentUser.email;
    document.getElementById('current-user-avatar').innerText = currentUser.name.charAt(0).toUpperCase();
  }

  // Initialize Markdown Editor if not already initialized
  if (!easyMDE && document.getElementById('blog-content')) {
    easyMDE = new EasyMDE({
      element: document.getElementById('blog-content'),
      spellChecker: false,
      placeholder: 'Write your blog post article here using Markdown or HTML...',
      status: false,
      minHeight: '220px'
    });
  }

  // Load Dashboard Data
  switchSection('dashboard');
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
    'projects': 'Manage Projects & Works',
    'services': 'Manage Services',
    'careers': 'Manage Career Openings',
    'applications': 'Candidate Job Applications',
    'leads': 'Contact & Enquiry Leads',
    'site-settings': 'Header, Footer & Content Customization',
    'settings': 'Security & Admin Settings'
  };

  document.getElementById('page-title').innerText = titleMap[sectionId] || 'Dashboard';

  // Load data based on section
  if (sectionId === 'dashboard') loadDashboardStats();
  if (sectionId === 'blogs') loadBlogs();
  if (sectionId === 'projects') loadProjects();
  if (sectionId === 'services') loadServices();
  if (sectionId === 'careers') loadCareers();
  if (sectionId === 'applications') loadApplications();
  if (sectionId === 'leads') loadLeads();
  if (sectionId === 'site-settings') loadSiteSettings();

  // Close mobile sidebar if open
  document.querySelector('.sidebar').classList.remove('open');
  if (window.lucide) lucide.createIcons();
}

function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
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
    console.error(err);
  }
}

// ==================== BLOGS CRUD ====================

async function loadBlogs() {
  try {
    const res = await apiRequest('/blogs.php?admin=1&limit=100');
    if (res.success) {
      allBlogs = res.data;
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
      <td><strong>${escapeHtml(blog.title)}</strong><br><small class="text-muted">/${escapeHtml(blog.slug)}</small></td>
      <td><span class="badge badge-accent">${escapeHtml(blog.category)}</span></td>
      <td>${blog.views || 0}</td>
      <td><span class="badge ${blog.status === 'published' ? 'badge-success' : 'badge-warning'}">${blog.status}</span></td>
      <td>${formatDate(blog.created_at)}</td>
      <td>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-outline btn-sm" onclick="editBlog(${blog.id})"><i data-lucide="edit-3"></i></button>
          <button class="btn btn-outline btn-sm" onclick="deleteBlog(${blog.id})" style="color:var(--color-danger);"><i data-lucide="trash-2"></i></button>
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
  document.getElementById('blog-cover').value = blog ? blog.cover_image : '';
  document.getElementById('blog-excerpt').value = blog ? blog.excerpt : '';
  document.getElementById('blog-meta-title').value = blog ? blog.meta_title : '';
  document.getElementById('blog-status').value = blog ? blog.status : 'published';

  if (easyMDE) {
    easyMDE.value(blog ? blog.content : '');
  }

  document.getElementById('modal-blog-title').innerText = blog ? 'Edit Blog Post' : 'Create New Blog Post';
  openModal('modal-blog');
}

async function editBlog(id) {
  try {
    const res = await apiRequest(`/blogs.php?admin=1&id=${id}`);
    if (res.success) {
      openBlogModal(res.data);
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

// ==================== PROJECTS CRUD ====================

async function loadProjects() {
  try {
    const res = await apiRequest('/projects.php?admin=1');
    if (res.success) {
      allProjects = res.data;
      renderProjects(allProjects);
    }
  } catch (err) {
    showToast('Failed to load projects', 'error');
  }
}

function renderProjects(projects) {
  const tbody = document.getElementById('projects-table-body');
  if (!projects.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No projects found.</td></tr>';
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
      const tbody = document.getElementById('services-table-body');
      if (!res.data.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No services found.</td></tr>';
        return;
      }
      tbody.innerHTML = res.data.map(s => `
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
  await apiRequest(`/services.php?id=${id}`, 'DELETE');
  showToast('Service deleted', 'success');
  loadServices();
}

// ==================== CAREERS & APPLICATIONS ====================

async function loadCareers() {
  try {
    const res = await apiRequest('/careers.php?admin=1');
    if (res.success) {
      const tbody = document.getElementById('careers-table-body');
      if (!res.data.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No job openings posted.</td></tr>';
        return;
      }
      tbody.innerHTML = res.data.map(c => `
        <tr>
          <td><strong>${escapeHtml(c.title)}</strong></td>
          <td>${escapeHtml(c.department)}</td>
          <td><span class="badge badge-accent">${escapeHtml(c.job_type)}</span></td>
          <td>${escapeHtml(c.location)}</td>
          <td><span class="badge ${c.status === 'open' ? 'badge-success' : 'badge-danger'}">${c.status}</span></td>
          <td>
            <div style="display:flex;gap:6px;">
              <button class="btn btn-outline btn-sm" onclick="editCareer(${c.id})"><i data-lucide="edit-3"></i></button>
              <button class="btn btn-outline btn-sm" onclick="deleteCareer(${c.id})" style="color:var(--color-danger);"><i data-lucide="trash-2"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
      if (window.lucide) lucide.createIcons();
    }
  } catch (err) {
    showToast('Failed to load careers', 'error');
  }
}

function openCareerModal(c = null) {
  document.getElementById('career-id').value = c ? c.id : '';
  document.getElementById('career-title').value = c ? c.title : '';
  document.getElementById('career-dept').value = c ? c.department : 'Engineering';
  document.getElementById('career-type').value = c ? c.job_type : 'Full-time';
  document.getElementById('career-loc').value = c ? c.location : 'Remote / Mohali';
  document.getElementById('career-exp').value = c ? c.experience : '1-3 Years';
  document.getElementById('career-desc').value = c ? c.description : '';
  document.getElementById('career-req').value = c ? c.requirements : '';
  document.getElementById('career-status').value = c ? c.status : 'open';
  openModal('modal-career');
}

async function editCareer(id) {
  const res = await apiRequest(`/careers.php?admin=1&id=${id}`);
  if (res.success) openCareerModal(res.data);
}

async function handleSaveCareer(e) {
  e.preventDefault();
  const id = document.getElementById('career-id').value;
  const payload = {
    id: id || undefined,
    title: document.getElementById('career-title').value,
    department: document.getElementById('career-dept').value,
    job_type: document.getElementById('career-type').value,
    location: document.getElementById('career-loc').value,
    experience: document.getElementById('career-exp').value,
    description: document.getElementById('career-desc').value,
    requirements: document.getElementById('career-req').value,
    status: document.getElementById('career-status').value
  };

  await apiRequest('/careers.php', id ? 'PUT' : 'POST', payload);
  showToast('Job opening saved!', 'success');
  closeModal('modal-career');
  loadCareers();
}

async function deleteCareer(id) {
  if (!confirm('Are you sure?')) return;
  await apiRequest(`/careers.php?id=${id}`, 'DELETE');
  showToast('Job opening deleted', 'success');
  loadCareers();
}

async function loadApplications() {
  try {
    const res = await apiRequest('/careers.php?action=applications');
    if (res.success) {
      const tbody = document.getElementById('applications-table-body');
      if (!res.data.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No applications received yet.</td></tr>';
        return;
      }
      tbody.innerHTML = res.data.map(app => `
        <tr>
          <td><strong>${escapeHtml(app.applicant_name)}</strong></td>
          <td>${escapeHtml(app.job_title || 'General')}</td>
          <td><small>${escapeHtml(app.email)}<br>${escapeHtml(app.phone || '')}</small></td>
          <td><a href="${app.resume_path}" target="_blank" class="btn btn-outline btn-sm"><i data-lucide="file-text"></i> View PDF</a></td>
          <td>${app.portfolio_url ? `<a href="${app.portfolio_url}" target="_blank" class="btn btn-text">Link</a>` : '-'}</td>
          <td>${formatDate(app.created_at)}</td>
          <td>
            <select class="form-control" style="padding:4px 8px;font-size:12px;" onchange="updateAppStatus(${app.id}, this.value)">
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
  await apiRequest('/careers.php?action=application_status', 'PUT', { app_id: appId, status });
  showToast('Status updated', 'success');
}

// ==================== LEADS ====================

async function loadLeads() {
  try {
    const res = await apiRequest('/leads.php');
    if (res.success) {
      const tbody = document.getElementById('leads-table-body');
      if (!res.data.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No inquiry leads yet.</td></tr>';
        return;
      }
      tbody.innerHTML = res.data.map(l => `
        <tr>
          <td><strong>${escapeHtml(l.name)}</strong></td>
          <td><small>${escapeHtml(l.email)}<br>${escapeHtml(l.phone || '')}</small></td>
          <td><span class="badge badge-accent">${escapeHtml(l.service_needed || 'General')}</span></td>
          <td>${escapeHtml(l.budget || '-')}</td>
          <td><div style="max-width:280px;font-size:13px;color:var(--text-muted);">${escapeHtml(l.message)}</div></td>
          <td>
            <select class="form-control" style="padding:4px 8px;font-size:12px;" onchange="updateLeadStatus(${l.id}, this.value)">
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
  await apiRequest('/leads.php', 'PUT', { id, status });
  showToast('Lead status updated', 'success');
}

async function deleteLead(id) {
  if (!confirm('Are you sure?')) return;
  await apiRequest(`/leads.php?id=${id}`, 'DELETE');
  showToast('Lead deleted', 'success');
  loadLeads();
}

// ==================== SETTINGS & UPLOAD ====================

async function loadSiteSettings() {
  try {
    const res = await apiRequest('/settings.php');
    if (res.success && res.data) {
      const d = res.data;
      if (document.getElementById('setting-header-tagline')) document.getElementById('setting-header-tagline').value = d.header_tagline || '';
      if (document.getElementById('setting-header-cta-text')) document.getElementById('setting-header-cta-text').value = d.header_cta_text || '';
      if (document.getElementById('setting-header-cta-url')) document.getElementById('setting-header-cta-url').value = d.header_cta_url || '';
      if (document.getElementById('setting-contact-phone')) document.getElementById('setting-contact-phone').value = d.contact_phone || '';
      if (document.getElementById('setting-contact-email')) document.getElementById('setting-contact-email').value = d.contact_email || '';
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
    contact_phone: document.getElementById('setting-contact-phone')?.value || '',
    contact_email: document.getElementById('setting-contact-email')?.value || '',
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

async function uploadImage(input, targetInputId) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const formData = new FormData();
  formData.append('file', file);

  showToast('Uploading image...', 'success');

  try {
    const res = await fetch(`${API_BASE}/upload.php`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById(targetInputId).value = data.url;
      showToast('Image uploaded successfully!', 'success');
    } else {
      showToast(data.error || 'Upload failed', 'error');
    }
  } catch (err) {
    showToast('Upload error', 'error');
  }
}

// ==================== HELPERS ====================

async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const options = { method, headers };
  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API Request failed');
  }

  return data;
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
  if (window.lucide) lucide.createIcons();
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function autoSlug(sourceId, targetId) {
  const val = document.getElementById(sourceId).value;
  document.getElementById(targetId).value = val
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
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
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}
