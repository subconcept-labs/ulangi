/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { config } from '../../constants/config';
import { RoundedCornerButtonStyle } from '../../styles/RoundedCornerButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { NextButtonStyles, darkStyles, lightStyles } from './NextButton.style';

export interface NextButtonProps {
  theme: Theme;
  title: string;
  next: () => void;
  styles?: {
    light: NextButtonStyles;
    dark: NextButtonStyles;
  };
}

@observer
export class NextButton extends React.Component<NextButtonProps> {
  public get styles(): NextButtonStyles {
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
        style={this.styles.next_button_container}>
        <View style={this.styles.title_container}>
          <DefaultText style={this.styles.title}>
            {this.props.title}
          </DefaultText>
        </View>
        <DefaultButton
          text="Next"
          styles={RoundedCornerButtonStyle.getFullBackgroundStyles(
            ButtonSize.LARGE,
            4,
            config.styles.greenColor,
            '#fff',
          )}
          onPress={this.props.next}
        />
      </Animatable.View>
    );
  }
}
