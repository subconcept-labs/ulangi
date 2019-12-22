import { SecurityScreenIds } from '../../../src/constants/ids/SecurityScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class SecurityScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(SecurityScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(SecurityScreenIds.BACK_BTN).tap();
  }

  public async navigateToChangeEmailScreen(): Promise<void> {
    await Element.byId(SecurityScreenIds.CHANGE_EMAIL_BTN).tap();
  }

  public async navigateToChangePasswordScreen(): Promise<void> {
    await Element.byId(SecurityScreenIds.CHANGE_PASSWORD_BTN).tap();
  }
}

export const securityScreen = new SecurityScreen();
