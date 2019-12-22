import { SetUpAccountScreenIds } from '../../../src/constants/ids/SetUpAccountScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class SetUpAccountScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(SetUpAccountScreenIds.SCREEN);
  }

  public async fillNewEmail(email: string): Promise<void> {
    await Element.byId(SetUpAccountScreenIds.EMAIL_INPUT).replaceText(email);
  }

  public async fillPassword(password: string): Promise<void> {
    await Element.byId(SetUpAccountScreenIds.PASSWORD_INPUT).replaceText(
      password
    );
  }

  public async fillConfirmPassword(password: string): Promise<void> {
    await Element.byId(
      SetUpAccountScreenIds.CONFIRM_PASSWORD_INPUT
    ).replaceText(password);
  }

  public async submit(): Promise<void> {
    await Element.byId(SetUpAccountScreenIds.SUBMIT_BTN).tap();
  }

  public async back(): Promise<void> {
    await Element.byId(SetUpAccountScreenIds.BACK_BTN).tap();
  }
}

export const setUpAccountScreen = new SetUpAccountScreen();
