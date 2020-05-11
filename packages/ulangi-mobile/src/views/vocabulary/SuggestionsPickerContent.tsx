/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { ActivityState, ErrorCode, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableSuggestionListState } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';

import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { DefaultText } from '../common/DefaultText';
import { SmartScrollView } from '../common/SmartScrollView';
import { PickerError } from './PickerError';
import { PickerLoading } from './PickerLoading';
import { SuggestionList, SuggestionListProps } from './SuggestionList';
import {
  SuggestionsPickerContentStyles,
  darkStyles,
  lightStyles,
} from './SuggestionsPickerContent.style';

export interface SuggestionsPickerContentProps {
  theme: Theme;
  learningLanguageName: string;
  translatedToLanguageName: string;
  suggestionListState: ObservableSuggestionListState;
  getSuggestions: () => void;
  openLink: (link: string) => void;
  styles?: {
    light: SuggestionsPickerContentStyles;
    dark: SuggestionsPickerContentStyles;
  };
}

@observer
export class SuggestionsPickerContent extends React.Component<
  SuggestionsPickerContentProps
> {
  public get styles(): SuggestionsPickerContentStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    if (
      this.props.suggestionListState.dictionaryEntryState.fetchState.get() ===
      ActivityState.ACTIVE
    ) {
      return (
        <PickerLoading
          theme={this.props.theme}
          message="Fetching suggestions. Please wait...."
        />
      );
    } else if (
      this.props.suggestionListState.dictionaryEntryState.fetchState.get() ===
      ActivityState.ERROR
    ) {
      return this.renderPickerError();
    } else {
      return this.renderSuggestions();
    }
  }

  private renderPickerError(): React.ReactElement<any> {
    if (
      this.props.suggestionListState.dictionaryEntryState.fetchError.get() ===
      ErrorCode.DICTIONARY__UNSUPPORTED
    ) {
      return (
        <PickerError
          theme={this.props.theme}
          errorMessage={
            'Suggestions is not yet available for ' +
            this.props.learningLanguageName +
            ' - ' +
            this.props.translatedToLanguageName +
            '.'
          }
        />
      );
    } else if (
      this.props.suggestionListState.dictionaryEntryState.fetchError.get() ===
      ErrorCode.DICTIONARY__SPECIFIC_LANAGUAGE_REQUIRED
    ) {
      return (
        <PickerError
          theme={this.props.theme}
          testID={VocabularyFormIds.DICTIONARY_SPECIFIC_LANGUAGE_REQUIRED}
          errorMessage={
            "We couldn't provide suggestions because the language of your current set is ambiguous (Any Language.)"
          }
        />
      );
    } else if (
      this.props.suggestionListState.dictionaryEntryState.fetchError.get() ===
      ErrorCode.DICTIONARY__NO_RESULTS
    ) {
      return (
        <PickerError
          theme={this.props.theme}
          errorMessage={
            <DefaultText>
              <DefaultText>
                {"We couldn't find any dictionary entries for "}
              </DefaultText>
              <DefaultText style={this.styles.bold}>
                {this.props.suggestionListState.currentVocabularyTerm}
              </DefaultText>
              <DefaultText>.</DefaultText>
            </DefaultText>
          }
        />
      );
    } else {
      return (
        <PickerError
          theme={this.props.theme}
          errorMessage={
            <DefaultText>
              <DefaultText>Oops! Something went wrong.</DefaultText>
              <DefaultText
                onPress={this.props.getSuggestions}
                style={this.styles.highlighted_text}>
                {' '}
                Please check internet connection and try again.
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

  private renderSuggestions(): React.ReactElement<any> {
    const { suggestionListState } = this.props;

    const allSuggestionLists: (null | Omit<
      SuggestionListProps,
      'theme' | 'openLink'
    >)[] = [
      suggestionListState.dictionaryEntryState.dictionaryEntry !== null
        ? {
            term:
              suggestionListState.dictionaryEntryState.dictionaryEntry
                .vocabularyTerm,
            label: undefined,
            attributions:
              suggestionListState.dictionaryEntryState.dictionaryEntry
                .attributions,
            suggestions: assertExists(
              suggestionListState.suggestionsFromDictionaryEntry,
            ),
          }
        : null,
      suggestionListState.dictionaryEntryState.traditionalEntry !== null
        ? {
            term:
              suggestionListState.dictionaryEntryState.traditionalEntry
                .vocabularyTerm,
            label: 'traditional',
            attributions:
              suggestionListState.dictionaryEntryState.traditionalEntry
                .attributions,
            suggestions: assertExists(
              suggestionListState.suggestionsFromTraditionalEntry,
            ),
          }
        : null,
      suggestionListState.dictionaryEntryState.masculineEntry !== null
        ? {
            term:
              suggestionListState.dictionaryEntryState.masculineEntry
                .vocabularyTerm,
            label: 'masculine',
            attributions:
              suggestionListState.dictionaryEntryState.masculineEntry
                .attributions,
            suggestions: assertExists(
              suggestionListState.suggestionsFromMasculineEntry,
            ),
          }
        : null,
    ];

    return (
      <SmartScrollView
        testID={VocabularyFormIds.SUGGESTION_LIST}
        showsVerticalScrollIndicator={true}
        style={this.styles.picker_content}>
        {_.every(allSuggestionLists, _.isNull) ? (
          <DefaultText style={this.styles.no_suggestions_text}>
            `We couldn't for any suggestions for $
            {this.props.suggestionListState.currentVocabularyTerm}.`
          </DefaultText>
        ) : (
          allSuggestionLists
            .filter((list): list is SuggestionListProps => list !== null)
            .map(
              (list): React.ReactElement<any> => {
                return (
                  <SuggestionList
                    key={list.term + '-' + list.label}
                    theme={this.props.theme}
                    term={list.term}
                    label={list.label}
                    attributions={list.attributions}
                    suggestions={list.suggestions}
                    openLink={this.props.openLink}
                  />
                );
              },
            )
        )}
      </SmartScrollView>
    );
  }
}
