import { VocabularyFilterType } from '@ulangi/ulangi-common/enums';

import { categoryDetailScreen } from '../screen-objects/CategoryDetailScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';

describe('Archive multiple vocabulary', (): void => {
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
          },
        ]);
        await lightBoxDialog.close();
      }
    );

    it('archive multiple active vocabulary in manage screen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.selectVocabulary('vocabulary 1');
      await manageScreen.selectVocabulary('vocabulary 2');
      await manageScreen.archiveSelectedVocabulary();
      await lightBoxDialog.close();
      await manageScreen.expectVocabularyToNotExist('vocabulary 1');
      await manageScreen.expectVocabularyToNotExist('vocabulary 2');

      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.ARCHIVED);
      await manageScreen.expectVocabularyToExist('vocabulary 1');
      await manageScreen.expectVocabularyToExist('vocabulary 2');
    });

    it('archive multiple deleted vocabulary in manage screen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.selectVocabulary('vocabulary 1');
      await manageScreen.selectVocabulary('vocabulary 2');
      await manageScreen.deleteSelectedVocabulary();
      await lightBoxDialog.close();
      await manageScreen.expectVocabularyToNotExist('vocabulary 1');
      await manageScreen.expectVocabularyToNotExist('vocabulary 2');

      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.DELETED);
      await manageScreen.selectVocabulary('vocabulary 1');
      await manageScreen.selectVocabulary('vocabulary 2');
      await manageScreen.archiveSelectedVocabulary();
      await lightBoxDialog.close();
      await manageScreen.expectVocabularyToNotExist('vocabulary 1');
      await manageScreen.expectVocabularyToNotExist('vocabulary 2');

      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.ARCHIVED);
      await manageScreen.expectVocabularyToExist('vocabulary 1');
      await manageScreen.expectVocabularyToExist('vocabulary 2');
    });

    it('archive multiple active vocabulary in category detail screen', async (): Promise<
      void
    > => {
      await manageScreen.viewCategoryDetail('Uncategorized');
      await categoryDetailScreen.selectVocabulary('vocabulary 1');
      await categoryDetailScreen.selectVocabulary('vocabulary 2');
      await categoryDetailScreen.archiveSelectedVocabulary();
      await lightBoxDialog.close();
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 2');
      await categoryDetailScreen.openMenuAndSelectFilter(
        VocabularyFilterType.ARCHIVED
      );
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 2');
    });

    it('archive multiple deleted vocabulary in category detail screen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.selectVocabulary('vocabulary 1');
      await manageScreen.selectVocabulary('vocabulary 2');
      await manageScreen.deleteSelectedVocabulary();
      await lightBoxDialog.close();
      await manageScreen.expectVocabularyToNotExist('vocabulary 1');
      await manageScreen.expectVocabularyToNotExist('vocabulary 2');

      await manageScreen.showCategoryList();
      await manageScreen.openMenuAndSelectFilter(VocabularyFilterType.DELETED);
      await manageScreen.viewCategoryDetail('Uncategorized');

      await manageScreen.selectVocabulary('vocabulary 1');
      await manageScreen.selectVocabulary('vocabulary 2');
      await manageScreen.archiveSelectedVocabulary();
      await lightBoxDialog.close();
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary 2');
      await categoryDetailScreen.openMenuAndSelectFilter(
        VocabularyFilterType.ARCHIVED
      );
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 1');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary 2');
    });
  });
});
