import { Feedback } from '@ulangi/ulangi-common/enums';

import { WritingLessonScreenIds } from '../../../src/constants/ids/WritingLessonScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from '../screen-objects/Screen';
import { reviewFeedbackBar } from './ReviewFeedbackBar';
import { writingForm } from './WritingForm';

export class WritingLessonScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(WritingLessonScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(WritingLessonScreenIds.BACK_BTN).tap();
  }

  public async autoAnswerAndSelectFeedbackForAll(
    vocabularyList: readonly {
      vocabularyText: string;
      definitions: readonly string[];
    }[]
  ): Promise<void> {
    await writingForm.autoAnswerAndSelectFeedbackForAll(vocabularyList);
  }

  public async autoAnswerAndSelectFeedback(
    vocabularyList: readonly {
      vocabularyText: string;
      definitions: readonly string[];
    }[],
    feedback: Feedback
  ): Promise<string> {
    const answer = await writingForm.autoAnswer(vocabularyList);
    await reviewFeedbackBar.select(feedback);
    return answer;
  }

  public async disableAll(): Promise<void> {
    await writingForm.disableAll();
  }

  public async takeAnotherLesson(): Promise<void> {
    await Element.byId(WritingLessonScreenIds.TAKE_ANOTHER_LESSON_BTN).tap();
  }

  public async quit(): Promise<void> {
    await Element.byId(WritingLessonScreenIds.QUIT_BTN).tap();
  }

  public async viewReviewFeedback(): Promise<void> {
    await Element.byId(WritingLessonScreenIds.VIEW_ALL_FEEDBACK_BTN).tap();
  }

  public async expectToHaveTakeAnotherLessonButton(): Promise<void> {
    await Element.byId(
      WritingLessonScreenIds.TAKE_ANOTHER_LESSON_BTN
    ).expectToExist();
  }

  public async expectToHaveQuitButon(): Promise<void> {
    await Element.byId(WritingLessonScreenIds.QUIT_BTN).expectToExist();
  }
}

export const writingLessonScreen = new WritingLessonScreen();
