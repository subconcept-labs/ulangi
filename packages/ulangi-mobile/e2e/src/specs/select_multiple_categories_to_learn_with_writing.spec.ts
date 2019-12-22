import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { writingLessonScreen } from '../screen-objects/WritingLessonScreen';
import { writingScreen } from '../screen-objects/WritingScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';

describe('Select multpile categories to learn with Writing', (): void => {
  describe(`Test starts at ManageScreen after adding multiple terms with different categories`, (): void => {
    const vocabularyList = [
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
    ];

    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Japanese',
          'English'
        );
        await manageScreen.navigateToAddVocabularyScreen();
        await addVocabularyScreen.fillAndSaveMultpleTerms(vocabularyList);
        await lightBoxDialog.close();
      }
    );

    it('select multiple categories to learn with writing', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.selectCategory('Uncategorized');
      await manageScreen.selectCategory('Numbers');
      await manageScreen.selectCategory('Animals');
      await manageScreen.learnSelectedCategoriesWithWriting();
      await writingScreen.navigateToWritingLessonScreen();
      await writingLessonScreen.expectToExist();
    });

    it('select multiple categories to learn with writing but cannot take another lesson because not enough terms', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.selectCategory('Uncategorized');
      await manageScreen.selectCategory('Numbers');
      await manageScreen.selectCategory('Animals');
      await manageScreen.learnSelectedCategoriesWithWriting();
      await writingScreen.navigateToWritingLessonScreen();
      await writingLessonScreen.autoAnswerAndSelectFeedbackForAll(
        vocabularyList
      );
      await writingLessonScreen.takeAnotherLesson();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.cancel();
      await writingLessonScreen.expectToNotExist();
    });

    it('select Numbers to learn with writing then take another lesson by including terms from other categories', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.selectCategory('Uncategorized');
      await manageScreen.selectCategory('Numbers');
      await manageScreen.learnSelectedCategoriesWithWriting();
      await writingScreen.navigateToWritingLessonScreen();
      await writingLessonScreen.autoAnswerAndSelectFeedbackForAll(
        vocabularyList
      );
      await writingLessonScreen.takeAnotherLesson();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.okay();
      await writingLessonScreen.expectToExist();
    });
  });
});
