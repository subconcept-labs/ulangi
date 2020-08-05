/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  VocabularyDetailTitleStyles,
  vocabularyDetailTitleResponsiveStyles,
} from './VocabularyDetailTitle.style';

export interface VocabularyDetailTitleProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
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
    return vocabularyDetailTitleResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
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
