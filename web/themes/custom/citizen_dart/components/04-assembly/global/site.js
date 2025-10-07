(function ($, Drupal, once) {

  /* BACK TO TOP
  ------------------ */
  Drupal.behaviors.backToTop = {
    attach: function (context, settings) {
      once('backTop', 'html.js', context).forEach(backTop => {
        window.addEventListener('scroll', function () {
          var back = window.innerHeight * 0.8;
          if (window.scrollY > back) {
            document.querySelector('.back-anchor').style.display = 'block';
          } else {
            document.querySelector('.back-anchor').style.display = 'none';
          }
        });
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

})(jQuery, Drupal, once);
