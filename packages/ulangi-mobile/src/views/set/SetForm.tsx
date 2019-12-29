/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SetFormPickerType, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableSetFormState } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { SetFormIds } from '../../constants/ids/SetFormIds';
import { DefaultText } from '../common/DefaultText';
import { SetFormStyles, darkStyles, lightStyles } from './SetForm.style';

export interface SetFormProps {
  theme: Theme;
  setFormState: ObservableSetFormState;
  showPicker: (pickerType: SetFormPickerType) => void;
  showSelectLearningLanguageFirstDialog: () => void;
  styles?: {
    light: SetFormStyles;
    dark: SetFormStyles;
  };
}

@observer
export class SetForm extends React.Component<SetFormProps> {
  public get styles(): SetFormStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.form_body_container}>
        {this.props.setFormState.shouldShowSetNameInput === true ? (
          <View style={this.styles.set_name_container}>
            <TextInput
              testID={SetFormIds.SET_NAME_INPUT}
              placeholder="Enter set name (optional)"
              placeholderTextColor={
                this.props.theme === Theme.LIGHT
                  ? config.styles.light.secondaryTextColor
                  : config.styles.dark.secondaryTextColor
              }
              style={this.styles.set_name_input}
              value={this.props.setFormState.setName || ''}
              onChangeText={(text): void => {
                this.props.setFormState.setName = text;
              }}
            />
          </View>
        ) : null}
        <View style={this.styles.button_container}>
          <TouchableOpacity
            testID={SetFormIds.SHOW_LEARNING_LANGUAGE_PICKER_BTN}
            style={this.styles.button_touchable}
            onPress={(): void =>
              this.props.showPicker(SetFormPickerType.LEARN)
            }>
            <DefaultText style={[this.styles.button_text]}>
              <DefaultText style={this.styles.bold}>Learn: </DefaultText>
              {this.props.setFormState.learningLanguageCode === null ? (
                <DefaultText>Select language</DefaultText>
              ) : (
                <DefaultText>
                  {
                    assertExists(this.props.setFormState.learningLanguage)
                      .fullName
                  }
                </DefaultText>
              )}
            </DefaultText>
            <Image source={Images.CARET_DOWN_GREY_12X8} />
          </TouchableOpacity>
          <TouchableOpacity
            testID={SetFormIds.SHOW_TRANSLATED_TO_LANGUAGE_PICKER_BTN}
            style={[
              this.styles.button_touchable,
              this.props.setFormState.canSelectTranslatedIntoLanguage
                ? {}
                : this.styles.button_disabled,
            ]}
            onPress={(): void => {
              if (this.props.setFormState.canSelectTranslatedIntoLanguage) {
                this.props.showPicker(SetFormPickerType.TRANSLATED_INTO);
              } else {
                this.props.showSelectLearningLanguageFirstDialog();
              }
            }}>
            <DefaultText
              style={[
                this.styles.button_text,
                this.props.setFormState.canSelectTranslatedIntoLanguage
                  ? {}
                  : this.styles.button_text_disabled,
              ]}>
              <DefaultText style={this.styles.bold}>
                Translated into:{' '}
              </DefaultText>
              {this.props.setFormState.translatedToLanguageCode === null ? (
                <DefaultText>Select language</DefaultText>
              ) : (
                <DefaultText>
                  {
                    assertExists(this.props.setFormState.translatedToLanguage)
                      .fullName
                  }
                </DefaultText>
              )}
            </DefaultText>
            <Image source={Images.CARET_DOWN_GREY_12X8} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
