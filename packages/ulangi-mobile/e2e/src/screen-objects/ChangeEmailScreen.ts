import { ChangeEmailScreenIds } from '../../../src/constants/ids/ChangeEmailScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class ChangeEmailScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(ChangeEmailScreenIds.SCREEN);
  }

  public async fillNewEmail(email: string): Promise<void> {
    await Element.byId(ChangeEmailScreenIds.NEW_EMAIL_INPUT).replaceText(email);
  }

  public async fillCurrentPassword(password: string): Promise<void> {
    await Element.byId(ChangeEmailScreenIds.CURRENT_PASSWORD_INPUT).replaceText(
      password
    );
  }

  public async save(): Promise<void> {
    await Element.byId(ChangeEmailScreenIds.SAVE_BTN).tap();
  }
}

export const changeEmailScreen = new ChangeEmailScreen();
