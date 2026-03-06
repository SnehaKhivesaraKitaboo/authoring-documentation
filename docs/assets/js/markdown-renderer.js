/**
 * Markdown Renderer
 * Handles loading and rendering of Markdown files
 * Uses marked.js library for parsing
 */

class MarkdownRenderer {
  constructor(options = {}) {
    this.options = {
      baseUrl: options.baseUrl || '',
      sanitize: options.sanitize !== false,
      breaks: options.breaks !== false,
      gfm: options.gfm !== false,
      ...options
    };
    
    // Initialize marked.js if available
    if (typeof marked !== 'undefined') {
      this.initializeMarked();
    }
  }

  /**
   * Initialize marked.js with custom configuration
   */
  initializeMarked() {
    marked.setOptions({
      breaks: this.options.breaks,
      gfm: this.options.gfm,
      headerIds: true,
      mangle: false,
      pedantic: false,
      sanitize: false, // We'll handle sanitization separately if needed
      smartLists: true,
      smartypants: true
    });

    // Custom renderer for enhanced styling
    const renderer = new marked.Renderer();
    
    // Custom heading renderer
    renderer.heading = (text, level) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
      return `
        <h${level} id="${escapedText}">
          <a class="heading-anchor" href="#${escapedText}" aria-hidden="true">#</a>
          ${text}
        </h${level}>
      `;
    };

    // Custom link renderer (open external links in new tab)
    renderer.link = (href, title, text) => {
      const isExternal = href.startsWith('http://') || href.startsWith('https://');
      const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      const titleAttr = title ? ` title="${title}"` : '';
      return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
    };

    // Custom code renderer
    renderer.code = (code, language) => {
      const lang = language || 'plaintext';
      return `
        <pre><code class="language-${lang}">${this.escapeHtml(code)}</code></pre>
      `;
    };

    // Custom blockquote renderer for callouts/alerts
    renderer.blockquote = (quote) => {
      // Check if it's a special alert
      const alertMatch = quote.match(/^<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
      if (alertMatch) {
        const type = alertMatch[1].toLowerCase();
        const content = quote.replace(/^<p>\[![^\]]+\]\s*/, '<p>');
        const typeMap = {
          'note': 'info',
          'tip': 'success',
          'important': 'warning',
          'warning': 'warning',
          'caution': 'error'
        };
        return `<div class="alert alert-${typeMap[type] || 'info'}">${content}</div>`;
      }
      return `<blockquote>${quote}</blockquote>`;
    };

    marked.use({ renderer });
  }

  /**
   * Load and render a Markdown file
   * @param {string} filePath - Path to the .md file
   * @param {string} targetElementId - ID of the element to render into
   * @returns {Promise<void>}
   */
  async renderFile(filePath, targetElementId) {
    try {
      const content = await this.loadFile(filePath);
      this.render(content, targetElementId);
    } catch (error) {
      this.renderError(targetElementId, error.message);
    }
  }

  /**
   * Load a file from the specified path
   * @param {string} filePath - Path to the file
   * @returns {Promise<string>}
   */
  async loadFile(filePath) {
    try {
      // Construct the full path
      const fullPath = this.resolvePath(filePath);
      
      const response = await fetch(fullPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
      }
      
      return await response.text();
    } catch (error) {
      throw new Error(`Error loading file "${filePath}": ${error.message}`);
    }
  }

  /**
   * Resolve file path relative to base URL
   * @param {string} filePath - Relative file path
   * @returns {string} - Resolved path
   */
  resolvePath(filePath) {
    // Remove leading slash if present
    const cleanPath = filePath.replace(/^\//, '');
    
    // Combine with base URL
    if (this.options.baseUrl) {
      return `${this.options.baseUrl}/${cleanPath}`;
    }
    
    return cleanPath;
  }

  /**
   * Render Markdown content to HTML
   * @param {string} markdown - Markdown content
   * @param {string} targetElementId - ID of target element
   */
  render(markdown, targetElementId) {
    const targetElement = document.getElementById(targetElementId);
    
    if (!targetElement) {
      console.error(`Target element #${targetElementId} not found`);
      return;
    }

    // Check if marked.js is available
    if (typeof marked === 'undefined') {
      targetElement.innerHTML = `
        <div class="alert alert-error">
          <strong>Error:</strong> Markdown parser (marked.js) not loaded.
        </div>
      `;
      return;
    }

    // Convert markdown to HTML
    const html = marked.parse(markdown);
    
    // Add markdown-content class wrapper
    targetElement.innerHTML = `<div class="markdown-content">${html}</div>`;
    
    // Apply syntax highlighting if available
    this.applySyntaxHighlighting(targetElement);
    
    // Trigger custom event
    this.dispatchRenderEvent(targetElement);
  }

  /**
   * Render an error message
   * @param {string} targetElementId - ID of target element
   * @param {string} message - Error message
   */
  renderError(targetElementId, message) {
    const targetElement = document.getElementById(targetElementId);
    
    if (!targetElement) {
      console.error(`Target element #${targetElementId} not found`);
      return;
    }

    targetElement.innerHTML = `
      <div class="alert alert-error">
        <strong>Error loading documentation:</strong><br>
        ${this.escapeHtml(message)}
      </div>
    `;
  }

  /**
   * Apply syntax highlighting to code blocks
   * @param {HTMLElement} container - Container element
   */
  applySyntaxHighlighting(container) {
    // Check if Prism.js or highlight.js is available
    if (typeof Prism !== 'undefined') {
      Prism.highlightAllUnder(container);
    } else if (typeof hljs !== 'undefined') {
      container.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }

  /**
   * Dispatch custom event after rendering
   * @param {HTMLElement} element - Rendered element
   */
  dispatchRenderEvent(element) {
    const event = new CustomEvent('markdown:rendered', {
      detail: { element },
      bubbles: true
    });
    element.dispatchEvent(event);
  }

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string}
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Render inline markdown (for small snippets)
   * @param {string} markdown - Markdown content
   * @returns {string} - HTML string
   */
  renderInline(markdown) {
    if (typeof marked === 'undefined') {
      return this.escapeHtml(markdown);
    }
    return marked.parseInline(markdown);
  }
}

/**
 * Utility function to render markdown file
 * Usage: renderMarkdown('path/to/file.md', 'target-element-id')
 */
function renderMarkdown(filePath, targetElementId, options = {}) {
  const renderer = new MarkdownRenderer(options);
  return renderer.renderFile(filePath, targetElementId);
}

/**
 * Utility function to render markdown text
 * Usage: renderMarkdownText(markdownContent, 'target-element-id')
 */
function renderMarkdownText(markdown, targetElementId, options = {}) {
  const renderer = new MarkdownRenderer(options);
  renderer.render(markdown, targetElementId);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MarkdownRenderer, renderMarkdown, renderMarkdownText };
}
