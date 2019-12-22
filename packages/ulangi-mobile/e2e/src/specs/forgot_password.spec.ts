import { forgotPasswordScreen } from '../screen-objects/ForgotPasswordScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { signInScreen } from '../screen-objects/SignInScreen';
import { generateRandomEmail } from '../utils/generateRandomEmail';

describe('Forgot password', (): void => {
  describe('Tests start and end at ForgotPasswordScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapNo();
        await signInScreen.navigateToForgotPasswordScreen();
      }
    );

    it('navigate to sign in screen and back to forgot password screen', async (): Promise<
      void
    > => {
      await forgotPasswordScreen.navigateToSignInScreen();
      await signInScreen.navigateToForgotPasswordScreen();
      await forgotPasswordScreen.expectToExist();
    });

    it('submit reset request failed because email is not registered', async (): Promise<
      void
    > => {
      await forgotPasswordScreen.fillEmail(generateRandomEmail());
      await forgotPasswordScreen.submit();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('submit reset request successfuly', async (): Promise<void> => {
      await forgotPasswordScreen.fillEmail('test@ulangi.com');
      await forgotPasswordScreen.submit();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
    });
  });
});
