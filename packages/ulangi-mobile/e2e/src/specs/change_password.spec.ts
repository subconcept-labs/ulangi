import { changePasswordScreen } from '../screen-objects/ChangePasswordScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { securityScreen } from '../screen-objects/SecurityScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { signInScreen } from '../screen-objects/SignInScreen';
import { signUpScreen } from '../screen-objects/SignUpScreen';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';

describe('Change password', (): void => {
  describe('Tests start at ChangePasswordScreen', (): void => {
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
        await securityScreen.navigateToChangePasswordScreen();
      }
    );

    it('change password failed due to password too short', async (): Promise<
      void
    > => {
      await changePasswordScreen.fillNewPassword('123');
      await changePasswordScreen.fillConfirmPassword('123');
      await changePasswordScreen.fillCurrentPassword(password);
      await changePasswordScreen.save();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('change email failed due to password mismatched', async (): Promise<
      void
    > => {
      await changePasswordScreen.fillNewPassword(generateRandomPassword());
      await changePasswordScreen.fillConfirmPassword(generateRandomPassword());
      await changePasswordScreen.fillCurrentPassword(password);
      await changePasswordScreen.save();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('change password successfully', async (): Promise<void> => {
      const newPassword = generateRandomPassword();
      await changePasswordScreen.fillNewPassword(newPassword);
      await changePasswordScreen.fillConfirmPassword(newPassword);
      await changePasswordScreen.fillCurrentPassword(password);
      await changePasswordScreen.save();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();

      // Make sure we can log back in
      await securityScreen.back();
      await moreScreen.logOut();
      await welcomeScreen.tapNo();
      await signInScreen.logIn(email, newPassword);
      await manageScreen.expectToExist();
    });
  });
});
