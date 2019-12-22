import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';

describe('Select all fetched categories', (): void => {
  describe(`Test starts at ManageScreen after adding multiple terms with different category`, (): void => {
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
            category: 'Numbers',
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

    it('select all fetched categories then unselect them in manage screen', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.selectCategory('Uncategorized');
      await manageScreen.selectAllFetchedCategories();
      await manageScreen.unselectCategory('Uncategorized');
      await manageScreen.unselectCategory('Numbers');
      await manageScreen.unselectCategory('Animals');
    });
  });
});
