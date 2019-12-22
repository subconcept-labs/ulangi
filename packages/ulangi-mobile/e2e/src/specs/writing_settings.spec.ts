import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { learnScreen } from '../screen-objects/LearnScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { signInScreen } from '../screen-objects/SignInScreen';
import { signUpScreen } from '../screen-objects/SignUpScreen';
import { writingScreen } from '../screen-objects/WritingScreen';
import { writingSettingsScreen } from '../screen-objects/WritingSettingsScreen';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';

describe('Writing settings', (): void => {
  describe('Tests start at WritingScreen', (): void => {
    let email, password;
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
        await manageScreen.navigateToLearnScreen();
        await learnScreen.navigateToWritingScreen();
      }
    );

    it('navigate to WritingSettingsScreen and back', async (): Promise<
      void
    > => {
      await writingScreen.navigateToWritingSettingsScreen();
      await writingSettingsScreen.back();
      await writingSettingsScreen.expectToNotExist();
    });

    it('change interval successfully', async (): Promise<void> => {
      await writingScreen.navigateToWritingSettingsScreen();

      await writingSettingsScreen.changeInterval(6);
      await writingSettingsScreen.expectToHaveInterval(6);
      await writingSettingsScreen.save();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
    });

    it('saved settings should persist after logged out', async (): Promise<
      void
    > => {
      await writingScreen.navigateToWritingSettingsScreen();
      await writingSettingsScreen.changeInterval(6);
      await writingSettingsScreen.expectToHaveInterval(6);
      await writingSettingsScreen.save();
      await lightBoxDialog.close();

      await writingScreen.back();
      await learnScreen.navigateToMoreScreen();
      await moreScreen.logOut();
      await welcomeScreen.tapNo();
      await signInScreen.logIn(email, password);
      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToWritingScreen();
      await writingScreen.navigateToWritingSettingsScreen();
      await writingSettingsScreen.expectToHaveInterval(6);
    });
  });
});
