// ========================================================
// ENTEC MEDIA - Professional WordPress-Grade Admin CMS (Light Theme)
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

// Filter state
let activeBlogStatus = 'all';

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
      const href = item.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
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
    btn.innerHTML = '<span>Log In</span><i data-lucide="arrow-right"></i>';
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
  if (window.lucide) lucide.createIcons();
}

function showAppView() {
  document.getElementById('login-view').style.display = 'none';
  document.getElementById('app-view').style.display = 'block';

  if (currentUser) {
    const displayName = currentUser.name || 'Administrator';
    const nameEl = document.getElementById('admin-user-display-name');
    if (nameEl) nameEl.innerText = displayName;
    const avatarEl = document.getElementById('admin-avatar-initials');
    if (avatarEl) avatarEl.innerText = displayName.charAt(0).toUpperCase();
  }

  // Initialize Markdown Editor if not already initialized
  if (!easyMDE && document.getElementById('blog-content')) {
    easyMDE = new EasyMDE({
      element: document.getElementById('blog-content'),
      spellChecker: false,
      placeholder: 'Write your post article here using Markdown or paste HTML...',
      status: false,
      minHeight: '260px',
      toolbar: [
        'bold', 'italic', 'heading-2', 'heading-3', '|',
        'quote', 'unordered-list', 'ordered-list', '|',
        'link', 'image', 'code', 'table', '|',
        'preview', 'side-by-side', 'fullscreen'
      ]
    });
  }

  // Load Section from current URL hash or default to dashboard
  const initialSection = (window.location.hash || '').replace('#', '') || 'dashboard';
  switchSection(initialSection);
}

// ==================== NAVIGATION ====================

function switchSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(sec => sec.style.display = 'none');
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

  const activeSec = document.getElementById(`sec-${sectionId}`);
  if (activeSec) activeSec.style.display = 'block';

  const activeNav = document.querySelector(`.nav-item[href="#${sectionId}"]`);
  if (activeNav) activeNav.classList.add('active');

  // Load data based on section
  if (sectionId === 'dashboard') loadDashboardStats();
  if (sectionId === 'blogs') loadBlogs();
  if (sectionId === 'careers') loadCareers();
  if (sectionId === 'applications') loadApplications();
  if (sectionId === 'projects') loadProjects();
  if (sectionId === 'services') loadServices();
  if (sectionId === 'leads') loadLeads();
  if (sectionId === 'media') loadMedia();
  if (sectionId === 'settings') loadSiteSettings();

  // Close mobile sidebar if open
  closeSidebar();
  if (window.lucide) lucide.createIcons();
}

function toggleSidebar() {
  const sidebar = document.getElementById('wp-sidebar');
  if (sidebar) sidebar.classList.toggle('active');
}

function closeSidebar() {
  const sidebar = document.getElementById('wp-sidebar');
  if (sidebar) sidebar.classList.remove('active');
}

// ==================== DASHBOARD STATS ====================

async function loadDashboardStats() {
  try {
    const res = await apiRequest('/stats.php');
    if (res.success) {
      const data = res.data;
      if (document.getElementById('stat-blogs')) document.getElementById('stat-blogs').innerText = data.blogs_count || 0;
      if (document.getElementById('stat-careers')) document.getElementById('stat-careers').innerText = data.careers_open_count || 0;
      if (document.getElementById('stat-applications')) document.getElementById('stat-applications').innerText = data.applications_count || 0;
      if (document.getElementById('stat-leads')) document.getElementById('stat-leads').innerText = data.new_leads_count || 0;
      if (document.getElementById('stat-media')) document.getElementById('stat-media').innerText = data.media_count || 0;

      if (document.getElementById('badge-leads')) document.getElementById('badge-leads').innerText = data.new_leads_count || 0;
      if (document.getElementById('badge-applications')) document.getElementById('badge-applications').innerText = data.applications_count || 0;

      // Render recent posts table
      const blogsTbody = document.getElementById('table-dash-blogs');
      if (blogsTbody) {
        if (data.recent_blogs && data.recent_blogs.length > 0) {
          blogsTbody.innerHTML = data.recent_blogs.map(blog => `
            <tr>
              <td><strong><a href="javascript:void(0)" onclick="editBlog(${blog.id})">${escapeHtml(blog.title)}</a></strong></td>
              <td><span class="badge badge-accent">${escapeHtml(blog.category || 'General')}</span></td>
              <td><span class="badge ${blog.status === 'published' ? 'badge-published' : 'badge-draft'}">${blog.status || 'published'}</span></td>
            </tr>
          `).join('');
        } else {
          blogsTbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No posts found.</td></tr>';
        }
      }

      // Render recent leads table
      const leadsTbody = document.getElementById('table-dash-leads');
      if (leadsTbody) {
        if (data.recent_leads && data.recent_leads.length > 0) {
          leadsTbody.innerHTML = data.recent_leads.map(lead => `
            <tr>
              <td><strong>${escapeHtml(lead.name)}</strong></td>
              <td>${escapeHtml(lead.phone || lead.email || '')}</td>
              <td>${formatDate(lead.created_at)}</td>
            </tr>
          `).join('');
        } else {
          leadsTbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No recent inquiries yet.</td></tr>';
        }
      }
    }
  } catch (err) {
    console.error('Stats error:', err);
  }
  if (window.lucide) lucide.createIcons();
}

// ==================== WORDPRESS POSTS CRUD (edit.php) ====================

async function loadBlogs() {
  try {
    const res = await apiRequest('/blogs.php?admin=1');
    if (res.success) {
      allBlogs = Array.isArray(res.data) ? res.data : (res.data?.blogs || []);
      updateBlogCountBadges();
      filterBlogs();
    }
  } catch (err) {
    showToast('Failed to load posts', 'error');
  }
}

function updateBlogCountBadges() {
  const allCount = allBlogs.length;
  const pubCount = allBlogs.filter(b => b.status === 'published').length;
  const draftCount = allBlogs.filter(b => b.status === 'draft').length;

  const countAll = document.getElementById('count-blogs-all');
  if (countAll) countAll.innerText = allCount;
  const countPub = document.getElementById('count-blogs-published');
  if (countPub) countPub.innerText = pubCount;
  const countDraft = document.getElementById('count-blogs-draft');
  if (countDraft) countDraft.innerText = draftCount;
}

function filterBlogByStatus(status) {
  activeBlogStatus = status;

  // Update tabs
  document.querySelectorAll('ul.subsubsub a').forEach(a => a.classList.remove('current'));
  const currentTab = document.querySelector(`ul.subsubsub .${status === 'published' ? 'publish' : status} a`);
  if (currentTab) currentTab.classList.add('current');

  filterBlogs();
}

function filterBlogs() {
  const query = (document.getElementById('blog-search')?.value || '').toLowerCase();
  const cat = document.getElementById('blog-filter-cat')?.value || '';

  const filtered = allBlogs.filter(b => {
    const matchesStatus = activeBlogStatus === 'all' || b.status === activeBlogStatus;
    const matchesCat = !cat || b.category === cat;
    const matchesSearch = !query || b.title.toLowerCase().includes(query) || (b.excerpt && b.excerpt.toLowerCase().includes(query));
    return matchesStatus && matchesCat && matchesSearch;
  });

  renderBlogs(filtered);
}

function renderBlogs(blogs) {
  const tbody = document.getElementById('blogs-table-body');
  if (!tbody) return;

  const countDisplay = document.getElementById('blogs-count-display');
  if (countDisplay) countDisplay.innerText = `${blogs.length} items`;
  const countDisplayBottom = document.getElementById('blogs-count-display-bottom');
  if (countDisplayBottom) countDisplayBottom.innerText = `${blogs.length} items`;

  if (!blogs.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding: 24px; color: var(--wp-text-muted);">No posts found matching the criteria.</td></tr>';
    return;
  }

  tbody.innerHTML = blogs.map(blog => `
    <tr id="post-${blog.id}">
      <th scope="row" class="check-column">
        <input type="checkbox" class="blog-select-checkbox" value="${blog.id}">
      </th>
      <td class="column-title">
        <strong>
          <a class="row-title" href="javascript:void(0)" onclick="editBlog(${blog.id})">${escapeHtml(blog.title)}</a>
          ${blog.status === 'draft' ? ' — <span class="post-state">Draft</span>' : ''}
        </strong>
        <div class="row-actions">
          <span class="edit"><a href="javascript:void(0)" onclick="editBlog(${blog.id})">Edit</a> | </span>
          <span class="trash"><a href="javascript:void(0)" onclick="deleteBlog(${blog.id})" class="button-link-delete">Trash</a> | </span>
          <span class="view"><a href="/blog/${blog.slug}" target="_blank">View</a></span>
        </div>
      </td>
      <td class="column-author">${escapeHtml(blog.author || 'Entec Media')}</td>
      <td class="column-categories"><a href="javascript:void(0)" onclick="setCategoryFilter('${escapeHtml(blog.category)}')">${escapeHtml(blog.category || 'General')}</a></td>
      <td class="column-tags">
        <span class="badge ${blog.status === 'published' ? 'badge-published' : 'badge-draft'}">
          ${blog.status === 'published' ? 'Published' : 'Draft'}
        </span>
      </td>
      <td class="column-views">${blog.views || 0}</td>
      <td class="column-date">
        ${blog.status === 'published' ? 'Published' : 'Last Modified'}<br>
        <abbr title="${blog.created_at}">${formatDate(blog.created_at)}</abbr>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function setCategoryFilter(cat) {
  const sel = document.getElementById('blog-filter-cat');
  if (sel) {
    sel.value = cat;
    filterBlogs();
  }
}

function toggleSelectAll(checkboxClass, masterCheckbox) {
  document.querySelectorAll(`.${checkboxClass}`).forEach(cb => {
    cb.checked = masterCheckbox.checked;
  });
}

async function handleBlogBulkAction() {
  const action = document.getElementById('bulk-action-blogs').value;
  if (action === '-1') return;
  await processBlogBulk(action);
}

async function handleBlogBulkActionBottom() {
  const action = document.getElementById('bulk-action-blogs-bottom').value;
  if (action === '-1') return;
  await processBlogBulk(action);
}

async function processBlogBulk(action) {
  const checked = Array.from(document.querySelectorAll('.blog-select-checkbox:checked')).map(cb => cb.value);
  if (!checked.length) {
    showToast('Please select at least one post.', 'error');
    return;
  }

  if (action === 'trash') {
    if (!confirm(`Are you sure you want to move ${checked.length} post(s) to Trash?`)) return;
    for (const id of checked) {
      await apiRequest(`/blogs.php?id=${id}`, 'DELETE');
    }
    showToast(`${checked.length} post(s) moved to Trash`, 'success');
    loadBlogs();
  } else if (action === 'publish' || action === 'draft') {
    for (const id of checked) {
      await apiRequest(`/blogs.php`, 'PUT', { id: parseInt(id), status: action });
    }
    showToast(`${checked.length} post(s) updated to ${action}`, 'success');
    loadBlogs();
  }
}

function openBlogModal(blog = null) {
  document.getElementById('blog-id').value = blog ? blog.id : '';
  document.getElementById('blog-title').value = blog ? blog.title : '';
  document.getElementById('blog-slug').value = blog ? blog.slug : '';
  document.getElementById('blog-category').value = blog ? blog.category : 'Web Development';
  document.getElementById('blog-cover').value = blog ? (blog.cover_image || '') : '';
  document.getElementById('blog-excerpt').value = blog ? (blog.excerpt || '') : '';
  document.getElementById('blog-meta-title').value = blog ? (blog.meta_title || '') : '';
  document.getElementById('blog-meta-desc').value = blog ? (blog.meta_description || '') : '';
  document.getElementById('blog-status').value = blog ? blog.status : 'published';

  // Update permalink preview
  const slugText = document.getElementById('permalink-slug-text');
  if (slugText) slugText.innerText = blog ? blog.slug : 'new-post';

  // Update Featured Image Box
  updateFeaturedImageUi(blog ? blog.cover_image : '');

  // Update Editor content
  if (easyMDE) {
    easyMDE.value(blog ? (blog.content || '') : '');
  }

  document.getElementById('modal-blog-title').innerText = blog ? 'Edit Post' : 'Add New Post';
  document.getElementById('blog-submit-btn').innerText = blog ? 'Update' : 'Publish';
  openModal('modal-blog');
}

function updateFeaturedImageUi(coverUrl) {
  const preview = document.getElementById('blog-cover-preview');
  const setLink = document.getElementById('blog-set-featured-link');
  const actions = document.getElementById('blog-featured-actions');

  if (coverUrl) {
    if (preview) {
      preview.src = coverUrl;
      preview.style.display = 'block';
    }
    if (setLink) setLink.style.display = 'none';
    if (actions) actions.style.display = 'flex';
  } else {
    if (preview) {
      preview.src = '';
      preview.style.display = 'none';
    }
    if (setLink) setLink.style.display = 'inline-block';
    if (actions) actions.style.display = 'none';
  }
}

function removeFeaturedImage(inputId, previewId) {
  const input = document.getElementById(inputId);
  if (input) input.value = '';
  updateFeaturedImageUi('');
}

async function editBlog(id) {
  try {
    const res = await apiRequest(`/blogs.php?admin=1&id=${id}`);
    if (res.success && res.data) {
      openBlogModal(res.data);
    }
  } catch (err) {
    showToast('Failed to load post details', 'error');
  }
}

function setBlogDraftAndSave() {
  document.getElementById('blog-status').value = 'draft';
  document.getElementById('form-blog').requestSubmit();
}

async function handleSaveBlog(e) {
  e.preventDefault();
  const id = document.getElementById('blog-id').value;
  const title = document.getElementById('blog-title').value.trim();
  const slug = document.getElementById('blog-slug').value.trim() || generateSlug(title);
  const category = document.getElementById('blog-category').value;
  const cover_image = document.getElementById('blog-cover').value.trim();
  const excerpt = document.getElementById('blog-excerpt').value.trim();
  const meta_title = document.getElementById('blog-meta-title').value.trim() || title;
  const meta_description = document.getElementById('blog-meta-desc').value.trim() || excerpt;
  const status = document.getElementById('blog-status').value;
  const content = easyMDE ? easyMDE.value() : document.getElementById('blog-content').value;

  const payload = {
    id: id ? parseInt(id) : undefined,
    title,
    slug,
    category,
    cover_image,
    excerpt,
    content,
    meta_title,
    meta_description,
    status
  };

  const btn = document.getElementById('blog-submit-btn');
  btn.disabled = true;

  try {
    await apiRequest('/blogs.php', id ? 'PUT' : 'POST', payload);
    showToast(id ? 'Post updated successfully!' : 'Post published successfully!', 'success');
    closeModal('modal-blog');
    loadBlogs();
  } catch (err) {
    showToast(err.message || 'Failed to save post', 'error');
  } finally {
    btn.disabled = false;
  }
}

async function deleteBlog(id) {
  if (!confirm('Are you sure you want to move this post to Trash?')) return;
  try {
    await apiRequest(`/blogs.php?id=${id}`, 'DELETE');
    showToast('Post moved to Trash', 'success');
    loadBlogs();
  } catch (err) {
    showToast('Failed to delete post', 'error');
  }
}

// ==================== WORDPRESS CAREERS CRUD ====================

async function loadCareers() {
  try {
    const res = await apiRequest('/careers.php?admin=1');
    if (res.success) {
      allCareers = Array.isArray(res.data) ? res.data : [];
      const countEl = document.getElementById('count-careers-all');
      if (countEl) countEl.innerText = allCareers.length;
      renderCareers(allCareers);
    }
  } catch (err) {
    showToast('Failed to load job openings', 'error');
  }
}

function renderCareers(careers) {
  const tbody = document.getElementById('careers-table-body');
  if (!tbody) return;

  if (!careers.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding:24px;color:var(--wp-text-muted);">No job openings posted yet. Click "Add New Job" to post one.</td></tr>';
    return;
  }

  tbody.innerHTML = careers.map(c => `
    <tr>
      <td class="column-title">
        <strong><a class="row-title" href="javascript:void(0)" onclick="editCareer(${c.id})">${escapeHtml(c.title)}</a></strong>
        <div class="row-actions">
          <span class="edit"><a href="javascript:void(0)" onclick="editCareer(${c.id})">Edit</a> | </span>
          <span class="trash"><a href="javascript:void(0)" onclick="deleteCareer(${c.id})" class="button-link-delete">Trash</a> | </span>
          <span class="view"><a href="/careers/${c.slug}" target="_blank">View Opening</a></span>
        </div>
      </td>
      <td><span class="badge badge-accent">${escapeHtml(c.department || 'Development')}</span></td>
      <td>${escapeHtml(c.job_type || 'Full-time')}</td>
      <td>${escapeHtml(c.location || 'Zirakpur, Punjab')}</td>
      <td>${escapeHtml(c.experience || '1-3 years')}</td>
      <td><span class="badge ${c.status === 'open' ? 'badge-published' : 'badge-danger'}">${c.status === 'open' ? 'Open' : 'Closed'}</span></td>
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
  document.getElementById('career-loc').value = c ? c.location : 'Zirakpur, Punjab';
  document.getElementById('career-exp').value = c ? c.experience : '2-4 years';
  document.getElementById('career-salary').value = c ? (c.salary_range || '') : '';
  document.getElementById('career-desc').value = c ? (c.description || '') : '';
  document.getElementById('career-status').value = c ? c.status : 'open';

  document.getElementById('modal-career-title').innerText = c ? 'Edit Job Opening' : 'Post New Job Opening';
  openModal('modal-career');
}

async function editCareer(id) {
  try {
    const res = await apiRequest(`/careers.php?admin=1&id=${id}`);
    if (res.success && res.data) {
      openCareerModal(res.data);
    }
  } catch (err) {
    showToast('Failed to load opening details', 'error');
  }
}

async function handleSaveCareer(e) {
  e.preventDefault();
  const id = document.getElementById('career-id').value;
  const title = document.getElementById('career-title').value.trim();
  const slug = document.getElementById('career-slug').value.trim() || generateSlug(title);
  const department = document.getElementById('career-dept').value;
  const job_type = document.getElementById('career-type').value;
  const location = document.getElementById('career-loc').value.trim();
  const experience = document.getElementById('career-exp').value.trim();
  const salary_range = document.getElementById('career-salary').value.trim();
  const description = document.getElementById('career-desc').value.trim();
  const status = document.getElementById('career-status').value;

  const payload = {
    id: id ? parseInt(id) : undefined,
    title,
    slug,
    department,
    job_type,
    location,
    experience,
    salary_range,
    description,
    status
  };

  try {
    await apiRequest('/careers.php', id ? 'PUT' : 'POST', payload);
    showToast(id ? 'Job opening updated' : 'New job posted successfully', 'success');
    closeModal('modal-career');
    loadCareers();
  } catch (err) {
    showToast(err.message || 'Failed to save job opening', 'error');
  }
}

async function deleteCareer(id) {
  if (!confirm('Are you sure you want to delete this job opening?')) return;
  try {
    await apiRequest(`/careers.php?id=${id}`, 'DELETE');
    showToast('Job opening deleted', 'success');
    loadCareers();
  } catch (err) {
    showToast('Failed to delete opening', 'error');
  }
}

// ==================== CANDIDATE APPLICATIONS ====================

async function loadApplications() {
  try {
    const res = await apiRequest('/careers.php?action=applications');
    if (res.success) {
      allApplications = Array.isArray(res.data) ? res.data : [];
      const badge = document.getElementById('badge-applications');
      if (badge) badge.innerText = allApplications.length;
      const countEl = document.getElementById('count-careers-apps');
      if (countEl) countEl.innerText = allApplications.length;
      renderApplications(allApplications);
    }
  } catch (err) {
    showToast('Failed to load applications', 'error');
  }
}

function renderApplications(apps) {
  const tbody = document.getElementById('applications-table-body');
  if (!tbody) return;

  if (!apps.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding:24px;color:var(--wp-text-muted);">No candidate applications received yet.</td></tr>';
    return;
  }

  tbody.innerHTML = apps.map(app => `
    <tr>
      <td><strong>${escapeHtml(app.applicant_name)}</strong></td>
      <td><strong>${escapeHtml(app.job_title || 'General Position')}</strong></td>
      <td>
        <a href="mailto:${escapeHtml(app.email)}">${escapeHtml(app.email)}</a><br>
        <a href="tel:${escapeHtml(app.phone)}">${escapeHtml(app.phone || 'N/A')}</a>
      </td>
      <td>
        ${app.resume_path ? `<a href="${app.resume_path}" target="_blank" class="button button-small"><i data-lucide="file-text"></i> View Resume</a>` : '<span class="text-muted">No resume</span>'}
        ${app.portfolio_url ? `<br><a href="${app.portfolio_url}" target="_blank" style="font-size:12px;">Portfolio &rarr;</a>` : ''}
      </td>
      <td>
        <select class="form-control" style="font-size:12px;padding:2px 6px;height:28px;" onchange="updateApplicationStatus(${app.id}, this.value)">
          <option value="new" ${app.status === 'new' ? 'selected' : ''}>New</option>
          <option value="reviewing" ${app.status === 'reviewing' ? 'selected' : ''}>Reviewing</option>
          <option value="shortlisted" ${app.status === 'shortlisted' ? 'selected' : ''}>Shortlisted</option>
          <option value="hired" ${app.status === 'hired' ? 'selected' : ''}>Hired</option>
          <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Rejected</option>
        </select>
      </td>
      <td>${formatDate(app.created_at)}</td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

async function updateApplicationStatus(appId, status) {
  try {
    await apiRequest('/careers.php?action=application_status', 'PUT', { app_id: appId, status });
    showToast('Application status updated', 'success');
  } catch (err) {
    showToast('Failed to update status', 'error');
  }
}

// ==================== PROJECTS / PORTFOLIO CRUD ====================

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
  if (!tbody) return;

  if (!projects.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding:24px;color:var(--wp-text-muted);">No projects found. Click "Add New Project" to add one.</td></tr>';
    return;
  }

  tbody.innerHTML = projects.map(p => `
    <tr>
      <td>
        <img src="${p.thumbnail || '/images/r/aboutbac.webp'}" style="width:70px;height:45px;object-fit:cover;border:1px solid #dcdcde;border-radius:2px;" alt="thumb">
      </td>
      <td class="column-title">
        <strong><a class="row-title" href="javascript:void(0)" onclick="editProject(${p.id})">${escapeHtml(p.title)}</a></strong>
        <div class="row-actions">
          <span class="edit"><a href="javascript:void(0)" onclick="editProject(${p.id})">Edit</a> | </span>
          <span class="trash"><a href="javascript:void(0)" onclick="deleteProject(${p.id})" class="button-link-delete">Trash</a> | </span>
          ${p.live_url ? `<span class="view"><a href="${p.live_url}" target="_blank">View Live</a></span>` : ''}
        </div>
      </td>
      <td><span class="badge badge-accent">${escapeHtml(p.category || 'Development')}</span></td>
      <td>${escapeHtml(p.client || 'Entec Media')}</td>
      <td>${p.live_url ? `<a href="${p.live_url}" target="_blank" style="font-size:12px;">${escapeHtml(p.live_url)}</a>` : '<span class="text-muted">—</span>'}</td>
      <td><span class="badge ${p.status === 'published' ? 'badge-published' : 'badge-draft'}">${p.status || 'published'}</span></td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function filterProjects() {
  const q = (document.getElementById('project-search')?.value || '').toLowerCase();
  renderProjects(allProjects.filter(p => p.title.toLowerCase().includes(q) || (p.client && p.client.toLowerCase().includes(q))));
}

function openProjectModal(p = null) {
  document.getElementById('project-id').value = p ? p.id : '';
  document.getElementById('project-title').value = p ? p.title : '';
  document.getElementById('project-slug').value = p ? p.slug : '';
  document.getElementById('project-client').value = p ? (p.client || '') : '';
  document.getElementById('project-cat').value = p ? (p.category || 'Website Development') : 'Website Development';
  document.getElementById('project-thumb').value = p ? (p.thumbnail || '') : '';
  document.getElementById('project-url').value = p ? (p.live_url || '') : '';
  document.getElementById('project-desc').value = p ? (p.short_desc || '') : '';
  document.getElementById('project-status').value = p ? (p.status || 'published') : 'published';

  const preview = document.getElementById('project-thumb-preview');
  if (p && p.thumbnail) {
    preview.src = p.thumbnail;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }

  document.getElementById('modal-project-title').innerText = p ? 'Edit Project' : 'Add Portfolio Project';
  openModal('modal-project');
}

async function editProject(id) {
  try {
    const res = await apiRequest(`/projects.php?admin=1&id=${id}`);
    if (res.success && res.data) {
      openProjectModal(res.data);
    }
  } catch (err) {
    showToast('Failed to load project details', 'error');
  }
}

async function handleSaveProject(e) {
  e.preventDefault();
  const id = document.getElementById('project-id').value;
  const title = document.getElementById('project-title').value.trim();
  const slug = document.getElementById('project-slug').value.trim() || generateSlug(title);
  const client = document.getElementById('project-client').value.trim();
  const category = document.getElementById('project-cat').value;
  const thumbnail = document.getElementById('project-thumb').value.trim();
  const live_url = document.getElementById('project-url').value.trim();
  const short_desc = document.getElementById('project-desc').value.trim();
  const status = document.getElementById('project-status').value;

  const payload = {
    id: id ? parseInt(id) : undefined,
    title,
    slug,
    client,
    category,
    thumbnail,
    live_url,
    short_desc,
    status
  };

  try {
    await apiRequest('/projects.php', id ? 'PUT' : 'POST', payload);
    showToast(id ? 'Project updated' : 'Project added successfully', 'success');
    closeModal('modal-project');
    loadProjects();
  } catch (err) {
    showToast(err.message || 'Failed to save project', 'error');
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
      renderServices(allServices);
    }
  } catch (err) {
    showToast('Failed to load services', 'error');
  }
}

function renderServices(services) {
  const tbody = document.getElementById('services-table-body');
  if (!tbody) return;

  if (!services.length) {
    tbody.innerHTML = '<tr><td colspan="3" class="text-center" style="padding:24px;color:var(--wp-text-muted);">No services added yet. Click "Add New Service" to create one.</td></tr>';
    return;
  }

  tbody.innerHTML = services.map(s => `
    <tr>
      <td class="column-title">
        <strong><a class="row-title" href="javascript:void(0)" onclick="editService(${s.id})">${escapeHtml(s.title)}</a></strong>
        <div class="row-actions">
          <span class="edit"><a href="javascript:void(0)" onclick="editService(${s.id})">Edit</a> | </span>
          <span class="trash"><a href="javascript:void(0)" onclick="deleteService(${s.id})" class="button-link-delete">Trash</a></span>
        </div>
      </td>
      <td><code>/services/${escapeHtml(s.slug)}</code></td>
      <td><span class="badge ${s.status === 'active' ? 'badge-published' : 'badge-danger'}">${s.status || 'active'}</span></td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function openServiceModal(s = null) {
  document.getElementById('service-id').value = s ? s.id : '';
  document.getElementById('service-title').value = s ? s.title : '';
  document.getElementById('service-slug').value = s ? s.slug : '';
  document.getElementById('service-desc').value = s ? (s.short_desc || '') : '';
  document.getElementById('service-status').value = s ? s.status : 'active';

  document.getElementById('modal-service-title').innerText = s ? 'Edit Service' : 'Add New Service';
  openModal('modal-service');
}

async function editService(id) {
  try {
    const res = await apiRequest(`/services.php?admin=1&id=${id}`);
    if (res.success && res.data) {
      openServiceModal(res.data);
    }
  } catch (err) {
    showToast('Failed to load service details', 'error');
  }
}

async function handleSaveService(e) {
  e.preventDefault();
  const id = document.getElementById('service-id').value;
  const title = document.getElementById('service-title').value.trim();
  const slug = document.getElementById('service-slug').value.trim() || generateSlug(title);
  const short_desc = document.getElementById('service-desc').value.trim();
  const status = document.getElementById('service-status').value;

  const payload = {
    id: id ? parseInt(id) : undefined,
    title,
    slug,
    short_desc,
    status
  };

  try {
    await apiRequest('/services.php', id ? 'PUT' : 'POST', payload);
    showToast(id ? 'Service updated' : 'Service created', 'success');
    closeModal('modal-service');
    loadServices();
  } catch (err) {
    showToast(err.message || 'Failed to save service', 'error');
  }
}

async function deleteService(id) {
  if (!confirm('Are you sure you want to delete this service?')) return;
  try {
    await apiRequest(`/services.php?id=${id}`, 'DELETE');
    showToast('Service deleted', 'success');
    loadServices();
  } catch (err) {
    showToast('Failed to delete service', 'error');
  }
}

// ==================== CONTACT INQUIRIES & LEADS ====================

async function loadLeads() {
  try {
    const res = await apiRequest('/leads.php');
    if (res.success) {
      allLeads = Array.isArray(res.data) ? res.data : [];
      const badge = document.getElementById('badge-leads');
      if (badge) badge.innerText = allLeads.filter(l => l.status === 'new').length;
      renderLeads(allLeads);
    }
  } catch (err) {
    showToast('Failed to load inquiries', 'error');
  }
}

function renderLeads(leads) {
  const tbody = document.getElementById('leads-table-body');
  if (!tbody) return;

  if (!leads.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding:24px;color:var(--wp-text-muted);">No client inquiries received yet.</td></tr>';
    return;
  }

  tbody.innerHTML = leads.map(l => `
    <tr>
      <td><strong>${escapeHtml(l.name)}</strong></td>
      <td>
        <a href="mailto:${escapeHtml(l.email)}">${escapeHtml(l.email)}</a><br>
        <a href="tel:${escapeHtml(l.phone)}">${escapeHtml(l.phone || 'N/A')}</a>
      </td>
      <td><span class="badge badge-accent">${escapeHtml(l.service_needed || 'General')}</span></td>
      <td style="max-width:280px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${escapeHtml(l.message || '')}">
        ${escapeHtml(l.message || '')}
      </td>
      <td>
        <select class="form-control" style="font-size:12px;padding:2px 6px;height:28px;" onchange="updateLeadStatus(${l.id}, this.value)">
          <option value="new" ${l.status === 'new' ? 'selected' : ''}>New</option>
          <option value="contacted" ${l.status === 'contacted' ? 'selected' : ''}>Contacted</option>
          <option value="converted" ${l.status === 'converted' ? 'selected' : ''}>Converted</option>
          <option value="closed" ${l.status === 'closed' ? 'selected' : ''}>Closed</option>
        </select>
      </td>
      <td>${formatDate(l.created_at)}</td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

async function updateLeadStatus(id, status) {
  try {
    await apiRequest('/leads.php', 'PUT', { id, status });
    showToast('Lead status updated', 'success');
  } catch (err) {
    showToast('Failed to update status', 'error');
  }
}

// ==================== WORDPRESS MEDIA LIBRARY (upload.php) ====================

async function loadMedia() {
  try {
    const res = await apiRequest('/upload.php');
    if (res.success) {
      allMedia = Array.isArray(res.files) ? res.files : [];
      const countEl = document.getElementById('media-count-display');
      if (countEl) countEl.innerText = `${allMedia.length} items`;
      renderMedia(allMedia);
    }
  } catch (err) {
    showToast('Failed to load media assets', 'error');
  }
}

function renderMedia(files) {
  const container = document.getElementById('media-grid-container');
  if (!container) return;

  if (!files.length) {
    container.innerHTML = '<div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--wp-text-muted);">No media files found. Drop files above to upload.</div>';
    return;
  }

  container.innerHTML = files.map(f => `
    <div class="media-item-box" onclick="openMediaDetailsModal('${escapeHtml(f.filename)}')" title="${escapeHtml(f.filename)}">
      <img src="${f.url}" alt="${escapeHtml(f.filename)}" loading="lazy">
    </div>
  `).join('');
}

function filterMedia() {
  const q = (document.getElementById('media-search')?.value || '').toLowerCase();
  const type = document.getElementById('media-filter-type')?.value || '';

  const filtered = allMedia.filter(f => {
    const matchesQ = !q || f.filename.toLowerCase().includes(q);
    const matchesType = !type || (type === 'images' ? /\.(webp|png|jpg|jpeg|svg|gif)$/i.test(f.filename) : !/\.(webp|png|jpg|jpeg|svg|gif)$/i.test(f.filename));
    return matchesQ && matchesType;
  });

  renderMedia(filtered);
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

function openMediaDetailsModal(filename) {
  const file = allMedia.find(f => f.filename === filename);
  if (!file) return;

  document.getElementById('media-details-title').innerText = file.filename;
  document.getElementById('media-details-img').src = file.url;
  document.getElementById('media-details-url').value = file.url.startsWith('http') ? file.url : (window.location.origin + file.url);
  document.getElementById('media-details-size').innerText = 'File size: ' + formatBytes(file.size);
  document.getElementById('media-details-date').innerText = 'Uploaded on: ' + formatDate(file.date ? file.date * 1000 : Date.now());

  const delBtn = document.getElementById('media-details-delete-btn');
  delBtn.onclick = () => {
    closeModal('modal-media-details');
    deleteMedia(file.filename);
  };

  openModal('modal-media-details');
}

async function deleteMedia(filename) {
  if (!confirm(`Are you sure you want to permanently delete "${filename}"?`)) return;
  try {
    const res = await apiRequest(`/upload.php?file=${encodeURIComponent(filename)}`, 'DELETE');
    if (res.success) {
      showToast('Media file deleted permanently', 'success');
      loadMedia();
    }
  } catch (err) {
    showToast('Failed to delete media', 'error');
  }
}

// ==================== WORDPRESS MEDIA PICKER MODAL ====================

function openMediaPicker(targetInputId, previewImgId) {
  activePickerTargetInputId = targetInputId;
  activePickerPreviewImgId = previewImgId;
  selectedPickerMediaUrl = '';

  loadPickerMedia();
  openModal('modal-media-picker');
}

function openMediaPickerForEditor() {
  activePickerTargetInputId = '';
  activePickerPreviewImgId = '';
  selectedPickerMediaUrl = '';

  loadPickerMedia();
  openModal('modal-media-picker');
}

async function loadPickerMedia() {
  const listEl = document.getElementById('media-picker-list');
  if (!listEl) return;

  try {
    if (!allMedia.length) {
      const res = await apiRequest('/upload.php');
      if (res.success) allMedia = res.files || [];
    }
    renderPickerMedia(allMedia);
  } catch (err) {
    listEl.innerHTML = '<div style="grid-column: 1/-1; padding: 30px; text-align: center; color: var(--wp-color-danger);">Failed to load media assets.</div>';
  }
}

function renderPickerMedia(files) {
  const listEl = document.getElementById('media-picker-list');
  if (!listEl) return;

  const imageFiles = files.filter(f => /\.(webp|png|jpg|jpeg|svg|gif)$/i.test(f.filename));

  if (!imageFiles.length) {
    listEl.innerHTML = '<div style="grid-column: 1/-1; padding: 30px; text-align: center; color: var(--wp-text-muted);">No images found. Click "Upload New" above.</div>';
    return;
  }

  listEl.innerHTML = imageFiles.map(f => `
    <div class="media-item-box ${selectedPickerMediaUrl === f.url ? 'selected' : ''}" onclick="selectPickerItem('${f.url}', this)" title="${escapeHtml(f.filename)}">
      <img src="${f.url}" alt="${escapeHtml(f.filename)}" loading="lazy">
    </div>
  `).join('');
}

function selectPickerItem(url, el) {
  selectedPickerMediaUrl = url;
  document.querySelectorAll('#media-picker-list .media-item-box').forEach(item => item.classList.remove('selected'));
  if (el) el.classList.add('selected');
}

function confirmMediaSelection() {
  if (!selectedPickerMediaUrl) {
    showToast('Please click an image to select it.', 'error');
    return;
  }

  // If selecting for post editor
  if (!activePickerTargetInputId && easyMDE) {
    const cm = easyMDE.codemirror;
    const doc = cm.getDoc();
    const cursor = doc.getCursor();
    doc.replaceRange(`![Image](${selectedPickerMediaUrl})\n`, cursor);
    closeModal('modal-media-picker');
    showToast('Image inserted into content editor!', 'success');
    return;
  }

  if (activePickerTargetInputId) {
    const input = document.getElementById(activePickerTargetInputId);
    if (input) input.value = selectedPickerMediaUrl;
  }

  if (activePickerPreviewImgId) {
    const preview = document.getElementById(activePickerPreviewImgId);
    if (preview) {
      preview.src = selectedPickerMediaUrl;
      preview.style.display = 'block';
    }
  }

  if (activePickerTargetInputId === 'blog-cover') {
    updateFeaturedImageUi(selectedPickerMediaUrl);
  }

  closeModal('modal-media-picker');
  showToast('Featured image updated!', 'success');
}

async function uploadToPicker(input) {
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  const formData = new FormData();
  formData.append('file', file);
  showToast(`Uploading ${file.name}...`, 'success');

  try {
    const res = await uploadFileRequest(formData);
    if (res.success) {
      showToast(`${file.name} uploaded successfully!`, 'success');
      selectedPickerMediaUrl = res.url;
      await loadPickerMedia();
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  } catch (err) {
    showToast('Upload error', 'error');
  }
}

function filterPickerMedia() {
  const q = (document.getElementById('picker-media-search')?.value || '').toLowerCase();
  renderPickerMedia(allMedia.filter(f => f.filename.toLowerCase().includes(q)));
}

// ==================== GENERAL SITE SETTINGS ====================

async function loadSiteSettings() {
  try {
    const res = await apiRequest('/settings.php');
    if (res.success && res.data) {
      const s = res.data;
      if (document.getElementById('setting-contact-phone1')) document.getElementById('setting-contact-phone1').value = s.contact_phone1 || '+91-9992009988';
      if (document.getElementById('setting-contact-phone2')) document.getElementById('setting-contact-phone2').value = s.contact_phone2 || '+91-9992009901';
      if (document.getElementById('setting-contact-email')) document.getElementById('setting-contact-email').value = s.contact_email || 'info@entecmedia.com';
      if (document.getElementById('setting-contact-address')) document.getElementById('setting-contact-address').value = s.contact_address || 'Phase 8B, Industrial Area, Sector 74, Mohali, Punjab';
      if (document.getElementById('setting-working-hours')) document.getElementById('setting-working-hours').value = s.working_hours || 'Mon - Fri: 9:30 AM - 6:30 PM';

      if (document.getElementById('setting-social-linkedin')) document.getElementById('setting-social-linkedin').value = s.social_linkedin || 'https://linkedin.com/company/entecmedia';
      if (document.getElementById('setting-social-instagram')) document.getElementById('setting-social-instagram').value = s.social_instagram || 'https://instagram.com/entecmedia';
      if (document.getElementById('setting-social-facebook')) document.getElementById('setting-social-facebook').value = s.social_facebook || 'https://facebook.com/entecmedia';
      if (document.getElementById('setting-social-youtube')) document.getElementById('setting-social-youtube').value = s.social_youtube || 'https://youtube.com/@entecmedia';
    }
  } catch (err) {
    showToast('Failed to load settings', 'error');
  }
}

async function handleSaveSettings(e) {
  e.preventDefault();
  const payload = {
    contact_phone1: document.getElementById('setting-contact-phone1').value.trim(),
    contact_phone2: document.getElementById('setting-contact-phone2').value.trim(),
    contact_email: document.getElementById('setting-contact-email').value.trim(),
    contact_address: document.getElementById('setting-contact-address').value.trim(),
    working_hours: document.getElementById('setting-working-hours').value.trim(),
    social_linkedin: document.getElementById('setting-social-linkedin').value.trim(),
    social_instagram: document.getElementById('setting-social-instagram').value.trim(),
    social_facebook: document.getElementById('setting-social-facebook').value.trim(),
    social_youtube: document.getElementById('setting-social-youtube').value.trim()
  };

  const btn = document.getElementById('settings-save-btn');
  btn.disabled = true;
  btn.innerText = 'Saving...';

  try {
    await apiRequest('/settings.php', 'POST', payload);
    showToast('Settings saved successfully!', 'success');
  } catch (err) {
    showToast(err.message || 'Failed to save settings', 'error');
  } finally {
    btn.disabled = false;
    btn.innerText = 'Save Changes';
  }
}

// ==================== MODAL UTILITIES ====================

function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    if (window.lucide) lucide.createIcons();
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

// ==================== API HELPERS & LOCAL DEV FALLBACK ====================

const MOCK_STORAGE_KEY = 'entec_admin_cms_store_v1';

function getMockStore() {
  let store = null;
  try {
    store = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY) || 'null');
  } catch (e) {}

  if (!store || !store.blogs || !store.blogs.length) {
    store = {
      blogs: [
        {
          id: 1,
          title: "Core Web Vitals Guide: Optimizing INP, LCP & CLS in 2026",
          slug: "core-web-vitals-guide",
          category: "SEO",
          author: "Entec Media",
          cover_image: "/images/r/aboutbac.webp",
          excerpt: "Master Interaction to Next Paint (INP), Largest Contentful Paint (LCP), and Cumulative Layout Shift (CLS) with actionable frontend optimization strategies.",
          content: "### Core Web Vitals in 2026\n\nGoogle's page experience signals are more crucial than ever for search visibility and conversion rates. Understanding and optimizing INP, LCP, and CLS ensures your visitors enjoy lightning-fast load times.",
          meta_title: "Core Web Vitals Guide 2026 | Entec Media",
          meta_description: "Master Interaction to Next Paint (INP), Largest Contentful Paint (LCP), and CLS.",
          status: "published",
          views: 342,
          created_at: "2026-10-15 10:30:00"
        },
        {
          id: 2,
          title: "Website Design Trends for 2026: The Rise of Kinetic Typography",
          slug: "website-design-trends-2026",
          category: "Website Design",
          author: "Entec Media",
          cover_image: "/images/r/aboutbac.webp",
          excerpt: "Explore the emerging visual paradigms shaping high-converting websites in 2026, from fluid typography to generative canvas animations.",
          content: "### The Aesthetics of Modern Web Design\n\nIn 2026, web design has moved beyond static minimalism into dynamic storytelling. Discover how micro-interactions and bold layouts captivate audiences.",
          meta_title: "Website Design Trends 2026 | Entec Media",
          meta_description: "Explore emerging visual paradigms shaping websites in 2026.",
          status: "published",
          views: 521,
          created_at: "2026-10-18 14:15:00"
        },
        {
          id: 3,
          title: "Google Ads vs Meta Ads: Performance Marketing Blueprint for ROI",
          slug: "google-ads-vs-meta-ads",
          category: "Digital Marketing",
          author: "Entec Media",
          cover_image: "/images/r/aboutbac.webp",
          excerpt: "How to balance high-intent search capture with disruptive social demand generation for maximum blended return on ad spend (ROAS).",
          content: "### Search Intent vs Social Discovery\n\nBalancing paid search with paid social is essential for full-funnel customer acquisition. Learn which channels drive optimal performance for your business model.",
          meta_title: "Google Ads vs Meta Ads ROI Blueprint | Entec Media",
          meta_description: "Performance marketing comparison between Google and Meta Ads.",
          status: "draft",
          views: 184,
          created_at: "2026-10-19 09:45:00"
        }
      ],
      careers: [
        {
          id: 1,
          title: "Senior Frontend Engineer (Next.js / TypeScript)",
          slug: "senior-frontend-engineer",
          department: "Development",
          job_type: "Full-time",
          location: "Zirakpur, Punjab / Remote",
          experience: "3+ years",
          salary_range: "₹6.0L - ₹10.5L",
          description: "Build high-performance, animation-rich web applications with Next.js App Router and TypeScript.",
          status: "open"
        },
        {
          id: 2,
          title: "UI/UX Product Designer",
          slug: "ui-ux-product-designer",
          department: "Design",
          job_type: "Full-time",
          location: "Zirakpur, Punjab",
          experience: "2-4 years",
          salary_range: "₹4.8L - ₹8.0L",
          description: "Craft modern, state-of-the-art web and mobile interfaces in Figma with atomic design systems.",
          status: "open"
        }
      ],
      applications: [
        {
          id: 1,
          applicant_name: "Rahul Sharma",
          email: "rahul.sharma@example.com",
          phone: "+91-9876543210",
          job_title: "Senior Frontend Engineer",
          resume_path: "/uploads/resumes/sample-resume.pdf",
          portfolio_url: "https://github.com/rahulsharma",
          status: "new",
          created_at: "2026-10-20 11:00:00"
        }
      ],
      projects: [
        {
          id: 1,
          title: "NexaTech Enterprise Cloud Portal",
          slug: "nexatech-enterprise",
          client: "NexaTech Corp",
          category: "Website Development",
          thumbnail: "/images/r/aboutbac.webp",
          live_url: "https://entecmedia.com/portfolio/nexatech-enterprise",
          short_desc: "Enterprise cloud dashboard and high-availability customer portal.",
          status: "published"
        },
        {
          id: 2,
          title: "Lumina Luxury Brand Identity",
          slug: "lumina-luxury",
          client: "Lumina Lifestyle",
          category: "Website Design",
          thumbnail: "/images/r/aboutbac.webp",
          live_url: "https://entecmedia.com/portfolio/lumina-luxury",
          short_desc: "E-commerce flagship store with cinematic product storytelling.",
          status: "published"
        }
      ],
      services: [
        { id: 1, title: "Website Design", slug: "website-design", status: "active" },
        { id: 2, title: "Website Development", slug: "website-development", status: "active" },
        { id: 3, title: "Mobile App Development", slug: "mobile-app-development", status: "active" },
        { id: 4, title: "SEO", slug: "seo", status: "active" },
        { id: 5, title: "Google & Meta Ads", slug: "google-ads", status: "active" }
      ],
      leads: [
        {
          id: 1,
          name: "Amit Patel",
          email: "amit.patel@techcorp.in",
          phone: "+91-9988776655",
          service_needed: "Website Development",
          message: "Looking for an agency to build a high-performance Next.js company website.",
          status: "new",
          created_at: "2026-10-21 08:30:00"
        }
      ],
      media: [
        { filename: "darklogo.svg", url: "/images/darklogo.svg", size: 12279, date: 1792560000 },
        { filename: "whitelogo.svg", url: "/images/whitelogo.svg", size: 11964, date: 1792560000 },
        { filename: "aboutbac.webp", url: "/images/r/aboutbac.webp", size: 98450, date: 1792560000 }
      ],
      settings: {
        contact_phone1: "+91-9992009988",
        contact_phone2: "+91-9992009901",
        contact_email: "info@entecmedia.com",
        contact_address: "Phase 8B, Industrial Area, Sector 74, Mohali, Punjab",
        working_hours: "Mon - Fri: 9:30 AM - 6:30 PM",
        social_linkedin: "https://linkedin.com/company/entecmedia",
        social_instagram: "https://instagram.com/entecmedia",
        social_facebook: "https://facebook.com/entecmedia",
        social_youtube: "https://youtube.com/@entecmedia"
      }
    };
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
  }
  return store;
}

function handleLocalMockApi(endpoint, method, body) {
  const store = getMockStore();

  // 1. Auth
  if (endpoint.startsWith('/auth.php')) {
    if (endpoint.includes('action=login') || method === 'POST') {
      const email = body?.email || 'admin@entecmedia.com';
      return {
        success: true,
        token: 'mock-token-' + Date.now(),
        user: { id: 1, name: 'Entec Administrator', email, role: 'superadmin' }
      };
    }
    return { authenticated: true, user: currentUser || { name: 'Entec Administrator', email: 'admin@entecmedia.com' } };
  }

  // 2. Stats
  if (endpoint.startsWith('/stats.php')) {
    return {
      success: true,
      data: {
        blogs_count: store.blogs.length,
        careers_open_count: store.careers.filter(c => c.status === 'open').length,
        applications_count: store.applications.length,
        projects_count: store.projects.length,
        new_leads_count: store.leads.filter(l => l.status === 'new').length,
        media_count: store.media.length,
        recent_blogs: store.blogs.slice(0, 5),
        recent_leads: store.leads.slice(0, 5),
        recent_applications: store.applications.slice(0, 5)
      }
    };
  }

  // 3. Blogs
  if (endpoint.startsWith('/blogs.php')) {
    if (method === 'GET') {
      const idMatch = endpoint.match(/id=(\d+)/);
      if (idMatch) {
        const blog = store.blogs.find(b => b.id === parseInt(idMatch[1]));
        return { success: true, data: blog };
      }
      return { success: true, data: store.blogs };
    }
    if (method === 'POST') {
      const newB = { ...body, id: Date.now(), views: 0, created_at: new Date().toISOString() };
      store.blogs.unshift(newB);
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      return { success: true, message: 'Post created', id: newB.id };
    }
    if (method === 'PUT') {
      const idx = store.blogs.findIndex(b => b.id === parseInt(body.id));
      if (idx !== -1) {
        store.blogs[idx] = { ...store.blogs[idx], ...body };
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      }
      return { success: true, message: 'Post updated' };
    }
    if (method === 'DELETE') {
      const idMatch = endpoint.match(/id=(\d+)/);
      if (idMatch) {
        store.blogs = store.blogs.filter(b => b.id !== parseInt(idMatch[1]));
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      }
      return { success: true, message: 'Post deleted' };
    }
  }

  // 4. Careers
  if (endpoint.startsWith('/careers.php')) {
    if (endpoint.includes('action=applications')) {
      return { success: true, data: store.applications };
    }
    if (endpoint.includes('action=application_status')) {
      const app = store.applications.find(a => a.id === parseInt(body.app_id));
      if (app) app.status = body.status;
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      return { success: true, message: 'Status updated' };
    }
    if (method === 'GET') {
      const idMatch = endpoint.match(/id=(\d+)/);
      if (idMatch) return { success: true, data: store.careers.find(c => c.id === parseInt(idMatch[1])) };
      return { success: true, data: store.careers };
    }
    if (method === 'POST') {
      const newC = { ...body, id: Date.now() };
      store.careers.unshift(newC);
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      return { success: true, message: 'Job posted' };
    }
    if (method === 'PUT') {
      const idx = store.careers.findIndex(c => c.id === parseInt(body.id));
      if (idx !== -1) {
        store.careers[idx] = { ...store.careers[idx], ...body };
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      }
      return { success: true, message: 'Job updated' };
    }
    if (method === 'DELETE') {
      const idMatch = endpoint.match(/id=(\d+)/);
      if (idMatch) {
        store.careers = store.careers.filter(c => c.id !== parseInt(idMatch[1]));
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      }
      return { success: true, message: 'Job deleted' };
    }
  }

  // 5. Projects
  if (endpoint.startsWith('/projects.php')) {
    if (method === 'GET') {
      const idMatch = endpoint.match(/id=(\d+)/);
      if (idMatch) return { success: true, data: store.projects.find(p => p.id === parseInt(idMatch[1])) };
      return { success: true, data: store.projects };
    }
    if (method === 'POST') {
      const newP = { ...body, id: Date.now() };
      store.projects.unshift(newP);
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      return { success: true, message: 'Project created' };
    }
    if (method === 'PUT') {
      const idx = store.projects.findIndex(p => p.id === parseInt(body.id));
      if (idx !== -1) {
        store.projects[idx] = { ...store.projects[idx], ...body };
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      }
      return { success: true, message: 'Project updated' };
    }
    if (method === 'DELETE') {
      const idMatch = endpoint.match(/id=(\d+)/);
      if (idMatch) {
        store.projects = store.projects.filter(p => p.id !== parseInt(idMatch[1]));
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      }
      return { success: true, message: 'Project deleted' };
    }
  }

  // 6. Services
  if (endpoint.startsWith('/services.php')) {
    if (method === 'GET') {
      const idMatch = endpoint.match(/id=(\d+)/);
      if (idMatch) return { success: true, data: store.services.find(s => s.id === parseInt(idMatch[1])) };
      return { success: true, data: store.services };
    }
    if (method === 'POST') {
      const newS = { ...body, id: Date.now() };
      store.services.unshift(newS);
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      return { success: true, message: 'Service created' };
    }
    if (method === 'PUT') {
      const idx = store.services.findIndex(s => s.id === parseInt(body.id));
      if (idx !== -1) {
        store.services[idx] = { ...store.services[idx], ...body };
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      }
      return { success: true, message: 'Service updated' };
    }
    if (method === 'DELETE') {
      const idMatch = endpoint.match(/id=(\d+)/);
      if (idMatch) {
        store.services = store.services.filter(s => s.id !== parseInt(idMatch[1]));
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      }
      return { success: true, message: 'Service deleted' };
    }
  }

  // 7. Leads
  if (endpoint.startsWith('/leads.php')) {
    if (method === 'GET') return { success: true, data: store.leads };
    if (method === 'PUT') {
      const lead = store.leads.find(l => l.id === parseInt(body.id));
      if (lead) lead.status = body.status;
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      return { success: true, message: 'Lead updated' };
    }
  }

  // 8. Settings
  if (endpoint.startsWith('/settings.php')) {
    if (method === 'GET') return { success: true, data: store.settings };
    if (method === 'POST') {
      store.settings = { ...store.settings, ...body };
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      return { success: true, message: 'Settings saved' };
    }
  }

  // 9. Media
  if (endpoint.startsWith('/upload.php')) {
    if (method === 'GET') return { success: true, files: store.media };
    if (method === 'DELETE') {
      const fileParam = new URLSearchParams(endpoint.split('?')[1]).get('file');
      if (fileParam) {
        store.media = store.media.filter(m => m.filename !== fileParam);
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
      }
      return { success: true, message: 'File deleted' };
    }
  }

  return { success: true };
}

function handleLocalMockUpload(formData) {
  const store = getMockStore();
  const file = formData.get('file');
  const filename = file ? file.name : ('media_' + Date.now() + '.webp');
  const url = '/images/r/aboutbac.webp';
  const newMedia = {
    filename,
    url,
    size: file ? file.size : 124500,
    date: Math.floor(Date.now() / 1000)
  };
  store.media.unshift(newMedia);
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
  return { success: true, url, filename };
}

async function apiRequest(endpoint, method = 'GET', data = null) {
  const headers = {
    'Accept': 'application/json'
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    const text = await res.text();
    if (text.trim().startsWith('<?php')) {
      return handleLocalMockApi(endpoint, method, data);
    }
    return JSON.parse(text);
  } catch (err) {
    return handleLocalMockApi(endpoint, method, data);
  }
}

async function uploadFileRequest(formData) {
  const headers = {};
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  try {
    const res = await fetch(`${API_BASE}/upload.php`, {
      method: 'POST',
      headers,
      body: formData
    });
    const text = await res.text();
    if (text.trim().startsWith('<?php')) {
      return handleLocalMockUpload(formData);
    }
    return JSON.parse(text);
  } catch (err) {
    return handleLocalMockUpload(formData);
  }
}

async function syncSiteData() {
  if (!confirm('This will populate default blogs, careers, and services into the database if empty. Proceed?')) return;
  try {
    const res = await apiRequest('/seed.php');
    if (res.success) {
      showToast('Database populated with defaults!', 'success');
      loadDashboardStats();
    } else {
      showToast(res.message || 'Data sync complete', 'success');
    }
  } catch (err) {
    showToast('Failed to seed defaults', 'error');
  }
}

// ==================== UTILITY HELPERS ====================

function generateSlug(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function autoSlug(sourceId, targetId) {
  const src = document.getElementById(sourceId);
  const tgt = document.getElementById(targetId);
  if (src && tgt && (!tgt.value || tgt.dataset.auto !== 'false')) {
    const slug = generateSlug(src.value);
    tgt.value = slug;
    const permalinkSlug = document.getElementById('permalink-slug-text');
    if (permalinkSlug) permalinkSlug.innerText = slug || 'sample-post';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function copyFromInput(id) {
  const input = document.getElementById(id);
  if (!input) return;
  input.select();
  navigator.clipboard.writeText(input.value).then(() => {
    showToast('Copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy', 'error');
  });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : (type === 'error' ? 'alert-triangle' : 'info')}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Global window exposure for HTML event handlers
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
window.filterBlogByStatus = filterBlogByStatus;
window.setCategoryFilter = setCategoryFilter;
window.toggleSelectAll = toggleSelectAll;
window.handleBlogBulkAction = handleBlogBulkAction;
window.handleBlogBulkActionBottom = handleBlogBulkActionBottom;
window.setBlogDraftAndSave = setBlogDraftAndSave;
window.handleSaveBlog = handleSaveBlog;
window.openCareerModal = openCareerModal;
window.editCareer = editCareer;
window.deleteCareer = deleteCareer;
window.filterCareers = filterCareers;
window.handleSaveCareer = handleSaveCareer;
window.updateApplicationStatus = updateApplicationStatus;
window.openProjectModal = openProjectModal;
window.editProject = editProject;
window.deleteProject = deleteProject;
window.filterProjects = filterProjects;
window.handleSaveProject = handleSaveProject;
window.openServiceModal = openServiceModal;
window.editService = editService;
window.deleteService = deleteService;
window.handleSaveService = handleSaveService;
window.updateLeadStatus = updateLeadStatus;
window.openMediaPicker = openMediaPicker;
window.openMediaPickerForEditor = openMediaPickerForEditor;
window.selectPickerItem = selectPickerItem;
window.confirmMediaSelection = confirmMediaSelection;
window.removeFeaturedImage = removeFeaturedImage;
window.filterPickerMedia = filterPickerMedia;
window.uploadToPicker = uploadToPicker;
window.openMediaDetailsModal = openMediaDetailsModal;
window.filterMedia = filterMedia;
window.handleDirectMediaUpload = handleDirectMediaUpload;
window.deleteMedia = deleteMedia;
window.copyFromInput = copyFromInput;
window.handleSaveSettings = handleSaveSettings;
window.syncSiteData = syncSiteData;
window.autoSlug = autoSlug;
window.showToast = showToast;
