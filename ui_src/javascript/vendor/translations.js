window.localization = window.localization || {},
function(n) {
    localization.translate = {

      menu: function() {
        $(".verse-diff-on #label-on").text(i18n.__('ON'));
        $(".verse-diff-on #label-off").text(i18n.__('OFF'));
      },
      translation: function() {
        $('#learn-more-button').text(i18n.__('Learn more'));
        $('.translation').text(i18n.__('Translation'));
      },

      init: function() {
        this.translation();
        this.menu();
      }
    };

    n(function() {
        localization.translate.init();
    })

}(jQuery);
