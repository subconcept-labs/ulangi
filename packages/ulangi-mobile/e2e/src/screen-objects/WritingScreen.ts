import { WritingScreenIds } from '../../../src/constants/ids/WritingScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class WritingScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(WritingScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(WritingScreenIds.BACK_BTN).tap();
  }

  public async navigateToWritingLessonScreen(): Promise<void> {
    await Element.byId(WritingScreenIds.START_BTN).tap();
  }

  public async navigateToWritingSettingsScreen(): Promise<void> {
    await Element.byId(WritingScreenIds.SETTINGS_BTN).tap();
  }

  public async navigateToWritingFAQScreen(): Promise<void> {
    await Element.byId(WritingScreenIds.FAQ_BTN).tap();
  }
}

export const writingScreen = new WritingScreen();
