import { QuizMultipleChoiceScreenIds } from '../../../src/constants/ids/QuizMultipleChoiceScreenIds';
import { Element } from '../adapters/Element';
import { multipleChoiceForm } from './MultipleChoiceForm';
import { Screen } from './Screen';

export class QuizMultipleChoiceScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(QuizMultipleChoiceScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(QuizMultipleChoiceScreenIds.BACK_BTN).tap();
  }

  public async autoCompleteQuiz(): Promise<void> {
    await multipleChoiceForm.autoAnswerAll();
  }

  public async takeAnotherQuiz(): Promise<void> {
    await Element.byId(QuizMultipleChoiceScreenIds.TAKE_ANOTHER_QUIZ_BTN).tap();
  }

  public async quit(): Promise<void> {
    await Element.byId(QuizMultipleChoiceScreenIds.QUIT_BTN).tap();
  }

  public async expectToHaveCorrectAnswer(): Promise<void> {
    await multipleChoiceForm.expectToHaveCorrectAnswer();
  }
}

export const quizMultipleChoiceScreen = new QuizMultipleChoiceScreen();
