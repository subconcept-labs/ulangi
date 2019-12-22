import { ReflexPausedScreenIds } from '../../../src/constants/ids/ReflexPausedScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class ReflexPausedScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(ReflexPausedScreenIds.SCREEN);
  }

  public async continue(): Promise<void> {
    await Element.byId(ReflexPausedScreenIds.CONTINUE_BTN).tap();
  }

  public async restart(): Promise<void> {
    await Element.byId(ReflexPausedScreenIds.RESTART_BTN).tap();
  }

  public async quit(): Promise<void> {
    await Element.byId(ReflexPausedScreenIds.QUIT_BTN).tap();
  }
}

export const reflexPausedScreen = new ReflexPausedScreen();
