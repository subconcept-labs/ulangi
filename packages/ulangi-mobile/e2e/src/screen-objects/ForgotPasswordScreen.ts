import { ForgotPasswordScreenIds } from '../../../src/constants/Ids/ForgotPasswordScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class ForgotPasswordScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(ForgotPasswordScreenIds.SCREEN);
  }

  public async navigateToSignInScreen(): Promise<void> {
    await Element.byId(ForgotPasswordScreenIds.BACK_BTN).tap();
  }

  public async fillEmail(email: string): Promise<void> {
    await Element.byId(ForgotPasswordScreenIds.EMAIL_INPUT).replaceText(email);
  }

  public async submit(): Promise<void> {
    await Element.byId(ForgotPasswordScreenIds.SUBMIT_BTN).tap();
  }
}

export const forgotPasswordScreen = new ForgotPasswordScreen();
