import { TermsOfServiceScreenIds } from '../../../src/constants/ids/TermsOfServiceScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class TermsOfServiceScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(TermsOfServiceScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(TermsOfServiceScreenIds.BACK_BTN).tap();
  }
}

export const termsOfServiceScreen = new TermsOfServiceScreen();
