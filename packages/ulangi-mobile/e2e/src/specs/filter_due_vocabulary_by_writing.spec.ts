import { VocabularyFilterType } from '@ulangi/ulangi-common/enums';

import { categoryDetailScreen } from '../screen-objects/CategoryDetailScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { writingLessonScreen } from '../screen-objects/WritingLessonScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';
import { learnScreen } from '../screen-objects/learnScreen';
import { writingScreen } from '../screen-objects/writingScreen';

describe('Filter due vocabulary by Writing', (): void => {
  describe(`Test starts at ManageScreen after adding one vocabulary`, (): void => {
    const vocabularyList = [
      {
        vocabularyText: 'vocabulary 1',
        definitions: ['meaning 1'],
      },
      {
        vocabularyText: 'vocabulary 2',
        definitions: ['meaning 2'],
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

    it('filter due vocabulary by writing in ManageScreen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_WRITING
      );
      await manageScreen.expectVocabularyToExist('vocabulary 1');
      await manageScreen.expectVocabularyToExist('vocabulary 2');
    });

    it('filter due category by writing in ManageScreen and view due vocabulary of the category', async (): Promise<
      void
    > => {
      await manageScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_WRITING
      );
      await manageScreen.viewCategoryDetail('Uncategorized');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 2');
    });

    it('filter due vocabulary by writing in CategoryDetailScreen', async (): Promise<
      void
    > => {
      await manageScreen.viewCategoryDetail('Uncategorized');
      await categoryDetailScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_WRITING
      );
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 2');
    });

    it('should not show due vocabulary in ManageScreen after completing the lesson', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_WRITING
      );
      await manageScreen.expectVocabularyToExist('vocabulary 1');
      await manageScreen.expectVocabularyToExist('vocabulary 2');

      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToWritingScreen();
      await writingScreen.navigateToWritingLessonScreen();
      await writingLessonScreen.autoAnswerAndSelectFeedbackForAll(
        vocabularyList
      );
      await writingLessonScreen.quit();
      await writingScreen.back();
      await learnScreen.navigateToManageScreen();
      await manageScreen.showVocabularyList();
      await manageScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_WRITING
      );
      await manageScreen.expectVocabularyToNotExist('vocabulary 1');
      await manageScreen.expectVocabularyToNotExist('vocabulary 2');
    });

    it('should not show due vocabulary in CategoryDetailScreen after completing the lesson', async (): Promise<
      void
    > => {
      await manageScreen.viewCategoryDetail('Uncategorized');
      await categoryDetailScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_WRITING
      );
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 2');
      await categoryDetailScreen.back();

      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToWritingScreen();
      await writingScreen.navigateToWritingLessonScreen();
      await writingLessonScreen.autoAnswerAndSelectFeedbackForAll(
        vocabularyList
      );
      await writingLessonScreen.quit();
      await writingScreen.back();
      await learnScreen.navigateToManageScreen();
      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.ACTIVE);
      await manageScreen.viewCategoryDetail('Uncategorized');
      await categoryDetailScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_WRITING
      );
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 2');
    });
  });
});
