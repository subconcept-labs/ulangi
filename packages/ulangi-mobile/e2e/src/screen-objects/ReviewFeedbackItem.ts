import { Feedback } from '@ulangi/ulangi-common/enums';

import { ReviewFeedbackItemIds } from '../../../src/constants/ids/ReviewFeedbackItemIds';
import { Element } from '../adapters/Element';
import { feedbackSelectionMenu } from '../screen-objects/FeedbackSelectionMenu';

export class ReviewFeedbackItem {
  public async setFeedbackForVocabulary(
    vocabularyText: string,
    feedback: Feedback
  ): Promise<void> {
    await Element.byId(
      ReviewFeedbackItemIds.SHOW_FEEDBACK_SELECTION_MENU_BTN_BY_VOCABULARY_TEXT(
        vocabularyText
      )
    ).tap();
    await feedbackSelectionMenu.selectFeedback(feedback);
  }

  public async expectVocabularyToNotExists(
    vocabularyText: string
  ): Promise<void> {
    await Element.byId(
      ReviewFeedbackItemIds.SHOW_FEEDBACK_SELECTION_MENU_BTN_BY_VOCABULARY_TEXT(
        vocabularyText
      )
    ).expectToNotExist();
  }

  public async expectVocabularyToHaveFeedback(
    vocabularyText: string,
    feedback: Feedback
  ): Promise<void> {
    await Element.byId(
      ReviewFeedbackItemIds.SHOW_FEEDBACK_SELECTION_MENU_BTN_BY_VOCABULARY_TEXT(
        vocabularyText
      )
    ).expectToHaveDescendant(Element.byText(feedback));
  }

  public async expectVocabularyToHaveNextLevel(
    vocabularyText: string,
    nextLevel: number
  ): Promise<void> {
    await Element.byId(
      ReviewFeedbackItemIds.NEXT_LEVEL_BY_VOCABULARY_TEXT(vocabularyText)
    ).expectToHaveText(nextLevel.toString());
  }

  public async expectVocabularyToHaveNextReview(
    vocabularyText: string,
    nextReview: string
  ): Promise<void> {
    await Element.byId(
      ReviewFeedbackItemIds.NEXT_REVIEW_BY_VOCABULARY_TEXT(vocabularyText)
    ).expectToHaveText(nextReview);
  }
}

export const reviewFeedbackItem = new ReviewFeedbackItem();
