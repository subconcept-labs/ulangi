/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { config } from '../../constants/config';
import { WritingScreenIds } from '../../constants/ids/WritingScreenIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import {
  WritingMenuStyles,
  writingMenuResponsiveStyles,
} from './WritingMenu.style';

export interface WritingMenuProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  startLesson: () => void;
  showSettings: () => void;
  showFAQ: () => void;
}

@observer
export class WritingMenu extends React.Component<WritingMenuProps> {
  private get styles(): WritingMenuStyles {
    return writingMenuResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.primary_button_container}>
          <DefaultButton
            testID={WritingScreenIds.START_BTN}
            text="Start Writing"
            styles={fullRoundedButtonStyles.getSolidBackgroundStyles(
              ButtonSize.X_LARGE,
              config.styles.primaryColor,
              'white',
              this.props.theme,
              this.props.screenLayout,
            )}
            onPress={this.props.startLesson}
          />
        </View>
        <View style={this.styles.secondary_button_container}>
          <DefaultButton
            testID={WritingScreenIds.SETTINGS_BTN}
            text="Settings"
            styles={fullRoundedButtonStyles.getSolidBackgroundStyles(
              ButtonSize.LARGE,
              '#ddd',
              '#444',
              this.props.theme,
              this.props.screenLayout,
            )}
            onPress={this.props.showSettings}
          />
        </View>
        <View style={this.styles.secondary_button_container}>
          <DefaultButton
            text="FAQ"
            testID={WritingScreenIds.FAQ_BTN}
            styles={fullRoundedButtonStyles.getSolidBackgroundStyles(
              ButtonSize.LARGE,
              '#ddd',
              '#444',
              this.props.theme,
              this.props.screenLayout,
            )}
            onPress={this.props.showFAQ}
          />
        </View>
      </View>
    );
  }
}
