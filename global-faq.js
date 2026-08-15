/**
 * global-faq.js
 * 
 * Injects a per-page FAQ button and modal into every page.
 * Each page defines its own FAQ content by setting:
 *
 *   window.PAGE_FAQ = {
 *     title: 'Page Title',           // optional, shown in modal header
 *     items: [
 *       { q: 'Question?', a: 'Answer text.' },
 *       ...
 *     ]
 *   };
 *
 * The FAQ button uses the same sf-reset-btn style as settings/notice buttons.
 * The modal uses the same settings-overlay/settings-container UI for visual consistency.
 *
 * Usage: <script src="global-faq.js"></script> (or ../ for subpages)
 * Must be included AFTER lucide is loaded.
 */
(function () {
  'use strict';

  const faqData = window.PAGE_FAQ || { title: 'FAQ', items: [] };
  const title = faqData.title || 'FAQ';
  const items = faqData.items || [];

  // Build accordion items from the items array
  const accordionItems = items.map((item, i) => `
    <details class="settings-accordion">
      <summary>${item.q}</summary>
      <div class="accordion-content">
        <p class="settings-desc">${item.a}</p>
      </div>
    </details>
  `).join('');

  const emptyMsg = items.length === 0
    ? '<p class="settings-desc" style="text-align:center;opacity:.5;">No FAQ items for this page.</p>'
    : '';

  const faqHTML = `
  <!-- ── Global FAQ Button ── -->
  <button id="faq-btn" class="sf-reset-btn global-faq-btn" aria-label="FAQ" title="Frequently Asked Questions">
    <i data-lucide="help-circle"></i>
  </button>

  <!-- ── Global FAQ Modal ── -->
  <div id="faq-modal" class="settings-overlay" aria-modal="true" role="dialog" style="display:none;">
    <div class="settings-container">
      <div class="settings-header">
        <h2>FAQ</h2>
        <button id="faq-close-btn" class="settings-close" aria-label="Close FAQ">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="settings-body">
        ${emptyMsg}
        ${accordionItems}
      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML('beforeend', faqHTML);

  // Inject button positioning style (only once)
  if (!document.getElementById('gs-faq-styles')) {
    const style = document.createElement('style');
    style.id = 'gs-faq-styles';
    style.textContent = `
      .global-faq-btn {
        position: fixed;
        top: 36px;
        right: 80px;
        z-index: 10001;
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    const faqBtn   = document.getElementById('faq-btn');
    const faqModal = document.getElementById('faq-modal');
    const faqClose = document.getElementById('faq-close-btn');

    const openFaq = () => {
      faqModal.style.display = '';
      requestAnimationFrame(() => requestAnimationFrame(() => faqModal.classList.add('active')));
    };
    const closeFaq = () => {
      faqModal.classList.remove('active');
      setTimeout(() => { faqModal.style.display = 'none'; }, 300);
    };

    faqBtn.addEventListener('click', openFaq);
    faqClose.addEventListener('click', closeFaq);
    faqModal.addEventListener('click', (e) => { if (e.target === faqModal) closeFaq(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && faqModal.classList.contains('active')) closeFaq();
    });

    // Accordion logic
    const accordions = faqModal.querySelectorAll('.settings-accordion');
    accordions.forEach(acc => {
      const summary = acc.querySelector('summary');
      const content = acc.querySelector('.accordion-content');
      if (!summary || !content) return;
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        if (acc.hasAttribute('open')) {
          content.style.animation = 'slideUp 0.2s ease-in forwards';
          content.addEventListener('animationend', function h() {
            acc.removeAttribute('open');
            content.style.animation = '';
            content.removeEventListener('animationend', h);
          });
        } else {
          accordions.forEach(other => {
            if (other !== acc && other.hasAttribute('open')) {
              const oc = other.querySelector('.accordion-content');
              oc.style.animation = 'slideUp 0.2s ease-in forwards';
              oc.addEventListener('animationend', function h() {
                other.removeAttribute('open');
                oc.style.animation = '';
                oc.removeEventListener('animationend', h);
              });
            }
          });
          acc.setAttribute('open', '');
          content.style.animation = 'slideDown 0.3s ease-out forwards';
        }
      });
    });

    // Re-render lucide icons for the injected button
    if (window.lucide) window.lucide.createIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
