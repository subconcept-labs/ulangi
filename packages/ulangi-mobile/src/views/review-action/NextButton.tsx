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
import * as Animatable from 'react-native-animatable';

import { config } from '../../constants/config';
import { roundedCornerButtonStyles } from '../../styles/RoundedCornerButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import {
  NextButtonStyles,
  nextButtonResponsiveStyles,
} from './NextButton.style';

export interface NextButtonProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  title: string;
  next: () => void;
}

@observer
export class NextButton extends React.Component<NextButtonProps> {
  public get styles(): NextButtonStyles {
    return nextButtonResponsiveStyles.compile(
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
        style={this.styles.next_button_container}>
        <View style={this.styles.title_container}>
          <DefaultText style={this.styles.title}>
            {this.props.title}
          </DefaultText>
        </View>
        <DefaultButton
          text="Next"
          styles={roundedCornerButtonStyles.getSolidBackgroundStyles(
            ButtonSize.LARGE,
            4,
            config.styles.greenColor,
            '#fff',
            this.props.theme,
            this.props.screenLayout,
          )}
          onPress={this.props.next}
        />
      </Animatable.View>
    );
  }
}
