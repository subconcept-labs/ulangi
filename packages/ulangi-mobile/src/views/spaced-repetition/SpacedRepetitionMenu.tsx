/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { SpacedRepetitionScreenIds } from '../../constants/ids/SpacedRepetitionScreenIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { DefaultButton } from '../common/DefaultButton';

export interface SpacedRepetitionMenuProps {
  startLesson: () => void;
  showSettings: () => void;
  showFAQ: () => void;
}

export class SpacedRepetitionMenu extends React.Component<
  SpacedRepetitionMenuProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <DefaultButton
          testID={SpacedRepetitionScreenIds.START_BTN}
          text="Start Review"
          styles={LessonScreenStyle.getPrimaryMenuButtonStyles()}
          onPress={this.props.startLesson}
        />
        <DefaultButton
          testID={SpacedRepetitionScreenIds.SETTINGS_BTN}
          text="Settings"
          styles={LessonScreenStyle.getSecondaryMenuButtonStyles()}
          onPress={this.props.showSettings}
        />
        <DefaultButton
          testID={SpacedRepetitionScreenIds.FAQ_BTN}
          text="FAQ"
          styles={LessonScreenStyle.getSecondaryMenuButtonStyles()}
          onPress={this.props.showFAQ}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 40,
  },
});
