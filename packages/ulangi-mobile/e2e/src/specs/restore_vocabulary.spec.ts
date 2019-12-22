import { VocabularyFilterType } from '@ulangi/ulangi-common/enums';

import { categoryDetailScreen } from '../screen-objects/CategoryDetailScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';

describe('Restore vocabulary', (): void => {
  describe(`Test starts at ManageScreen after adding one vocabulary`, (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Japanese',
          'English'
        );
        await manageScreen.navigateToAddVocabularyScreen();
        await addVocabularyScreen.fillAndSaveTerm({
          vocabularyText: 'vocabulary 1',
          definitions: ['meaning 1'],
        });
        await lightBoxDialog.close();
      }
    );

    it('restore archived vocabulary in manage screen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.archiveVocabulary('vocabulary 1');
      await manageScreen.expectVocabularyToNotExist('vocabulary 1');

      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.ARCHIVED);
      await manageScreen.restoreVocabulary('vocabulary 1');
      await manageScreen.expectVocabularyToNotExist('vocabulary 1');

      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.ACTIVE);
      await manageScreen.expectVocabularyToExist('vocabulary 1');
    });

    it('restore deleted vocabulary in manage screen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.deleteVocabulary('vocabulary 1');
      await manageScreen.expectVocabularyToNotExist('vocabulary 1');

      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.DELETED);
      await manageScreen.restoreVocabulary('vocabulary 1');
      await manageScreen.expectVocabularyToNotExist('vocabulary 1');

      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.ACTIVE);
      await manageScreen.expectVocabularyToExist('vocabulary 1');
    });

    it('restore archived vocabulary in category detail screen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.archiveVocabulary('vocabulary 1');
      await manageScreen.expectVocabularyToNotExist('vocabulary 1');

      await manageScreen.showCategoryList();
      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.ARCHIVED);
      await manageScreen.viewCategoryDetail('Uncategorized');

      await categoryDetailScreen.restoreVocabulary('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 1');
      await categoryDetailScreen.openMenuAndSelectFilter(
        VocabularyFilterType.ACTIVE
      );
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 1');
    });

    it('restore deleted vocabulary in category detail screen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.deleteVocabulary('vocabulary 1');
      await manageScreen.expectVocabularyToNotExist('vocabulary 1');

      await manageScreen.showCategoryList();
      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.DELETED);
      await manageScreen.viewCategoryDetail('Uncategorized');

      await categoryDetailScreen.restoreVocabulary('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 1');
      await categoryDetailScreen.openMenuAndSelectFilter(
        VocabularyFilterType.ACTIVE
      );
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 1');
    });
  });
});
