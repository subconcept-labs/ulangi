import { SignUpScreenIds } from '../../../src/constants/Ids/SignUpScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class SignUpScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(SignUpScreenIds.SCREEN);
  }

  public async signUp(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    await this.fillSignUp(
      email + '\n',
      password + '\n',
      confirmPassword + '\n'
    );
  }

  public async fillSignUp(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(confirmPassword);
  }

  public async fillEmail(email: string): Promise<void> {
    await Element.byId(SignUpScreenIds.EMAIL_INPUT).replaceText(email);
  }

  public async fillPassword(password: string): Promise<void> {
    await Element.byId(SignUpScreenIds.PASSWORD_INPUT).replaceText(password);
  }

  public async fillConfirmPassword(confirmPassword: string): Promise<void> {
    await Element.byId(SignUpScreenIds.CONFIRM_PASSWORD_INPUT).replaceText(
      confirmPassword
    );
  }

  public async pressSignUpButton(): Promise<void> {
    await Element.byId(SignUpScreenIds.SIGN_UP_BTN).tap();
  }

  public async navigateToSignInScreen(): Promise<void> {
    await Element.byId(SignUpScreenIds.BACK_BTN).tap();
  }
}

export const signUpScreen = new SignUpScreen();
