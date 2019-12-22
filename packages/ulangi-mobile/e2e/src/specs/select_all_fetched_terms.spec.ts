import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';

describe('Select all fetched terms', (): void => {
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
          {
            vocabularyText: 'vocabulary 3',
            definitions: ['meaning 3'],
          },
        ]);
        await lightBoxDialog.close();
      }
    );

    it('select all fetched terms then unselect them in manage screen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.selectVocabulary('vocabulary 1');
      await manageScreen.selectAllFetchedTerms();
      await manageScreen.unselectVocabulary('vocabulary 1');
      await manageScreen.unselectVocabulary('vocabulary 2');
      await manageScreen.unselectVocabulary('vocabulary 3');
    });

    it('select all fetched terms then unselect them in category detail screen', async (): Promise<
      void
    > => {
      await manageScreen.viewCategoryDetail('Uncategorized');
      await manageScreen.selectVocabulary('vocabulary 1');
      await manageScreen.selectAllFetchedTerms();
      await manageScreen.unselectVocabulary('vocabulary 1');
      await manageScreen.unselectVocabulary('vocabulary 2');
      await manageScreen.unselectVocabulary('vocabulary 3');
    });
  });
});
