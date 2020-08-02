/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { WordClass } from '@ulangi/ulangi-common/enums';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { config } from '../../constants/config';
import { VocabularyItemIds } from '../../constants/ids/VocabularyItemIds';
import { ss } from '../../utils/responsive';
import { DefaultText } from '../common/DefaultText';

export interface WordClassListProps {
  wordClasses: readonly WordClass[] | readonly string[];
  isUsingCustomWordClasses: boolean;
  noBorder?: boolean;
}

@observer
export class WordClassList extends React.Component<WordClassListProps> {
  public render(): React.ReactElement<any> {
    return (
      <React.Fragment>
        {this.props.isUsingCustomWordClasses
          ? this.renderCustomWordClasses(this.props.wordClasses)
          : this.renderBuiltInWordClasses(this.props
              .wordClasses as WordClass[])}
      </React.Fragment>
    );
  }

  private renderCustomWordClasses(
    wordClasses: readonly string[],
  ): React.ReactElement<any> {
    return (
      <React.Fragment>
        {wordClasses.map(
          (wordClass): React.ReactElement<any> => {
            let wordClassConfig = config.customWordClass.map[wordClass];
            if (typeof wordClassConfig === 'undefined') {
              wordClassConfig = config.customWordClass.map.other;
            }

            const container_extra_style = {
              backgroundColor: wordClassConfig.backgroundColor,
              borderColor: wordClassConfig.borderColor,
              borderWidth:
                this.props.noBorder === true ? 0 : StyleSheet.hairlineWidth,
            };
            const text_extra_style = {
              color: wordClassConfig.textColor,
            };

            return (
              <View
                key={wordClass}
                testID={VocabularyItemIds.WORD_CLASS_BY_VALUE(wordClass)}
                style={[styles.word_class_container, container_extra_style]}>
                <DefaultText style={[styles.word_class, text_extra_style]}>
                  {wordClass}
                </DefaultText>
              </View>
            );
          },
        )}
      </React.Fragment>
    );
  }

  private renderBuiltInWordClasses(
    wordClasses: readonly WordClass[],
  ): React.ReactElement<any> {
    return (
      <React.Fragment>
        {wordClasses.map(
          (wordClass): React.ReactElement<any> => {
            const container_extra_style = {
              backgroundColor:
                config.builtInWordClass.map[wordClass].backgroundColor,
              borderColor: config.builtInWordClass.map[wordClass].borderColor,
              borderWidth:
                this.props.noBorder === true ? 0 : StyleSheet.hairlineWidth,
            };
            const text_extra_style = {
              color: config.builtInWordClass.map[wordClass].textColor,
            };
            return (
              <View
                key={wordClass}
                testID={VocabularyItemIds.WORD_CLASS_BY_VALUE(wordClass)}
                style={[styles.word_class_container, container_extra_style]}>
                <DefaultText style={[styles.word_class, text_extra_style]}>
                  {config.builtInWordClass.map[wordClass].abbr}
                </DefaultText>
              </View>
            );
          },
        )}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  word_class_container: {
    borderRadius: ss(3),
    marginVertical: ss(2),
    paddingVertical: ss(1),
    paddingHorizontal: ss(7),
    marginRight: ss(5),
  },

  word_class: {
    textAlign: 'center',
    fontSize: ss(15),
  },
});
