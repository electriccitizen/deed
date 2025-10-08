(function ($, Drupal, once) {

  /* BACK TO TOP
  ------------------ */
  Drupal.behaviors.backToTop = {
    attach: function (context, settings) {
      once('backTop', 'html.js', context).forEach(backTop => {
        document.querySelector('.back-anchor a').addEventListener('click', function (e) {
          e.preventDefault();
          window.scrollTo({
            top: document.body.offsetTop - 10,
            behavior: 'smooth'
          });
        });
      });
    }
  }

  Drupal.behaviors.widthCheck = {
    attach: function (context, settings) {
      once('desktopSizing', 'body', context).forEach(() => {
        // Get desktop width from CSS vars set in 00-base/variables/_units.scss.
        let deskWidth = window.getComputedStyle(document.documentElement).getPropertyValue('--desk-size');
        if (!deskWidth) {
          // As a backup, just in case the browser doesn't support CSS vars.
          deskWidth = "984px";
        }
        deskWidth = deskWidth.replace("px", "");
        let currentSize = "";
        widthCheck();

        window.addEventListener('resize', widthCheck);

        function widthCheck() {
          const oldSize = currentSize;
          if ($('body').width() >= deskWidth) {
            currentSize = "desk";
          }
          else {
            currentSize = "mobile";
          }
          if (oldSize !== currentSize) {
            $("body").removeClass("size-" + oldSize);
            $("body").addClass("size-" + currentSize);
          }
        }
      });
    }
  }

  Drupal.behaviors.positionApplyNow = {
    attach: function (context, settings) {
      once('positionApplyNow', '.block-2', context).forEach(() => {
        const applyNow = document.querySelector('.block-2');
        if (!applyNow) return;

        const originalButton = applyNow.querySelector('.block-2 a');
        if (!originalButton) return;

        const clonedButton = originalButton.cloneNode(true);
        const destinationUL = document.querySelector('#block-main-menu ul.menu-main-navigation');
        if (!destinationUL) return;

        //add cloned button to mobile menu
        clonedButton.className = 'mobile-apply';
        destinationUL.appendChild(clonedButton);
        
      });
    }
  };

})(jQuery, Drupal, once);
