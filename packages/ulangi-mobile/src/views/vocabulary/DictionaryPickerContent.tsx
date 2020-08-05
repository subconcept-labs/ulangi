/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDictionaryDefinition,
  ObservableDictionaryEntryState,
  ObservableScreenLayout,
  ObservableTranslation,
  ObservableTranslationListState,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { SmartScrollView } from '../common/SmartScrollView';
import {
  DictionaryPickerContentStyles,
  dictionaryPickerContentResponsiveStyles,
} from './DictionaryPickerContent.style';
import { DictionarySection } from './DictionarySection';
import { TranslationSection } from './TranslationSection';

export interface DictionaryPickerContentProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  learningLanguageName: string;
  translatedToLanguageName: string;
  dictionaryEntryState: ObservableDictionaryEntryState;
  translationListState: ObservableTranslationListState;
  getDictionaryEntry: () => void;
  translate: () => void;
  openLink: (link: string) => void;
  onPickDictionaryDefinition: (
    definition: ObservableDictionaryDefinition,
  ) => void;
  onPickTranslation: (translation: ObservableTranslation) => void;
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
    return dictionaryPickerContentResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <SmartScrollView
        testID={VocabularyFormIds.DICTIONARY_LIST}
        showsVerticalScrollIndicator={true}
        style={this.styles.picker_content}>
        <DictionarySection
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          learningLanguageName={this.props.learningLanguageName}
          translatedToLanguageName={this.props.translatedToLanguageName}
          dictionaryEntryState={this.props.dictionaryEntryState}
          getDictionaryEntry={this.props.getDictionaryEntry}
          openLink={this.props.openLink}
          onPick={this.props.onPickDictionaryDefinition}
        />
        <TranslationSection
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          learningLanguageName={this.props.learningLanguageName}
          translatedToLanguageName={this.props.translatedToLanguageName}
          translationListState={this.props.translationListState}
          translate={this.props.translate}
          onPick={this.props.onPickTranslation}
        />
      </SmartScrollView>
    );
  }
}
