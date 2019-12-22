import { QuizWritingScreenIds } from '../../../src/constants/ids/QuizWritingScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';
import { writingForm } from './WritingForm';

export class QuizWritingScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(QuizWritingScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(QuizWritingScreenIds.BACK_BTN).tap();
  }

  public async autoCompleteQuiz(
    vocabularyList: readonly {
      vocabularyText: string;
      definitions: readonly string[];
    }[]
  ): Promise<void> {
    await writingForm.autoAnswerAndNextForAll(vocabularyList);
  }

  public async takeAnotherQuiz(): Promise<void> {
    await Element.byId(QuizWritingScreenIds.TAKE_ANOTHER_QUIZ_BTN).tap();
  }

  public async quit(): Promise<void> {
    await Element.byId(QuizWritingScreenIds.QUIT_BTN).tap();
  }

  public async expectAnswerInputToExist(): Promise<void> {
    await writingForm.expectAnswerInputToExist();
  }
}

export const quizWritingScreen = new QuizWritingScreen();
