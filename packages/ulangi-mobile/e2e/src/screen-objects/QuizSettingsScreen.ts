import { QuizSettingsScreenIds } from '../../../src/constants/ids/QuizSettingsScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class QuizSettingsScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(QuizSettingsScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(QuizSettingsScreenIds.BACK_BTN).tap();
  }

  public async save(): Promise<void> {
    await Element.byId(QuizSettingsScreenIds.SAVE_BTN).tap();
  }

  public async changeVocabularyPool(
    vocabularyPool: 'Learned' | 'Active'
  ): Promise<void> {
    await Element.byId(QuizSettingsScreenIds.VOCABULARY_POOL_BTN).tap();
    await Element.byId(
      QuizSettingsScreenIds.SELECT_VOCABULARY_POOL_BTN_BY_VOCABULARY_POOL_NAME(
        vocabularyPool
      )
    ).tap();
  }

  public async expectToHaveVocabularyPool(
    vocabularyPool: 'Learned' | 'Active'
  ): Promise<void> {
    await Element.byId(
      QuizSettingsScreenIds.VOCABULARY_POOL_BTN
    ).expectToHaveDescendant(Element.byText(vocabularyPool));
  }
}

export const quizSettingsScreen = new QuizSettingsScreen();
