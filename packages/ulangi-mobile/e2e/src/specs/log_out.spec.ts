import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { welcomeScreen } from "../screen-objects/WelcomeScreen";
import { signInScreen } from '../screen-objects/SignInScreen';
import { signUpScreen } from '../screen-objects/SignUpScreen';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';

describe('Log-out', (): void => {
  describe('Tests start at ManageScreen', (): void => {
    let email;
    let password;
    beforeEach(
      async (): Promise<void> => {
        email = generateRandomEmail();
        password = generateRandomPassword();
        await welcomeScreen.tapNo();
        await signInScreen.navigateToSignUpScreen();
        await signUpScreen.signUp(email, password, password);
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Japanese',
          'English'
        );
      }
    );

    it('navigate to more screen to log out then log back in', async (): Promise<
      void
    > => {
      await manageScreen.navigateToMoreScreen();
      await moreScreen.logOut();
      await welcomeScreen.tapNo();
      await signInScreen.logIn(email, password);
      await manageScreen.expectToExist();
    });
  });
});
