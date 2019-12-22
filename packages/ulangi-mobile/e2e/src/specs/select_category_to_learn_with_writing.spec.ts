import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { writingLessonScreen } from '../screen-objects/WritingLessonScreen';
import { writingScreen } from '../screen-objects/WritingScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';

describe('Select category to learn with Writing', (): void => {
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

    it('select Uncategorized to learn with writing', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.learnCategoryWithWriting('Uncategorized');
      await writingScreen.navigateToWritingLessonScreen();
      await writingLessonScreen.expectToExist();
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

    it('select Animals to learn with writing', async (): Promise<void> => {
      await manageScreen.showCategoryList();
      await manageScreen.learnCategoryWithWriting('Animals');
      await writingScreen.navigateToWritingLessonScreen();
      await writingLessonScreen.expectToExist();
    });
  });

  describe(`Test starts at ManageScreen after adding multiple Number and Animals terms`, (): void => {
    const vocabularyList = [
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

    it('select Numbers to learn with writing but cannot take another lesson because not enough terms', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.learnCategoryWithWriting('Numbers');
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
      await manageScreen.learnCategoryWithWriting('Numbers');
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
