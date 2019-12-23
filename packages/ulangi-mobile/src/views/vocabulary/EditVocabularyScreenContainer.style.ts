/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { EditVocabularyScreenIds } from '../../constants/ids/EditVocabularyScreenIds';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';

export class EditVocabularyScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: EditVocabularyScreenIds.TOP_BAR,
        title: {
          text: 'Edit Vocabulary',
        },
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
            testID: EditVocabularyScreenIds.SAVE_BTN,
            text: 'Save',
            id: EditVocabularyScreenIds.SAVE_BTN,
            disableIconTint: true,
            color: config.styles.primaryColor,
          },
        ],
        leftButtons: [
          {
            testID: EditVocabularyScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: EditVocabularyScreenIds.BACK_BTN,
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
            testID: EditVocabularyScreenIds.SAVE_BTN,
            text: 'Save',
            id: EditVocabularyScreenIds.SAVE_BTN,
            disableIconTint: true,
            color: config.styles.primaryColor,
          },
        ],
        leftButtons: [
          {
            testID: EditVocabularyScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_MILK_22X22,
            id: EditVocabularyScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.dark.primaryTextColor,
          },
        ],
      },
    },
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    EditVocabularyScreenStyle.SCREEN_BASE_STYLES_ONLY,
    EditVocabularyScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    EditVocabularyScreenStyle.SCREEN_BASE_STYLES_ONLY,
    EditVocabularyScreenStyle.SCREEN_DARK_STYLES_ONLY,
  );
}
