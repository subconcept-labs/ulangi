import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { learnScreen } from '../screen-objects/LearnScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { quizMultipleChoiceScreen } from '../screen-objects/QuizMultipleChoiceScreen';
import { quizScreen } from '../screen-objects/QuizScreen';
import { quizSettingsScreen } from '../screen-objects/QuizSettingsScreen';
import { welcomeScreen } from '../screen-objects/welcomeScreen';

describe('Quiz multiple choice minimum required', (): void => {
  describe('Tests start at ManageScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'English',
          'English'
        );
      }
    );

    it('cannot start quiz if only has two terms', async (): Promise<void> => {
      await manageScreen.navigateToAddVocabularyScreen();
      await addVocabularyScreen.fillAndSaveMultpleTerms([
        {
          vocabularyText: 'vocabulary 1',
          definitions: ['meaning 1'],
        },
        {
          vocabularyText: 'vocabulary 2',
          definitions: ['meaning 2'],
        },
      ]);
      await lightBoxDialog.close();
      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToQuizScreen();

      await quizScreen.navigateToQuizSettingsScreen();
      await quizSettingsScreen.changeVocabularyPool('Active');
      await quizSettingsScreen.expectToHaveVocabularyPool('Active');
      await quizSettingsScreen.save();
      await lightBoxDialog.close();

      await quizScreen.navigateToQuizMultipleChoiceScreen();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('can start quiz if it has three terms', async (): Promise<void> => {
      await manageScreen.navigateToAddVocabularyScreen();
      await addVocabularyScreen.fillAndSaveMultpleTerms([
        {
          vocabularyText: 'vocabulary 1',
          definitions: ['meaning 1'],
        },
        {
          vocabularyText: 'vocabulary 2',
          definitions: ['meaning 2'],
        },
        {
          vocabularyText: 'vocabulary 3',
          definitions: ['meaning 3'],
        },
      ]);
      await lightBoxDialog.close();
      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToQuizScreen();

      await quizScreen.navigateToQuizSettingsScreen();
      await quizSettingsScreen.changeVocabularyPool('Active');
      await quizSettingsScreen.expectToHaveVocabularyPool('Active');
      await quizSettingsScreen.save();
      await lightBoxDialog.close();

      await quizScreen.navigateToQuizMultipleChoiceScreen();
      await quizMultipleChoiceScreen.expectToExist();
      await quizMultipleChoiceScreen.back();
      await quizMultipleChoiceScreen.expectToNotExist();
    });
  });
});
