(function (Drupal, once) {

  Drupal.behaviors.accordion = {
    attach: function (context, settings) {
      once('accordion', '.field-accordion-items', context).forEach(accordions => {
        accordions.querySelectorAll('.accordion-item').forEach(function (accordion) {
          const header = accordion.querySelector('.accordion-header');
          const content = accordion.querySelector('.accordion-content');
          header.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Expand/Collapse clicked accordion.
            if (accordion.classList.contains('collapsed')) {
              accordion.classList.remove('collapsed');
              accordion.classList.add('expanded');

              header.setAttribute('aria-expanded', 'true');
              content.setAttribute('aria-hidden', 'false');
              content.removeAttribute('inert');

              // Set max-height to 0 initially, then to scrollHeight after a
              // tiny delay to trigger the transition.
              content.style.maxHeight = '0px';
              setTimeout(() => {
                content.style.maxHeight = content.scrollHeight + 'px';
              }, 10);
            }
            else {
              accordion.classList.remove('expanded');
              accordion.classList.add('collapsed');

              header.setAttribute('aria-expanded', 'false');
              // Ensure smooth transition by setting initial max-height, if
              // expanded, on load.
              content.style.maxHeight = content.scrollHeight + 'px';
              content.setAttribute('aria-hidden', 'true');
              content.setAttribute('inert', '');

              setTimeout(() => {
                content.style.maxHeight = '0px'; // Collapse to 0px
              }, 10);
            }

          });
        });
      });
    }
  }

})(Drupal, once);
