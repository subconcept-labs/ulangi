/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyExtraFieldParser } from '@ulangi/ulangi-common/core';
import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableMultipleChoiceFormState,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import {
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { MultipleChoiceFormIds } from '../../constants/ids/MultipleChoiceFormIds';
import { DefaultText } from '../common/DefaultText';
import { WordClassList } from '../vocabulary/WordClassList';
import {
  MultipleChoiceFormStyles,
  multipleChoiceFormResponsiveStyles,
} from './MultipleChoiceForm.style';

export interface MultipleChoiceFormProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  multipleChoiceFormState: ObservableMultipleChoiceFormState;
  selectAnswer: (answer: string) => void;
}

@observer
export class MultipleChoiceForm extends React.Component<
  MultipleChoiceFormProps
> {
  private vocabularyExtraFieldParser = new VocabularyExtraFieldParser();

  private getIcon(answer: string): ImageSourcePropType {
    const isSelected = _.includes(
      this.props.multipleChoiceFormState.selectedAnswers,
      answer,
    );
    if (isSelected === true) {
      if (this.props.multipleChoiceFormState.isAnswerCorrect(answer)) {
        return Images.CHECK_GREEN_22X22;
      } else {
        return Images.CROSS_RED_22X22;
      }
    } else {
      return Images.UNCHECK_GREY_22X22;
    }
  }

  private animationContainerRef?: any;
  private unsubscribeAnimation?: () => void;

  public componentDidMount(): void {
    this.unsubscribeAnimation = autorun(
      (): void => {
        if (
          this.props.multipleChoiceFormState.containerAnimation ===
            'fadeOutDown' &&
          this.animationContainerRef
        ) {
          this.animationContainerRef.fadeOutDown(300).then(
            (): void => {
              this.props.multipleChoiceFormState.containerAnimation = null;
            },
          );
        } else if (
          this.props.multipleChoiceFormState.containerAnimation === 'shake' &&
          this.animationContainerRef
        ) {
          this.animationContainerRef.shake(500).then(
            (): void => {
              this.props.multipleChoiceFormState.containerAnimation = null;
            },
          );
        }
      },
    );
  }

  public componentWillUnmount(): void {
    if (this.unsubscribeAnimation) {
      this.unsubscribeAnimation();
    }
  }

  private get styles(): MultipleChoiceFormStyles {
    return multipleChoiceFormResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    const currentQuestion = this.props.multipleChoiceFormState.currentQuestion;
    return (
      <Animatable.View
        style={this.styles.multiple_choice_container}
        ref={(ref: any): void => {
          this.animationContainerRef = ref;
        }}
        animation="fadeInUp"
        duration={config.general.animationDuration}
        useNativeDriver={true}>
        <View style={this.styles.vocabulary_text_container}>
          <DefaultText style={this.styles.vocabulary_text}>
            <DefaultText style={this.styles.accessory}>What is </DefaultText>
            <DefaultText>
              {
                this.vocabularyExtraFieldParser.parse(
                  currentQuestion.testingVocabulary.vocabularyText,
                ).vocabularyTerm
              }
            </DefaultText>
            <DefaultText style={this.styles.accessory}>?</DefaultText>
          </DefaultText>
        </View>
        {currentQuestion.givenDefinitions.map(
          (definition): React.ReactElement<any> => {
            return (
              <View
                key={definition.definitionId}
                style={this.styles.answer_container}>
                <TouchableOpacity
                  testID={
                    this.props.multipleChoiceFormState.isAnswerCorrect(
                      definition.meaning,
                    )
                      ? MultipleChoiceFormIds.CORRECT_BTN
                      : MultipleChoiceFormIds.INCORRECT_BTN
                  }
                  style={this.styles.answer_touchable}
                  onPress={(): void =>
                    this.props.selectAnswer(definition.meaning)
                  }>
                  <Image
                    source={this.getIcon(definition.meaning)}
                    style={this.styles.uncheck}
                  />
                  <WordClassList
                    theme={this.props.theme}
                    screenLayout={this.props.screenLayout}
                    wordClasses={
                      definition.extraFields.wordClass.length > 0
                        ? definition.extraFields.wordClass.map(
                            (values): string => values[0],
                          )
                        : definition.wordClasses
                    }
                    isUsingCustomWordClasses={
                      definition.extraFields.wordClass.length > 0
                    }
                    noBorder={this.props.theme === Theme.DARK}
                  />
                  <View style={this.styles.meaning_container}>
                    <DefaultText style={this.styles.meaning}>
                      {definition.plainMeaning}
                    </DefaultText>
                  </View>
                </TouchableOpacity>
              </View>
            );
          },
        )}
      </Animatable.View>
    );
  }
}
