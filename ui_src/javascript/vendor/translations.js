window.localization = window.localization || {},
function(n) {
    localization.translate = {

      menu: function() {
        $(".verse-diff-on #label-on").text(i18n.__('btn-switch-on'));
        $(".verse-diff-on #label-off").text(i18n.__('btn-switch-off'));
      },
      translation: function() {
        $('#learn-more-button').text(i18n.__('Learn more'));
        $('.translation').text(i18n.__('Translation'));
        $(document).find("title").text(i18n.__('app-name-Autographa Lite'))
      },
      settings: function(){
        $("#defaultOpen").text(i18n.__('label-translation-details'))
        $("#lbl-import-translation").text(i18n.__('label-import-translation'))
        $("#label-import-ref-text").text(i18n.__('label-import-ref-text'))
        $("#label-manage-ref-texts").text(i18n.__('label-manage-ref-texts'))
        $(".label-lang-code").text(i18n.__('label-language-code'))
        $(".label-version").text(i18n.__('label-version'))
        $("#label-export-folder-location").text(i18n.__('label-export-folder-location'))
        $(".label-folder-location").text(i18n.__('label-folder-location'))
        $("#label-bible-name").text(i18n.__('label-bible-name'))
        $(".btn-save").text(i18n.__('btn-save'))
        $(".btn-import").text(i18n.__('btn-import'))
        $("#tbl-header-action").text(i18n.__('tbl-header-action'))
        $("#modal-title-setting").text(i18n.__('modal-title-setting'))
        $("#book-chapter-btn").attr('title', i18n.__('tooltip-select-book'))
        $("#chapterBtn").attr('title', i18n.__('tooltip-select-chapter'))
        $("#switchLable").attr('title', i18n.__('tooltip-compare-mode'))
        $("#searchText").attr('title', i18n.__('tooltip-find-and-replace'))
        $("#export-usfm").attr('title', i18n.__('tooltip-export-usfm'))
        $("#btnAbout").attr('title', i18n.__('tooltip-about'))
        $("#btnSettings").attr('title', i18n.__('tooltip-settings'))
        $(".minus").attr('title', i18n.__('tooltip-minus-font-size'))
        $(".plus").attr('title', i18n.__('tooltip-plus-font-size'))
        $("#2-column-layout").attr('title', i18n.__('2-column layout'))
        $("#3-column-layout").attr('title', i18n.__('3-column layout'))
        $("#4-column-layout").attr('title', i18n.__('4-column layout'))
        $("#save-btn").attr('title', i18n.__('tooltip-btn-save'))
        $(".close").attr('title', i18n.__('tooltip-modal-close'))
        $("#modal-title-about").text(i18n.__('modal-title-about'))
        $("#overviewtab").text(i18n.__('overview-tab'))
        $("#licensetab").text(i18n.__('license-tab'))
        $("#app-name").text(i18n.__('app-name-Autographa Lite'))
        $("#label-hosted-url").text(i18n.__('label-hosted-url'))

      },

      init: function() {
        this.translation();
        this.menu();
        this.settings();
      }
    };

    n(function() {
        localization.translate.init();
    })

}(jQuery);
