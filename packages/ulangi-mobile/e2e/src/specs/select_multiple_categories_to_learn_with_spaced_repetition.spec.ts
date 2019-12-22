import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { spacedRepetitionLessonScreen } from '../screen-objects/SpacedRepetitionLessonScreen';
import { spacedRepetitionScreen } from '../screen-objects/SpacedRepetitionScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';

describe('Select multiple categories to learn with Spaced Repetition', (): void => {
  describe(`Test starts at ManageScreen after adding multiple terms with different categories`, (): void => {
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

    it('select multiple categories to learn with spaced repetition', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.selectCategory('Uncategorized');
      await manageScreen.selectCategory('Numbers');
      await manageScreen.selectCategory('Animals');
      await manageScreen.learnSelectedCategoriesWithSpacedRepetition();
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
      await spacedRepetitionLessonScreen.expectToExist();
    });

    it('select multiple categories to learn with spaced repetition but cannot take another lesson because not enough terms', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.selectCategory('Uncategorized');
      await manageScreen.selectCategory('Numbers');
      await manageScreen.selectCategory('Animals');
      await manageScreen.learnSelectedCategoriesWithSpacedRepetition();
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
      await spacedRepetitionLessonScreen.autoCompleteReview();
      await spacedRepetitionLessonScreen.takeAnotherLesson();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.cancel();
      await spacedRepetitionLessonScreen.expectToNotExist();
    });

    it('select multiple terms to learn with spaced repetition then take another lesson by including terms from other categories', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.selectCategory('Uncategorized');
      await manageScreen.selectCategory('Numbers');
      await manageScreen.learnSelectedCategoriesWithSpacedRepetition();
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
      await spacedRepetitionLessonScreen.autoCompleteReview();
      await spacedRepetitionLessonScreen.takeAnotherLesson();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.okay();
      await spacedRepetitionLessonScreen.expectToExist();
    });
  });
});
