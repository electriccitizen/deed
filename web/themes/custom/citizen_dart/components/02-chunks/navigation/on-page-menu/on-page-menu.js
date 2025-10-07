(function (Drupal, once) {

  Drupal.behaviors.sectionMenu = {
    attach: function (context) {
      once('section-menu', '#block-section-menu', context).forEach(sectionMenu => {
        const sectionMenuWrapper = sectionMenu.querySelector('#section-menu-wrapper');
        const menuNavigation = sectionMenu.querySelector(".menu-main-navigation");

        sectionMenu.querySelector('.section-menu-toggle').addEventListener('click', event => {
          event.preventDefault();
          // Only allow the menu to be expanded or collapsed when at mobile
          // sizes.
          if (window.outerWidth < 980) {
            if (event.target.classList.contains('active-nav')) {
              event.target.setAttribute('aria-expanded', false);
              event.target.classList.remove('active-nav');
              event.target.querySelector('.material-icons').innerHTML = '&#xE5D2;';
              menuNavigation.classList.remove('accordion-open');
              slideUp(sectionMenuWrapper, 200);
            }
            else {
              event.target.setAttribute('aria-expanded', true);
              event.target.classList.add('active-nav');
              event.target.querySelector('.material-icons').innerHTML = '&#xE5CD;';
              menuNavigation.classList.add('accordion-open');
              slideDown(sectionMenuWrapper, 200);
            }
          }
        });

        window.addEventListener('resize', Drupal.debounce(mobileSectionNav, 150, false));

        // Must wait for document loading to be complete to come after theme.
        window.onload = () => {
          context.querySelectorAll('#section-menu-wrapper ul li').forEach(menuList => {
            // Find nested lists and set their parents and expanders.
            const childList = menuList.querySelector("ul");
            if (childList && !menuList.querySelector(".expander")) {
              menuList.classList.add('parent');

              // Create the "expander" button that reveals/hides the nested
              // menu items.
              const expander = document.createElement("a");
              expander.classList.add('expander');
              expander.setAttribute('href', '#');
              expander.setAttribute('role', 'button');
              expander.setAttribute('aria-label', Drupal.t('Section Submenu Expander'));
              expander.addEventListener('click', event => {
                event.preventDefault();
                if (menuList.classList.contains('expanded')) {
                  // Collapse nested list.
                  menuList.classList.remove('expanded');
                  event.target.setAttribute('aria-expanded', false);
                  slideUp(childList, 200);
                }
                else {
                  menuList.classList.add('expanded');
                  event.target.setAttribute('aria-expanded', true);
                  slideDown(childList, 200);
                }
              });

              menuList.prepend(expander);
              childList.setAttribute('aria-hidden', 'true');
            }

            // Find any active links and set their parents to be expanded and
            // active.
            menuList.querySelectorAll('.is-active').forEach(activeItem => {
              activeItem.removeAttribute('href');
              const activeList = activeItem.parentNode.querySelector("ul");
              if (activeList) {
                slideDown(activeList, 200);
                parentsUntil(activeList, '#section-menu-wrapper > ul', (element) => {
                  element.classList.add('active-trail', 'expanded');
                  const parentExpander = element.querySelector(":scope > .expander");
                  const parentList = element.querySelector(':scope > li > ul');
                  if (parentExpander) {
                    parentExpander.setAttribute("aria-expanded", true);
                  }
                  if (parentList) {
                    parentList.setAttribute('aria-hidden', false)
                  }
                })
              }
            });
          });
        };
      });
    }
  }

  /**
   * Animate an element collapsing a la jQuery's slideUp() method.
   * @param {HTMLElement} element
   * @param {number} duration
   */
  function slideUp(element, duration) {
    element.style.overflow = 'hidden';
    element.setAttribute('aria-hidden', true);
    window.requestAnimationFrame(timestamp => animateSlide(element, element.scrollHeight, -element.scrollHeight, duration, timestamp));
  }

  /**
   * Animate an element opening a la jQuery's slideDown() method.
   * @param {HTMLElement} element
   * @param {number} duration
   */
  function slideDown(element, duration) {
    element.style.display = 'block';
    element.setAttribute('aria-hidden', false);
    window.requestAnimationFrame(timestamp => animateSlide(element, 0, element.scrollHeight, duration, timestamp));
  }

  /**
   * Over time continue to collapse/open a given element by height.
   * @param {HTMLElement} element
   * @param {number} startHeight
   * @param {number} endHeight
   * @param {number} duration
   * @param {number} timestamp
   * @param {number} startTime
   */
  function animateSlide(element, startHeight, endHeight, duration, timestamp, startTime = 0) {
    if (startTime === 0) {
      startTime = timestamp;
    }
    const currentTime = timestamp - startTime;
    let animationContinue = currentTime < duration;
    let newHeight = animateEasing(currentTime, startHeight, endHeight, duration);

    if (animationContinue) {
      element.style.height = `${newHeight.toFixed(2)}px`;
      window.requestAnimationFrame((timestamp) => animateSlide(element, startHeight, endHeight, duration, timestamp, startTime));
    }
    else {
      if (endHeight < 0) {
        element.style.display = 'none';
      }
      element.style.overflow = 'visible';
      element.style.height = 'auto';
    }
  }

  /**
   * Use a linear quadratic formula to calculate the height for an animated slide.
   * @param {number} timepassed
   * @param {number} start
   * @param {number} end
   * @param {number} duration
   * @returns {number}
   */
  function animateEasing(timepassed, start, end, duration) {
    const difference = timepassed / duration;
    return -end * difference * (difference - 2) + start;
  }

  /**
   * Step upwards through a Node list and apply a callback until a selector.
   * @param {HTMLElement} element
   * @param {string} untilSelector
   * @param {function} callback
   */
  function parentsUntil(element, untilSelector, callback) {
    if (!element.matches(untilSelector)) {
      callback(element);
      parentsUntil(element.parentNode, untilSelector, callback);
    }
  }

  /**
   * Update ARIA roles for mobile menu depending on if we're at mobile size.
   */
  function mobileSectionNav() {

    const sectionMenuToggle = document.querySelector(".section-menu-toggle");
    const sectionMenuWrapper = document.querySelector("#section-menu-wrapper");

    if (window.outerWidth < 980) {
      // If ARIA settings not already on the toggle due to the user clicking it,
      // add them.
      if (!sectionMenuToggle.hasAttribute('aria-controls')) {
        sectionMenuToggle.setAttribute('href', '#');
        sectionMenuToggle.setAttribute('aria-controls', 'section-menu-wrapper');
        sectionMenuToggle.setAttribute('aria-expanded', false);
        sectionMenuWrapper.setAttribute('aria-hidden', true);
      }
    }
    else {
      // Strip all ARIA attributes and prevent clicking it.
      sectionMenuToggle.removeAttribute('aria-controls');
      sectionMenuToggle.removeAttribute('aria-expanded');
      sectionMenuToggle.removeAttribute('role');
      sectionMenuToggle.removeAttribute('href');
      sectionMenuWrapper.removeAttribute('aria-hidden');
    }
  }

})(Drupal, once);
