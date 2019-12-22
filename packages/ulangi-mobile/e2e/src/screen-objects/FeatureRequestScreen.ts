import { FeatureRequestScreenIds } from '../../../src/constants/ids/FeatureRequestScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class FeatureRequestScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(FeatureRequestScreenIds.SCREEN);
  }

  public async setMessage(message: string): Promise<void> {
    await Element.byId(FeatureRequestScreenIds.TEXT_INPUT).replaceText(message);
  }

  public async send(): Promise<void> {
    await Element.byId(FeatureRequestScreenIds.SEND_BTN).tap();
  }
}

export const featureRequestScreen = new FeatureRequestScreen();
