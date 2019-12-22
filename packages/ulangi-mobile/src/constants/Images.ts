/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export class Images {
  public static readonly FLAG_ICONS_BY_LANGUAGE_CODE = {
    ar: require('../../assets/img/ar_flag_32x32.png'),
    cs: require('../../assets/img/cs_flag_32x32.png'),
    zh: require('../../assets/img/zh_flag_32x32.png'),
    da: require('../../assets/img/da_flag_32x32.png'),
    nl: require('../../assets/img/nl_flag_32x32.png'),
    en: require('../../assets/img/en_flag_32x32.png'),
    fr: require('../../assets/img/fr_flag_32x32.png'),
    de: require('../../assets/img/de_flag_32x32.png'),
    el: require('../../assets/img/el_flag_32x32.png'),
    hi: require('../../assets/img/hi_flag_32x32.png'),
    hu: require('../../assets/img/hu_flag_32x32.png'),
    id: require('../../assets/img/id_flag_32x32.png'),
    it: require('../../assets/img/it_flag_32x32.png'),
    ja: require('../../assets/img/ja_flag_32x32.png'),
    ko: require('../../assets/img/ko_flag_32x32.png'),
    nb: require('../../assets/img/nb_flag_32x32.png'),
    pl: require('../../assets/img/pl_flag_32x32.png'),
    pt: require('../../assets/img/pt_flag_32x32.png'),
    ru: require('../../assets/img/ru_flag_32x32.png'),
    sk: require('../../assets/img/sk_flag_32x32.png'),
    es: require('../../assets/img/es_flag_32x32.png'),
    sv: require('../../assets/img/sv_flag_32x32.png'),
    tr: require('../../assets/img/tr_flag_32x32.png'),
    uk: require('../../assets/img/uk_flag_32x32.png'),
    vi: require('../../assets/img/vi_flag_32x32.png'),
    any: require('../../assets/img/any_flag_32x32.png'),
  };

  public static readonly QUICK_TUTORIAL_SCREENS = {
    light: [
      require('../../assets/img/DiscoverVocabulary_light.png'),
      require('../../assets/img/AddVocabulary_light.png'),
      require('../../assets/img/LearningTechniques_light.png'),
      require('../../assets/img/PlayGames_light.png'),
      require('../../assets/img/ViewCategory_light.png'),
      require('../../assets/img/ViewLevelBreakdown_light.png'),
      require('../../assets/img/ChangeSet_light.png'),
      require('../../assets/img/FilterVocabulary_light.png'),
    ],
    dark: [
      require('../../assets/img/DiscoverVocabulary_dark.png'),
      require('../../assets/img/AddVocabulary_dark.png'),
      require('../../assets/img/LearningTechniques_dark.png'),
      require('../../assets/img/PlayGames_dark.png'),
      require('../../assets/img/ViewCategory_dark.png'),
      require('../../assets/img/ViewLevelBreakdown_dark.png'),
      require('../../assets/img/ChangeSet_dark.png'),
      require('../../assets/img/FilterVocabulary_dark.png'),
    ],
  };

  public static readonly LOGO_60X60 = require('../../assets/img/logo_60x60.png');
  public static readonly LOGO_86X86 = require('../../assets/img/logo_86x86.png');
  public static readonly LOGO_120X120 = require('../../assets/img/logo_120x120.png');

  public static readonly MANAGE_GREY_25X25 = require('../../assets/img/manage_grey_25x25.png');
  public static readonly MANAGE_BLUE_25X25 = require('../../assets/img/manage_blue_25x25.png');
  public static readonly DISCOVER_GREY_25X25 = require('../../assets/img/discover_grey_25x25.png');
  public static readonly DISCOVER_BLUE_25X25 = require('../../assets/img/discover_blue_25x25.png');
  public static readonly LEARN_GREY_25X25 = require('../../assets/img/learn_grey_25x25.png');
  public static readonly LEARN_BLUE_25X25 = require('../../assets/img/learn_blue_25x25.png');
  public static readonly PLAY_GREY_25X25 = require('../../assets/img/play_grey_25x25.png');
  public static readonly PLAY_BLUE_25X25 = require('../../assets/img/play_blue_25x25.png');
  public static readonly DONATE_GREY_25X25 = require('../../assets/img/donate_grey_25x25.png');
  public static readonly DONATE_BLUE_25X25 = require('../../assets/img/donate_blue_25x25.png');
  public static readonly MORE_GREY_25X7 = require('../../assets/img/more_grey_25x7.png');
  public static readonly MORE_BLUE_25X7 = require('../../assets/img/more_blue_25x7.png');

  public static readonly EYE_BLACK_25X19 = require('../../assets/img/eye_black_25x19.png');
  public static readonly EYE_MILK_25X19 = require('../../assets/img/eye_milk_25x19.png');
  public static readonly SPEAKER_BLACK_23X23 = require('../../assets/img/speaker_black_23x23.png');
  public static readonly SPEAKER_MILK_23X23 = require('../../assets/img/speaker_milk_23x23.png');
  public static readonly ARROW_LEFT_BLACK_25X25 = require('../../assets/img/arrow_left_black_25x25.png');
  public static readonly ARROW_LEFT_MILK_25X25 = require('../../assets/img/arrow_left_milk_25x25.png');
  public static readonly ARROW_RIGHT_BLACK_25X25 = require('../../assets/img/arrow_right_black_25x25.png');
  public static readonly ARROW_RIGHT_MILK_25X25 = require('../../assets/img/arrow_right_milk_25x25.png');

  public static readonly PLUS_WHITE_22X22 = require('../../assets/img/plus_white_22x22.png');
  public static readonly PLUS_MILK_22X22 = require('../../assets/img/plus_milk_22x22.png');
  public static readonly PLUS_BLACK_22X22 = require('../../assets/img/plus_black_22x22.png');
  public static readonly CHANGE_SET_WHITE_22X22 = require('../../assets/img/change_set_white_22x22.png');
  public static readonly CROSS_WHITE_22X22 = require('../../assets/img/cross_white_22x22.png');
  public static readonly CROSS_BLACK_22X22 = require('../../assets/img/cross_black_22x22.png');
  public static readonly CROSS_RED_22X22 = require('../../assets/img/cross_red_22x22.png');
  public static readonly CROSS_GREEN_22X22 = require('../../assets/img/cross_green_22x22.png');
  public static readonly ARROW_LEFT_WHITE_22X22 = require('../../assets/img/arrow_left_white_22x22.png');
  public static readonly ARROW_LEFT_BLACK_22X22 = require('../../assets/img/arrow_left_black_22x22.png');
  public static readonly ARROW_LEFT_MILK_22X22 = require('../../assets/img/arrow_left_milk_22x22.png');
  public static readonly ARROW_LEFT_PURPLE_22X22 = require('../../assets/img/arrow_left_purple_22x22.png');
  public static readonly ARROW_LEFT_GREEN_22X22 = require('../../assets/img/arrow_left_green_22x22.png');
  public static readonly MINUS_BLACK_22X22 = require('../../assets/img/minus_black_22x22.png');
  public static readonly HORIZONTAL_DOTS_GREY_16X4 = require('../../assets/img/horizontal_dots_grey_16x4.png');
  public static readonly UNCHECK_GREY_22X22 = require('../../assets/img/uncheck_grey_22x22.png');
  public static readonly CHECK_BLUE_22X22 = require('../../assets/img/check_blue_22x22.png');
  public static readonly CHECK_GREEN_22X22 = require('../../assets/img/check_green_22x22.png');
  public static readonly PAUSE_PURPLE_22X22 = require('../../assets/img/pause_purple_22x22.png');
  public static readonly PAUSE_GREEN_22X22 = require('../../assets/img/pause_green_22x22.png');
  public static readonly PAUSE_WHITE_22X22 = require('../../assets/img/pause_white_22x22.png');
  public static readonly SEARCH_WHITE_22X22 = require('../../assets/img/search_white_22x22.png');
  public static readonly SEARCH_MILK_22X22 = require('../../assets/img/search_milk_22x22.png');
  public static readonly SEARCH_BLUE_22X22 = require('../../assets/img/search_blue_22x22.png');
  public static readonly TIP_YELLOW_16X22 = require('../../assets/img/tip_yellow_16x22.png');
  public static readonly INFO_BLUE_22X22 = require('../../assets/img/info_blue_22x22.png');
  public static readonly INFO_WHITE_22X22 = require('../../assets/img/info_white_22x22.png');
  public static readonly INFO_MILK_22X22 = require('../../assets/img/info_milk_22x22.png');
  public static readonly QUESTION_YELLOW_14X22 = require('../../assets/img/question_yellow_14x22.png');
  public static readonly HORIZONTAL_DOTS_BLACK_22X6 = require('../../assets/img/horizontal_dots_black_22x6.png');
  public static readonly HORIZONTAL_DOTS_GREY_22X6 = require('../../assets/img/horizontal_dots_grey_22x6.png');
  public static readonly HORIZONTAL_DOTS_WHITE_22X6 = require('../../assets/img/horizontal_dots_white_22x6.png');
  public static readonly HORIZONTAL_DOTS_MILK_22X6 = require('../../assets/img/horizontal_dots_milk_22x6.png');
  public static readonly HORIZONTAL_DOTS_CIRCLE_BLACK_22X22 = require('../../assets/img/horizontal_dots_circle_black_22x22.png');
  public static readonly HORIZONTAL_DOTS_CIRCLE_GREY_22X22 = require('../../assets/img/horizontal_dots_circle_grey_22x22.png');
  public static readonly STAR_WHITE_22X22 = require('../../assets/img/star_white_22x22.png');
  public static readonly ADD_BLUE_22X22 = require('../../assets/img/add_blue_22x22.png');
  public static readonly ADD_WHITE_22X22 = require('../../assets/img/add_white_22x22.png');

  public static readonly REMOVE_GREY_14X14 = require('../../assets/img/remove_grey_14x14.png');
  public static readonly SEARCH_GREY_14X14 = require('../../assets/img/search_grey_14x14.png');
  public static readonly CHECK_GREEN_14x12 = require('../../assets/img/check_green_14x12.png');

  public static readonly LINK_MILK_14X14 = require('../../assets/img/link_milk_14x14.png');
  public static readonly LINK_BLACK_14X14 = require('../../assets/img/link_black_14x14.png');
  public static readonly LINK_GREY_14X14 = require('../../assets/img/link_grey_14x14.png');

  public static readonly CARET_RIGHT_GREY_8X16 = require('../../assets/img/caret_right_grey_8x16.png');
  public static readonly SPEAKER_BLACK_17X17 = require('../../assets/img/speaker_black_17x17.png');
  public static readonly SPEAKER_MILK_17X17 = require('../../assets/img/speaker_milk_17x17.png');

  public static readonly REMOVE_GREY_16X16 = require('../../assets/img/remove_grey_16x16.png');
  public static readonly LINK_WHITE_16X16 = require('../../assets/img/link_white_16x16.png');
  public static readonly LINK_BLACK_16X16 = require('../../assets/img/link_black_16x16.png');
  public static readonly LINK_LINE_GREY_16X16 = require('../../assets/img/link_line_grey_16x16.png');
  public static readonly SYNC_GREY_16X16 = require('../../assets/img/sync_grey_16x16.png');
  public static readonly SYNC_BLUE_16X16 = require('../../assets/img/sync_blue_16x16.png');
  public static readonly SYNC_GREY_20X20 = require('../../assets/img/sync_grey_20x20.png');
  public static readonly SYNC_BLUE_20X20 = require('../../assets/img/sync_blue_20x20.png');
  public static readonly SYNC_WHITE_20X20 = require('../../assets/img/sync_white_20x20.png');
  public static readonly CHECK_WHITE_20X20 = require('../../assets/img/check_white_20x20.png');
  public static readonly CHECK_GREEN_20X20 = require('../../assets/img/check_green_20x20.png');
  public static readonly TWITTER_20x20 = require('../../assets/img/twitter_20x20.png');
  public static readonly REDDIT_20x20 = require('../../assets/img/reddit_20x20.png');
  public static readonly INSTAGRAM_20x20 = require('../../assets/img/instagram_20x20.png');

  public static readonly CARET_RIGHT_GREY_10X18 = require('../../assets/img/caret_right_grey_10x18.png');
  public static readonly SEARCH_WHITE_18X18 = require('../../assets/img/search_white_18x18.png');

  public static readonly SEARCH_WHITE_20X20 = require('../../assets/img/search_white_20x20.png');
  public static readonly SEARCH_MILK_20X20 = require('../../assets/img/search_milk_20x20.png');
  public static readonly SPEAKER_BLACK_20X20 = require('../../assets/img/speaker_black_20x20.png');

  public static readonly ARROW_RIGHT_BLACK_12X10 = require('../../assets/img/arrow_right_black_12x10.png');
  public static readonly ARROW_RIGHT_GREY_12X10 = require('../../assets/img/arrow_right_grey_12x10.png');
  public static readonly ARROW_UP_GREEN_10X8 = require('../../assets/img/arrow_up_green_10x8.png');
  public static readonly ARROW_DOWN_RED_10X8 = require('../../assets/img/arrow_down_red_10x8.png');
  public static readonly CARET_DOWN_GREY_12X8 = require('../../assets/img/caret_down_grey_12x8.png');

  public static readonly STAR_BLUE_12X12 = require('../../assets/img/star_blue_12x12.png');
  public static readonly ATTENTION_YELLOW_12X12 = require('../../assets/img/attention_yellow_12x12.png');

  public static readonly CARET_DOWN_GREY_9X7 = require('../../assets/img/caret_down_grey_9x7.png');
  public static readonly CARET_DOWN_GREY_ALPHA_9X7 = require('../../assets/img/caret_down_grey_alpha_9x7.png');
  public static readonly CARET_DOWN_WHITE_ALPHA_9X7 = require('../../assets/img/caret_down_white_alpha_9x7.png');
  public static readonly CARET_DOWN_WHITE_8X4 = require('../../assets/img/caret_down_white_8x4.png');
  public static readonly CARET_DOWN_WHITE_ALPHA_8X4 = require('../../assets/img/caret_down_white_alpha_8x4.png');
  public static readonly CARET_DOWN_GREY_8X4 = require('../../assets/img/caret_down_grey_8x4.png');

  public static readonly PLUS_WHITE_20X20 = require('../../assets/img/plus_white_20x20.png');
  public static readonly CROSS_WHITE_20X20 = require('../../assets/img/cross_white_20x20.png');

  public static readonly CROSS_GREY_40X40 = require('../../assets/img/cross_grey_40x40.png');
  public static readonly REFRESH_GREY_40X40 = require('../../assets/img/refresh_grey_40x40.png');

  public static readonly SPACED_REPETITION_TITLE_BLACK_184X42 = require('../../assets/img/spaced_repetition_title_black_184x42.png');
  public static readonly SPACED_REPETITION_TITLE_WHITE_184X42 = require('../../assets/img/spaced_repetition_title_white_184x42.png');
  public static readonly SPACED_REPETITION_FLORAL_50X76 = require('../../assets/img/spaced_repetition_floral_50x76.png');

  public static readonly WRITING_TITLE_WHITE_115X42 = require('../../assets/img/writing_title_white_115x42.png');
  public static readonly WRITING_TITLE_BLACK_115X42 = require('../../assets/img/writing_title_black_115x42.png');
  public static readonly WRITING_FLORAL_32X74 = require('../../assets/img/writing_floral_32x74.png');

  public static readonly QUIZ_TITLE_BLACK_118X42 = require('../../assets/img/quiz_title_black_118x42.png');
  public static readonly QUIZ_TITLE_WHITE_118X42 = require('../../assets/img/quiz_title_white_118x42.png');
  public static readonly QUIZ_FLORAL_40X80 = require('../../assets/img/quiz_floral_40x80.png');

  public static readonly PREMIUM_FLORAL_62X56 = require('../../assets/img/premium_floral_62x56.png');

  public static readonly ATOM_TITLE_111X61 = require('../../assets/img/atom_title_111x61.png');

  public static readonly TRANSLATE_BY_GOOGLE_COLOR_SHORT = require('../../assets/img/translate-by-google-color-short.png');
  public static readonly TRANSLATE_BY_GOOGLE_WHITE_SHORT = require('../../assets/img/translate-by-google-white-short.png');

  public static readonly ADD_BLACK_16X16 = require('../../assets/img/add_black_16x16.png');
  public static readonly ADD_MILK_16X16 = require('../../assets/img/add_milk_16x16.png');
  public static readonly HORIZONTAL_DOTS_BLACK_16X16 = require('../../assets/img/horizontal_dots_black_16x16.png');
  public static readonly HORIZONTAL_DOTS_MILK_16X16 = require('../../assets/img/horizontal_dots_milk_16x16.png');
}
