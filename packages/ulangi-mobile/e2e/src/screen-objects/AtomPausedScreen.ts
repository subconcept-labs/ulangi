import { AtomPausedScreenIds } from '../../../src/constants/ids/AtomPausedScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class AtomPausedScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(AtomPausedScreenIds.SCREEN);
  }

  public async quit(): Promise<void> {
    await Element.byId(AtomPausedScreenIds.QUIT_BTN).tap();
  }

  public async restart(): Promise<void> {
    await Element.byId(AtomPausedScreenIds.RESTART_BTN).tap();
  }
}

export const atomPausedScreen = new AtomPausedScreen();
