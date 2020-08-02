/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableDimensions } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { WritingScreenIds } from '../../constants/ids/WritingScreenIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { ls, ss, xls } from '../../utils/responsive';
import { DefaultButton } from '../common/DefaultButton';

export interface WritingMenuProps {
  observableDimensions: ObservableDimensions;
  startLesson: () => void;
  showSettings: () => void;
  showFAQ: () => void;
}

@observer
export class WritingMenu extends React.Component<WritingMenuProps> {
  public render(): React.ReactElement<any> {
    return (
      <View
        style={[
          styles.container,
          {
            marginHorizontal: this.props.observableDimensions.isPortrait
              ? ls(16)
              : xls(16),
          },
        ]}>
        <DefaultButton
          testID={WritingScreenIds.START_BTN}
          text="Start Writing"
          styles={LessonScreenStyle.getPrimaryMenuButtonStyles()}
          onPress={this.props.startLesson}
        />
        <DefaultButton
          testID={WritingScreenIds.SETTINGS_BTN}
          text="Settings"
          styles={LessonScreenStyle.getSecondaryMenuButtonStyles()}
          onPress={this.props.showSettings}
        />
        <DefaultButton
          text="FAQ"
          testID={WritingScreenIds.FAQ_BTN}
          styles={LessonScreenStyle.getSecondaryMenuButtonStyles()}
          onPress={this.props.showFAQ}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: ss(42),
  },
});
