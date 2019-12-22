/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { Feedback } from '@ulangi/ulangi-common/enums';
import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';

import { FeedbackSelectionMenuIds } from '../../constants/ids/FeedbackSelectionMenuIds';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

export class FeedbackSelectionMenuDelegate {
  private navigatorDelegate: NavigatorDelegate;
  private styles: {
    light: Options;
    dark: Options;
  };

  public constructor(
    navigatorDelegate: NavigatorDelegate,
    styles: {
      light: Options;
      dark: Options;
    }
  ) {
    this.navigatorDelegate = navigatorDelegate;
    this.styles = styles;
  }

  public show(
    selectedFeedback: Feedback,
    onPress: (feedback: Feedback) => void
  ): void {
    this.navigatorDelegate.showSelectionMenu(
      {
        items: new Map(
          _.values(Feedback).map(
            (feedback): [string, SelectionItem] => {
              return [
                feedback,
                {
                  testID: FeedbackSelectionMenuIds.SELECT_FEEDBACK_BTN_BY_FEEDBACK(
                    feedback
                  ),
                  text: feedback,
                  onPress: (): void => {
                    onPress(feedback as Feedback);
                    this.navigatorDelegate.dismissLightBox();
                  },
                },
              ];
            }
          )
        ),
        selectedIds: [selectedFeedback],
        title: 'Select',
      },
      this.styles
    );
  }
}
