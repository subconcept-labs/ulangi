/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservablePublicVocabularyDetailScreen,
  ObservableSetStore,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { PublicVocabularyDetailScreenIds } from '../../constants/ids/PublicVocabularyDetailScreenIds';
import { PublicVocabularyDetailScreenDelegate } from '../../delegates/discover/PublicVocabularyDetailScreenDelegate';
import { VocabularyDetailExtraFields } from '../../views/vocabulary/VocabularyDetailExtraFields';
import { VocabularyDetailPronunciation } from '../../views/vocabulary/VocabularyDetailPronunciation';
import { VocabularyDetailTitle } from '../../views/vocabulary/VocabularyDetailTitle';
import {
  PublicVocabularyDetailScreenStyles,
  darkStyles,
  lightStyles,
} from './PublicVocabularyDetailScreen.style';

export interface PublicVocabularyDetailScreenProps {
  setStore: ObservableSetStore;
  themeStore: ObservableThemeStore;
  observableScreen: ObservablePublicVocabularyDetailScreen;
  screenDelegate: PublicVocabularyDetailScreenDelegate;
}

export class PublicVocabularyDetailScreen extends React.Component<
  PublicVocabularyDetailScreenProps
> {
  public get styles(): PublicVocabularyDetailScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    const currentSet = assertExists(
      this.props.setStore.currentSet,
      'currentSet should not be undefined or null',
    );
    return (
      <View
        style={this.styles.screen}
        testID={PublicVocabularyDetailScreenIds.SCREEN}>
        <ScrollView style={this.styles.container}>
          <VocabularyDetailTitle
            theme={this.props.themeStore.theme}
            vocabularyTerm={
              this.props.observableScreen.vocabulary.vocabularyTerm
            }
          />
          <VocabularyDetailPronunciation
            theme={this.props.themeStore.theme}
            speakState={this.props.observableScreen.speakState}
            speak={(): void =>
              this.props.screenDelegate.synthesizeAndSpeak(
                this.props.observableScreen.vocabulary.vocabularyTerm,
                currentSet.learningLanguageCode,
              )
            }
          />
          <VocabularyDetailExtraFields
            theme={this.props.themeStore.theme}
            vocabularyExtraFields={
              this.props.observableScreen.vocabulary.extraFields
            }
            speakState={this.props.observableScreen.speakState}
            speak={(text): void =>
              this.props.screenDelegate.synthesizeAndSpeak(
                text,
                currentSet.learningLanguageCode,
              )
            }
          />
        </ScrollView>
      </View>
    );
  }
}
