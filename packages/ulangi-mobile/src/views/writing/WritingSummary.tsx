/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreenLayout,
  ObservableWritingResult,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  WritingSummaryStyles,
  writingSummaryResponsiveStyles,
} from './WritingSummary.style';

export interface WritingSummaryProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  writingResult: ObservableWritingResult;
}

@observer
export class WritingSummary extends React.Component<WritingSummaryProps> {
  private get styles(): WritingSummaryStyles {
    return writingSummaryResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.stats_container}>
        <View style={this.styles.row}>
          <View style={this.styles.row_left}>
            <DefaultText style={this.styles.text_left}>
              Terms without hints:
            </DefaultText>
          </View>
          <View style={this.styles.row_right}>
            <DefaultText style={this.styles.text_right}>
              {this.props.writingResult.vocabularyIdsWithNoHintsUsed.length}
            </DefaultText>
          </View>
        </View>
        <View style={this.styles.row}>
          <View style={this.styles.row_left}>
            <DefaultText style={this.styles.text_left}>
              Terms with hints:
            </DefaultText>
          </View>
          <View style={this.styles.row_right}>
            <DefaultText style={this.styles.text_right}>
              {this.props.writingResult.vocabularyIdsWithHintsUsed.length}
            </DefaultText>
          </View>
        </View>
        {typeof this.props.writingResult.skippedVocabularyIds.length !==
        'undefined' ? (
          <View style={this.styles.row}>
            <View style={this.styles.row_left}>
              <DefaultText style={this.styles.text_left}>
                Terms skipped:
              </DefaultText>
            </View>
            <View style={this.styles.row_right}>
              <DefaultText style={this.styles.text_right}>
                {this.props.writingResult.skippedVocabularyIds.length}
              </DefaultText>
            </View>
          </View>
        ) : null}
        {typeof this.props.writingResult.disabledVocabularyIds.length !==
        'undefined' ? (
          <View style={this.styles.row}>
            <View style={this.styles.row_left}>
              <DefaultText style={this.styles.text_left}>
                Terms disabled:
              </DefaultText>
            </View>
            <View style={this.styles.row_right}>
              <DefaultText style={this.styles.text_right}>
                {this.props.writingResult.disabledVocabularyIds.length}
              </DefaultText>
            </View>
          </View>
        ) : null}
        <View style={this.styles.horizontal_line} />
        <View style={this.styles.result_container}>
          <View style={this.styles.result_row}>
            <DefaultText style={this.styles.percentage}>
              {this.props.writingResult.passPercentage === null
                ? 'N/A'
                : 'You passed ' +
                  this.props.writingResult.passPercentage +
                  '% of the terms'}
            </DefaultText>
          </View>
          <View style={this.styles.result_row}>
            <DefaultText style={this.styles.grade}>
              {typeof this.props.writingResult.grade !== 'undefined'
                ? 'Grade ' + this.props.writingResult.grade
                : 'N/A'}
            </DefaultText>
          </View>
        </View>
      </View>
    );
  }
}
