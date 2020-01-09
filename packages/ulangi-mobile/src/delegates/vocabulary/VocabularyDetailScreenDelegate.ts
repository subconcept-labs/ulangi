/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  SpacedRepetitionScheduler,
  WritingScheduler,
} from '@ulangi/ulangi-common/core';
import { ActivityState, VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableVocabulary,
  ObservableVocabularyDetailScreen,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { config } from '../../constants/config';
import { ErrorConverter } from '../../converters/ErrorConverter';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { NavigatorDelegate } from '../navigator/navigatorDelegate';
import { SpacedRepetitionSettingsDelegate } from '../spaced-repetition/SpacedRepetitionSettingsDelegate';
import { VocabularyActionMenuDelegate } from '../vocabulary/VocabularyActionMenuDelegate';
import { WritingSettingsDelegate } from '../writing/WritingSettingsDelegate';
import { SpeakDelegate } from './SpeakDelegate';

@boundClass
export class VocabularyDetailScreenDelegate {
  private errorConverter = new ErrorConverter();
  private spacedRepetitionScheduler = new SpacedRepetitionScheduler();
  private writingScheduler = new WritingScheduler();

  private observableScreen: ObservableVocabularyDetailScreen;
  private vocabularyActionMenuDelegate: VocabularyActionMenuDelegate;
  private speakDelegate: SpeakDelegate;
  private spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate;
  private writingSettingsDelegate: WritingSettingsDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observableScreen: ObservableVocabularyDetailScreen,
    vocabularyActionMenuDelegate: VocabularyActionMenuDelegate,
    speakDelegate: SpeakDelegate,
    spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate,
    writingSettingsDelegate: WritingSettingsDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observableScreen = observableScreen;
    this.vocabularyActionMenuDelegate = vocabularyActionMenuDelegate;
    this.speakDelegate = speakDelegate;
    this.spacedRepetitionSettingsDelegate = spacedRepetitionSettingsDelegate;
    this.writingSettingsDelegate = writingSettingsDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public synthesizeAndSpeak(text: string, languageCode: string): void {
    this.speakDelegate.synthesize(text, languageCode, {
      onSynthesizing: (): void => {
        this.observableScreen.speakState.set(ActivityState.ACTIVE);
      },
      onSynthesizeSucceeded: (filePath): void => {
        this.speak(filePath);
      },
      onSynthesizeFailed: (errorCode): void => {
        this.observableScreen.speakState.set(ActivityState.ERROR);
        this.showErrorDialog(errorCode);
      },
    });
  }

  public showVocabularyActionMenu(vocabulary: ObservableVocabulary): void {
    this.vocabularyActionMenuDelegate.show(vocabulary);
  }

  public calculateNextSpacedRepetitionReview(vocabulary: Vocabulary): string {
    const {
      initialInterval,
    } = this.spacedRepetitionSettingsDelegate.getCurrentSettings();

    if (vocabulary.vocabularyStatus !== VocabularyStatus.ACTIVE) {
      return 'not active';
    } else {
      return this.spacedRepetitionScheduler.getReviewTimeFromNow(
        initialInterval,
        vocabulary,
        config.spacedRepetition.maxLevel,
      );
    }
  }

  public calculateNextWritingReview(vocabulary: Vocabulary): string {
    const {
      initialInterval,
    } = this.writingSettingsDelegate.getCurrentSettings();

    if (vocabulary.vocabularyStatus !== VocabularyStatus.ACTIVE) {
      return 'not active';
    } else {
      return this.writingScheduler.getReviewTimeFromNow(
        initialInterval,
        vocabulary,
        config.writing.maxLevel,
      );
    }
  }

  private speak(filePath: string): void {
    this.speakDelegate.speak(filePath, {
      onSpeaking: (): void => {
        this.observableScreen.speakState.set(ActivityState.ACTIVE);
      },
      onSpeakSucceeded: (): void => {
        this.observableScreen.speakState.set(ActivityState.INACTIVE);
      },
      onSpeakFailed: (): void => {
        this.observableScreen.speakState.set(ActivityState.INACTIVE);
      },
    });
  }

  private showErrorDialog(errorCode: string): void {
    this.navigatorDelegate.showDialog(
      {
        message: this.errorConverter.convertToMessage(errorCode),
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }
}
