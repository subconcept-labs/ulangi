import { VocabularyFilterType } from '@ulangi/ulangi-common/enums';

import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { spacedRepetitionLessonScreen } from '../screen-objects/SpacedRepetitionLessonScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';
import { learnScreen } from '../screen-objects/learnScreen';
import { spacedRepetitionScreen } from '../screen-objects/spacedRepetitionScreen';

describe('Filter due categories by Spaced Repetition', (): void => {
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

    it('filter due categories by spaced repetition in ManageScreen', async (): Promise<
      void
    > => {
      await manageScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_SPACED_REPETITION
      );
      await manageScreen.expectCategoryToExist('Uncategorized');
    });

    it('should not show due categories in ManageScreen after completing the lesson', async (): Promise<
      void
    > => {
      await manageScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_SPACED_REPETITION
      );
      await manageScreen.expectCategoryToExist('Uncategorized');

      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToSpacedRepetitionScreen();
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
      await spacedRepetitionLessonScreen.autoCompleteReview();
      await spacedRepetitionLessonScreen.quit();
      await spacedRepetitionScreen.back();
      await learnScreen.navigateToManageScreen();
      await manageScreen.showCategoryList();
      await manageScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_SPACED_REPETITION
      );
      await manageScreen.expectCategoryToNotExist('Uncategorized');
    });
  });
});
