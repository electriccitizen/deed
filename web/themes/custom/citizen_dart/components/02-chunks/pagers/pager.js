(function ($, Drupal, once) {
  Drupal.behaviors.pager = {
    attach: function (context, settings) {
      $(once('page-menu', '.count-shim', context)).each(function () {
        // Add pager counter to results.
        const countElement = document.querySelector('.count-shim');
        const pageTotalElement = document.querySelector('.page-total');

        if (countElement) {
          const count = countElement.innerHTML;
          if (pageTotalElement) {
            pageTotalElement.innerHTML = count;
          }

          if (count > 7) {
            let pagerNav = document.querySelector('nav.pager');
            if (pagerNav) {
              pagerNav.classList.add('results-pager');
              let resultsCount = document.querySelector('.results-count');
              if (resultsCount) {
                resultsCount.parentNode.removeChild(resultsCount);
                let pager = document.querySelector('.pager');
                if (pager) {
                  let resultsCountWrapper = document.createElement('div');
                  resultsCountWrapper.classList.add('results-count-wrapper');
                  pager.insertBefore(resultsCountWrapper, pager.firstChild);
                  resultsCountWrapper.appendChild(resultsCount);
                }
              }

              const pagerNumbers = document.querySelectorAll('.pager__number');
              const resultsCountElement = document.querySelector('.results-count');
              if (pagerNumbers && resultsCountElement) {
                pagerNumbers.forEach(function (number) {
                  number.style.display = 'block';
                });
                resultsCountElement.style.display = 'block';
              }
            }
          } else {
            const pagerCurrent = document.querySelector('.pager__current');
            if (pagerCurrent) {
              pagerCurrent.style.display = 'block';
            }
          }
        }
      });
    }
  }

})(jQuery, Drupal, once);
