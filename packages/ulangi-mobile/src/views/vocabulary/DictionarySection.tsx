/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, ErrorCode, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDictionaryDefinition,
  ObservableDictionaryEntryState,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { DefaultText } from '../common/DefaultText';
import { DictionaryDefinitionList } from './DictionaryDefinitionList';
import {
  DictionarySectionStyles,
  dictionarySectionResponsiveStyles,
} from './DictionarySection.style';
import { PickerError } from './PickerError';
import { PickerLoading } from './PickerLoading';

export interface DictionarySectionProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  learningLanguageName: string;
  translatedToLanguageName: string;
  dictionaryEntryState: ObservableDictionaryEntryState;
  getDictionaryEntry: () => void;
  onPick: (definition: ObservableDictionaryDefinition) => void;
  showLink: (link: string, screenTitle: string) => void;
  styles?: {
    light: DictionarySectionStyles;
    dark: DictionarySectionStyles;
  };
}

@observer
export class DictionarySection extends React.Component<DictionarySectionProps> {
  public get styles(): DictionarySectionStyles {
    return dictionarySectionResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): null | React.ReactElement<any> {
    if (
      this.props.dictionaryEntryState.fetchState.get() === ActivityState.ACTIVE
    ) {
      return (
        <PickerLoading
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          message="Searching dictionary..."
        />
      );
    } else if (
      this.props.dictionaryEntryState.fetchState.get() === ActivityState.ERROR
    ) {
      return this.renderPickerError();
    } else if (this.props.dictionaryEntryState.dictionaryEntry !== null) {
      const {
        dictionaryEntry,
        traditionalEntry,
        masculineEntry,
      } = this.props.dictionaryEntryState;
      return (
        <React.Fragment>
          {dictionaryEntry.definitions.length > 0 ? (
            <DictionaryDefinitionList
              theme={this.props.theme}
              screenLayout={this.props.screenLayout}
              term={dictionaryEntry.vocabularyTerm}
              attributions={dictionaryEntry.attributions}
              definitions={dictionaryEntry.definitions}
              onPick={this.props.onPick}
              showLink={this.props.showLink}
            />
          ) : null}
          {traditionalEntry !== null ? (
            <DictionaryDefinitionList
              theme={this.props.theme}
              screenLayout={this.props.screenLayout}
              term={traditionalEntry.vocabularyTerm}
              label="traditional"
              attributions={traditionalEntry.attributions}
              definitions={traditionalEntry.definitions}
              onPick={this.props.onPick}
              showLink={this.props.showLink}
            />
          ) : null}
          {masculineEntry !== null ? (
            <DictionaryDefinitionList
              theme={this.props.theme}
              screenLayout={this.props.screenLayout}
              term={masculineEntry.vocabularyTerm}
              label="masculine"
              attributions={masculineEntry.attributions}
              definitions={masculineEntry.definitions}
              onPick={this.props.onPick}
              showLink={this.props.showLink}
            />
          ) : null}
        </React.Fragment>
      );
    } else {
      return null;
    }
  }

  private renderPickerError(): React.ReactElement<PickerError> {
    if (
      this.props.dictionaryEntryState.fetchError.get() ===
      ErrorCode.DICTIONARY__UNSUPPORTED
    ) {
      return (
        <PickerError
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          errorMessage={
            this.props.learningLanguageName +
            ' - ' +
            this.props.translatedToLanguageName +
            'dictionary is not yet available.'
          }
        />
      );
    } else if (
      this.props.dictionaryEntryState.fetchError.get() ===
      ErrorCode.DICTIONARY__SPECIFIC_LANAGUAGE_REQUIRED
    ) {
      return (
        <PickerError
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          testID={VocabularyFormIds.DICTIONARY_SPECIFIC_LANGUAGE_REQUIRED}
          errorMessage={
            "We couldn't search dictionary because the language of your current set is ambiguous (Any Language.)"
          }
        />
      );
    } else if (
      this.props.dictionaryEntryState.fetchError.get() ===
      ErrorCode.DICTIONARY__NO_RESULTS
    ) {
      if (this.props.dictionaryEntryState.dictionaryEntry !== null) {
        return (
          <PickerError
            theme={this.props.theme}
            screenLayout={this.props.screenLayout}
            errorMessage={
              <DefaultText>
                <DefaultText>
                  {"We couldn't find any dictionary entries for "}
                </DefaultText>
                <DefaultText style={this.styles.bold}>
                  {
                    this.props.dictionaryEntryState.dictionaryEntry
                      .vocabularyTerm
                  }
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
            screenLayout={this.props.screenLayout}
            errorMessage={
              <DefaultText>
                <DefaultText>
                  {"We couldn't find any related dictionary entries."}
                </DefaultText>
              </DefaultText>
            }
          />
        );
      }
    } else {
      return (
        <PickerError
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          errorMessage={
            <DefaultText>
              <DefaultText>Oops! Something went wrong.</DefaultText>
              <DefaultText
                onPress={this.props.getDictionaryEntry}
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
}
