(function (Drupal, once) {

  /* Add paragraph preview labels
  ----------------------- */
  Drupal.behaviors.previewLabel = {
    attach: function (context) {
      once('isParaPreview', '.lp-builder .paragraph--view-mode--preview', context).forEach((element) => {
        if (typeof element.dataset.type !== 'undefined') {
          const label = document.createElement('div');
          label.className = "para-preview-label";
          label.innerHTML = element.dataset.type.replace(/_/g, ' ') + " widget";
          element.prepend(label);
        }
      });
    }
  };

})(Drupal, once);
