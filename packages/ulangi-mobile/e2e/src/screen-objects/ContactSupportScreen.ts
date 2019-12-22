import { ContactSupportScreenIds } from '../../../src/constants/ids/ContactSupportScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class ContactSupportScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(ContactSupportScreenIds.SCREEN);
  }

  public async setMessage(message: string): Promise<void> {
    await Element.byId(ContactSupportScreenIds.TEXT_INPUT).replaceText(message);
  }

  public async send(): Promise<void> {
    await Element.byId(ContactSupportScreenIds.SEND_BTN).tap();
  }
}

export const contactSupportScreen = new ContactSupportScreen();
