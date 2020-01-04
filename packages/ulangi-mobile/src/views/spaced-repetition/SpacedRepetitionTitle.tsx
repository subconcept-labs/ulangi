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
  SpacedRepetitionTitleStyles,
  darkStyles,
  lightStyles,
} from './SpacedRepetitionTitle.style';

export interface SpacedRepetitionTitleProps {
  theme: Theme;
  styles?: {
    light: SpacedRepetitionTitleStyles;
    dark: SpacedRepetitionTitleStyles;
  };
}

@observer
export class SpacedRepetitionTitle extends React.Component<
  SpacedRepetitionTitleProps
> {
  public get styles(): SpacedRepetitionTitleStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <DefaultText style={this.styles.title}>Spaced Repetition</DefaultText>
        <DefaultText style={this.styles.subtitle}>
          A WELL-KNOWN LEARNING TECHNIQUE
        </DefaultText>
        <Image
          source={Images.SPACED_REPETITION_30X30}
          style={this.styles.icon}
        />
      </View>
    );
  }
}
