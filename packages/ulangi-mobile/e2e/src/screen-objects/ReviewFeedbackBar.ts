import { Feedback } from '@ulangi/ulangi-common/enums';

import { ReviewFeedbackBarIds } from '../../../src/constants/ids/ReviewFeedbackBarIds';
import { Element } from '../adapters/Element';

export class ReviewFeedbackBar {
  public async select(feedback: Feedback): Promise<void> {
    await Element.byId(
      ReviewFeedbackBarIds.SELECT_FEEDBACK_BTN_BY_FEEDBACK(feedback)
    ).tap();
  }
}

export const reviewFeedbackBar = new ReviewFeedbackBar();
