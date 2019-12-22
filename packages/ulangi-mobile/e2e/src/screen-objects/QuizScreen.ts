import { QuizScreenIds } from '../../../src/constants/ids/QuizScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class QuizScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(QuizScreenIds.SCREEN);
  }

  public async navigateToQuizWritingScreen(): Promise<void> {
    await Element.byId(QuizScreenIds.WRITING_BTN).tap();
  }

  public async navigateToQuizMultipleChoiceScreen(): Promise<void> {
    await Element.byId(QuizScreenIds.MULTIPLE_CHOICE_BTN).tap();
  }

  public async navigateToQuizSettingsScreen(): Promise<void> {
    await Element.byId(QuizScreenIds.SETTINGS_BTN).tap();
  }

  public async back(): Promise<void> {
    await Element.byId(QuizScreenIds.BACK_BTN).tap();
  }
}

export const quizScreen = new QuizScreen();
