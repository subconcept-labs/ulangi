import { device } from '../adapters/device';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { moreScreen } from '../screen-objects/MoreScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { signInScreen } from "../screen-objects/SignInScreen";
import { signUpScreen } from '../screen-objects/SignUpScreen';
import { changeEmailRemotely } from '../utils/changeEmailRemotely';
import { changePasswordRemotely } from '../utils/changePasswordRemotely';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { signInRemotely } from '../utils/signInRemotely';

describe('Session-expired', (): void => {
  describe('Tests start and end at WelcomeScreen', (): void => {
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
          'Spanish',
          'English'
        );
      }
    );

    it('change email remotely, then restart app and it should display session expired', async (): Promise<
      void
    > => {
      const response = await signInRemotely(email, password);
      const newEmail = generateRandomEmail();
      const accessToken = response.data.accessToken;

      await changeEmailRemotely(newEmail, password, accessToken);
      await device.restartApp();

      await moreScreen.expectSessionExpiredDialogToExist();
      await lightBoxDialog.close();
      await welcomeScreen.expectToExist();
    });

    it('change password remotely, then restart app and it should display session expired', async (): Promise<
      void
    > => {
      const response = await signInRemotely(email, password);
      const accessToken = response.data.accessToken;
      const newPassword = generateRandomPassword();

      await changePasswordRemotely(newPassword, password, accessToken);
      await device.restartApp();

      await moreScreen.expectSessionExpiredDialogToExist();
      await lightBoxDialog.close();
      await welcomeScreen.expectToExist();
    });
  });
});
