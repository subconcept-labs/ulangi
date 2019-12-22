/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { Theme } from '@ulangi/ulangi-common/enums';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableDictionaryEntryState,
  ObservableTranslationListState,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { SmartScrollView } from '../common/SmartScrollView';
import {
  DictionaryPickerContentStyles,
  darkStyles,
  lightStyles,
} from './DictionaryPickerContent.style';
import { DictionarySection } from './DictionarySection';
import { TranslationSection } from './TranslationSection';

export interface DictionaryPickerContentProps {
  theme: Theme;
  learningLanguageName: string;
  translatedToLanguageName: string;
  dictionaryEntryState: ObservableDictionaryEntryState;
  translationListState: ObservableTranslationListState;
  getDictionaryEntry: () => void;
  translate: () => void;
  openLink: (link: string) => void;
  onPick: (definition: DeepPartial<Definition>) => void;
  styles?: {
    light: DictionaryPickerContentStyles;
    dark: DictionaryPickerContentStyles;
  };
}

@observer
export class DictionaryPickerContent extends React.Component<
  DictionaryPickerContentProps
> {
  public get styles(): DictionaryPickerContentStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <SmartScrollView
        testID={VocabularyFormIds.DICTIONARY_LIST}
        showsVerticalScrollIndicator={true}
        style={this.styles.picker_content}
      >
        <DictionarySection
          theme={this.props.theme}
          learningLanguageName={this.props.learningLanguageName}
          translatedToLanguageName={this.props.translatedToLanguageName}
          dictionaryEntryState={this.props.dictionaryEntryState}
          getDictionaryEntry={this.props.getDictionaryEntry}
          openLink={this.props.openLink}
          onPick={this.props.onPick}
        />
        <TranslationSection
          theme={this.props.theme}
          learningLanguageName={this.props.learningLanguageName}
          translatedToLanguageName={this.props.translatedToLanguageName}
          translationListState={this.props.translationListState}
          translate={this.props.translate}
          onPick={this.props.onPick}
        />
      </SmartScrollView>
    );
  }
}
