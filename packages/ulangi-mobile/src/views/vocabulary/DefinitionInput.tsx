/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableDefinition } from '@ulangi/ulangi-observable';
import { boundMethod } from 'autobind-decorator';
import { IObservableValue, autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TextInput, View } from 'react-native';

import { config } from '../../constants/config';
import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import {
  DefinitionInputStyles,
  darkStyles,
  lightStyles,
} from './DefinitionInput.style';

export interface DefinitionInputProps {
  theme: Theme;
  index: number;
  definition: ObservableDefinition;
  translatedToLanguageName: string;
  shouldFocusInput: IObservableValue<null | number>;
  shouldMoveCursor: IObservableValue<null | {
    index: number;
    position: number;
  }>;
  styles?: {
    light: DefinitionInputStyles;
    dark: DefinitionInputStyles;
  };
}

@observer
export class DefinitionInput extends React.Component<DefinitionInputProps> {
  private textInputRef: any;
  private unsubscribeFocus?: () => void;
  private unsubscribeHandlingCursor?: () => void;

  public componentDidMount(): void {
    this.unsubscribeFocus = autorun(this.handleFocus);
    this.unsubscribeHandlingCursor = autorun(this.handleCursor);
  }

  public componentWillUnmount(): void {
    if (typeof this.unsubscribeFocus !== 'undefined') {
      this.unsubscribeFocus();
    }

    if (typeof this.unsubscribeHandlingCursor !== 'undefined') {
      this.unsubscribeHandlingCursor();
    }
  }

  @boundMethod
  private handleFocus(): void {
    if (
      typeof this.textInputRef !== 'undefined' &&
      this.props.shouldFocusInput.get() === this.props.index
    ) {
      this.textInputRef.focus();
      this.props.shouldFocusInput.set(null);
    }
  }

  @boundMethod
  private handleCursor(): void {
    const cursorCommand = this.props.shouldMoveCursor.get();

    if (
      typeof this.textInputRef !== 'undefined' &&
      cursorCommand !== null &&
      cursorCommand.index === this.props.index
    ) {
      this.textInputRef.setNativeProps({
        selection: {
          start: cursorCommand.position,
          end: cursorCommand.position,
        },
      });
      this.props.shouldMoveCursor.set(null);
    }
  }

  public get styles(): DefinitionInputStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.meaning_container}>
        <TextInput
          scrollEnabled={false}
          ref={(ref): void => {
            this.textInputRef = ref;
          }}
          testID={VocabularyFormIds.MEANING_INPUT_BY_INDEX(this.props.index)}
          onChangeText={(text): void => {
            this.props.definition.meaning = text;
          }}
          multiline={true}
          placeholder={`Enter definition in ${
            this.props.translatedToLanguageName
          }`}
          placeholderTextColor={
            this.props.theme === Theme.LIGHT
              ? config.styles.light.secondaryTextColor
              : config.styles.dark.secondaryTextColor
          }
          value={this.props.definition.meaning}
          style={this.styles.meaning_input}
          autoCapitalize="none"
        />
      </View>
    );
  }
}
