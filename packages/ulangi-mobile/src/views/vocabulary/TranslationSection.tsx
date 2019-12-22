/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { ActivityState, ErrorCode, Theme } from '@ulangi/ulangi-common/enums';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import { ObservableTranslationListState } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { DefaultText } from '../common/DefaultText';
import { PickerError } from './PickerError';
import { PickerLoading } from './PickerLoading';
import { TranslateWithGoogleButton } from './TranslateWithGoogleButton';
import { TranslationList } from './TranslationList';
import {
  TranslationSectionStyles,
  darkStyles,
  lightStyles,
} from './TranslationSection.style';

export interface TranslationSectionProps {
  theme: Theme;
  learningLanguageName: string;
  translatedToLanguageName: string;
  translationListState: ObservableTranslationListState;
  translate: () => void;
  onPick: (definition: DeepPartial<Definition>) => void;
  styles?: {
    light: TranslationSectionStyles;
    dark: TranslationSectionStyles;
  };
}

@observer
export class TranslationSection extends React.Component<
  TranslationSectionProps
> {
  public get styles(): TranslationSectionStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    if (
      this.props.translationListState.translateState.get() ===
      ActivityState.ACTIVE
    ) {
      return <PickerLoading theme={this.props.theme} message="Translating" />;
    } else if (
      this.props.translationListState.translateState.get() ===
      ActivityState.ERROR
    ) {
      return this.renderPickerError();
    } else if (this.props.translationListState.translations !== null) {
      if (this.props.translationListState.translations.length === 0) {
        return (
          <PickerError
            theme={this.props.theme}
            errorMessage={
              <DefaultText>
                <DefaultText>{`We couldn't translate the term`} </DefaultText>
                <DefaultText>{` to ${
                  this.props.translatedToLanguageName
                }. Please make sure you enter it correctly.`}</DefaultText>
              </DefaultText>
            }
          />
        );
      } else {
        return (
          <TranslationList
            theme={this.props.theme}
            translations={this.props.translationListState.translations}
            onPick={this.props.onPick}
          />
        );
      }
    } else {
      return <TranslateWithGoogleButton translate={this.props.translate} />;
    }
  }

  private renderPickerError(): React.ReactElement<PickerError> {
    if (
      this.props.translationListState.translateError.get() ===
      ErrorCode.TRANSLATION__SAME_SOURCE_DESTINATION_LANGUAGE
    ) {
      return (
        <PickerError
          theme={this.props.theme}
          errorMessage={`We couldn't translate it because the source language is same as the target language (${this
            .props.learningLanguageName +
            ' - ' +
            this.props.translatedToLanguageName})`}
        />
      );
    } else if (
      this.props.translationListState.translateError.get() ===
      ErrorCode.TRANSLATION__SPECIFIC_LANGUAGE_REQUIRED
    ) {
      return (
        <PickerError
          theme={this.props.theme}
          testID={VocabularyFormIds.TRANSLATION_SPECIFIC_LANGUAGE_REQUIRED}
          errorMessage={`Translation is not supported because either the source or the target language is selected as "Any Language"`}
        />
      );
    } else {
      return (
        <PickerError
          theme={this.props.theme}
          errorMessage={
            <DefaultText>
              <DefaultText>Oops! Something went wrong. </DefaultText>
              <DefaultText
                onPress={this.props.translate}
                style={this.styles.highlighted_text}
              >
                Please try again.
              </DefaultText>
              <DefaultText>
                {' '}
                If the problem still persists, please try again later.
              </DefaultText>
            </DefaultText>
          }
        />
      );
    }
  }
}
