import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { learnScreen } from '../screen-objects/LearnScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { quizScreen } from '../screen-objects/QuizScreen';
import { quizSettingsScreen } from '../screen-objects/QuizSettingsScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { signInScreen } from '../screen-objects/SignInScreen';
import { signUpScreen } from '../screen-objects/SignUpScreen';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';

describe('Quiz settings', (): void => {
  describe('Tests start at QuizScreen', (): void => {
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
        await learnScreen.navigateToQuizScreen();
      }
    );

    it('navigate to QuizSettingsScreen and back', async (): Promise<void> => {
      await quizScreen.navigateToQuizSettingsScreen();
      await quizSettingsScreen.back();
      await quizSettingsScreen.expectToNotExist();
    });

    it('change vocabulary pool successfully', async (): Promise<void> => {
      await quizScreen.navigateToQuizSettingsScreen();

      await quizSettingsScreen.changeVocabularyPool('Active');
      await quizSettingsScreen.expectToHaveVocabularyPool('Active');
      await quizSettingsScreen.save();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
    });

    it('saved settings should persist after logged out', async (): Promise<
      void
    > => {
      await quizScreen.navigateToQuizSettingsScreen();
      await quizSettingsScreen.changeVocabularyPool('Active');
      await quizSettingsScreen.expectToHaveVocabularyPool('Active');
      await quizSettingsScreen.save();
      await lightBoxDialog.close();

      await quizScreen.back();
      await learnScreen.navigateToMoreScreen();
      await moreScreen.logOut();
      await welcomeScreen.tapNo();
      await signInScreen.logIn(email, password);
      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToQuizScreen();
      await quizScreen.navigateToQuizSettingsScreen();
      await quizSettingsScreen.changeVocabularyPool('Active');
      await quizSettingsScreen.expectToHaveVocabularyPool('Active');
    });
  });
});
