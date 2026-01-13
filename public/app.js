// DOM Elements
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('category-filter');
const sortBy = document.getElementById('sort-by');
const repoList = document.getElementById('repo-list');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

// Stats elements
const totalReposEl = document.getElementById('total-repos');
const totalReferencesEl = document.getElementById('total-references');
const categoriesCountEl = document.getElementById('categories-count');

// State
let filteredData = [...mixinRepoData];

// Initialize
function init() {
  populateCategories();
  updateStats();
  renderRepoList();
  setupEventListeners();
}

// Populate category filter options
function populateCategories() {
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Update statistics
function updateStats() {
  const totalRefs = mixinRepoData.reduce((sum, repo) => sum + repo.mixin_references, 0);
  const uniqueCategories = new Set(mixinRepoData.map(r => r.category)).size;

  animateNumber(totalReposEl, mixinRepoData.length);
  animateNumber(totalReferencesEl, totalRefs);
  animateNumber(categoriesCountEl, uniqueCategories);
}

// Animate number counting
function animateNumber(element, target) {
  const duration = 1000;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (target - start) * easeOutQuart);
    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Filter and sort data
function filterAndSortData() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const sortOption = sortBy.value;

  // Filter
  filteredData = mixinRepoData.filter(repo => {
    const matchesSearch = 
      repo.name.toLowerCase().includes(searchTerm) ||
      repo.repo.toLowerCase().includes(searchTerm) ||
      repo.description.toLowerCase().includes(searchTerm) ||
      repo.category.toLowerCase().includes(searchTerm);
    
    const matchesCategory = category === 'All' || repo.category === category;
    
    return matchesSearch && matchesCategory;
  });

  // Sort
  filteredData.sort((a, b) => {
    switch (sortOption) {
      case 'references-desc':
        return b.mixin_references - a.mixin_references;
      case 'references-asc':
        return a.mixin_references - b.mixin_references;
      case 'stars-desc':
        const starsA = a.stars || 0;
        const starsB = b.stars || 0;
        return starsB - starsA;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  renderRepoList();
}

// Render repository list
function renderRepoList() {
  if (filteredData.length === 0) {
    repoList.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3>No repositories found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    `;
    return;
  }

  repoList.innerHTML = filteredData.map((repo, index) => {
    const rank = index + 1;
    const isTop3 = rank <= 3;
    
    return `
      <article class="repo-card" data-id="${repo.id}" role="button" tabindex="0">
        <div class="repo-rank ${isTop3 ? 'top-3' : ''}">#${rank}</div>
        <div class="repo-info">
          <h2 class="repo-name">${escapeHtml(repo.name)}</h2>
          <p class="repo-path">${escapeHtml(repo.repo)}</p>
          <p class="repo-description">${escapeHtml(repo.description)}</p>
          <div class="repo-meta">
            <span class="repo-tag category">${escapeHtml(repo.category)}</span>
            ${repo.common_mixin_targets.length > 0 ? `
              <span class="repo-tag">${repo.common_mixin_targets.length} common target${repo.common_mixin_targets.length !== 1 ? 's' : ''}</span>
            ` : ''}
          </div>
        </div>
        <div class="repo-stats">
          <div>
            <span class="mixin-count">${repo.mixin_references.toLocaleString()}</span>
            <span class="mixin-label">Mixin References</span>
          </div>
          ${repo.stars ? `
            <div class="github-stars">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>${formatNumber(repo.stars)}</span>
            </div>
          ` : ''}
        </div>
      </article>
    `;
  }).join('');

  // Add click handlers
  document.querySelectorAll('.repo-card').forEach(card => {
    card.addEventListener('click', () => openModal(parseInt(card.dataset.id)));
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        openModal(parseInt(card.dataset.id));
      }
    });
  });
}

// Open modal with repo details
function openModal(repoId) {
  const repo = mixinRepoData.find(r => r.id === repoId);
  if (!repo) return;

  const rank = mixinRepoData
    .sort((a, b) => b.mixin_references - a.mixin_references)
    .findIndex(r => r.id === repoId) + 1;
  const isTop3 = rank <= 3;

  modalBody.innerHTML = `
    <div class="modal-header">
      <div class="modal-rank ${isTop3 ? 'top-3' : ''}">#${rank}</div>
      <div class="modal-title-section">
        <h2>${escapeHtml(repo.name)}</h2>
        <p class="modal-repo-path">${escapeHtml(repo.repo)}</p>
        <span class="modal-category">${escapeHtml(repo.category)}</span>
      </div>
    </div>

    <div class="modal-stats-grid">
      <div class="modal-stat">
        <span class="modal-stat-value references">${repo.mixin_references.toLocaleString()}</span>
        <span class="modal-stat-label">Mixin References</span>
      </div>
      <div class="modal-stat" id="modal-stars-stat">
        <span class="modal-stat-value stars">${repo.stars ? formatNumber(repo.stars) : 'N/A'}</span>
        <span class="modal-stat-label">GitHub Stars</span>
      </div>
    </div>

    ${repo.github_url ? `
      <div class="live-stats-container" id="live-stats-container">
        <button class="refresh-btn" id="refresh-stats-btn" data-repo="${escapeHtml(repo.repo)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Fetch Live GitHub Stats
        </button>
        <div class="live-stats-result" id="live-stats-result"></div>
      </div>
    ` : ''}

    <div class="modal-description">
      <h3>Description</h3>
      <p>${escapeHtml(repo.description)}</p>
    </div>

    ${repo.common_mixin_targets.length > 0 ? `
      <div class="modal-targets">
        <h3>Common Mixin Targets</h3>
        <div class="targets-list">
          ${repo.common_mixin_targets.map(target => `
            <span class="target-item">${escapeHtml(target)}</span>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${repo.notes ? `
      <div class="modal-notes">
        <h3>Notes</h3>
        <p>${escapeHtml(repo.notes)}</p>
      </div>
    ` : ''}

    <div class="modal-actions">
      ${repo.github_url ? `
        <a href="${repo.github_url}" target="_blank" rel="noopener" class="modal-btn primary">
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          View on GitHub
        </a>
      ` : `
        <button class="modal-btn primary" disabled>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          Not on GitHub (Proprietary)
        </button>
      `}
    </div>
  `;

  // Setup refresh stats button if it exists
  const refreshBtn = document.getElementById('refresh-stats-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => fetchLiveStats(refreshBtn.dataset.repo));
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// Fetch live GitHub stats
async function fetchLiveStats(repoPath) {
  const btn = document.getElementById('refresh-stats-btn');
  const resultContainer = document.getElementById('live-stats-result');
  
  if (!btn || !resultContainer) return;
  
  // Disable button and show loading
  btn.disabled = true;
  btn.innerHTML = `
    <svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
    </svg>
    Fetching...
  `;
  
  try {
    const [owner, repo] = repoPath.split('/');
    const response = await fetch(`/api/github/${owner}/${repo}`);
    const data = await response.json();
    
    if (data.success) {
      resultContainer.innerHTML = `
        <div class="live-stats-grid">
          <div class="live-stat">
            <span class="live-stat-value">${data.data.stars.toLocaleString()}</span>
            <span class="live-stat-label">Stars</span>
          </div>
          <div class="live-stat">
            <span class="live-stat-value">${data.data.forks.toLocaleString()}</span>
            <span class="live-stat-label">Forks</span>
          </div>
          <div class="live-stat">
            <span class="live-stat-value">${data.data.open_issues.toLocaleString()}</span>
            <span class="live-stat-label">Issues</span>
          </div>
          <div class="live-stat">
            <span class="live-stat-value">${data.data.language || 'N/A'}</span>
            <span class="live-stat-label">Language</span>
          </div>
        </div>
        <p class="live-stats-updated">Last updated: ${new Date(data.data.updated_at).toLocaleDateString()}</p>
      `;
      
      // Update the stars in the main stats
      const starsEl = document.querySelector('#modal-stars-stat .modal-stat-value');
      if (starsEl) {
        starsEl.textContent = formatNumber(data.data.stars);
      }
    } else {
      resultContainer.innerHTML = `<p class="live-stats-error">Failed to fetch: ${data.error}</p>`;
    }
  } catch (error) {
    resultContainer.innerHTML = `<p class="live-stats-error">Error fetching stats. Please try again.</p>`;
  }
  
  // Re-enable button
  btn.disabled = false;
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
    </svg>
    Refresh Stats
  `;
}

// Close modal
function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Setup event listeners
function setupEventListeners() {
  searchInput.addEventListener('input', debounce(filterAndSortData, 300));
  categoryFilter.addEventListener('change', filterAndSortData);
  sortBy.addEventListener('change', filterAndSortData);
  
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
