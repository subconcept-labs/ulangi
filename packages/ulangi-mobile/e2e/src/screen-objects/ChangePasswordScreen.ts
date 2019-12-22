import { ChangePasswordScreenIds } from '../../../src/constants/ids/ChangePasswordScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class ChangePasswordScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(ChangePasswordScreenIds.SCREEN);
  }

  public async fillNewPassword(password: string): Promise<void> {
    await Element.byId(ChangePasswordScreenIds.NEW_PASSWORD_INPUT).replaceText(
      password
    );
  }

  public async fillConfirmPassword(password: string): Promise<void> {
    await Element.byId(
      ChangePasswordScreenIds.CONFIRM_NEW_PASSWORD_INPUT
    ).replaceText(password);
  }

  public async fillCurrentPassword(password: string): Promise<void> {
    await Element.byId(
      ChangePasswordScreenIds.CURRENT_PASSWORD_INPUT
    ).replaceText(password);
  }

  public async save(): Promise<void> {
    await Element.byId(ChangePasswordScreenIds.SAVE_BTN).tap();
  }
}

export const changePasswordScreen = new ChangePasswordScreen();
