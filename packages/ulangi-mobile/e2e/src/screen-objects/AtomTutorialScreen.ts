import { AtomTutorialScreenIds } from '../../../src/constants/ids/AtomTutorialScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class AtomTutorialScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(AtomTutorialScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(AtomTutorialScreenIds.BACK_BTN).tap();
  }
}

export const atomTutorialScreen = new AtomTutorialScreen();
