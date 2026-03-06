/**
 * Mermaid Diagram Initialization
 * Uses a retry mechanism to wait for the CDN-loaded Mermaid library.
 */
(function () {
  'use strict';

  var MAX_RETRIES = 30;
  var RETRY_INTERVAL = 300;

  function renderDiagrams() {
    var elements = document.querySelectorAll('.mermaid');
    if (elements.length === 0) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: { useMaxWidth: true, htmlLabels: true },
      sequence: { useMaxWidth: true },
      fontFamily: 'Inter, sans-serif'
    });

    try {
      var result = mermaid.run({ nodes: elements });
      if (result && typeof result.catch === 'function') {
        result.catch(function () {
          if (typeof mermaid.init === 'function') {
            mermaid.init(undefined, elements);
          }
        });
      }
    } catch (e) {
      if (typeof mermaid.init === 'function') {
        mermaid.init(undefined, elements);
      }
    }
  }

  function waitForMermaid(attempt) {
    if (typeof mermaid !== 'undefined' && typeof mermaid.initialize === 'function') {
      renderDiagrams();
      return;
    }
    if (attempt < MAX_RETRIES) {
      setTimeout(function () {
        waitForMermaid(attempt + 1);
      }, RETRY_INTERVAL);
    }
  }

  function onReady() {
    waitForMermaid(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
