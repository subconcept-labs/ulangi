import { Feedback } from '@ulangi/ulangi-common/enums';

import { SpacedRepetitionLessonScreenIds } from '../../../src/constants/ids/SpacedRepetitionLessonScreenIds';
import { Element } from '../adapters/Element';
import { reviewFeedbackBar } from './ReviewFeedbackBar';
import { reviewActionBar } from "./ReviewActionBar";
import { LightBoxDialogIds } from "../../../src/constants/ids/LightBoxDialogIds"
import { Screen } from './Screen';

export class SpacedRepetitionLessonScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(SpacedRepetitionLessonScreenIds.SCREEN);
  }

  public async goToNextItem(): Promise<void> {
    await reviewActionBar.goToNextItem()
  }

  public async goToPreviousItem(): Promise<void> {
    await reviewActionBar.goToPreviousItem()
  }

  public async showAnswer(): Promise<void> {
    await reviewActionBar.showAnswer()
  }

  public async autoCompleteReview(): Promise<void> {
    while (await reviewActionBar.hasShowAnswerButton()) {
      await reviewActionBar.showAnswer();
      await reviewActionBar.goToNextItem();
      await reviewFeedbackBar.select(Feedback.GOOD);
    }
  }

  public async selectFeedback(feedback: Feedback): Promise<void> {
    await reviewFeedbackBar.select(feedback);
  }

  public async back(): Promise<void> {
    await Element.byId(SpacedRepetitionLessonScreenIds.BACK_BTN).tap();
    await Element.byId(LightBoxDialogIds.OKAY_BTN).tap();
  }

  public async takeAnotherLesson(): Promise<void> {
    await Element.byId(
      SpacedRepetitionLessonScreenIds.TAKE_ANOTHER_LESSON_BTN
    ).tap();
  }

  public async quit(): Promise<void> {
    await Element.byId(SpacedRepetitionLessonScreenIds.QUIT_BTN).tap();
  }

  public async viewAllFeedback(): Promise<void> {
    await Element.byId(
      SpacedRepetitionLessonScreenIds.VIEW_ALL_FEEDBACK_BTN
    ).tap();
  }

  public async expectToHaveTakeAnotherLessonButton(): Promise<void> {
    await Element.byId(
      SpacedRepetitionLessonScreenIds.TAKE_ANOTHER_LESSON_BTN
    ).expectToExist();
  }

  public async expectToHaveQuitButon(): Promise<void> {
    await Element.byId(
      SpacedRepetitionLessonScreenIds.QUIT_BTN
    ).expectToExist();
  }
}

export const spacedRepetitionLessonScreen = new SpacedRepetitionLessonScreen();
