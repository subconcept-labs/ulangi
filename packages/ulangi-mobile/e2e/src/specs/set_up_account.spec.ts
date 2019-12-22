import * as config from '../../e2e.config.js';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { setUpAccountScreen } from '../screen-objects/SetUpAccountScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { signInScreen } from '../screen-objects/SignInScreen';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';

describe('Set up account', (): void => {
  describe('Tests start at SetUpAccountScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Korean',
          'English'
        );
        await manageScreen.navigateToMoreScreen();
        await moreScreen.navigateToSetUpAccountScreen();
      }
    );

    it('set up account failed due to invalid email', async (): Promise<
      void
    > => {
      await setUpAccountScreen.fillNewEmail('invalidnewemail');
      await setUpAccountScreen.fillPassword('12345678');
      await setUpAccountScreen.fillConfirmPassword('12345678');
      await setUpAccountScreen.submit();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('set up account failed because guest domain is used', async (): Promise<
      void
    > => {
      const email = 'test' + config.guestEmailDomain;
      const password = generateRandomPassword();
      await setUpAccountScreen.fillNewEmail(email);
      await setUpAccountScreen.fillPassword(password);
      await setUpAccountScreen.fillConfirmPassword(password);
      await setUpAccountScreen.submit();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('set up account failed due to password mismatch', async (): Promise<
      void
    > => {
      const email = generateRandomEmail();
      await setUpAccountScreen.fillNewEmail(email);
      await setUpAccountScreen.fillPassword('password1');
      await setUpAccountScreen.fillConfirmPassword('password2');
      await setUpAccountScreen.submit();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('set up account successfully', async (): Promise<void> => {
      const newEmail = generateRandomEmail();
      const password = generateRandomPassword();
      await setUpAccountScreen.fillNewEmail(newEmail);
      await setUpAccountScreen.fillPassword(password);
      await setUpAccountScreen.fillConfirmPassword(password);
      await setUpAccountScreen.submit();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();

      // Make sure we can log back in
      await moreScreen.logOut();
      await welcomeScreen.tapNo();
      await signInScreen.logIn(newEmail, password);
    });
  });
});
