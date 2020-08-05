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
import { QuizScreenIds } from '../../constants/ids/QuizScreenIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { QuizMenuStyles, quizMenuResponsiveStyles } from './QuizMenu.style';

export interface QuizMenuProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  startWritingQuiz: () => void;
  startMultipleChoiceQuiz: () => void;
  showSettings: () => void;
}

@observer
export class QuizMenu extends React.Component<QuizMenuProps> {
  private get styles(): QuizMenuStyles {
    return quizMenuResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.primary_button_container}>
          <DefaultButton
            testID={QuizScreenIds.MULTIPLE_CHOICE_BTN}
            text="Multiple Choice"
            styles={fullRoundedButtonStyles.getSolidBackgroundStyles(
              ButtonSize.X_LARGE,
              config.styles.primaryColor,
              'white',
              this.props.theme,
              this.props.screenLayout,
            )}
            onPress={this.props.startMultipleChoiceQuiz}
          />
        </View>
        <View style={this.styles.primary_button_container}>
          <DefaultButton
            testID={QuizScreenIds.WRITING_BTN}
            text="Writing"
            styles={fullRoundedButtonStyles.getSolidBackgroundStyles(
              ButtonSize.X_LARGE,
              config.styles.primaryColor,
              'white',
              this.props.theme,
              this.props.screenLayout,
            )}
            onPress={this.props.startWritingQuiz}
          />
        </View>
        <View style={this.styles.secondary_button_container}>
          <DefaultButton
            testID={QuizScreenIds.SETTINGS_BTN}
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
      </View>
    );
  }
}
