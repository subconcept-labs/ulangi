/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreenLayout,
  ObservableVocabulary,
} from '@ulangi/ulangi-observable';
import * as moment from 'moment';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  VocabularyDetailInfoStyles,
  vocabularyDetailInfoResponsiveStyles,
} from './VocabularyDetailInfo.style';

export interface VocabularyDetailInfoProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  vocabulary: ObservableVocabulary;
}

export class VocabularyDetailInfo extends React.Component<
  VocabularyDetailInfoProps
> {
  private get styles(): VocabularyDetailInfoStyles {
    return vocabularyDetailInfoResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }
  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.title_container}>
          <DefaultText style={this.styles.title_text}>INFO</DefaultText>
        </View>
        <View style={this.styles.content_container}>
          <View style={this.styles.row_container}>
            <DefaultText style={this.styles.left_text}>Sync</DefaultText>
            <DefaultText style={this.styles.right_text}>
              {this.props.vocabulary.updatedAt === null
                ? 'Not yet'
                : moment(this.props.vocabulary.updatedAt).fromNow()}
            </DefaultText>
          </View>
        </View>
      </View>
    );
  }
}
