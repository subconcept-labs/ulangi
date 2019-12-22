import { Feedback } from '@ulangi/ulangi-common/enums';

import { FeedbackSelectionMenuIds } from '../../../src/constants/ids/FeedbackSelectionMenuIds';
import { Element } from '../adapters/Element';

export class FeedbackSelectionMenu {
  public async selectFeedback(feedback: Feedback): Promise<void> {
    await Element.byId(
      FeedbackSelectionMenuIds.SELECT_FEEDBACK_BTN_BY_FEEDBACK(feedback)
    ).tap();
  }
}

export const feedbackSelectionMenu = new FeedbackSelectionMenu();
