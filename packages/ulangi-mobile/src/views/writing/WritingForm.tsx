/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreenLayout,
  ObservableWritingFormState,
} from '@ulangi/ulangi-observable';
import { autorun, reaction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView, TextInput, View, ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { config } from '../../constants/config';
import { WritingFormIds } from '../../constants/ids/WritingFormIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { DefaultTextInput } from '../common/DefaultTextInput';
import { DefinitionItem } from '../vocabulary/DefinitionItem';
import {
  WritingFormStyles,
  definitionItemResponsiveStyles,
  writingFormResponsiveStyles,
} from './WritingForm.style';

export interface WritingFormProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  writingFormState: ObservableWritingFormState;
  shouldHighlightOnError: boolean;
  setAnswer: (text: string) => void;
  showHint: () => void;
  next: () => void;
}

@observer
export class WritingForm extends React.Component<WritingFormProps> {
  private textInputRef?: TextInput | null;
  private animationContainerRef?: any;
  private unsubscribeFocus?: () => void;
  private unsubscribeAnimation?: () => void;

  public componentDidMount(): void {
    this.unsubscribeFocus = reaction(
      (): boolean => this.props.writingFormState.shouldAutoFocus,
      (autoFocus): void => {
        if (
          autoFocus &&
          typeof this.textInputRef !== 'undefined' &&
          this.textInputRef !== null
        ) {
          this.textInputRef.focus();
        }
      },
    );

    this.unsubscribeAnimation = autorun(
      (): void => {
        if (
          this.props.writingFormState.shouldRunFadeOutAnimation === true &&
          this.animationContainerRef
        ) {
          this.animationContainerRef.fadeOutDown(200).then(
            (): void => {
              this.props.writingFormState.shouldRunFadeOutAnimation = false;
            },
          );
        }
      },
    );
  }

  public componentWillUnmount(): void {
    if (typeof this.unsubscribeFocus !== 'undefined') {
      this.unsubscribeFocus();
    }

    if (this.unsubscribeAnimation) {
      this.unsubscribeAnimation();
    }
  }

  private get styles(): WritingFormStyles {
    return writingFormResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Animatable.View
        style={this.styles.container}
        ref={(ref: any): void => {
          this.animationContainerRef = ref;
        }}
        animation="fadeInUp"
        duration={config.general.animationDuration}
        useNativeDriver={true}>
        <View style={this.styles.row}>
          <DefaultText style={this.styles.label}>
            GIVEN DEFINITIONS:
          </DefaultText>
          <View style={this.styles.definition_container}>
            {this.props.writingFormState.currentQuestion.givenDefinitions.map(
              (definition, index): React.ReactElement<any> => {
                return (
                  <DefinitionItem
                    key={index}
                    index={index}
                    theme={this.props.theme}
                    screenLayout={this.props.screenLayout}
                    definition={definition}
                    hideFields={['example']}
                    styles={definitionItemResponsiveStyles}
                  />
                );
              },
            )}
          </View>
        </View>
        <View style={this.styles.row}>
          <DefaultText style={this.styles.label}>WRITE THE TERM:</DefaultText>
          <View style={this.styles.answer_container}>
            <View style={this.styles.answer}>
              <DefaultTextInput
                testID={WritingFormIds.ANSWER_INPUT}
                ref={(ref): void => {
                  this.textInputRef = ref;
                }}
                // We need key otherwise textInput does not update on skip/next
                key={this.props.writingFormState.currentQuestion.questionId}
                editable={!this.props.writingFormState.isCurrentAnswerCorrect}
                style={this.styles.input}
                autoFocus={this.props.writingFormState.shouldAutoFocus}
                autoCapitalize="none"
                autoCorrect={false}
                value={this.props.writingFormState.currentAnswer}
                onChangeText={this.props.setAnswer}
              />
              <View
                testID={
                  this.props.writingFormState.isCurrentAnswerCorrect
                    ? WritingFormIds.ANSWER_IS_CORRECT
                    : this.props.writingFormState
                        .isCurrentAnswerPartiallyCorrect
                    ? WritingFormIds.ANSWER_IS_PARTIALLY_CORRECT
                    : WritingFormIds.ANSWER_IS_INCORRECT
                }
                style={[
                  this.styles.underline,
                  this.getUnderlineColorForAnswer(),
                ]}
              />
            </View>
            {this.props.writingFormState.nextButtonType !== null ? (
              <View style={this.styles.button_container}>
                <DefaultButton
                  testID={WritingFormIds.NEXT_BTN}
                  text={this.props.writingFormState.nextButtonType}
                  styles={fullRoundedButtonStyles.getSolidGreenBackgroundStyles(
                    ButtonSize.SMALL,
                    this.props.theme,
                    this.props.screenLayout,
                  )}
                  onPress={this.props.next}
                />
              </View>
            ) : null}
          </View>
        </View>
        <View style={this.styles.row}>
          <DefaultText style={this.styles.label}>HINT:</DefaultText>
          <View style={this.styles.hint_container}>
            <View style={this.styles.hint_text_container}>
              <ScrollView
                horizontal={true}
                bounces={false}
                contentContainerStyle={this.styles.hint_scrollview}
                showsHorizontalScrollIndicator={false}>
                <DefaultText
                  testID={WritingFormIds.HINT_TEXT}
                  numberOfLines={1}
                  style={this.styles.hint_text}>
                  {this.props.writingFormState.currentHint}
                </DefaultText>
              </ScrollView>
              <View style={this.styles.underline} />
            </View>
            <View style={this.styles.button_container}>
              <DefaultButton
                testID={WritingFormIds.HINT_BTN}
                text="Show"
                styles={fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
                  ButtonSize.SMALL,
                  this.props.theme,
                  this.props.screenLayout,
                )}
                onPress={this.props.showHint}
              />
            </View>
          </View>
        </View>
      </Animatable.View>
    );
  }

  private getUnderlineColorForAnswer(): ViewStyle {
    if (this.props.writingFormState.isCurrentAnswerCorrect === true) {
      return {
        backgroundColor: '#4EBA6F',
      };
    } else if (
      this.props.writingFormState.isCurrentAnswerPartiallyCorrect === false &&
      this.props.shouldHighlightOnError === true
    ) {
      return {
        backgroundColor: '#F15A5A',
      };
    } else {
      return {
        backgroundColor:
          this.props.theme === Theme.LIGHT
            ? config.styles.light.primaryTextColor
            : config.styles.dark.primaryTextColor,
      };
    }
  }
}
