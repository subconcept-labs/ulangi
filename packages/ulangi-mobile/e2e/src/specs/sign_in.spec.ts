import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { signInScreen } from '../screen-objects/SignInScreen';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { signUpRemotely } from '../utils/signUpRemotely';

describe('Sign-in.', (): void => {
  describe('Tests start and end at WelcomeScreen', (): void => {
    it('sign in failed because user is not registered', async (): Promise<
      void
    > => {
      const email = generateRandomEmail();
      const password = generateRandomPassword();

      await signInScreen.logIn(email, password);
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('sign in as guest successfully', async (): Promise<void> => {
      await welcomeScreen.tapYes();
      await createFirstSetScreen.logOut();
      await welcomeScreen.expectToExist();
    });

    it('sign in with registered account by pressing return key', async (): Promise<
      void
    > => {
      const email = generateRandomEmail();
      const password = generateRandomPassword();

      await signUpRemotely(email, password);
      await signInScreen.fillEmail(email + '\n');
      await signInScreen.fillPassword(password + '\n');

      await createFirstSetScreen.logOut();
      await welcomeScreen.expectToExist();
    });

    it('sign in with registered account successfully by pressing sign in button', async (): Promise<
      void
    > => {
      const email = generateRandomEmail();
      const password = generateRandomPassword();
      await signUpRemotely(email, password);

      await signInScreen.fillEmail(email);
      await signInScreen.fillPassword(password);
      await signInScreen.pressSignInButton();

      await createFirstSetScreen.logOut();
      await welcomeScreen.expectToExist();
    });
  });
});
