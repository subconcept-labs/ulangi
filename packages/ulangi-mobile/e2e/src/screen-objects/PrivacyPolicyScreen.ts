import { PrivacyPolicyScreenIds } from '../../../src/constants/ids/PrivacyPolicyScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class PrivacyPolicyScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(PrivacyPolicyScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(PrivacyPolicyScreenIds.BACK_BTN).tap();
  }
}

export const privacyPolicyScreen = new PrivacyPolicyScreen();
