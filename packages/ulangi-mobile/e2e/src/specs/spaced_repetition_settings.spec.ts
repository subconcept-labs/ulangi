import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { learnScreen } from '../screen-objects/LearnScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { signInScreen } from '../screen-objects/SignInScreen';
import { signUpScreen } from '../screen-objects/SignUpScreen';
import { spacedRepetitionScreen } from '../screen-objects/SpacedRepetitionScreen';
import { spacedRepetitionSettingsScreen } from '../screen-objects/SpacedRepetitionSettingsScreen';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';

describe('Spaced repetition settings', (): void => {
  describe('Tests start at SpacedRepetitionScreen', (): void => {
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
        await learnScreen.navigateToSpacedRepetitionScreen();
      }
    );

    it('navigate to SpacedRepetitionSettingsScreen and back', async (): Promise<
      void
    > => {
      await spacedRepetitionScreen.navigateToSpacedRepetitionSettingsScreen();
      await spacedRepetitionSettingsScreen.back();
      await spacedRepetitionSettingsScreen.expectToNotExist();
    });

    it('change interval successfully', async (): Promise<void> => {
      await spacedRepetitionScreen.navigateToSpacedRepetitionSettingsScreen();

      await spacedRepetitionSettingsScreen.changeInterval(6);
      await spacedRepetitionSettingsScreen.expectToHaveInterval(6);
      await spacedRepetitionSettingsScreen.save();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
    });

    it('saved settings should persist after logged out', async (): Promise<
      void
    > => {
      await spacedRepetitionScreen.navigateToSpacedRepetitionSettingsScreen();
      await spacedRepetitionSettingsScreen.changeInterval(6);
      await spacedRepetitionSettingsScreen.expectToHaveInterval(6);
      await spacedRepetitionSettingsScreen.save();
      await lightBoxDialog.close();

      await spacedRepetitionScreen.back();
      await learnScreen.navigateToMoreScreen();
      await moreScreen.logOut();
      await welcomeScreen.tapNo();
      await signInScreen.logIn(email, password);
      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToSpacedRepetitionScreen();
      await spacedRepetitionScreen.navigateToSpacedRepetitionSettingsScreen();
      await spacedRepetitionSettingsScreen.expectToHaveInterval(6);
    });
  });
});
