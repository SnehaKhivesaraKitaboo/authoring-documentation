/**
 * Sidebar Loader
 * Injects a consistent, full navigation sidebar into every page.
 * Determines the correct relative path prefix based on page depth.
 */

(function () {
  'use strict';

  function getPathPrefix() {
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path.endsWith('/docs/') || path.endsWith('/docs')) {
      return '';
    }
    const segments = path.split('/');
    const docsIndex = segments.indexOf('docs');
    if (docsIndex === -1) return '';
    const depth = segments.length - docsIndex - 2;
    return '../'.repeat(depth);
  }

  function getCurrentFile() {
    const path = window.location.pathname;
    const parts = path.split('/');
    return parts[parts.length - 1];
  }

  function isActive(href) {
    const currentFile = getCurrentFile();
    const linkFile = href.split('/').pop();
    return linkFile === currentFile;
  }

  function activeClass(href) {
    return isActive(href) ? ' active' : '';
  }

  function buildSidebar(prefix) {
    const elements = [
      { href: 'components/Elements/title.html', label: 'Title', icon: 'M5 3h14a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z' },
      { href: 'components/Elements/header.html', label: 'Header', icon: 'M4 6h16M4 12h16M4 18h7' },
      { href: 'components/Elements/text.html', label: 'Text', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
      { href: 'components/Elements/image.html', label: 'Image', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { href: 'components/Elements/video.html', label: 'Video', icon: 'M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
      { href: 'components/Elements/audio.html', label: 'Audio', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
      { href: 'components/Elements/html-interactivity.html', label: 'HTML Interactivity', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
      { href: 'components/Elements/table.html', label: 'Table', icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
      { href: 'components/Elements/callout-box.html', label: 'Callout Box', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
      { href: 'components/Elements/situation-header.html', label: 'Situation Header', icon: 'M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z' },
      { href: 'components/Elements/thumbs-card-header.html', label: 'Thumbs Card Header', icon: 'M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5' },
      { href: 'components/Elements/lesson-opener.html', label: 'Lesson Opener', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    ];

    const widgets = [
      { href: 'components/widgets/annotation.html', label: 'Annotation', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
      { href: 'components/widgets/carousel.html', label: 'Carousel', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { href: 'components/widgets/categorize.html', label: 'Categorize', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
      { href: 'components/widgets/clic.html', label: 'CLIC Component', icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122' },
      { href: 'components/widgets/click-to-reveal.html', label: 'Click to Reveal', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
      { href: 'components/widgets/correction.html', label: 'Correction', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
      { href: 'components/widgets/extended-response.html', label: 'Extended Response (ITC)', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { href: 'components/widgets/fib.html', label: 'Fill in the Blank (FIB)', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
      { href: 'components/widgets/fib-with-image.html', label: 'FIB with Image', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { href: 'components/widgets/flashcard.html', label: 'Flashcard', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
      { href: 'components/widgets/graphic-organizer.html', label: 'Graphic Organizer (Image GO)', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' },
      { href: 'components/widgets/group-activity.html', label: 'Group Activity (Multipart)', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
      { href: 'components/widgets/highlighter.html', label: 'Highlighter', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
      { href: 'components/widgets/image-labeling.html', label: 'Image Labeling', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
      { href: 'components/widgets/match-the-pairs.html', label: 'Match The Pairs', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
      { href: 'components/widgets/mtp-multiple.html', label: 'MTP Multiple', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      { href: 'components/widgets/mcq.html', label: 'Multiple Choice (MCQ)', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
      { href: 'components/widgets/question-answer.html', label: 'Question Answer', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
      { href: 'components/widgets/sidebar.html', label: 'Sidebar', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
      { href: 'components/widgets/sorting.html', label: 'Sorting', icon: 'M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4' },
      { href: 'components/widgets/table-go.html', label: 'Table GO', icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
      { href: 'components/widgets/true-false.html', label: 'True and False', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
      { href: 'components/widgets/word-search.html', label: 'Word Search', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' }
    ];

    function svgIcon(d) {
      return `<svg class="nav-item__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${d}"></path></svg>`;
    }

    const elementItems = elements.map(e => {
      const href = prefix + e.href;
      return `<li class="nav-item"><a href="${href}" class="nav-item__link${activeClass(href)}">${svgIcon(e.icon)}<span class="nav-item__text">${e.label}</span></a></li>`;
    }).join('\n            ');

    const widgetItems = widgets.map(w => {
      const href = prefix + w.href;
      return `<li class="nav-item"><a href="${href}" class="nav-item__link${activeClass(href)}">${svgIcon(w.icon)}<span class="nav-item__text">${w.label}</span></a></li>`;
    }).join('\n            ');

    const dashboardHref = prefix + 'index.html';
    const layoutHref = prefix + 'components/layout/layout.html';

    return `
    <div class="sidebar__header">
      <a href="${dashboardHref}" class="sidebar__logo">
        <div class="sidebar__logo-icon">📚</div>
        <span class="sidebar__logo-text">Author Components</span>
      </a>
    </div>
    
    <div class="sidebar__search">
      <div class="search-box">
        <svg class="search-box__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <label for="sidebar-search" class="sr-only">Search components</label>
        <input type="text" id="sidebar-search" class="search-box__input" placeholder="Search components...">
      </div>
    </div>
    
    <nav class="sidebar__nav" aria-label="Component navigation">
      <div class="nav-group">
        <ul class="nav-list">
          <li class="nav-item">
            <a href="${dashboardHref}" class="nav-item__link${activeClass(dashboardHref)}">
              <svg class="nav-item__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span class="nav-item__text">Dashboard</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="nav-group">
        <button class="nav-group__toggle" data-target="layout-group" aria-label="Toggle Layout Components section">
          <span class="nav-group__title">Layout Components</span>
          <svg class="nav-group__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <ul class="nav-list" id="layout-group">
          <li class="nav-item">
            <a href="${layoutHref}" class="nav-item__link${activeClass(layoutHref)}">
              <svg class="nav-item__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
              </svg>
              <span class="nav-item__text">Layout Component</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="nav-group">
        <button class="nav-group__toggle" data-target="element-group" aria-label="Toggle Element Components section">
          <span class="nav-group__title">Element Components</span>
          <svg class="nav-group__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <ul class="nav-list" id="element-group">
            ${elementItems}
        </ul>
      </div>
      
      <div class="nav-group">
        <button class="nav-group__toggle" data-target="widget-group" aria-label="Toggle Widget Components section">
          <span class="nav-group__title">Widget Components</span>
          <svg class="nav-group__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <ul class="nav-list" id="widget-group">
            ${widgetItems}
        </ul>
      </div>
    </nav>
    
    <div class="sidebar__footer">
      <a href="#" class="sidebar__footer-link">
        <svg class="sidebar__footer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Help &amp; Support
      </a>
    </div>`;
  }

  function injectSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const prefix = getPathPrefix();
    sidebar.innerHTML = buildSidebar(prefix);

    // After injecting HTML, wire up all dropdown toggles directly
    // so we don't depend on navigation.js timing
    initSidebarDropdowns();
    initSidebarSearch();
    highlightActiveLink();
  }

  /**
   * Wire up .nav-group__toggle click → collapse/expand the adjacent .nav-list
   * Uses CSS-driven max-height via aria-expanded attribute.
   */
  function initSidebarDropdowns() {
    const toggles = document.querySelectorAll('.nav-group__toggle');
    toggles.forEach(function (toggle) {
      // Default: all groups expanded
      if (!toggle.hasAttribute('aria-expanded')) {
        toggle.setAttribute('aria-expanded', 'true');
      }

      // Restore saved state from localStorage
      var targetId = toggle.dataset.target;
      try {
        var saved = JSON.parse(localStorage.getItem('nav-group-states') || '{}');
        if (saved[targetId] !== undefined) {
          toggle.setAttribute('aria-expanded', saved[targetId] ? 'true' : 'false');
        }
      } catch (e) { /* ignore */ }

      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        var next = !isExpanded;
        toggle.setAttribute('aria-expanded', next ? 'true' : 'false');

        // Persist state
        try {
          var states = JSON.parse(localStorage.getItem('nav-group-states') || '{}');
          states[targetId] = next;
          localStorage.setItem('nav-group-states', JSON.stringify(states));
        } catch (e) { /* ignore */ }
      });
    });
  }

  /**
   * Filter sidebar nav items when user types in the search box.
   */
  function initSidebarSearch() {
    var searchInput = document.getElementById('sidebar-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
      var term = searchInput.value.toLowerCase().trim();
      var groups = document.querySelectorAll('.nav-group');

      groups.forEach(function (group) {
        var toggle = group.querySelector('.nav-group__toggle');
        var items = group.querySelectorAll('.nav-item');
        var anyVisible = false;

        items.forEach(function (item) {
          var text = item.textContent.toLowerCase();
          var show = !term || text.includes(term);
          item.style.display = show ? '' : 'none';
          if (show) anyVisible = true;
        });

        // Expand group when searching so results are visible
        if (term && toggle && anyVisible) {
          toggle.setAttribute('aria-expanded', 'true');
        }

        // Hide entire group if nothing matches
        if (toggle) {
          group.style.display = (!term || anyVisible) ? '' : 'none';
        }
      });
    });
  }

  /**
   * Mark the current page's nav link as active and expand its parent group.
   */
  function highlightActiveLink() {
    var currentFile = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.nav-item__link');

    links.forEach(function (link) {
      var linkFile = (link.getAttribute('href') || '').split('/').pop();
      if (linkFile === currentFile) {
        link.classList.add('active');
        // Expand the parent nav-group
        var group = link.closest('.nav-group');
        if (group) {
          var toggle = group.querySelector('.nav-group__toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'true');
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSidebar);
  } else {
    injectSidebar();
  }
})();
