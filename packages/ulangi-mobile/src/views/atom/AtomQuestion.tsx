/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableAtomQuestion,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  AtomQuestionStyles,
  atomQuestionResponsiveStyles,
} from './AtomQuestion.style';

export interface AtomQuestionProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  question: ObservableAtomQuestion;
}

@observer
export class AtomQuestion extends React.Component<AtomQuestionProps> {
  private get styles(): AtomQuestionStyles {
    return atomQuestionResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  private unescapeUnderscore(text: string): string {
    // Replace all \_ with _
    const regex = /\\_/g;
    return text.replace(regex, '_');
  }

  private parseVocabularyTextWithUnderscores(): React.ReactElement<any> {
    const underscores = _.fill(
      Array(this.props.question.answer.length),
      '_',
    ).join('');
    const indexOfUnderscores = this.props.question.textWithUnderscores.indexOf(
      underscores,
    );
    const beginSubstring = this.unescapeUnderscore(
      this.props.question.textWithUnderscores.slice(0, indexOfUnderscores),
    );
    const endSubstring = this.unescapeUnderscore(
      this.props.question.textWithUnderscores.slice(
        indexOfUnderscores + underscores.length,
      ),
    );

    return (
      <DefaultText style={this.styles.vocabulary_text_with_underscores}>
        <DefaultText>{beginSubstring}</DefaultText>
        <DefaultText style={this.styles.underscores}>{underscores}</DefaultText>
        <DefaultText>{endSubstring}</DefaultText>
      </DefaultText>
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.vocabulary_text_container}>
          {this.parseVocabularyTextWithUnderscores()}
        </View>
        <View style={this.styles.hint_container}>
          <DefaultText style={this.styles.label}>Hint: </DefaultText>
          <DefaultText style={this.styles.hint}>
            {this.props.question.hint}
          </DefaultText>
        </View>
      </View>
    );
  }
}
