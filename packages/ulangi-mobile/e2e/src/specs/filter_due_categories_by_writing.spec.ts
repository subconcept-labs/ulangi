import { VocabularyFilterType } from '@ulangi/ulangi-common/enums';

import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { writingLessonScreen } from '../screen-objects/WritingLessonScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';
import { learnScreen } from '../screen-objects/learnScreen';
import { writingScreen } from '../screen-objects/writingScreen';

describe('Filter due categories by Writing', (): void => {
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

    it('filter due vocabulary by spaced repetition in ManageScreen', async (): Promise<
      void
    > => {
      await manageScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_WRITING
      );
      await manageScreen.expectCategoryToExist('Uncategorized');
    });

    it('should not show due vocabulary in ManageScreen after completing the lesson', async (): Promise<
      void
    > => {
      await manageScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_WRITING
      );
      await manageScreen.expectCategoryToExist('Uncategorized');

      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToWritingScreen();
      await writingScreen.navigateToWritingLessonScreen();
      await writingLessonScreen.autoAnswerAndSelectFeedbackForAll(
        vocabularyList
      );
      await writingLessonScreen.quit();
      await writingScreen.back();
      await learnScreen.navigateToManageScreen();
      await manageScreen.showCategoryList();
      await manageScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DUE_BY_WRITING
      );
      await manageScreen.expectCategoryToNotExist('Uncategorized');
    });
  });
});
