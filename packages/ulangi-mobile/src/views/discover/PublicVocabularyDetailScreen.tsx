/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  ObservablePublicVocabularyDetailScreen,
  ObservableSetStore,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { PublicVocabularyDetailScreenIds } from '../../constants/ids/PublicVocabularyDetailScreenIds';
import { PublicVocabularyDetailScreenDelegate } from '../../delegates/discover/PublicVocabularyDetailScreenDelegate';
import { VocabularyDetailExtraFields } from '../../views/vocabulary/VocabularyDetailExtraFields';
import { VocabularyDetailPronunciation } from '../../views/vocabulary/VocabularyDetailPronunciation';
import { VocabularyDetailStrokeOrder } from '../../views/vocabulary/VocabularyDetailStrokeOrder';
import { VocabularyDetailTitle } from '../../views/vocabulary/VocabularyDetailTitle';
import { Screen } from '../common/Screen';
import {
  PublicVocabularyDetailScreenStyles,
  publicVocabularyDetailScreenResponsiveStyles,
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
    return publicVocabularyDetailScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    const currentSet = assertExists(
      this.props.setStore.currentSet,
      'currentSet should not be undefined or null',
    );
    return (
      <Screen
        style={this.styles.screen}
        testID={PublicVocabularyDetailScreenIds.SCREEN}
        useSafeAreaView={true}
        observableScreen={this.props.observableScreen}>
        <ScrollView style={this.styles.container}>
          <VocabularyDetailTitle
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            vocabularyTerm={
              this.props.observableScreen.vocabulary.vocabularyTerm
            }
          />
          <VocabularyDetailPronunciation
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            speakState={this.props.observableScreen.speakState}
            speak={(): void =>
              this.props.screenDelegate.synthesizeAndSpeak(
                this.props.observableScreen.vocabulary.vocabularyTerm,
                currentSet.learningLanguageCode,
              )
            }
          />
          {currentSet.learningLanguageCode === 'zh' ? (
            <VocabularyDetailStrokeOrder
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              vocabularyTerm={
                this.props.observableScreen.vocabulary.vocabularyTerm
              }
              vocabularyExtraFields={
                this.props.observableScreen.vocabulary.extraFields
              }
              strokeOrderForm={this.props.observableScreen.strokeOrderForm}
              changeStrokeOrderForm={
                this.props.screenDelegate.changeStrokeOrderForm
              }
            />
          ) : null}
          <VocabularyDetailExtraFields
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
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
      </Screen>
    );
  }
}
