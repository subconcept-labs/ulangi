/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, View } from 'react-native';

import { Images } from '../../constants/Images';
import { DefaultText } from '../common/DefaultText';
import { QuizTitleStyles, darkStyles, lightStyles } from './QuizTitle.style';

export interface QuizTitleProps {
  theme: Theme;
  styles?: {
    light: QuizTitleStyles;
    dark: QuizTitleStyles;
  };
}

@observer
export class QuizTitle extends React.Component<QuizTitleProps> {
  public get styles(): QuizTitleStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <DefaultText style={this.styles.title}>Quiz</DefaultText>
        <DefaultText style={this.styles.subtitle}>
          TEST WHAT YOU LEARNED
        </DefaultText>
        <Image source={Images.QUIZ_GREEN_30X30} style={this.styles.icon} />
      </View>
    );
  }
}
