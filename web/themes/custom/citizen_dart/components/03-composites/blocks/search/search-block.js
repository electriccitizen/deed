(function (Drupal, once) {

  Drupal.behaviors.searchToggle = {
    attach: function (context, settings) {
      once('tSearch', '.block-site-search', context).forEach(search => {

        const openTrigger = search.querySelector(".t-search");
        const closeTrigger = search.querySelector(".close-search");
        const target = search.querySelector(".t-search-close");
        const searchInput = search.querySelector("#edit-site-search-api-fulltext");
        const searchSubmitBtn = search.querySelector("#edit-site-search-submit");

        if (closeTrigger) {
          closeTrigger.setAttribute("tabindex", "-1");
        }
        if (searchInput) {
          searchInput.setAttribute("tabindex", "-1");
        }
        if (searchSubmitBtn) {
          searchSubmitBtn.setAttribute("tabindex", "-1");
        }

        // Open search.
        const openSearchBlock = (e) => {
          e.preventDefault();
          const searchFormWrapper = document.getElementById("search-form-wrapper");

          if (searchFormWrapper) {
            searchFormWrapper.setAttribute('aria-hidden', 'false');

            if (closeTrigger) {
              closeTrigger.setAttribute("tabindex", "0");
            }
            if (searchInput) {
              searchInput.setAttribute("tabindex", "0");
            }
            if (searchSubmitBtn) {
              searchSubmitBtn.setAttribute("tabindex", "0");
            }

            // Set max-height to 0 initially, then to scrollHeight after a tiny delay
            searchFormWrapper.style.maxHeight = '0px';
            setTimeout(() => {
              searchFormWrapper.style.maxHeight = searchFormWrapper.scrollHeight + 'px';
            }, 10); // Small delay to trigger the transition
          }

          if (target) {
            setTimeout(() => {
              target.style.display = 'block';
            }, 300);
          }

          // Close main menu if open when search is clicked.
          const superfishMainAccordion = document.getElementById("superfish-main-accordion");
          const superfishMainToggle = document.getElementById("superfish-main-toggle");

          if (superfishMainAccordion && superfishMainAccordion.classList.contains('sf-expanded')) {
            superfishMainAccordion.style.display = 'none';
            setTimeout(() => {
              superfishMainAccordion.classList.remove('sf-expanded');
              superfishMainToggle.classList.remove('sf-expanded');
            }, 200);
          }
        }

        openTrigger.addEventListener('click', openSearchBlock);

        // Close search.
        const closeSearchBlock = (e) => {
          e.preventDefault();

          if (closeTrigger) {
            closeTrigger.setAttribute("tabindex", "-1");
          }
          if (searchInput) {
            searchInput.setAttribute("tabindex", "-1");
          }
          if (searchSubmitBtn) {
            searchSubmitBtn.setAttribute("tabindex", "-1");
          }

          if (target) {
            target.style.display = 'none';
          }

          const searchFormWrapper = document.getElementById("search-form-wrapper");

          if (searchFormWrapper) {

            // Ensure smooth transition by setting initial max-height if expanded on load
            setTimeout(() => {
              searchFormWrapper.style.maxHeight = '0px'; // Collapse to 0px
            }, 10);
          }
        }

        closeTrigger.addEventListener('click', closeSearchBlock);

      });
    }
  }

})(Drupal, once);
