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
import { DialogDelegate } from '../dialog/DialogDelegate';
import { SpacedRepetitionSettingsDelegate } from '../spaced-repetition/SpacedRepetitionSettingsDelegate';
import { VocabularyActionMenuDelegate } from '../vocabulary/VocabularyActionMenuDelegate';
import { WritingSettingsDelegate } from '../writing/WritingSettingsDelegate';
import { SpeakDelegate } from './SpeakDelegate';

@boundClass
export class VocabularyDetailScreenDelegate {
  private spacedRepetitionScheduler = new SpacedRepetitionScheduler();
  private writingScheduler = new WritingScheduler();

  private observableScreen: ObservableVocabularyDetailScreen;
  private vocabularyActionMenuDelegate: VocabularyActionMenuDelegate;
  private speakDelegate: SpeakDelegate;
  private spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate;
  private writingSettingsDelegate: WritingSettingsDelegate;
  private dialogDelegate: DialogDelegate;

  public constructor(
    observableScreen: ObservableVocabularyDetailScreen,
    vocabularyActionMenuDelegate: VocabularyActionMenuDelegate,
    speakDelegate: SpeakDelegate,
    spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate,
    writingSettingsDelegate: WritingSettingsDelegate,
    dialogDelegate: DialogDelegate,
  ) {
    this.observableScreen = observableScreen;
    this.vocabularyActionMenuDelegate = vocabularyActionMenuDelegate;
    this.speakDelegate = speakDelegate;
    this.spacedRepetitionSettingsDelegate = spacedRepetitionSettingsDelegate;
    this.writingSettingsDelegate = writingSettingsDelegate;
    this.dialogDelegate = dialogDelegate;
  }

  public changeStrokeOrderForm(
    form: 'unknown' | 'traditional' | 'simplified',
  ): void {
    this.observableScreen.strokeOrderForm = form;
  }

  public synthesizeAndSpeak(text: string, languageCode: string): void {
    this.speakDelegate.synthesize(text, languageCode, {
      onSynthesizing: (): void => {
        this.observableScreen.speakState.set(ActivityState.ACTIVE);
      },
      onSynthesizeSucceeded: (filePath): void => {
        this.speak(filePath);
      },
      onSynthesizeFailed: (errorBag): void => {
        this.observableScreen.speakState.set(ActivityState.ERROR);
        this.dialogDelegate.showFailedDialog(errorBag);
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
}
