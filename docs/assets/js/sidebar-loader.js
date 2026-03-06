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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSidebar);
  } else {
    injectSidebar();
  }
})();
