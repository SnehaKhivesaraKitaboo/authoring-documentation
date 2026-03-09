/**
 * Navigation System
 * Handles sidebar navigation, active states, and collapsible sections
 */

class Navigation {
  constructor(options = {}) {
    this.options = {
      sidebarSelector: options.sidebarSelector || '.sidebar',
      navItemSelector: options.navItemSelector || '.nav-item__link',
      toggleSelector: options.toggleSelector || '.nav-item__toggle',
      searchSelector: options.searchSelector || '.search-box__input',
      ...options
    };

    this.sidebar = document.querySelector(this.options.sidebarSelector);
    this.currentPath = window.location.pathname;
    
    this.init();
  }

  /**
   * Initialize navigation system
   */
  init() {
    this.setupNavigationLinks();
    this.setupCollapsibleSections();
    this.setupGroupDropdowns();
    this.setupCategorySections();
    this.setupSearch();
    this.setupMobileToggle();
    this.highlightCurrentPage();
    this.restoreGroupDropdownStates();
    this.restoreCategorySectionStates();
    this.setupBackToTop();
    this.injectMobileMenuButton();
  }

  /**
   * Setup navigation link click handlers
   */
  setupNavigationLinks() {
    const navLinks = document.querySelectorAll(this.options.navItemSelector);
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleNavClick(e, link);
      });
    });
  }

  /**
   * Handle navigation link click
   * @param {Event} e - Click event
   * @param {HTMLElement} link - Clicked link
   */
  handleNavClick(e, link) {
    // Remove active class from all links
    document.querySelectorAll(this.options.navItemSelector).forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to clicked link
    link.classList.add('active');
    
    // Store active page
    this.setActivePage(link.getAttribute('href'));
    
    // Close mobile sidebar
    this.closeMobileSidebar();
  }

  /**
   * Setup collapsible navigation sections
   */
  setupCollapsibleSections() {
    const toggleButtons = document.querySelectorAll(this.options.toggleSelector);
    
    toggleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleSection(button);
      });
    });
  }

  /**
   * Setup group dropdown toggles.
   * NOTE: sidebar-loader.js handles dropdowns directly after injection.
   * This method is a no-op to avoid double-binding on already-wired toggles.
   */
  setupGroupDropdowns() {
    // Dropdowns are wired by sidebar-loader.js immediately after injection.
    // No additional binding needed here.
  }

  /**
   * Toggle a group dropdown
   * @param {HTMLElement} toggle - Toggle button
   */
  toggleGroupDropdown(toggle) {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    const targetId = toggle.dataset.target;
    
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    this.saveGroupDropdownState(targetId, !isExpanded);
  }

  /**
   * Save group dropdown state
   * @param {string} groupId - Group identifier
   * @param {boolean} isExpanded - Expansion state
   */
  saveGroupDropdownState(groupId, isExpanded) {
    try {
      const states = JSON.parse(localStorage.getItem('nav-group-states') || '{}');
      states[groupId] = isExpanded;
      localStorage.setItem('nav-group-states', JSON.stringify(states));
    } catch (e) {
      console.warn('Could not save group dropdown state:', e);
    }
  }

  /**
   * Restore group dropdown states from localStorage.
   * NOTE: sidebar-loader.js handles this immediately after injection.
   */
  restoreGroupDropdownStates() {
    // Handled by sidebar-loader.js — no-op here.
  }

  /**
   * Get group dropdown state from localStorage
   * @param {string} groupId - Group identifier
   * @returns {boolean|null}
   */
  getGroupDropdownState(groupId) {
    try {
      const states = JSON.parse(localStorage.getItem('nav-group-states') || '{}');
      return states[groupId] !== undefined ? states[groupId] : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Setup category section toggles (for dashboard)
   */
  setupCategorySections() {
    const categoryToggles = document.querySelectorAll('.category-section__header[data-target]');
    
    categoryToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        this.toggleCategorySection(toggle);
      });
    });
  }

  /**
   * Toggle a category section
   * @param {HTMLElement} toggle - The category section header button
   */
  toggleCategorySection(toggle) {
    const targetId = toggle.dataset.target;
    const targetGrid = document.getElementById(targetId);
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    
    if (!targetGrid) return;
    
    // Toggle state
    toggle.setAttribute('aria-expanded', !isExpanded);
    
    // Save state to localStorage
    this.saveCategorySectionState(targetId, !isExpanded);
  }

  /**
   * Save category section state to localStorage
   * @param {string} categoryId - Category section ID
   * @param {boolean} isExpanded - Whether the section is expanded
   */
  saveCategorySectionState(categoryId, isExpanded) {
    try {
      const states = JSON.parse(localStorage.getItem('category-section-states') || '{}');
      states[categoryId] = isExpanded;
      localStorage.setItem('category-section-states', JSON.stringify(states));
    } catch (e) {
      console.warn('Failed to save category section state:', e);
    }
  }

  /**
   * Restore category section states from localStorage
   */
  restoreCategorySectionStates() {
    const categoryToggles = document.querySelectorAll('.category-section__header[data-target]');
    
    categoryToggles.forEach(toggle => {
      const targetId = toggle.dataset.target;
      const savedState = this.getCategorySectionState(targetId);
      
      if (savedState !== null) {
        toggle.setAttribute('aria-expanded', savedState);
      }
    });
  }

  /**
   * Get category section state from localStorage
   * @param {string} categoryId - Category section ID
   * @returns {boolean|null} Saved state or null if not found
   */
  getCategorySectionState(categoryId) {
    try {
      const states = JSON.parse(localStorage.getItem('category-section-states') || '{}');
      return states[categoryId] !== undefined ? states[categoryId] : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Toggle a collapsible section
   * @param {HTMLElement} button - Toggle button
   */
  toggleSection(button) {
    const isExpanded = button.classList.contains('expanded');
    const parentItem = button.closest('.nav-item--collapsible');
    const childrenContainer = parentItem.querySelector('.nav-item__children');
    
    if (isExpanded) {
      // Collapse
      button.classList.remove('expanded');
      childrenContainer.classList.remove('expanded');
      button.setAttribute('aria-expanded', 'false');
    } else {
      // Expand
      button.classList.add('expanded');
      childrenContainer.classList.add('expanded');
      button.setAttribute('aria-expanded', 'true');
    }
    
    // Store state
    this.saveCollapsibleState(button.dataset.section, !isExpanded);
  }

  /**
   * Setup search functionality
   */
  setupSearch() {
    const searchInput = document.querySelector(this.options.searchSelector);
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });
  }

  /**
   * Handle search input - filters sidebar nav items AND dashboard cards
   * @param {string} query - Search query
   */
  handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      const link = item.querySelector('.nav-item__link');
      const text = link ? link.textContent.toLowerCase() : '';
      
      if (searchTerm === '' || text.includes(searchTerm)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });

    this.filterDashboardCards(searchTerm);
    
    if (searchTerm !== '') {
      this.expandAllSections();
    } else {
      this.restoreCollapsibleStates();
    }
  }

  /**
   * Filter dashboard component cards based on search term
   * @param {string} searchTerm - Lowercased search term
   */
  filterDashboardCards(searchTerm) {
    const cards = document.querySelectorAll('.component-card');
    if (cards.length === 0) return;

    let visibleCount = 0;

    cards.forEach(card => {
      const title = (card.querySelector('.component-card__title') || {}).textContent || '';
      const desc = (card.querySelector('.component-card__description') || {}).textContent || '';
      const tags = (card.querySelector('.component-card__tags') || {}).textContent || '';
      const combined = (title + ' ' + desc + ' ' + tags).toLowerCase();

      if (searchTerm === '' || combined.includes(searchTerm)) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const emptyState = document.getElementById('search-empty-state');
    if (emptyState) {
      if (searchTerm !== '' && visibleCount === 0) {
        emptyState.classList.add('visible');
      } else {
        emptyState.classList.remove('visible');
      }
    }
  }

  /**
   * Setup mobile sidebar toggle
   */
  setupMobileToggle() {
    const toggleBtn = document.querySelector('.sidebar__toggle');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.toggleMobileSidebar();
      });
    }
    
    if (overlay) {
      overlay.addEventListener('click', () => {
        this.closeMobileSidebar();
      });
    }
  }

  /**
   * Toggle mobile sidebar
   */
  toggleMobileSidebar() {
    if (!this.sidebar) return;
    
    const isOpen = this.sidebar.classList.contains('open');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (isOpen) {
      this.sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
    } else {
      this.sidebar.classList.add('open');
      if (overlay) overlay.classList.add('visible');
    }
  }

  /**
   * Close mobile sidebar
   */
  closeMobileSidebar() {
    if (!this.sidebar) return;
    
    this.sidebar.classList.remove('open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('visible');
  }

  /**
   * Highlight current page in navigation
   */
  highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(this.options.navItemSelector);
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      if (href === currentPath || this.isCurrentPage(href)) {
        link.classList.add('active');
        this.expandParentSections(link);
      }
    });
  }

  /**
   * Check if link matches current page
   * @param {string} href - Link href
   * @returns {boolean}
   */
  isCurrentPage(href) {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'index.html';
    const linkFile = href.split('/').pop();
    
    return linkFile === currentFile;
  }

  /**
   * Expand parent sections of a nav item
   * @param {HTMLElement} navLink - Navigation link
   */
  expandParentSections(navLink) {
    let parent = navLink.closest('.nav-item__children');
    
    while (parent) {
      parent.classList.add('expanded');
      
      const toggle = parent.previousElementSibling;
      if (toggle && toggle.classList.contains('nav-item__toggle')) {
        toggle.classList.add('expanded');
        toggle.setAttribute('aria-expanded', 'true');
      }
      
      parent = parent.parentElement.closest('.nav-item__children');
    }
  }

  /**
   * Expand all collapsible sections
   */
  expandAllSections() {
    const toggleButtons = document.querySelectorAll(this.options.toggleSelector);
    const childrenContainers = document.querySelectorAll('.nav-item__children');
    
    toggleButtons.forEach(button => {
      button.classList.add('expanded');
      button.setAttribute('aria-expanded', 'true');
    });
    
    childrenContainers.forEach(container => {
      container.classList.add('expanded');
    });
  }

  /**
   * Restore saved collapsible states
   */
  restoreCollapsibleStates() {
    const toggleButtons = document.querySelectorAll(this.options.toggleSelector);
    
    toggleButtons.forEach(button => {
      const section = button.dataset.section;
      const isExpanded = this.getCollapsibleState(section);
      
      if (isExpanded) {
        button.classList.add('expanded');
        const parentItem = button.closest('.nav-item--collapsible');
        const childrenContainer = parentItem.querySelector('.nav-item__children');
        childrenContainer.classList.add('expanded');
      }
    });
  }

  /**
   * Save collapsible state to localStorage
   * @param {string} section - Section identifier
   * @param {boolean} isExpanded - Expansion state
   */
  saveCollapsibleState(section, isExpanded) {
    try {
      const states = JSON.parse(localStorage.getItem('nav-collapsible-states') || '{}');
      states[section] = isExpanded;
      localStorage.setItem('nav-collapsible-states', JSON.stringify(states));
    } catch (e) {
      console.warn('Could not save navigation state:', e);
    }
  }

  /**
   * Get collapsible state from localStorage
   * @param {string} section - Section identifier
   * @returns {boolean}
   */
  getCollapsibleState(section) {
    try {
      const states = JSON.parse(localStorage.getItem('nav-collapsible-states') || '{}');
      return states[section] === true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Set active page
   * @param {string} path - Page path
   */
  setActivePage(path) {
    try {
      localStorage.setItem('active-page', path);
    } catch (e) {
      console.warn('Could not save active page:', e);
    }
  }

  /**
   * Get active page
   * @returns {string|null}
   */
  getActivePage() {
    try {
      return localStorage.getItem('active-page');
    } catch (e) {
      return null;
    }
  }

  /**
   * Setup back-to-top floating button
   */
  setupBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>';
    document.body.appendChild(btn);

    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * Inject mobile hamburger menu button into the header
   */
  injectMobileMenuButton() {
    const header = document.querySelector('.header');
    if (!header) return;
    if (header.querySelector('.mobile-menu-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'mobile-menu-btn';
    btn.setAttribute('aria-label', 'Open navigation menu');
    btn.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
    header.insertBefore(btn, header.firstChild);

    btn.addEventListener('click', () => {
      this.toggleMobileSidebar();
    });
  }
}

/**
 * Initialize navigation when DOM is ready
 */
function initNavigation(options = {}) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new Navigation(options);
    });
  } else {
    new Navigation(options);
  }
}

// Auto-initialize if not in module context
if (typeof module === 'undefined') {
  initNavigation();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Navigation, initNavigation };
}
