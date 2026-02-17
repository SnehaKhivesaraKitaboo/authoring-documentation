/**
 * Router
 * Simple client-side routing for documentation portal
 */

class Router {
  constructor(options = {}) {
    this.options = {
      contentSelector: options.contentSelector || '#main-content',
      loadingClass: options.loadingClass || 'loading',
      errorClass: options.errorClass || 'error',
      ...options
    };

    this.routes = new Map();
    this.currentRoute = null;
    this.contentElement = document.querySelector(this.options.contentSelector);
    
    this.init();
  }

  /**
   * Initialize router
   */
  init() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.route) {
        this.navigateTo(e.state.route, false);
      }
    });
  }

  /**
   * Register a route
   * @param {string} path - Route path
   * @param {Function} handler - Route handler function
   */
  register(path, handler) {
    this.routes.set(path, handler);
  }

  /**
   * Navigate to a route
   * @param {string} path - Route path
   * @param {boolean} pushState - Whether to push state to history
   */
  async navigateTo(path, pushState = true) {
    const handler = this.routes.get(path);
    
    if (!handler) {
      console.warn(`No handler registered for route: ${path}`);
      return;
    }

    // Update browser history
    if (pushState) {
      window.history.pushState({ route: path }, '', path);
    }

    // Show loading state
    this.showLoading();

    try {
      // Execute route handler
      await handler(path);
      
      // Update current route
      this.currentRoute = path;
      
      // Hide loading state
      this.hideLoading();
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Navigation error:', error);
      this.showError(error.message);
    }
  }

  /**
   * Show loading state
   */
  showLoading() {
    if (this.contentElement) {
      this.contentElement.classList.add(this.options.loadingClass);
    }
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    if (this.contentElement) {
      this.contentElement.classList.remove(this.options.loadingClass);
    }
  }

  /**
   * Show error state
   * @param {string} message - Error message
   */
  showError(message) {
    if (this.contentElement) {
      this.contentElement.classList.remove(this.options.loadingClass);
      this.contentElement.innerHTML = `
        <div class="alert alert-error">
          <strong>Error:</strong> ${message}
        </div>
      `;
    }
  }

  /**
   * Get current route
   * @returns {string|null}
   */
  getCurrentRoute() {
    return this.currentRoute;
  }

  /**
   * Check if route exists
   * @param {string} path - Route path
   * @returns {boolean}
   */
  hasRoute(path) {
    return this.routes.has(path);
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Router };
}
