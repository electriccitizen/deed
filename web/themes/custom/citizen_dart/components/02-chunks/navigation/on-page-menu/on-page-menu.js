(function (Drupal, once) {
  'use strict';

  const cssEscapeFallback = (value) => {
    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
      return CSS.escape(value);
    }
    return String(value).replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
  };

  /**
   * Determine fixed header height (if any) to offset scrolling.
   * Tries common header selectors; only counts it if computed position is fixed.
   */
  const getHeaderOffset = () => {
    const headerSelectors = ['.site-header', 'header', '.header', '.fixed-header', '[data-header-fixed]'];
    const headerEl = document.querySelector(headerSelectors.join(','));
    if (!headerEl) return 0;
    const style = window.getComputedStyle(headerEl);
    if (style.position === 'fixed' || style.position === 'sticky') {
      return Math.ceil(headerEl.getBoundingClientRect().height);
    }
    return 0;
  };

  /**
   * Smooth scroll to an element and update the URL hash without jumping.
   * @param {Element} targetEl
   * @param {number} offset
   */
  const smoothScrollTo = (targetEl, offset = 0) => {
    if (!targetEl) return;
    const top = Math.round(targetEl.getBoundingClientRect().top + window.pageYOffset - offset - 8); // small gap
    window.scrollTo({ top: top < 0 ? 0 : top, behavior: 'smooth' });
  };

  Drupal.behaviors.onPageMenu = {
    attach(context) {
      once('on-page-menu', '.field-paragraphs', context).forEach((field) => {
        const navRoot = field.querySelector('.otp-nav') || document.querySelector('.otp-nav');
        if (!navRoot) {
          return;
        }

        // Prevent double-adding the click handler if navRoot already processed.
        if (navRoot.dataset._otpNavHandlerAttached) {
          // still run actions for paragraph--otp-action discovery below
        } else {
          navRoot.dataset._otpNavHandlerAttached = '1';

          // Click handler for smooth-scrolling nav links (delegated).
          navRoot.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            // target id without leading '#'
            const targetId = href.replace(/^#/, '');
            const escaped = cssEscapeFallback(targetId);
            const targetEl = document.getElementById(targetId) || document.querySelector('#' + escaped);
            if (!targetEl) return;

            e.preventDefault();

            const headerOffset = getHeaderOffset();
            smoothScrollTo(targetEl, headerOffset);

            // Update URL hash without jump (replaceState avoids creating an extra history entry).
            try {
              history.replaceState(null, '', '#' + targetId);
            } catch (err) {
              // ignore if history API not available for some reason
            }
          }, { passive: false });
        }

        // Build a map of parentId => nav <li>
        const navMap = Object.create(null);
        navRoot.querySelectorAll('.otp-section-nav-item[id]').forEach((li) => {
          const idAttr = li.id || '';
          const m = idAttr.match(/^otp-nav-(\d+)$/);
          if (m) {
            navMap[m[1]] = li;
          }
        });

        // Find all action paragraphs inside this field and add child nav links
        field.querySelectorAll('.paragraph--otp-action[id]').forEach((actionEl) => {
          if (actionEl.dataset._otpProcessed) return;
          actionEl.dataset._otpProcessed = '1';

          // Must explicitly have the data-otp-headline attribute (editor opted in).
          if (!actionEl.hasAttribute('data-otp-headline')) return;

          const headline = (actionEl.getAttribute('data-otp-headline') || '').trim();
          if (!headline) return;

          // Find parent section id by searching ancestors for id "section-<id>-..."
          let parentId = null;
          const sectionAncestor = actionEl.closest('[id^="section-"], .paragraph--otp-section[id]');
          if (sectionAncestor && sectionAncestor.id) {
            const sid = sectionAncestor.id;
            const m = sid.match(/^section-(\d+)(?:-|$)/);
            if (m) parentId = m[1];
          }

          // Fallback: data-paragraph-id attribute on an ancestor
          if (!parentId) {
            const ancestorWithPid = actionEl.closest('[data-paragraph-id]');
            if (ancestorWithPid) parentId = ancestorWithPid.getAttribute('data-paragraph-id');
          }

          if (!parentId) return;

          const navLi = navMap[parentId] || navRoot.querySelector('#' + cssEscapeFallback('otp-nav-' + parentId));
          if (!navLi) return;

          let childrenUl = navLi.querySelector('.otp-section-children');
          if (!childrenUl) {
            childrenUl = document.createElement('ul');
            childrenUl.className = 'otp-section-children';
            navLi.appendChild(childrenUl);
          }

          const actionId = actionEl.id;
          if (!actionId) return;

          // Prevent duplicate links
          if (childrenUl.querySelector('a[href="#' + cssEscapeFallback(actionId) + '"]')) {
            return;
          }

          const childLi = document.createElement('li');
          childLi.className = 'otp-section-child';

          const a = document.createElement('a');
          a.setAttribute('href', '#' + actionId);
          a.textContent = headline;

          childLi.appendChild(a);
          childrenUl.appendChild(childLi);
        });
      });
    }
  };

  const inTopWindow = (top, min = -50, max = 200) => (top >= min && top <= max);

  Drupal.behaviors.otpSimpleHighlight = {
    attach(context) {
      once('otp-simple-highlight', '.field-paragraphs', context).forEach((container) => {
        // Find sections scoped to this container so we only watch relevant ones.
        let sections = Array.from(container.querySelectorAll('.otp-section[id]'));
        if (!sections.length) return;

        // Helper: activate link matching section id
        const activateForSectionId = (sectionId) => {
          const activeClass = 'otp-section-active';
          // remove class from all .otp-main-link first (container scope first)
          const allLinks = Array.from(container.querySelectorAll('.otp-main-link.' + activeClass));
          allLinks.forEach(l => l.classList.remove(activeClass));

          if (!sectionId) return;
          const selector = '.otp-main-link[href="#' + CSS.escape(sectionId) + '"]';
          let a = container.querySelector(selector) || document.querySelector(selector);
          if (a) {
            a.classList.add(activeClass);
          }
        };

        // Evaluate which section (if any) is closest to the top window zone.
        const evaluate = () => {
          sections = Array.from(container.querySelectorAll('.otp-section[id]')); // refresh list each run
          if (!sections.length) {
            activateForSectionId(null);
            return;
          }

          const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
          let best = null;
          let bestScore = Infinity;

          const MIN_TOP = -50;
          const MAX_TOP = 200;

          for (const sec of sections) {
            const rect = sec.getBoundingClientRect();
            const top = Math.round(rect.top);
            if (top >= MIN_TOP && top <= MAX_TOP) {
              const score = Math.abs(top); // smaller is closer to top
              if (score < bestScore) {
                best = sec;
                bestScore = score;
              }
            }
          }

          if (best) {
            activateForSectionId(best.id);
            return;
          }

          // last-section fallback: when last section title reaches top third of viewport
          const last = sections[sections.length - 1];
          if (last) {
            // If your section has a specific title element you prefer, select it instead of section.
            // e.g. last.querySelector('.field-section-title')
            const lastTop = Math.round(last.getBoundingClientRect().top);
            if (lastTop <= Math.round(viewportHeight / 3)) {
              activateForSectionId(last.id);
              return;
            }
          }

          // otherwise clear
          activateForSectionId(null);
        };

        // Throttled scroll/resize using requestAnimationFrame
        let rafPending = false;
        const onScrollOrResize = () => {
          if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(() => {
              rafPending = false;
              evaluate();
            });
          }
        };

        // IntersectionObserver to cheaply schedule checks when sections enter/leave viewport.
        let io = null;
        if ('IntersectionObserver' in window) {
          io = new IntersectionObserver((entries) => {
            // We don't pick from entries directly; just run evaluate() when something changed.
            evaluate();
          }, { root: null, rootMargin: '0px', threshold: 0 });
          sections.forEach(s => io.observe(s));
        }

        // Always attach scroll+resize handlers so evaluate runs during user scroll (covers cases IO misses)
        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize, { passive: true });

        // Run evaluate immediately and at a few short intervals to catch late layout
        requestAnimationFrame(evaluate);
        window.addEventListener('load', evaluate, { passive: true });
        setTimeout(evaluate, 100);
        setTimeout(evaluate, 500);

        // If DOM under container changes (e.g., nav or sections inserted), re-run evaluate and re-observe
        const mo = new MutationObserver(() => {
          setTimeout(() => {
            // refresh sections, re-observe
            sections = Array.from(container.querySelectorAll('.otp-section[id]'));
            if (io) {
              try { io.disconnect(); } catch (e) {}
              io = new IntersectionObserver((entries) => evaluate(), { root: null, rootMargin: '0px', threshold: 0 });
              sections.forEach(s => io.observe(s));
            }
            evaluate();
          }, 50);
        });
        mo.observe(container, { childList: true, subtree: true });

        // Cleanup when container removed
        const removalChecker = setInterval(() => {
          if (!document.body.contains(container)) {
            clearInterval(removalChecker);
            try { if (io) io.disconnect(); } catch (e) {}
            mo.disconnect();
            window.removeEventListener('scroll', onScrollOrResize);
            window.removeEventListener('resize', onScrollOrResize);
          }
        }, 2000);
      });
    }
  };


  
})(Drupal, once);
