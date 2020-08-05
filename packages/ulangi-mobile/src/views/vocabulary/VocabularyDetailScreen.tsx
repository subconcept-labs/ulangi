/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  ObservableSetStore,
  ObservableThemeStore,
  ObservableVocabularyDetailScreen,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { VocabularyDetailScreenIds } from '../../constants/ids/VocabularyDetailScreenIds';
import { VocabularyDetailScreenDelegate } from '../../delegates/vocabulary/VocabularyDetailScreenDelegate';
import { VocabularyDetailDefinitions } from '../../views/vocabulary/VocabularyDetailDefinitions';
import { VocabularyDetailExtraFields } from '../../views/vocabulary/VocabularyDetailExtraFields';
import { VocabularyDetailPronunciation } from '../../views/vocabulary/VocabularyDetailPronunciation';
import { VocabularyDetailSpacedRepetitionInfo } from '../../views/vocabulary/VocabularyDetailSpacedRepetitionInfo';
import { VocabularyDetailStrokeOrder } from '../../views/vocabulary/VocabularyDetailStrokeOrder';
import { VocabularyDetailTitle } from '../../views/vocabulary/VocabularyDetailTitle';
import { VocabularyDetailWritingInfo } from '../../views/vocabulary/VocabularyDetailWritingInfo';
import { Screen } from '../common/Screen';
import {
  VocabularyDetailScreenStyles,
  vocabularyDetailScreenResponsiveStyles,
} from './VocabularyDetailScreen.style';

export interface VocabularyDetailScreenProps {
  setStore: ObservableSetStore;
  themeStore: ObservableThemeStore;
  observableScreen: ObservableVocabularyDetailScreen;
  screenDelegate: VocabularyDetailScreenDelegate;
}

@observer
export class VocabularyDetailScreen extends React.Component<
  VocabularyDetailScreenProps
> {
  public get styles(): VocabularyDetailScreenStyles {
    return vocabularyDetailScreenResponsiveStyles.compile(
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
        testID={VocabularyDetailScreenIds.SCREEN}
        style={this.styles.screen}
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
                this.props.observableScreen.vocabulary.vocabularyExtraFields
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
              this.props.observableScreen.vocabulary.vocabularyExtraFields
            }
            speakState={this.props.observableScreen.speakState}
            speak={(text): void =>
              this.props.screenDelegate.synthesizeAndSpeak(
                text,
                currentSet.learningLanguageCode,
              )
            }
          />
          <VocabularyDetailDefinitions
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            definitions={this.props.observableScreen.vocabulary.definitions}
          />
          <VocabularyDetailSpacedRepetitionInfo
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            vocabulary={this.props.observableScreen.vocabulary}
            nextReview={this.props.screenDelegate.calculateNextSpacedRepetitionReview(
              this.props.observableScreen.vocabulary,
            )}
          />
          <VocabularyDetailWritingInfo
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            vocabulary={this.props.observableScreen.vocabulary}
            nextReview={this.props.screenDelegate.calculateNextWritingReview(
              this.props.observableScreen.vocabulary,
            )}
          />
        </ScrollView>
      </Screen>
    );
  }
}
