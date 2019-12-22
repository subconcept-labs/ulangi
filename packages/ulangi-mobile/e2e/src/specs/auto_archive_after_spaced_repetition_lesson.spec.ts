import { VocabularyFilterType } from '@ulangi/ulangi-common/enums';

import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { autoArchiveScreen } from '../screen-objects/AutoArchiveScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { learnScreen } from '../screen-objects/LearnScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { spacedRepetitionLessonScreen } from '../screen-objects/SpacedRepetitionLessonScreen';
import { spacedRepetitionScreen } from '../screen-objects/SpacedRepetitionScreen';

describe('Auto archive after a spaced repetition lesson', (): void => {
  describe('Test starts at ManageScreen after adding three terms', (): void => {
    const vocabularyList = [
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
    ];
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'English',
          'English'
        );
        await manageScreen.navigateToAddVocabularyScreen();
        await addVocabularyScreen.fillAndSaveMultpleTerms(vocabularyList);
        await lightBoxDialog.close();
      }
    );

    it('auto archive if the conditions are met', async (): Promise<void> => {
      await manageScreen.navigateToMoreScreen();
      await moreScreen.navigateToAutoArchiveScreen();
      await autoArchiveScreen.setSRLevelThreshold(1);
      await autoArchiveScreen.setWRLevelThreshold(0);
      await autoArchiveScreen.save();
      await lightBoxDialog.close();
      await moreScreen.navigateToLearnScreen();
      await learnScreen.navigateToSpacedRepetitionScreen();
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
      await spacedRepetitionLessonScreen.autoCompleteReview();
      await spacedRepetitionLessonScreen.quit();
      await spacedRepetitionScreen.back();
      await learnScreen.navigateToManageScreen();
      await manageScreen.showVocabularyList();
      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.ARCHIVED);
      await manageScreen.expectVocabularyToExist('vocabulary 1');
      await manageScreen.expectVocabularyToExist('vocabulary 2');
      await manageScreen.expectVocabularyToExist('vocabulary 3');
    });

    it('should not auto archive if the conditions are not met', async (): Promise<
      void
    > => {
      await manageScreen.navigateToMoreScreen();
      await moreScreen.navigateToAutoArchiveScreen();
      await autoArchiveScreen.setSRLevelThreshold(1);
      await autoArchiveScreen.setWRLevelThreshold(1);
      await autoArchiveScreen.save();
      await lightBoxDialog.close();
      await moreScreen.navigateToLearnScreen();
      await learnScreen.navigateToSpacedRepetitionScreen();
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
      await spacedRepetitionLessonScreen.autoCompleteReview();
      await spacedRepetitionLessonScreen.quit();
      await spacedRepetitionScreen.back();
      await learnScreen.navigateToManageScreen();
      await manageScreen.showVocabularyList();
      await manageScreen.expectVocabularyToExist('vocabulary 1');
      await manageScreen.expectVocabularyToExist('vocabulary 2');
      await manageScreen.expectVocabularyToExist('vocabulary 3');
    });

    it('should not auto archive if auto archive is disabled', async (): Promise<
      void
    > => {
      await manageScreen.navigateToMoreScreen();
      await moreScreen.navigateToAutoArchiveScreen();
      await autoArchiveScreen.toggle();
      await autoArchiveScreen.setSRLevelThreshold(1);
      await autoArchiveScreen.setWRLevelThreshold(0);
      await autoArchiveScreen.save();
      await lightBoxDialog.close();
      await moreScreen.navigateToLearnScreen();
      await learnScreen.navigateToSpacedRepetitionScreen();
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
      await spacedRepetitionLessonScreen.autoCompleteReview();
      await spacedRepetitionLessonScreen.quit();
      await spacedRepetitionScreen.back();
      await learnScreen.navigateToManageScreen();
      await manageScreen.showVocabularyList();
      await manageScreen.expectVocabularyToExist('vocabulary 1');
      await manageScreen.expectVocabularyToExist('vocabulary 2');
      await manageScreen.expectVocabularyToExist('vocabulary 3');
    });
  });
});
