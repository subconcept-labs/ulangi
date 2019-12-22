import { WritingFAQScreenIds } from '../../../src/constants/ids/WritingFAQScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class WritingFAQScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(WritingFAQScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(WritingFAQScreenIds.BACK_BTN).tap();
  }
}

export const writingFAQScreen = new WritingFAQScreen();
