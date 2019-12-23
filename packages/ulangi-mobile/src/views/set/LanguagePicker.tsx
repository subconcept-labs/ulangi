/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SetFormPickerType, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableLanguage,
  ObservableSetPickerState,
} from '@ulangi/ulangi-observable';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { config } from '../../constants/config';
import { SetFormIds } from '../../constants/ids/SetFormIds';
import { DefaultText } from '../common/DefaultText';
import {
  LanguagePickerStyles,
  darkStyles,
  lightStyles,
} from './LanguagePicker.style';
import { LanguagePickerItem } from './LanguagePickerItem';

export interface LanguagePickerProps {
  theme: Theme;
  pickerState: ObservableSetPickerState;
  selectedLanguageCode: null | string;
  selectableLanguages: readonly ObservableLanguage[];
  onLanguageSelect: (languageCode: string) => void;
  hidePicker: () => void;
  styles?: {
    light: LanguagePickerStyles;
    dark: LanguagePickerStyles;
  };
}

@observer
export class LanguagePicker extends React.Component<LanguagePickerProps> {
  private keyExtractor = (item: ObservableLanguage): string =>
    item.languageCode;

  private animationContainerRef?: any;
  private unsubscribeAnimation?: () => void;

  public componentDidMount(): void {
    this.unsubscribeAnimation = autorun(
      (): void => {
        if (this.props.pickerState.languagePickerShouldRunCloseAnimation) {
          this.animationContainerRef
            .fadeOutDown(config.general.animationDuration)
            .then(
              (): void => {
                this.props.pickerState.languagePickerShouldRunCloseAnimation = false;
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

  public get styles(): LanguagePickerStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): null | React.ReactElement<any> {
    if (this.props.pickerState.currentPicker !== null) {
      return (
        <Animatable.View
          key={this.props.pickerState.currentPicker}
          animation="fadeInUp"
          duration={config.general.animationDuration}
          useNativeDriver
          ref={(ref: any): void => {
            this.animationContainerRef = ref;
          }}
          style={this.styles.picker_container}>
          <View style={this.styles.top_bar_container}>
            <View style={this.styles.top_bar_text_container}>
              <DefaultText
                testID={SetFormIds.LANGUAGE_PICKER_TITLE}
                style={this.styles.top_bar_text}>
                {this.props.pickerState.currentPicker ===
                SetFormPickerType.LEARN
                  ? 'Learn:'
                  : 'Translated into:'}
              </DefaultText>
            </View>
            <TouchableOpacity
              testID={SetFormIds.CLOSE_PICKER_BTN}
              onPress={this.props.hidePicker}
              style={this.styles.close_button}>
              <DefaultText style={this.styles.close_text}>Close</DefaultText>
            </TouchableOpacity>
          </View>
          <View style={this.styles.list_container}>
            <FlatList
              testID={SetFormIds.LANGUAGE_LIST}
              keyExtractor={this.keyExtractor}
              data={this.props.selectableLanguages}
              renderItem={({
                item,
              }: {
                item: ObservableLanguage;
              }): React.ReactElement<any> => (
                <LanguagePickerItem
                  key={item.languageCode}
                  theme={this.props.theme}
                  language={item}
                  isSelected={
                    this.props.selectedLanguageCode === item.languageCode
                  }
                  onSelect={this.props.onLanguageSelect}
                />
              )}
            />
          </View>
        </Animatable.View>
      );
    } else {
      return null;
    }
  }
}
