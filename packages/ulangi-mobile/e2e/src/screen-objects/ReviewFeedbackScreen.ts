import { Feedback } from '@ulangi/ulangi-common/enums';

import { ReviewFeedbackScreenIds } from '../../../src/constants/ids/ReviewFeedbackScreenIds';
import { Element } from '../adapters/Element';
import { reviewFeedbackItem } from './ReviewFeedbackItem';
import { Screen } from './Screen';

export class ReviewFeedbackScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(ReviewFeedbackScreenIds.SCREEN);
  }

  public async setFeedbackForVocabulary(
    vocabularyText: string,
    feedback: Feedback
  ): Promise<void> {
    await reviewFeedbackItem.setFeedbackForVocabulary(vocabularyText, feedback);
  }

  public async expectVocabularyToNotExists(
    vocabularyText: string
  ): Promise<void> {
    await reviewFeedbackItem.expectVocabularyToNotExists(vocabularyText);
  }
  public async expectVocabularyToHaveFeedback(
    vocabularyText: string,
    feedback: Feedback
  ): Promise<void> {
    await reviewFeedbackItem.expectVocabularyToHaveFeedback(
      vocabularyText,
      feedback
    );
  }

  public async expectVocabularyToHaveNextLevel(
    vocabularyText: string,
    nextLevel: number
  ): Promise<void> {
    await reviewFeedbackItem.expectVocabularyToHaveNextLevel(
      vocabularyText,
      nextLevel
    );
  }

  public async expectVocabularyToHaveNextReview(
    vocabularyText: string,
    nextReview: string
  ): Promise<void> {
    await reviewFeedbackItem.expectVocabularyToHaveNextReview(
      vocabularyText,
      nextReview
    );
  }

  public async save(): Promise<void> {
    await Element.byId(ReviewFeedbackScreenIds.SAVE_BTN).tap();
  }
}

export const reviewFeedbackScreen = new ReviewFeedbackScreen();
