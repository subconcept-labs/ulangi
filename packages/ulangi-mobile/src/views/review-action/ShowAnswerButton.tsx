/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import { observer } from 'mobx-react';
import * as React from 'react';
import * as Animatable from 'react-native-animatable';

import { config } from '../../constants/config';
import { RoundedCornerButtonStyle } from '../../styles/RoundedCornerButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import {
  ShowAnswerButtonStyles,
  darkStyles,
  lightStyles,
} from './ShowAnswerButton.style';

export interface ShowAnswerButtonProps {
  theme: Theme;
  showAnswer: () => void;
  styles?: {
    light: ShowAnswerButtonStyles;
    dark: ShowAnswerButtonStyles;
  };
}

@observer
export class ShowAnswerButton extends React.Component<ShowAnswerButtonProps> {
  public get styles(): ShowAnswerButtonStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
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
          styles={RoundedCornerButtonStyle.getFullBackgroundStyles(
            ButtonSize.LARGE,
            4,
            config.styles.primaryColor,
            '#fff',
          )}
          onPress={this.props.showAnswer}
        />
      </Animatable.View>
    );
  }
}
