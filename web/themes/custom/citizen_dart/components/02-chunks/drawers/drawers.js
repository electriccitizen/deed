(function (Drupal, once) {

  /* DRAWERS (SHOW MORE)
  ------------------------------------ */

  Drupal.behaviors.drawerBelow = {
    attach: function (context, settings) {
      once('drawer', '.drawer-toggle', context).forEach(drawer => {
        const drawerID = drawer.getAttribute('aria-controls');
        if (drawer.classList.contains('pre-hide-toggle') ) {
          //find the matching drawer content and if there is one, do something
          const drawerContent = document.getElementById(drawerID);
          if (drawerContent && drawerContent.innerHTML.trim() !== '') {
            drawer.classList.add('visible-drawer');
          } else{
            drawer.remove();
            drawerContent.remove();
          }
        }

        drawer.addEventListener('click', function (e) {
          e.preventDefault();

          const toggleText = this.dataset.toggle;

          if (this.classList.contains('drawer-below')) {
            if (!this.classList.contains('active-drawer')) {
              this.nextElementSibling.setAttribute('aria-hidden', 'false');
              this.textContent = Drupal.t('See fewer @toggle', { '@toggle': toggleText });
              this.classList.add('active-drawer');
              this.setAttribute('aria-expanded', 'true');

              // Set max-height to 0 initially, then to scrollHeight after a tiny delay
              this.nextElementSibling.style.maxHeight = '0px';
              setTimeout(() => {
                this.nextElementSibling.style.maxHeight = this.nextElementSibling.scrollHeight + 'px';
              }, 10); // Small delay to trigger the transition
            } else {
              this.textContent = Drupal.t('See all @toggle', { '@toggle': toggleText });
              this.classList.remove('active-drawer');
              this.setAttribute('aria-expanded', 'false');
              this.nextElementSibling.setAttribute('aria-hidden', 'true');

              // Ensure smooth transition by setting initial max-height if expanded on load
              setTimeout(() => {
                this.nextElementSibling.style.maxHeight = '0px'; // Collapse to 0px
              }, 10);
            }
          } else {
            if (!this.classList.contains('active-drawer')) {
              this.previousElementSibling.setAttribute('aria-hidden', 'false');
              this.textContent = Drupal.t('See fewer @toggle', { '@toggle': toggleText });
              this.classList.add('active-drawer');
              this.setAttribute('aria-expanded', 'true');

              // Set max-height to 0 initially, then to scrollHeight after a tiny delay
              this.previousElementSibling.style.maxHeight = '0px';
              setTimeout(() => {
                this.previousElementSibling.style.maxHeight = this.nextElementSibling.scrollHeight + 'px';
              }, 10); // Small delay to trigger the transition
            } else {
              this.textContent = Drupal.t('See all @toggle', { '@toggle': toggleText });
              this.classList.remove('active-drawer');
              this.setAttribute('aria-expanded', 'false');
              this.previousElementSibling.setAttribute('aria-hidden', 'true');

              // Ensure smooth transition by setting initial max-height if expanded on load
              setTimeout(() => {
                this.previousElementSibling.style.maxHeight = '0px'; // Collapse to 0px
              }, 10);
            }
          }
        });

        function findToggleType(element) {
          const n = element.textContent.split(' ');
          return n[n.length - 1];
        }
      });
    }
  };

})(Drupal, once);
