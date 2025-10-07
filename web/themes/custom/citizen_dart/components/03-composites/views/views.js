(function (Drupal, once) {

  /* Scroll to results if an exposed filter was used,
   * set placeholders for select2.
  ------------------------------------ */
  Drupal.behaviors.viewsScroll = {
    attach: function (context, settings) {
      once('wasSearched', '#views-form-wrapper', context).forEach(view => {

        const urlCurrent = window.location.href;

        if ((urlCurrent.indexOf("?f") > -1) || (urlCurrent.indexOf("?c") > -1) || (urlCurrent.indexOf("?s") > -1)) {

          window.onload = function () {
            setTimeout(function () {
              var viewScrollAnchor = document.getElementById('skip-filters');

              if (viewScrollAnchor) {
                viewScrollAnchor.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
                viewScrollAnchor.focus();
              }
            }, 300);
          };
        }

      });
    }
  };

  /* Highlight search results.
  ------------------------------------ */
  Drupal.behaviors.searchHighlight = {
    attach: function (context, settings) {
      once('highlight', '#views-exposed-form-site-search-site-search-block', context).forEach(searchBlock => {
        const searchInput = document.getElementById('edit-site-search-api-fulltext');

        if (searchInput && searchInput.value) {
          const searchString = searchInput.value.split(' ');

          function wrapInTag(element, opts) {
            const tag = opts.tag,
              words = opts.words || [],
              regex = new RegExp(words.join('|'), 'gi'),
              replacement = '<' + tag + '>$&</' + tag + '>';

            element.innerHTML = element.textContent.replace(regex, replacement);
          }

          const bodyElements = document.querySelectorAll('.views-field-field-meta-description');

          if (bodyElements.length > 0) {
            bodyElements.forEach(function (element) {
              wrapInTag(element, {
                tag: 'mark class="search-highlight"',
                words: searchString
              });
            });
          }
        }

      });
    }
  }

})(Drupal, once);
