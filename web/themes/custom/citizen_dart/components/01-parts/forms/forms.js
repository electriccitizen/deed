(function ($, Drupal, once) {

  // NOTE: Need jQuery because of select2.

  /* USER LOGIN PASSWORD SHOW
  ------------------------------------ */
  Drupal.behaviors.userLogin = {
    attach: function (context, settings) {
      once('showPass', '#user-login-form', context).forEach(login => {

        const showPasswordButton = login.querySelector('.show-password');
        const passwordInput = document.getElementById('edit-pass');

        showPasswordButton.addEventListener('click', function (e) {
          e.preventDefault();

          if (showPasswordButton.classList.contains('show')) {
            showPasswordButton.classList.remove('show');
            showPasswordButton.textContent = 'Show';
            passwordInput.type = 'password';
          } else {
            showPasswordButton.classList.add('show');
            showPasswordButton.textContent = 'Hide';
            passwordInput.type = 'text';
          }
        });

      });
    }
  };

  /* SELECT 2
  ------------------------------------ */
  Drupal.behaviors.select2 = {
    attach: function (context, settings) {
      once('selects', 'select', context).forEach(() => {

        // Helper function to mimic jQuery's $(document).ready().
        function documentReady(callback) {
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
          } else {
            callback();
          }
        }

        // Function to initialize Select2 on select elements.
        function initializeSelect2(selector) {
          document.querySelectorAll(selector).forEach(function (select) {
            $(select).select2({
              placeholder: 'Select an option'
            });
          });
        }

        // Function to update accessibility attributes for Select2 search
        // fields.
        function updateSelect2Accessibility() {
          document.querySelectorAll('.select2-search__field').forEach(function (searchField) {
            const label = searchField.closest('.select2-container').previousElementSibling.innerText;
            searchField.setAttribute('aria-label', label);
            searchField.removeAttribute('role');
            searchField.closest('.select2-selection').removeAttribute('role');
          });
        }

        // Call the initialization function on the specified select elements.
        documentReady(function () {
          initializeSelect2('form.views-exposed-form select, form.webform-submission-form select');
          updateSelect2Accessibility();
        });

      });
    }
  };

})(jQuery, Drupal, once);
