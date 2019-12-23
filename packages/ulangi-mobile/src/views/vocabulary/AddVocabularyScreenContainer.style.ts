/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { AddVocabularyScreenIds } from '../../constants/ids/AddVocabularyScreenIds';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { touchableTitle } from '../common/TouchableTitle';

export class AddVocabularyScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: AddVocabularyScreenIds.TOP_BAR,
        title: touchableTitle(
          ScreenName.ADD_VOCABULARY_SCREEN,
          SecondaryScreenStyle.TOUCHABLE_TITLE_STYLES,
        ),
      },
    },
  );

  public static SCREEN_LIGHT_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
    {
      topBar: {
        rightButtons: [
          {
            testID: AddVocabularyScreenIds.SAVE_BTN,
            text: 'Save',
            id: AddVocabularyScreenIds.SAVE_BTN,
            disableIconTint: true,
            color: config.styles.primaryColor,
          },
        ],
        leftButtons: [
          {
            testID: AddVocabularyScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: AddVocabularyScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.light.primaryTextColor,
          },
        ],
      },
    },
  );

  public static SCREEN_DARK_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_DARK_STYLES_ONLY,
    {
      topBar: {
        rightButtons: [
          {
            testID: AddVocabularyScreenIds.SAVE_BTN,
            text: 'Save',
            id: AddVocabularyScreenIds.SAVE_BTN,
            disableIconTint: true,
            color: config.styles.primaryColor,
          },
        ],
        leftButtons: [
          {
            testID: AddVocabularyScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_MILK_22X22,
            id: AddVocabularyScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.dark.primaryTextColor,
          },
        ],
      },
    },
  );

  public static SCREEN_LIGHT_FULL_STYLES = _.merge(
    {},
    AddVocabularyScreenStyle.SCREEN_BASE_STYLES_ONLY,
    AddVocabularyScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
  );

  public static SCREEN_DARK_FULL_STYLES = _.merge(
    {},
    AddVocabularyScreenStyle.SCREEN_BASE_STYLES_ONLY,
    AddVocabularyScreenStyle.SCREEN_DARK_STYLES_ONLY,
  );
}
