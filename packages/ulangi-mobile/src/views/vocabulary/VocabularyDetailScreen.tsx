/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableAudioStore,
  ObservableDarkModeStore,
  ObservableSetStore,
  ObservableVocabularyDetailScreen,
} from '@ulangi/ulangi-observable';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { VocabularyDetailScreenIds } from '../../constants/ids/VocabularyDetailScreenIds';
import { VocabularyDetailScreenDelegate } from '../../delegates/vocabulary/VocabularyDetailScreenDelegate';
import { VocabularyDetailDefinitions } from '../../views/vocabulary/VocabularyDetailDefinitions';
import { VocabularyDetailExtraFields } from '../../views/vocabulary/VocabularyDetailExtraFields';
import { VocabularyDetailPronunciation } from '../../views/vocabulary/VocabularyDetailPronunciation';
import { VocabularyDetailSpacedRepetitionInfo } from '../../views/vocabulary/VocabularyDetailSpacedRepetitionInfo';
import { VocabularyDetailTitle } from '../../views/vocabulary/VocabularyDetailTitle';
import { VocabularyDetailWritingInfo } from '../../views/vocabulary/VocabularyDetailWritingInfo';
import {
  VocabularyDetailScreenStyles,
  darkStyles,
  lightStyles,
} from './VocabularyDetailScreen.style';

export interface VocabularyDetailScreenProps {
  setStore: ObservableSetStore;
  audioStore: ObservableAudioStore;
  darkModeStore: ObservableDarkModeStore;
  observableScreen: ObservableVocabularyDetailScreen;
  screenDelegate: VocabularyDetailScreenDelegate;
}

export class VocabularyDetailScreen extends React.Component<
  VocabularyDetailScreenProps
> {
  public get styles(): VocabularyDetailScreenStyles {
    return this.props.darkModeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    const currentSet = assertExists(
      this.props.setStore.currentSet,
      'currentSet should not be undefined or null'
    );
    return (
      <View
        style={this.styles.screen}
        testID={VocabularyDetailScreenIds.SCREEN}
      >
        <ScrollView style={this.styles.container}>
          <VocabularyDetailTitle
            theme={this.props.darkModeStore.theme}
            vocabularyTerm={
              this.props.observableScreen.vocabulary.vocabularyTerm
            }
          />
          <VocabularyDetailPronunciation
            theme={this.props.darkModeStore.theme}
            observableScreen={this.props.observableScreen}
            speak={(): void =>
              this.props.screenDelegate.synthesizeAndSpeak(
                this.props.observableScreen.vocabulary.vocabularyTerm,
                currentSet.learningLanguageCode
              )
            }
          />
          <VocabularyDetailExtraFields
            theme={this.props.darkModeStore.theme}
            vocabularyExtraFields={
              this.props.observableScreen.vocabulary.vocabularyExtraFields
            }
            synthesizeSpeechState={
              this.props.observableScreen.synthesizeSpeechState
            }
            speak={(text): void =>
              this.props.screenDelegate.synthesizeAndSpeak(
                text,
                currentSet.learningLanguageCode
              )
            }
          />
          <VocabularyDetailDefinitions
            theme={this.props.darkModeStore.theme}
            definitions={this.props.observableScreen.vocabulary.definitions}
          />
          <VocabularyDetailSpacedRepetitionInfo
            theme={this.props.darkModeStore.theme}
            vocabulary={this.props.observableScreen.vocabulary}
            nextReview={this.props.screenDelegate.calculateNextSpacedRepetitionReview(
              this.props.observableScreen.vocabulary
            )}
          />
          <VocabularyDetailWritingInfo
            theme={this.props.darkModeStore.theme}
            vocabulary={this.props.observableScreen.vocabulary}
            nextReview={this.props.screenDelegate.calculateNextWritingReview(
              this.props.observableScreen.vocabulary
            )}
          />
        </ScrollView>
      </View>
    );
  }
}
