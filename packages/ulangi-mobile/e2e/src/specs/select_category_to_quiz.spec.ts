import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { quizMultipleChoiceScreen } from '../screen-objects/QuizMultipleChoiceScreen';
import { quizScreen } from '../screen-objects/QuizScreen';
import { quizSettingsScreen } from '../screen-objects/QuizSettingsScreen';
import { quizWritingScreen } from '../screen-objects/QuizWritingScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';

describe('Select category to quiz', (): void => {
  describe(`Test starts at ManageScreen after adding multiple Uncategorized terms`, (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Japanese',
          'English'
        );
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
      }
    );

    it('select Uncategorized to quiz', async (): Promise<void> => {
      await manageScreen.showCategoryList();
      await manageScreen.quizCategory('Uncategorized');
      await quizScreen.navigateToQuizSettingsScreen();
      await quizSettingsScreen.changeVocabularyPool('Active');
      await quizSettingsScreen.save();
      await lightBoxDialog.close();
      await quizScreen.navigateToQuizWritingScreen();
      await quizWritingScreen.expectToExist();
      await quizWritingScreen.back();
      await quizScreen.navigateToQuizMultipleChoiceScreen();
      await quizMultipleChoiceScreen.expectToExist();
    });
  });

  describe(`Test starts at ManageScreen after adding multiple Animals terms`, (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Japanese',
          'English'
        );
        await manageScreen.navigateToAddVocabularyScreen();
        await addVocabularyScreen.fillAndSaveMultpleTerms([
          {
            vocabularyText: 'vocabulary 1',
            definitions: ['meaning 1'],
            category: 'Animals',
          },
          {
            vocabularyText: 'vocabulary 2',
            definitions: ['meaning 2'],
            category: 'Animals',
          },
          {
            vocabularyText: 'vocabulary 3',
            definitions: ['meaning 3'],
            category: 'Animals',
          },
        ]);
        await lightBoxDialog.close();
      }
    );

    it('select Animals to quiz', async (): Promise<void> => {
      await manageScreen.showCategoryList();
      await manageScreen.quizCategory('Animals');
      await quizScreen.navigateToQuizSettingsScreen();
      await quizSettingsScreen.changeVocabularyPool('Active');
      await quizSettingsScreen.save();
      await lightBoxDialog.close();
      await quizScreen.navigateToQuizWritingScreen();
      await quizWritingScreen.expectToExist();
      await quizWritingScreen.back();
      await quizScreen.navigateToQuizMultipleChoiceScreen();
      await quizMultipleChoiceScreen.expectToExist();
    });
  });

  describe(`Test starts at ManageScreen after adding multiple Number and Animals terms`, (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Japanese',
          'English'
        );
        await manageScreen.navigateToAddVocabularyScreen();
        await addVocabularyScreen.fillAndSaveMultpleTerms([
          {
            vocabularyText: 'vocabulary 1',
            definitions: ['meaning 1'],
            category: 'Numbers',
          },
          {
            vocabularyText: 'vocabulary 2',
            definitions: ['meaning 2'],
            category: 'Numbers',
          },
          {
            vocabularyText: 'vocabulary 3',
            definitions: ['meaning 3'],
            category: 'Animals',
          },
        ]);
        await lightBoxDialog.close();
      }
    );

    it('select Numbers for multiple choice quiz but failed because not enough terms', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.quizCategory('Numbers');
      await quizScreen.navigateToQuizSettingsScreen();
      await quizSettingsScreen.changeVocabularyPool('Active');
      await quizSettingsScreen.save();
      await lightBoxDialog.close();
      await quizScreen.navigateToQuizMultipleChoiceScreen();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });
  });
});
