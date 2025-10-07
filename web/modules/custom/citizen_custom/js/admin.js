(function (Drupal, once) {

  /* CONTENT LIST PARAGRAPH SELECT LIST FUNCTIONALITY
  ----------------------- */
  Drupal.behaviors.contentList = {
    attach: function (context) {
      once('isContentPlacer', '.field--name-field-content-type', context).forEach(contentTypeField => {
      
        // Hide select and limit fields that are not the content type (taxonomy)
        // field. These get displayed later depending on which content type is
        // selected.
        hideAllBut('.field--widget-options-select, .field--name-field-limit-list', contentTypeField, context);
        const contentTypeSelect = contentTypeField.querySelector("select");
        // Store the "machine name" of the currently selected Content type.
        let typeName = getTypeString(contentTypeSelect);  
        
        // If the Content Placer has already had options set, make sure the
        // appropriate fields are shown.
        if (typeName && contentTypeSelect.selectedIndex != "_none") {
          // This will work for content type category fields (like events_category)
          // as long as the field is correctly named. Additional control fields
          // like 'event_type' will need to be added using individual logic
          const categories = '.field--name-field-' + typeName + '-category';
          context.querySelectorAll(categories).forEach(element => {
            element.style.display = 'block';
          });
          if ((typeName == 'events') || (typeName == 'news')) {
            context.querySelectorAll('.field--name-field-limit-list').forEach(limit => {
              limit.style.display = 'block';
            });
          } 
        }

        // Assign onchange events to various fields to hide and show related
        // fields.
        contentTypeField.addEventListener("change", event => {
          // Re-hide any fields that may have been unhidden since the last
          // change.
          hideAllBut('.field--widget-options-select, .field--name-field-limit-list', contentTypeField, context, true);

          typeName = getTypeString(event.target);
          if (typeName && contentTypeSelect.selectedIndex != "_none") {
            const categories = '.field--name-field-' + typeName + '-category';
            context.querySelectorAll(categories).forEach(element => {
              element.style.display = 'block';
            });
            if ((typeName == 'events') || (typeName == 'news')) {
              context.querySelectorAll('.field--name-field-limit-list').forEach(limit => {
                limit.style.display = 'block';
              });
            } 
          }
        });
      });
    }
  };

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

  /**
   * Generates a machine name based on the selected option in a select element.
   * @param {HTMLSelectElement} selectTarget
   * @returns {string}
   */
  function getTypeString(selectTarget) {
    let returnString = null;
    if (selectTarget?.options && selectTarget.options[selectTarget.selectedIndex]) {
      returnString = selectTarget.options[selectTarget.selectedIndex].text.toLowerCase().replace(/_/g, '-');
    }
    return returnString;
  }

  /**
   * Hides all Nodes meeting hideSelector within a context, except for keepNode.
   * @param {string} hideSelector: a jQuery-style selector of HTMLNodes to hide.
   * @param {HTMLElement} keepNode: a Node that should not be hidden.
   * @param {Document} context: a DOM Node that the query is restricted to.
   * @param {boolean} unset: set all select boxes to the "_none" option as well.
   **/
  function hideAllBut(hideSelector, keepNode, context, unset = false) {
    context.querySelectorAll(hideSelector).forEach(hideNode => {
      if (hideNode !== keepNode) {
        // Reset selected options to the default value, if unset is selected.
        if (unset) {
          const select = hideNode.querySelector("select");
          if (select) {
            select.selectedIndex = "_none";
          }
        }
        hideNode.style.display = 'none';
      }
    });
  }

})(Drupal, once);
