import { LearnScreenIds } from '../../../src/constants/ids/LearnScreenIds';
import { Element } from '../adapters/Element';
import { TabScreen } from '../screen-objects/TabScreen';

export class LearnScreen extends TabScreen {
  public getScreenElement(): Element {
    return Element.byId(LearnScreenIds.SCREEN);
  }

  public async navigateToSpacedRepetitionScreen(): Promise<void> {
    await Element.byId(LearnScreenIds.SPACED_REPETITION_BTN).tap();
  }

  public async navigateToWritingScreen(): Promise<void> {
    await Element.byId(LearnScreenIds.WRITING_BTN).tap();
  }

  public async navigateToQuizScreen(): Promise<void> {
    await Element.byId(LearnScreenIds.LEARN_LIST).scrollTo('bottom')
    await Element.byId(LearnScreenIds.QUIZ_BTN).tap();
  }

  public async openSetSelectionMenu(): Promise<void> {
    await Element.byId(LearnScreenIds.SHOW_SET_SELECTION_MENU_BTN).tap();
  }

  public async expectToHaveSubtitle(subtitle: string): Promise<void> {
    await Element.byId(LearnScreenIds.TOP_BAR).expectToHaveDescendant(
      Element.byText(subtitle)
    );
  }
}

export const learnScreen = new LearnScreen();
