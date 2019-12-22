import { AtomPlayScreenIds } from '../../../src/constants/ids/AtomPlayScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class AtomPlayScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(AtomPlayScreenIds.SCREEN);
  }

  public async pause(): Promise<void> {
    await Element.byId(AtomPlayScreenIds.PAUSE_BTN).tap();
  }
}

export const atomPlayScreen = new AtomPlayScreen();
