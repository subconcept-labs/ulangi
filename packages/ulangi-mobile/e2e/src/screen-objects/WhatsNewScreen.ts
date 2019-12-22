import { WhatsNewScreenIds } from '../../../src/constants/ids/WhatsNewScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class WhatsNewScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(WhatsNewScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(WhatsNewScreenIds.BACK_BTN).tap();
  }
}

export const whatsNewScreen = new WhatsNewScreen();
