/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';

import { WritingLessonScreenIds } from '../../constants/ids/WritingLessonScreenIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { useCustomTopBar } from '../../utils/useCustomTopBar';

export class WritingLessonScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    LessonScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      popGesture: false,
      topBar: useCustomTopBar({
        testID: WritingLessonScreenIds.TOP_BAR,
        screenName: ScreenName.WRITING_LESSON_SCREEN,
        styles: {
          light: LessonScreenStyle.TOP_BAR_LIGHT_STYLES,
          dark: LessonScreenStyle.TOP_BAR_DARK_STYLES,
        },
      }),
    },
  );

  public static SCREEN_LIGHT_STYLES_ONLY = _.merge(
    {},
    LessonScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
    {},
  );

  public static SCREEN_DARK_STYLES_ONLY = _.merge(
    {},
    LessonScreenStyle.SCREEN_DARK_STYLES_ONLY,
    {},
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    WritingLessonScreenStyle.SCREEN_BASE_STYLES_ONLY,
    WritingLessonScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    WritingLessonScreenStyle.SCREEN_BASE_STYLES_ONLY,
    WritingLessonScreenStyle.SCREEN_DARK_STYLES_ONLY,
  );
}
