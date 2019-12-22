/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableAtomQuestion } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { config } from '../../constants/config';
import { DefaultText } from '../common/DefaultText';

export interface AtomQuestionProps {
  question: ObservableAtomQuestion;
}

@observer
export class AtomQuestion extends React.Component<AtomQuestionProps> {
  private unescapeUnderscore(text: string): string {
    // Replace all \_ with _
    const regex = /\\_/g;
    return text.replace(regex, '_');
  }

  private parseVocabularyTextWithUnderscores(): React.ReactElement<any> {
    const underscores = _.fill(
      Array(this.props.question.answer.length),
      '_'
    ).join('');
    const indexOfUnderscores = this.props.question.textWithUnderscores.indexOf(
      underscores
    );
    const beginSubstring = this.unescapeUnderscore(
      this.props.question.textWithUnderscores.slice(0, indexOfUnderscores)
    );
    const endSubstring = this.unescapeUnderscore(
      this.props.question.textWithUnderscores.slice(
        indexOfUnderscores + underscores.length
      )
    );

    return (
      <DefaultText style={styles.vocabulary_text_with_underscores}>
        <DefaultText>{beginSubstring}</DefaultText>
        <DefaultText style={styles.underscores}>{underscores}</DefaultText>
        <DefaultText>{endSubstring}</DefaultText>
      </DefaultText>
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <View style={styles.vocabulary_text_container}>
          {this.parseVocabularyTextWithUnderscores()}
        </View>
        <View style={styles.hint_container}>
          <DefaultText style={styles.label}>Hint: </DefaultText>
          <DefaultText style={styles.hint}>
            {this.props.question.hint}
          </DefaultText>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: -1,
    marginTop: 15,
    marginHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  hint_container: {
    marginTop: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    fontWeight: 'bold',
    fontSize: 13,
    paddingRight: 4,
    color: '#91aa9d',
  },

  hint: {
    fontSize: 13,
    color: '#91aa9d',
  },

  vocabulary_text_container: {},

  vocabulary_text_with_underscores: {
    color: config.atom.textColor,
    fontSize: 17,
    fontWeight: 'bold',
    textShadowColor: '#00000012',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
  },

  underscores: {
    color: config.atom.textColor,
    fontSize: 17,
    letterSpacing: 1,
  },
});
