import * as config from '../../e2e.config.js';
import { changeEmailScreen } from '../screen-objects/ChangeEmailScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { securityScreen } from '../screen-objects/SecurityScreen';
import { welcomeScreen } from "../screen-objects/WelcomeScreen";
import { signInScreen } from '../screen-objects/SignInScreen';
import { signUpScreen } from '../screen-objects/SignUpScreen';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';

describe('Change email', (): void => {
  describe('Tests start at ChangeEmailScreen', (): void => {
    let email, password;
    beforeEach(
      async (): Promise<void> => {
        email = generateRandomEmail();
        password = generateRandomPassword();
        await welcomeScreen.tapNo();
        await signInScreen.navigateToSignUpScreen();
        await signUpScreen.signUp(email, password, password);
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Korean',
          'English'
        );
        await manageScreen.navigateToMoreScreen();
        await moreScreen.navigateToSecurityScreen();
        await securityScreen.navigateToChangeEmailScreen();
      }
    );

    it('change email failed due to invalid email', async (): Promise<void> => {
      await changeEmailScreen.fillNewEmail('invalidnewemail');
      await changeEmailScreen.fillCurrentPassword(password);
      await changeEmailScreen.save();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('change email failed because guest domain is used', async (): Promise<
      void
    > => {
      await changeEmailScreen.fillNewEmail('test' + config.guestEmailDomain);
      await changeEmailScreen.fillCurrentPassword(password);
      await changeEmailScreen.save();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('change email failed due to password is not correct', async (): Promise<
      void
    > => {
      await changeEmailScreen.fillNewEmail(generateRandomEmail());
      await changeEmailScreen.fillCurrentPassword('invalidpassword');
      await changeEmailScreen.save();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('change email successfully', async (): Promise<void> => {
      const newEmail = generateRandomEmail();
      await changeEmailScreen.fillNewEmail(newEmail);
      await changeEmailScreen.fillCurrentPassword(password);
      await changeEmailScreen.save();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();

      // Make sure we can log back in
      await securityScreen.back();
      await moreScreen.logOut();
      await welcomeScreen.tapNo();
      await signInScreen.logIn(newEmail, password);
    });
  });
});
