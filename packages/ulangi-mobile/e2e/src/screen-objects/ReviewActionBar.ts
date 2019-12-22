import { Element } from "../adapters/Element"
import { ReviewActionBarIds } from "../../../src/constants/ids/ReviewActionBarIds"

export class ReviewActionBar {

  public async goToNextItem(): Promise<void> {
    await Element.byId(
      ReviewActionBarIds.NEXT_BTN
    ).tap()
  }

  public async goToPreviousItem(): Promise<void> {
    await Element.byId(
      ReviewActionBarIds.PREVIOUS_BTN
    ).tap()
  }

  public async showAnswer(): Promise<void> {
    await Element.byId(
      ReviewActionBarIds.SHOW_ANSWER_BTN
    ).tap()
  }

  public async hasShowAnswerButton(): Promise<boolean> {
    return Element.byId(ReviewActionBarIds.SHOW_ANSWER_BTN).isExisting();
  }
}

export const reviewActionBar  = new ReviewActionBar()
