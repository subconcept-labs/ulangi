import { VocabularyFilterType } from '@ulangi/ulangi-common/enums';

import { categoryDetailScreen } from '../screen-objects/CategoryDetailScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';

describe('Filter vocabulary by status', (): void => {
  describe(`Test starts at ManageScreen after adding multiple terms`, (): void => {
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
            category: "category 2"
          },
          {
            vocabularyText: 'vocabulary 3',
            definitions: ['meaning 3'],
            category: "category 3"
          },
        ]
        );
        await lightBoxDialog.close();
      }
    );

    it('filter vocabulary by status in manage screen', async (): Promise<void> => {
      await manageScreen.showVocabularyList();

      await manageScreen.archiveVocabulary('vocabulary 1');
      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.ARCHIVED);
      await manageScreen.expectVocabularyToExist('vocabulary 1');
      await manageScreen.expectVocabularyToNotExist('vocabulary 2');
      await manageScreen.expectVocabularyToNotExist('vocabulary 3');

      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.ACTIVE);
      await manageScreen.expectVocabularyToExist('vocabulary 2');
      await manageScreen.expectVocabularyToExist('vocabulary 3');
      await manageScreen.expectVocabularyToNotExist('vocabulary 1');

      await manageScreen.deleteVocabulary('vocabulary 2');
      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.DELETED);
      await manageScreen.expectVocabularyToExist('vocabulary 2');
      await manageScreen.expectVocabularyToNotExist('vocabulary 1');
      await manageScreen.expectVocabularyToNotExist('vocabulary 3');

      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.ACTIVE);
      await manageScreen.expectVocabularyToExist('vocabulary 3');
      await manageScreen.expectVocabularyToNotExist('vocabulary 1');
      await manageScreen.expectVocabularyToNotExist('vocabulary 2');
    });

    it('filter vocabulary by status category detail screen', async (): Promise<
      void
    > => {
      await manageScreen.viewCategoryDetail('Uncategorized');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 2');
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 3');

      await categoryDetailScreen.archiveVocabulary('vocabulary 1');
      await categoryDetailScreen.openMenuAndSelectFilter(
        VocabularyFilterType.ARCHIVED
      );
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 2');
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 3');

      await categoryDetailScreen.deleteVocabulary('vocabulary 1');
      await categoryDetailScreen.openMenuAndSelectFilter(
        VocabularyFilterType.DELETED
      );
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 2');
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 3');

      await categoryDetailScreen.restoreVocabulary('vocabulary 1');
      await categoryDetailScreen.openMenuAndSelectFilter(
        VocabularyFilterType.ACTIVE
      );
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 2');
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 3');
    });
  })
});
