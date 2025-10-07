(function ($, Drupal, once) {
  Drupal.behaviors.main_navigation = {
    attach: function (context, settings) {
      const activeClass = "open";
      const rtlClass = "right-to-left";
      const hoverDelay = 200;

      $(once('main-navigation', '#block-main-menu', context)).each(function () {
        const menu = $('.menu-main-navigation', this);
        let lastSize = $("body").hasClass("size-desk") ? "size-desk" : "size-mobile";

        // Behavior depends on if we're mobile or not. To track this, we set a
        // single class in the body in 04-assembly/global/site.js.
        // "size-desk" indicates desktop size (> 986px wide) and "size-mobile"
        // indicates smaller than that.
        // The menu has two different designs based on which width the screen
        // currently is, and you'll see those checks throughout.

        $("a.nolink", menu).on("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
        })
        $("li", menu).on("mouseenter", addActiveClassCallback);
        $("li", menu).on("mouseleave", removeActiveClassCallback);
        $("a", menu).on("focus", (event) => {
          addActiveClass($(event.currentTarget).parent(), true);
          // Close all other items.
          removeActiveClass($(event.currentTarget).parent().siblings("li.open"), true);
        })
        $("a", menu).on("blur", (event) => {
          const link = $(event.currentTarget)
          const parentLi = link.parent();
          // Make sure menu items are closed when we leave them. This might be
          // redundant with the "focus" closer above, but just in case we leave
          // the menu itself, we need to double-check.
          if (!link.hasClass("menuparent")) {
            removeActiveClass(parentLi, true);
          }
        });
        $("#main-nav-toggle", this).on("click", (event) => {
          event.stopPropagation();
          $(event.currentTarget).toggleClass("open");
          menu.toggleClass("accordion-open");
        });
        $(".menu-item-expand", this).on("click", (event) => {
          event.stopPropagation();
          const parent = $(event.currentTarget).parent();
          parent.toggleClass("open");
          if (parent.hasClass("open")) {
            // jQuery has a much smoother "show" operation than anything vanilla
            // can do easily. We have to clean up the style props this adds when
            // changing back to desktop, though.
            parent.children("ul").slideDown(200);
          }
          else {
            parent.children("ul").slideUp(200);
          }
        });
        window.addEventListener("resize", () => {
          if (lastSize == "size-mobile" && $("body").hasClass("size-desk")) {
            $("li", menu).removeClass("open").find("ul").hide(0).attr("style", "");
            lastSize = "size-desk";
          }
          else if (lastSize == "size-desk" && $("body").hasClass("size-mobile")) {
            lastSize = "size-mobile";
          }
        });
      });

      function addActiveClass($element, noDelay = false) {
        if ($("body").hasClass("size-desk")) {
          // Find the list this element is displaying for later visibility
          // check.
          const childList = $element.children("ul");
          window.setTimeout(() => {
            $element.addClass(activeClass);
            if (childList.length > 0) {
              // If the list is going to run off the side of the page, apply a
              // class that aligns it to the right side of the hovered element,
              // instead of the left.
              if ((childList.offset().left + childList.width()) > $(document).width()) {
                childList.addClass(rtlClass);
              }
              else {
                // If screen resolution has changed we need to remove the RTL
                // class.
                childList.removeClass(rtlClass);
              }
            }
          }, noDelay ? 0 : hoverDelay);
        }
      }
      function removeActiveClass($element, noDelay = false) {
        if ($("body").hasClass("size-desk")) {
          const childList = $element.children("ul");
          window.setTimeout(() => {
              $element.removeClass(activeClass);
              if (childList.length > 0) {
                // If the RTL class has been applied, be sure to remove it so it
                // can be re-checked when the parent element is hovered again.
                childList.removeClass(rtlClass);
              }
          }, noDelay ? 0 : hoverDelay);
        }
      }

      function addActiveClassCallback(event) {
        addActiveClass($(event.currentTarget));
      }
      function removeActiveClassCallback(event) {
        removeActiveClass($(event.currentTarget))
      }
    },
  }
})(jQuery, Drupal, once)
