/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableLanguage,
  ObservableVocabularyFormState,
} from '@ulangi/ulangi-observable';
import { boundMethod } from 'autobind-decorator';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

import { config } from '../../constants/config';
import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { DefaultText } from '../common/DefaultText';
import { DefaultTextInput } from '../common/DefaultTextInput';
import { DefinitionInput } from './DefinitionInput';
import {
  VocabularyFormStyles,
  darkStyles,
  lightStyles,
} from './VocabularyForm.style';

export interface VocabularyFormProps {
  theme: Theme;
  learningLanguage: ObservableLanguage;
  translatedToLanguage: ObservableLanguage;
  vocabularyFormState: ObservableVocabularyFormState;
  lookUp: () => void;
  showSuggestions: () => void;
  showVocabularyExtraFieldsPicker: () => void;
  showDefinitionExtraFieldsPicker: (index: number) => void;
  addDefinitionSlot: () => void;
  editCategory: () => void;
  deleteDefinition: (index: number) => void;
  styles?: {
    light: VocabularyFormStyles;
    dark: VocabularyFormStyles;
  };
}

@observer
export class VocabularyForm extends React.Component<VocabularyFormProps> {
  private textInputRef?: TextInput | null;
  private unsubscribeFocus?: () => void;
  private unsubscribeHandlingCursor?: () => void;

  public componentDidMount(): void {
    this.unsubscribeFocus = autorun(this.handleFocus);
    this.unsubscribeHandlingCursor = autorun(this.handleCursor);
  }

  @boundMethod
  private handleFocus(): void {
    if (
      this.props.vocabularyFormState.shouldFocusVocabularyInput === true &&
      typeof this.textInputRef !== 'undefined' &&
      this.textInputRef !== null
    ) {
      this.textInputRef.focus();
      this.props.vocabularyFormState.shouldFocusVocabularyInput = false;
    }
  }

  @boundMethod
  private handleCursor(): void {
    if (
      typeof this.textInputRef !== 'undefined' &&
      this.textInputRef !== null &&
      this.props.vocabularyFormState.shouldMoveCursorOfVocabularyInput !== null
    ) {
      this.textInputRef.setNativeProps({
        selection: {
          start: this.props.vocabularyFormState
            .shouldMoveCursorOfVocabularyInput,
          end: this.props.vocabularyFormState.shouldMoveCursorOfVocabularyInput,
        },
      });
      this.props.vocabularyFormState.shouldMoveCursorOfVocabularyInput = null;
    }
  }

  public componentWillUnmount(): void {
    if (typeof this.unsubscribeFocus !== 'undefined') {
      this.unsubscribeFocus();
    }

    if (typeof this.unsubscribeHandlingCursor !== 'undefined') {
      this.unsubscribeHandlingCursor();
    }
  }

  public get styles(): VocabularyFormStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.form}>
        {this.renderVocabularyInput()}
        {this.renderDefinitionInputList()}
        {this.renderCategoryInput()}
      </View>
    );
  }

  private renderVocabularyInput(): React.ReactElement<any> {
    return (
      <View style={this.styles.vocabulary_container}>
        <View style={this.styles.header}>
          <View style={this.styles.title_container}>
            <DefaultText style={this.styles.title}>Term</DefaultText>
          </View>
        </View>
        <View style={this.styles.vocabulary_input_container}>
          <DefaultTextInput
            ref={(ref: any): void => {
              this.textInputRef = ref;
            }}
            testID={VocabularyFormIds.VOCABULARY_TEXT_INPUT}
            multiline={true}
            scrollEnabled={false}
            key={this.props.vocabularyFormState.vocabularyId}
            placeholder={`Enter term in ${
              this.props.learningLanguage.fullName
            }`}
            placeholderTextColor={
              this.props.theme === Theme.LIGHT
                ? config.styles.light.secondaryTextColor
                : config.styles.dark.secondaryTextColor
            }
            autoCapitalize="none"
            onChangeText={(text): void => {
              this.props.vocabularyFormState.vocabularyText = text;
            }}
            style={this.styles.vocabulary_input}
            value={this.props.vocabularyFormState.vocabularyText}
          />
        </View>
        <View style={this.styles.button_list}>
          <TouchableOpacity
            testID={VocabularyFormIds.DICTIONARY_BTN}
            onPress={this.props.lookUp}
            style={[this.styles.button, this.styles.button_green]}>
            <DefaultText
              style={[this.styles.button_text, this.styles.button_green_text]}>
              DICTIONARY
            </DefaultText>
          </TouchableOpacity>
          <TouchableOpacity
            testID={VocabularyFormIds.SUGGESTIONS_BTN}
            onPress={this.props.showSuggestions}
            style={[this.styles.button, this.styles.button_blue]}>
            <DefaultText
              style={[this.styles.button_text, this.styles.button_blue_text]}>
              SUGGESTIONS
            </DefaultText>
          </TouchableOpacity>
          <TouchableOpacity
            testID={VocabularyFormIds.VOCABULARY_EXTRA_FIELDS_BTN}
            onPress={this.props.showVocabularyExtraFieldsPicker}
            style={this.styles.button}>
            <DefaultText style={this.styles.button_text}>
              EXTRA FIELDS
            </DefaultText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  private renderDefinitionInputList(): React.ReactElement<any> {
    return (
      <React.Fragment>
        {this.props.vocabularyFormState.definitions.map(
          (definition, index): React.ReactElement<any> => {
            return (
              <View key={index} style={this.styles.definition_container}>
                <View style={this.styles.header}>
                  <View style={this.styles.title_container}>
                    <DefaultText style={this.styles.title}>
                      Definition {index + 1}
                    </DefaultText>
                  </View>
                </View>
                <DefinitionInput
                  key={definition.definitionId}
                  theme={this.props.theme}
                  index={index}
                  definition={definition}
                  translatedToLanguageName={
                    this.props.translatedToLanguage.fullName
                  }
                  shouldFocusInput={
                    this.props.vocabularyFormState.shouldFocusDefinitionInput
                  }
                  shouldMoveCursor={
                    this.props.vocabularyFormState
                      .shouldMoveCursorOfDefinitionInput
                  }
                />
                <View style={this.styles.button_list}>
                  <TouchableOpacity
                    testID={VocabularyFormIds.DELETE_DEFINITION_BTN_BY_INDEX(
                      index,
                    )}
                    onPress={(): void => this.props.deleteDefinition(index)}
                    style={[this.styles.button, this.styles.button_red]}>
                    <DefaultText
                      style={[
                        this.styles.button_text,
                        this.styles.button_red_text,
                      ]}>
                      DELETE
                    </DefaultText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID={VocabularyFormIds.DEFINITION_EXTRA_FIELDS_BTN_BY_INDEX(
                      index,
                    )}
                    onPress={(): void =>
                      this.props.showDefinitionExtraFieldsPicker(index)
                    }
                    style={this.styles.button}>
                    <DefaultText style={this.styles.button_text}>
                      EXTRA FIELDS
                    </DefaultText>
                  </TouchableOpacity>
                </View>
              </View>
            );
          },
        )}
        {this.addMoreDefinitionsButton()}
      </React.Fragment>
    );
  }

  private addMoreDefinitionsButton(): React.ReactElement<any> {
    return (
      <View style={this.styles.add_definition_btn_container}>
        <TouchableOpacity
          testID={VocabularyFormIds.ADD_DEFINITION_BTN}
          onPress={this.props.addDefinitionSlot}
          style={[this.styles.button, this.styles.add_definition_btn]}>
          <DefaultText
            style={[
              this.styles.button_text,
              this.styles.add_definition_btn_text,
            ]}>
            ADD DEFINITION
          </DefaultText>
        </TouchableOpacity>
      </View>
    );
  }

  private renderCategoryInput(): React.ReactElement<any> {
    return (
      <View style={this.styles.category_container}>
        <View style={this.styles.header}>
          <View style={this.styles.title_container}>
            <DefaultText style={this.styles.title}>Category</DefaultText>
          </View>
        </View>
        <View style={this.styles.category_name_container}>
          <DefaultText style={this.styles.category_name}>
            {this.props.vocabularyFormState.categoryName}
          </DefaultText>
          <TouchableOpacity
            testID={VocabularyFormIds.EDIT_CATEGORY_BTN}
            onPress={this.props.editCategory}
            style={this.styles.button}>
            <DefaultText style={this.styles.button_text}>EDIT</DefaultText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
