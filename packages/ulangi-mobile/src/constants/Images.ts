/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export class Images {
  public static readonly FLAG_ICONS_BY_LANGUAGE_CODE = {
    ar: require('../../assets/img/flag-icons/ar_flag_32x32.png'),
    cs: require('../../assets/img/flag-icons/cs_flag_32x32.png'),
    zh: require('../../assets/img/flag-icons/zh_flag_32x32.png'),
    da: require('../../assets/img/flag-icons/da_flag_32x32.png'),
    nl: require('../../assets/img/flag-icons/nl_flag_32x32.png'),
    en: require('../../assets/img/flag-icons/en_flag_32x32.png'),
    fr: require('../../assets/img/flag-icons/fr_flag_32x32.png'),
    de: require('../../assets/img/flag-icons/de_flag_32x32.png'),
    el: require('../../assets/img/flag-icons/el_flag_32x32.png'),
    hi: require('../../assets/img/flag-icons/hi_flag_32x32.png'),
    hu: require('../../assets/img/flag-icons/hu_flag_32x32.png'),
    id: require('../../assets/img/flag-icons/id_flag_32x32.png'),
    it: require('../../assets/img/flag-icons/it_flag_32x32.png'),
    ja: require('../../assets/img/flag-icons/ja_flag_32x32.png'),
    ko: require('../../assets/img/flag-icons/ko_flag_32x32.png'),
    nb: require('../../assets/img/flag-icons/nb_flag_32x32.png'),
    pl: require('../../assets/img/flag-icons/pl_flag_32x32.png'),
    pt: require('../../assets/img/flag-icons/pt_flag_32x32.png'),
    ru: require('../../assets/img/flag-icons/ru_flag_32x32.png'),
    sk: require('../../assets/img/flag-icons/sk_flag_32x32.png'),
    es: require('../../assets/img/flag-icons/es_flag_32x32.png'),
    sv: require('../../assets/img/flag-icons/sv_flag_32x32.png'),
    tr: require('../../assets/img/flag-icons/tr_flag_32x32.png'),
    uk: require('../../assets/img/flag-icons/uk_flag_32x32.png'),
    vi: require('../../assets/img/flag-icons/vi_flag_32x32.png'),
    any: require('../../assets/img/flag-icons/any_flag_32x32.png'),
  };

  public static readonly QUICK_TUTORIAL_SCREENS = {
    light: [
      require('../../assets/img/quick-tutorial-screens/AddVocabulary_light.png'),
      require('../../assets/img/quick-tutorial-screens/DiscoverVocabulary_light.png'),
      require('../../assets/img/quick-tutorial-screens/ViewLevelBreakdown_light.png'),
      require('../../assets/img/quick-tutorial-screens/ViewCategory_light.png'),
      require('../../assets/img/quick-tutorial-screens/ChangeSet_light.png'),
      require('../../assets/img/quick-tutorial-screens/FilterVocabulary_light.png'),
      require('../../assets/img/quick-tutorial-screens/Syncing_light.png'),
    ],
    dark: [
      require('../../assets/img/quick-tutorial-screens/AddVocabulary_dark.png'),
      require('../../assets/img/quick-tutorial-screens/DiscoverVocabulary_dark.png'),
      require('../../assets/img/quick-tutorial-screens/ViewLevelBreakdown_dark.png'),
      require('../../assets/img/quick-tutorial-screens/ViewCategory_dark.png'),
      require('../../assets/img/quick-tutorial-screens/ChangeSet_dark.png'),
      require('../../assets/img/quick-tutorial-screens/FilterVocabulary_dark.png'),
      require('../../assets/img/quick-tutorial-screens/Syncing_dark.png'),
    ],
  };

  // Logos
  public static readonly LOGO_60X60 = require('../../assets/img/logos/logo_60x60.png');
  public static readonly LOGO_86X86 = require('../../assets/img/logos/logo_86x86.png');
  public static readonly LOGO_120X120 = require('../../assets/img/logos/logo_120x120.png');

  // Titles
  public static readonly ATOM_TITLE_111X61 = require('../../assets/img/titles/atom_title_111x61.png');

  // Google Translate attributions
  public static readonly TRANSLATE_BY_GOOGLE_COLOR_SHORT = require('../../assets/img/google-translate-attributions/translate-by-google-color-short.png');
  public static readonly TRANSLATE_BY_GOOGLE_GREY_SHORT = require('../../assets/img/google-translate-attributions/translate-by-google-grey-short.png');
  public static readonly TRANSLATE_BY_GOOGLE_WHITE_SHORT = require('../../assets/img/google-translate-attributions/translate-by-google-white-short.png');

  // Social icons
  public static readonly TWITTER_20x20 = require('../../assets/img/social-icons/twitter_20x20.png');
  public static readonly REDDIT_20x20 = require('../../assets/img/social-icons/reddit_20x20.png');
  public static readonly INSTAGRAM_20x20 = require('../../assets/img/social-icons/instagram_20x20.png');

  // Lesson icons
  public static readonly SPACED_REPETITION_30X30 = require('../../assets/img/lesson-icons/spaced_repetition_30x30.png');
  public static readonly WRITING_30X30 = require('../../assets/img/lesson-icons/writing_30x30.png');
  public static readonly QUIZ_30X30 = require('../../assets/img/lesson-icons/quiz_30x30.png');

  // 40x40
  public static readonly CROSS_GREY_40X40 = require('../../assets/img/mobile-icons/cross_grey_40x40.png');
  public static readonly REFRESH_GREY_40X40 = require('../../assets/img/mobile-icons/refresh_grey_40x40.png');

  // 24x24
  public static readonly MANAGE_GREY_24X24 = require('../../assets/img/mobile-icons/manage_grey_24x24.png');
  public static readonly MANAGE_BLUE_24X24 = require('../../assets/img/mobile-icons/manage_blue_24x24.png');
  public static readonly DISCOVER_GREY_24X24 = require('../../assets/img/mobile-icons/discover_grey_24x24.png');
  public static readonly DISCOVER_BLUE_24X24 = require('../../assets/img/mobile-icons/discover_blue_24x24.png');
  public static readonly LEARN_GREY_24X24 = require('../../assets/img/mobile-icons/learn_grey_24x24.png');
  public static readonly LEARN_BLUE_24X24 = require('../../assets/img/mobile-icons/learn_blue_24x24.png');
  public static readonly PLAY_GREY_24X24 = require('../../assets/img/mobile-icons/play_grey_24x24.png');
  public static readonly PLAY_BLUE_24X24 = require('../../assets/img/mobile-icons/play_blue_24x24.png');
  public static readonly PROGRESS_GREY_24X24 = require('../../assets/img/mobile-icons/progress_grey_24x24.png');
  public static readonly PROGRESS_BLUE_24X24 = require('../../assets/img/mobile-icons/progress_blue_24x24.png');
  public static readonly MORE_GREY_24X24 = require('../../assets/img/mobile-icons/more_grey_24x24.png');
  public static readonly MORE_BLUE_24X24 = require('../../assets/img/mobile-icons/more_blue_24x24.png');
  public static readonly MORE_BLACK_24X24 = require('../../assets/img/mobile-icons/more_black_24x24.png');
  public static readonly MORE_MILK_24X24 = require('../../assets/img/mobile-icons/more_milk_24x24.png');
  public static readonly EYE_BLACK_24X24 = require('../../assets/img/mobile-icons/eye_black_24x24.png');
  public static readonly EYE_MILK_24X24 = require('../../assets/img/mobile-icons/eye_milk_24x24.png');
  public static readonly SPEAKER_BLACK_24X24 = require('../../assets/img/mobile-icons/speaker_black_24x24.png');
  public static readonly SPEAKER_MILK_24X24 = require('../../assets/img/mobile-icons/speaker_milk_24x24.png');
  public static readonly ARROW_LEFT_BLACK_24X24 = require('../../assets/img/mobile-icons/arrow_left_black_24x24.png');
  public static readonly ARROW_LEFT_MILK_24X24 = require('../../assets/img/mobile-icons/arrow_left_milk_24x24.png');
  public static readonly ARROW_RIGHT_BLACK_24X24 = require('../../assets/img/mobile-icons/arrow_right_black_24x24.png');
  public static readonly ARROW_RIGHT_MILK_24X24 = require('../../assets/img/mobile-icons/arrow_right_milk_24x24.png');
  public static readonly EDIT_BLACK_24X24 = require('../../assets/img/mobile-icons/edit_black_24x24.png');
  public static readonly EDIT_MILK_24X24 = require('../../assets/img/mobile-icons/edit_milk_24x24.png');
  public static readonly CROSS_BLACK_24X24 = require('../../assets/img/mobile-icons/cross_black_24x24.png');
  public static readonly CROSS_MILK_24X24 = require('../../assets/img/mobile-icons/cross_milk_24x24.png');

  // 22x22
  public static readonly ADD_WHITE_22X22 = require('../../assets/img/mobile-icons/add_white_22x22.png');
  public static readonly PLUS_WHITE_22X22 = require('../../assets/img/mobile-icons/plus_white_22x22.png');
  public static readonly PLUS_MILK_22X22 = require('../../assets/img/mobile-icons/plus_milk_22x22.png');
  public static readonly PLUS_BLACK_22X22 = require('../../assets/img/mobile-icons/plus_black_22x22.png');
  public static readonly PLUS_BLUE_22X22 = require('../../assets/img/mobile-icons/plus_blue_22x22.png');
  public static readonly CROSS_WHITE_22X22 = require('../../assets/img/mobile-icons/cross_white_22x22.png');
  public static readonly CROSS_BLACK_22X22 = require('../../assets/img/mobile-icons/cross_black_22x22.png');
  public static readonly CROSS_RED_22X22 = require('../../assets/img/mobile-icons/cross_red_22x22.png');
  public static readonly CROSS_GREEN_22X22 = require('../../assets/img/mobile-icons/cross_green_22x22.png');
  public static readonly ARROW_LEFT_WHITE_22X22 = require('../../assets/img/mobile-icons/arrow_left_white_22x22.png');
  public static readonly ARROW_LEFT_BLACK_22X22 = require('../../assets/img/mobile-icons/arrow_left_black_22x22.png');
  public static readonly ARROW_LEFT_MILK_22X22 = require('../../assets/img/mobile-icons/arrow_left_milk_22x22.png');
  public static readonly ARROW_LEFT_GREEN_22X22 = require('../../assets/img/mobile-icons/arrow_left_green_22x22.png');
  public static readonly CHECK_BLUE_22X22 = require('../../assets/img/mobile-icons/check_blue_22x22.png');
  public static readonly CHECK_GREEN_22X22 = require('../../assets/img/mobile-icons/check_green_22x22.png');
  public static readonly PAUSE_GREEN_22X22 = require('../../assets/img/mobile-icons/pause_green_22x22.png');
  public static readonly PAUSE_WHITE_22X22 = require('../../assets/img/mobile-icons/pause_white_22x22.png');
  public static readonly SEARCH_WHITE_22X22 = require('../../assets/img/mobile-icons/search_white_22x22.png');
  public static readonly SEARCH_MILK_22X22 = require('../../assets/img/mobile-icons/search_milk_22x22.png');
  public static readonly SEARCH_BLUE_22X22 = require('../../assets/img/mobile-icons/search_blue_22x22.png');
  public static readonly INFO_WHITE_22X22 = require('../../assets/img/mobile-icons/info_white_22x22.png');
  public static readonly INFO_MILK_22X22 = require('../../assets/img/mobile-icons/info_milk_22x22.png');
  public static readonly HORIZONTAL_DOTS_BLACK_22X22 = require('../../assets/img/mobile-icons/horizontal_dots_black_22x22.png');
  public static readonly HORIZONTAL_DOTS_GREY_22X22 = require('../../assets/img/mobile-icons/horizontal_dots_grey_22x22.png');
  public static readonly HORIZONTAL_DOTS_WHITE_22X22 = require('../../assets/img/mobile-icons/horizontal_dots_white_22x22.png');
  public static readonly HORIZONTAL_DOTS_MILK_22X22 = require('../../assets/img/mobile-icons/horizontal_dots_milk_22x22.png');
  public static readonly UNCHECK_GREY_22X22 = require('../../assets/img/mobile-icons/uncheck_grey_22x22.png');
  public static readonly STAR_LINE_GREY_22X22 = require('../../assets/img/mobile-icons/star_line_grey_22x22.png');
  public static readonly STAR_GREY_22X22 = require('../../assets/img/mobile-icons/star_grey_22x22.png');

  // 20x20
  public static readonly SEARCH_WHITE_20X20 = require('../../assets/img/mobile-icons/search_white_20x20.png');
  public static readonly SEARCH_MILK_20X20 = require('../../assets/img/mobile-icons/search_milk_20x20.png');
  public static readonly SYNC_BLUE_20X20 = require('../../assets/img/mobile-icons/sync_blue_20x20.png');
  public static readonly SYNC_WHITE_20X20 = require('../../assets/img/mobile-icons/sync_white_20x20.png');
  public static readonly CHECK_WHITE_20X20 = require('../../assets/img/mobile-icons/check_white_20x20.png');
  public static readonly CHECK_GREEN_20X20 = require('../../assets/img/mobile-icons/check_green_20x20.png');

  // 18x18
  public static readonly CARET_RIGHT_GREY_18X18 = require('../../assets/img/mobile-icons/caret_right_grey_18x18.png');

  // 16x16
  public static readonly SPEAKER_BLACK_16X16 = require('../../assets/img/mobile-icons/speaker_black_16x16.png');
  public static readonly SPEAKER_MILK_16X16 = require('../../assets/img/mobile-icons/speaker_milk_16x16.png');
  public static readonly ADD_BLACK_16X16 = require('../../assets/img/mobile-icons/add_black_16x16.png');
  public static readonly ADD_MILK_16X16 = require('../../assets/img/mobile-icons/add_milk_16x16.png');
  public static readonly HORIZONTAL_DOTS_BLACK_16X16 = require('../../assets/img/mobile-icons/horizontal_dots_black_16x16.png');
  public static readonly HORIZONTAL_DOTS_MILK_16X16 = require('../../assets/img/mobile-icons/horizontal_dots_milk_16x16.png');
  public static readonly REMOVE_GREY_16X16 = require('../../assets/img/mobile-icons/remove_grey_16x16.png');

  // 14x14
  public static readonly CARET_RIGHT_GREY_14X14 = require('../../assets/img/mobile-icons/caret_right_grey_14x14.png');
  public static readonly SEARCH_GREY_14X14 = require('../../assets/img/mobile-icons/search_grey_14x14.png');
  public static readonly CHECK_GREEN_14X14 = require('../../assets/img/mobile-icons/check_green_14x14.png');
  public static readonly LINK_GREY_14X14 = require('../../assets/img/mobile-icons/link_grey_14x14.png');

  // 12x12
  public static readonly CARET_DOWN_GREY_12X12 = require('../../assets/img/mobile-icons/caret_down_grey_12x12.png');
  public static readonly STAR_BLUE_12X12 = require('../../assets/img/mobile-icons/star_blue_12x12.png');

  // 10x10
  public static readonly CARET_DOWN_GREY_10X10 = require('../../assets/img/mobile-icons/caret_down_grey_10x10.png');
  public static readonly ARROW_UP_GREEN_10X10 = require('../../assets/img/mobile-icons/arrow_up_green_10x10.png');
  public static readonly ARROW_DOWN_RED_10X10 = require('../../assets/img/mobile-icons/arrow_down_red_10x10.png');
}
