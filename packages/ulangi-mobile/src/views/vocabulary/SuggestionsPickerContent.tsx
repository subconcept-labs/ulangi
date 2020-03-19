/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, ErrorCode, Theme } from '@ulangi/ulangi-common/enums';
import { Attribution } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableSuggestion,
  ObservableSuggestionListState,
} from '@ulangi/ulangi-observable';
import { IObservableArray } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { DefaultText } from '../common/DefaultText';
import { SmartScrollView } from '../common/SmartScrollView';
import { PickerError } from './PickerError';
import { PickerLoading } from './PickerLoading';
import { SuggestionItem } from './SuggestionItem';
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

  public render(): null | React.ReactElement<any> {
    if (
      this.props.suggestionListState.fetchState.get() === ActivityState.ACTIVE
    ) {
      return (
        <PickerLoading
          theme={this.props.theme}
          message="Fetching suggestions. Please wait...."
        />
      );
    } else if (
      this.props.suggestionListState.fetchState.get() === ActivityState.ERROR
    ) {
      return this.renderPickerError();
    } else if (this.props.suggestionListState.suggestionList !== null) {
      return this.renderList(this.props.suggestionListState.suggestionList);
    } else {
      return null;
    }
  }

  private renderPickerError(): React.ReactElement<any> {
    if (
      this.props.suggestionListState.fetchError.get() ===
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
      this.props.suggestionListState.fetchError.get() ===
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
      this.props.suggestionListState.fetchError.get() ===
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

  private renderList(
    suggestions: IObservableArray<ObservableSuggestion>,
  ): React.ReactElement<any> {
    return (
      <SmartScrollView
        testID={VocabularyFormIds.SUGGESTION_LIST}
        showsVerticalScrollIndicator={true}
        style={this.styles.picker_content}>
        {this.renderListHeader()}
        {suggestions.length > 0 ? (
          suggestions.map(
            (suggestion, index): React.ReactElement<any> => {
              return (
                <SuggestionItem
                  key={index}
                  theme={this.props.theme}
                  suggestion={suggestion}
                />
              );
            },
          )
        ) : (
          <DefaultText style={this.styles.no_suggestions_text}>
            We don't have any other suggestions.
          </DefaultText>
        )}
      </SmartScrollView>
    );
  }

  private renderListHeader(): React.ReactElement<any> {
    return (
      <View style={this.styles.title_container}>
        <DefaultText style={this.styles.title}>
          <DefaultText>Suggestions for </DefaultText>
          <DefaultText style={this.styles.term}>
            {this.props.suggestionListState.currentVocabularyTerm}
          </DefaultText>
          {this.props.suggestionListState.attributions !== null
            ? this.renderAttributions(
                this.props.suggestionListState.attributions,
              )
            : null}
        </DefaultText>
      </View>
    );
  }

  private renderAttributions(
    attributions: Attribution[],
  ): React.ReactElement<any> {
    return (
      <React.Fragment>
        <DefaultText> from </DefaultText>
        {attributions.map(
          (attribution, index): React.ReactElement<any> => {
            return (
              <React.Fragment key={index}>
                {index > 0 ? <DefaultText>, </DefaultText> : null}
                <DefaultText
                  onPress={(): void => {
                    if (typeof attribution.sourceLink !== 'undefined') {
                      this.props.openLink(attribution.sourceLink);
                    }
                  }}
                  style={
                    attribution.sourceLink ? this.styles.highlighted_text : null
                  }>
                  {attribution.sourceName}
                </DefaultText>
                {typeof attribution.license !== 'undefined' ? (
                  <DefaultText style={this.styles.license_text}>
                    <DefaultText>, under </DefaultText>
                    <DefaultText
                      style={this.styles.highlighted_text}
                      onPress={(): void => {
                        if (typeof attribution.licenseLink !== 'undefined') {
                          this.props.openLink(attribution.licenseLink);
                        }
                      }}>
                      {attribution.license}
                    </DefaultText>
                  </DefaultText>
                ) : null}
              </React.Fragment>
            );
          },
        )}
      </React.Fragment>
    );
  }
}
