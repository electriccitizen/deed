(function (Drupal, once) {
  'use strict';

  Drupal.behaviors.copyLink = {
    attach(context) {
      once('copy-url', 'button.copy-link', context).forEach((button) => {
        const label = button.querySelector('.copy-text');

        button.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);

            // Visual/text feedback
            const originalText = label.textContent.trim();
            label.textContent = Drupal.t('Copied!');
            button.classList.add('copied');

            setTimeout(() => {
              label.textContent = originalText;
              button.classList.remove('copied');
            }, 2000);
          } catch (err) {
            console.error('Failed to copy URL:', err);
            alert(Drupal.t('Unable to copy link.'));
          }
        });
      });
    }
  };

})(Drupal, once);
