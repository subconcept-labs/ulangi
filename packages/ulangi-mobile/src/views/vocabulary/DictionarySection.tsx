/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { ActivityState, ErrorCode, Theme } from '@ulangi/ulangi-common/enums';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import { ObservableDictionaryEntryState } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';

import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { DefaultText } from '../common/DefaultText';
import { DictionaryDefinitionList } from './DictionaryDefinitionList';
import {
  DictionarySectionStyles,
  darkStyles,
  lightStyles,
} from './DictionarySection.style';
import { PickerError } from './PickerError';
import { PickerLoading } from './PickerLoading';

export interface DictionarySectionProps {
  theme: Theme;
  learningLanguageName: string;
  translatedToLanguageName: string;
  dictionaryEntryState: ObservableDictionaryEntryState;
  getDictionaryEntry: () => void;
  onPick: (definition: DeepPartial<Definition>) => void;
  openLink: (link: string) => void;
  styles?: {
    light: DictionarySectionStyles;
    dark: DictionarySectionStyles;
  };
}

@observer
export class DictionarySection extends React.Component<DictionarySectionProps> {
  public get styles(): DictionarySectionStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): null | React.ReactElement<any> {
    if (
      this.props.dictionaryEntryState.fetchState.get() === ActivityState.ACTIVE
    ) {
      return (
        <PickerLoading
          theme={this.props.theme}
          message="Searching dictionary"
        />
      );
    } else if (
      this.props.dictionaryEntryState.fetchState.get() === ActivityState.ERROR
    ) {
      return this.renderPickerError();
    } else if (this.props.dictionaryEntryState.dictionaryEntry !== null) {
      const dictionaryEntry = this.props.dictionaryEntryState.dictionaryEntry;
      return (
        <React.Fragment>
          {_.map(
            dictionaryEntry.definitionsBySource,
            ({ definitions, attribution }): React.ReactElement<any> => {
              return (
                <DictionaryDefinitionList
                  key={attribution.sourceName}
                  theme={this.props.theme}
                  term={dictionaryEntry.vocabularyText}
                  attribution={attribution}
                  definitions={definitions}
                  onPick={this.props.onPick}
                  openLink={this.props.openLink}
                />
              );
            },
          )}
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
          testID={VocabularyFormIds.DICTIONARY_SPECIFIC_LANGUAGE_REQUIRED}
          errorMessage={
            'Dictionary is not available because either the source or the target language is selected as "Any Language"'
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
            errorMessage={
              <DefaultText>
                <DefaultText>
                  {"We couldn't find any dictionary entries for "}
                </DefaultText>
                <DefaultText style={this.styles.bold}>
                  {
                    this.props.dictionaryEntryState.dictionaryEntry
                      .vocabularyText
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
          errorMessage={
            <DefaultText>
              <DefaultText>Oops! Something went wrong.</DefaultText>
              <DefaultText
                onPress={this.props.getDictionaryEntry}
                style={this.styles.highlighted_text}>
                {' '}
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
