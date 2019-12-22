/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  VocabularyDetailTitleStyles,
  darkStyles,
  lightStyles,
} from './VocabularyDetailTitle.style';

export interface VocabularyDetailTitleProps {
  theme: Theme;
  vocabularyTerm: string;
  styles?: {
    light: VocabularyDetailTitleStyles;
    dark: VocabularyDetailTitleStyles;
  };
}

export class VocabularyDetailTitle extends React.Component<
  VocabularyDetailTitleProps
> {
  public get styles(): VocabularyDetailTitleStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <DefaultText style={this.styles.vocabulary_text}>
          {this.props.vocabularyTerm}
        </DefaultText>
      </View>
    );
  }
}
