import { AtomScreenIds } from '../../../src/constants/ids/AtomScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class AtomScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(AtomScreenIds.SCREEN);
  }

  public async navigateToAtomPlayScreen(): Promise<void> {
    await Element.byId(AtomScreenIds.PLAY_BTN).tap();
  }

  public async navigateToAtomTutorialScreen(): Promise<void> {
    await Element.byId(AtomScreenIds.TUTORIAL_BTN).tap();
  }
}

export const atomScreen = new AtomScreen();
