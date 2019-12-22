import * as config from '../../e2e.config.js';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { signInScreen } from '../screen-objects/SignInScreen';
import { signUpScreen } from '../screen-objects/SignUpScreen';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';

describe('Sign-up', (): void => {
  describe('Tests start at SignUpScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapNo();
        await signInScreen.navigateToSignUpScreen();
      }
    );

    it('sign up failed because email is valid', async (): Promise<void> => {
      const password = generateRandomPassword();
      await signUpScreen.signUp('invalidemail', password, password);
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('sign up failed because guest domain is used', async (): Promise<
      void
    > => {
      const email = 'test' + config.guestEmailDomain;
      const password = generateRandomPassword();
      await signUpScreen.signUp(email, password, password);
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('sign up failed because password and confirm password is mismatched', async (): Promise<
      void
    > => {
      await signUpScreen.signUp(
        generateRandomEmail(),
        generateRandomPassword(),
        generateRandomPassword()
      );
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('sign up failed because password is too short', async (): Promise<
      void
    > => {
      await signUpScreen.signUp('invalidemail', '12345', '12345');
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('sign up successfully then log back in using the same credential', async (): Promise<
      void
    > => {
      const email = generateRandomEmail();
      const password = generateRandomPassword();

      await signUpScreen.signUp(email, password, password);
      await createFirstSetScreen.logOut();

      await welcomeScreen.tapNo();
      await signInScreen.logIn(email, password);
      await createFirstSetScreen.expectToExist();
    });
  });
});
