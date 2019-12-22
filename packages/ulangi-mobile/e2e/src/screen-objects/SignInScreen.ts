import { SignInScreenIds } from '../../../src/constants/ids/SignInScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class SignInScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(SignInScreenIds.SCREEN);
  }

  public async logInAsGuest(): Promise<void> {
    await Element.byId(SignInScreenIds.GUEST_SIGN_IN_BTN).tap();
  }

  public async logIn(email: string, password: string): Promise<void> {
    await this.fillEmail(email + '\n');
    await this.fillPassword(password + '\n');
  }

  public async fillEmail(email: string): Promise<void> {
    await Element.byId(SignInScreenIds.EMAIL_INPUT).replaceText(email);
  }

  public async fillPassword(password: string): Promise<void> {
    await Element.byId(SignInScreenIds.PASSWORD_INPUT).replaceText(password);
  }

  public async pressSignInButton(): Promise<void> {
    await Element.byId(SignInScreenIds.SIGN_IN_BTN).tap();
  }

  public async navigateToSignUpScreen(): Promise<void> {
    await Element.byId(SignInScreenIds.SIGN_UP_BTN).tap();
  }

  public async navigateToForgotPasswordScreen(): Promise<void> {
    await Element.byId(SignInScreenIds.FORGOT_PASSWORD_BTN).tap();
  }
}

export const signInScreen = new SignInScreen();
