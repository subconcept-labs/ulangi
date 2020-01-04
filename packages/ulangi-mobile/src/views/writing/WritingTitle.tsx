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
import {
  WritingTitleStyles,
  darkStyles,
  lightStyles,
} from './WritingTitle.style';

export interface WritingTitleProps {
  theme: Theme;
  styles?: {
    light: WritingTitleStyles;
    dark: WritingTitleStyles;
  };
}

@observer
export class WritingTitle extends React.Component<WritingTitleProps> {
  public get styles(): WritingTitleStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <DefaultText style={this.styles.title}>Writing</DefaultText>
        <DefaultText style={this.styles.subtitle}>
          WITH SPACED REPETITION
        </DefaultText>
        <Image source={Images.WRITING_30X30} style={this.styles.icon} />
      </View>
    );
  }
}
