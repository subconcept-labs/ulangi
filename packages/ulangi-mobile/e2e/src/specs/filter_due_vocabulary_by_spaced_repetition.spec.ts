import { VocabularyFilterType } from '@ulangi/ulangi-common/enums';

import { categoryDetailScreen } from '../screen-objects/CategoryDetailScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { spacedRepetitionLessonScreen } from '../screen-objects/SpacedRepetitionLessonScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';
import { learnScreen } from '../screen-objects/learnScreen';
import { spacedRepetitionScreen } from '../screen-objects/spacedRepetitionScreen';

describe('Filter due vocabulary by Spaced Repetition', (): void => {
  describe(`Test starts at ManageScreen after adding one vocabulary`, (): void => {
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
        ]);
        await lightBoxDialog.close();
      }
    );

    it('filter due vocabulary by spaced repetition in ManageScreen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_SPACED_REPETITION
      );
      await manageScreen.expectVocabularyToExist('vocabulary 1');
      await manageScreen.expectVocabularyToExist('vocabulary 2');
    });

    it('filter due category by spaced repetition in ManageScreen and view due vocabulary of the category', async (): Promise<
      void
    > => {
      await manageScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_SPACED_REPETITION
      );
      await manageScreen.viewCategoryDetail('Uncategorized');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 2');
    });

    it('filter due vocabulary by spaced repetition in CategoryDetailScreen', async (): Promise<
      void
    > => {
      await manageScreen.viewCategoryDetail('Uncategorized');
      await categoryDetailScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_SPACED_REPETITION
      );
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 2');
    });

    it('should not show due vocabulary in ManageScreen after completing the lesson', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_SPACED_REPETITION
      );
      await manageScreen.expectVocabularyToExist('vocabulary 1');
      await manageScreen.expectVocabularyToExist('vocabulary 2');

      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToSpacedRepetitionScreen();
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
      await spacedRepetitionLessonScreen.autoCompleteReview();
      await spacedRepetitionLessonScreen.quit();
      await spacedRepetitionScreen.back();
      await learnScreen.navigateToManageScreen();
      await manageScreen.showVocabularyList();
      await manageScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_SPACED_REPETITION
      );
      await manageScreen.expectVocabularyToNotExist('vocabulary 1');
      await manageScreen.expectVocabularyToNotExist('vocabulary 2');
    });

    it('should not show due vocabulary in CategoryDetailScreen after completing the lesson', async (): Promise<
      void
    > => {
      await manageScreen.viewCategoryDetail('Uncategorized');
      await categoryDetailScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_SPACED_REPETITION
      );
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 2');
      await categoryDetailScreen.back();

      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToSpacedRepetitionScreen();
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
      await spacedRepetitionLessonScreen.autoCompleteReview();
      await spacedRepetitionLessonScreen.quit();
      await spacedRepetitionScreen.back();
      await learnScreen.navigateToManageScreen();
      await manageScreen.showCategoryList();
      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.ACTIVE);
      await manageScreen.viewCategoryDetail('Uncategorized');
      await categoryDetailScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_SPACED_REPETITION
      );
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 2');
    });
  });
});
