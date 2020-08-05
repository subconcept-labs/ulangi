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
import * as Animatable from 'react-native-animatable';

import { config } from '../../constants/config';
import { roundedCornerButtonStyles } from '../../styles/RoundedCornerButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import {
  ShowAnswerButtonStyles,
  showAnswerButtonResponsiveStyles,
} from './ShowAnswerButton.style';

export interface ShowAnswerButtonProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  showAnswer: () => void;
  styles?: {
    light: ShowAnswerButtonStyles;
    dark: ShowAnswerButtonStyles;
  };
}

@observer
export class ShowAnswerButton extends React.Component<ShowAnswerButtonProps> {
  private get styles(): ShowAnswerButtonStyles {
    return showAnswerButtonResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): null | React.ReactElement<any> {
    return (
      <Animatable.View
        animation="fadeIn"
        duration={config.general.animationDuration}
        useNativeDriver
        style={this.styles.show_answer_button_container}>
        <DefaultButton
          text="Show Answer"
          styles={roundedCornerButtonStyles.getSolidBackgroundStyles(
            ButtonSize.LARGE,
            4,
            config.styles.primaryColor,
            '#fff',
            this.props.theme,
            this.props.screenLayout,
          )}
          onPress={this.props.showAnswer}
        />
      </Animatable.View>
    );
  }
}
