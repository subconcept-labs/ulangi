import { SpacedRepetitionFAQScreenIds } from '../../../src/constants/ids/SpacedRepetitionFAQScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class SpacedRepetitionFAQScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(SpacedRepetitionFAQScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(SpacedRepetitionFAQScreenIds.BACK_BTN).tap();
  }
}

export const spacedRepetitionFAQScreen = new SpacedRepetitionFAQScreen();
