/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { Feedback } from '@ulangi/ulangi-common/enums';
import { ObservableReviewFeedbackScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { NavigatorDelegate } from '../../delegates/navigator/NavigatorDelegate';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { FeedbackSelectionMenuDelegate } from '../review-feedback/FeedbackSelectionMenuDelegate';
import { SpacedRepetitionSaveResultDelegate } from '../spaced-repetition/SpacedRepetitionSaveResultDelegate';
import { WritingSaveResultDelegate } from '../writing/WritingSaveResultDelegate';
import { ReviewFeedbackDataDelegate } from './ReviewFeedbackDataDelegate';

@boundClass
export class ReviewFeedbackScreenDelegate {
  private observableScreen: ObservableReviewFeedbackScreen;
  private saveResultDelegate:
    | WritingSaveResultDelegate
    | SpacedRepetitionSaveResultDelegate;
  private feedbackSelectionMenuDelegate: FeedbackSelectionMenuDelegate;
  private reviewFeedbackDataDelegate: ReviewFeedbackDataDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observableScreen: ObservableReviewFeedbackScreen,
    saveResultDelegate:
      | WritingSaveResultDelegate
      | SpacedRepetitionSaveResultDelegate,
    feedbackSelectionMenuDelegate: FeedbackSelectionMenuDelegate,
    reviewFeedbackDataDelegate: ReviewFeedbackDataDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate
  ) {
    this.observableScreen = observableScreen;
    this.saveResultDelegate = saveResultDelegate;
    this.feedbackSelectionMenuDelegate = feedbackSelectionMenuDelegate;
    this.reviewFeedbackDataDelegate = reviewFeedbackDataDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public saveResult(callback: {
    onSaveSucceeded: (feedbackList: ReadonlyMap<string, Feedback>) => void;
  }): void {
    this.saveResultDelegate.save(false, {
      onSaving: this.showSavingDialog,
      onSaveSucceeded: (): void => {
        callback.onSaveSucceeded(
          this.observableScreen.feedbackListState.feedbackList
        );
        this.showSaveSucceededDialog();
      },
      onSaveFailed: this.showSaveFailedDialog,
    });
  }

  public showFeedbackSelectionMenu(vocabularyId: string): void {
    this.feedbackSelectionMenuDelegate.show(
      assertExists(
        this.observableScreen.feedbackListState.feedbackList.get(vocabularyId)
      ),
      (feedback): void => {
        const vocabulary = assertExists(
          this.observableScreen.vocabularyList.get(vocabularyId),
          'vocabulary should not be null or undefined'
        );
        this.observableScreen.feedbackListState.feedbackList.set(
          vocabularyId,
          feedback
        );
        this.observableScreen.allNextReviewData.set(
          vocabularyId,
          this.reviewFeedbackDataDelegate.calculateNextReviewData(
            vocabulary,
            feedback
          )
        );
      }
    );
  }

  private showSavingDialog(): void {
    this.dialogDelegate.show({
      message: 'Saving. Please wait...',
    });
  }

  private showSaveSucceededDialog(): void {
    this.dialogDelegate.showSuccessDialog({
      message: 'Saved successfully.',
      onClose: (): void => {
        this.navigatorDelegate.pop();
      },
    });
  }

  private showSaveFailedDialog(errorCode: string): void {
    this.dialogDelegate.showFailedDialog(errorCode, {
      title: 'SAVE FAILED',
    });
  }
}
