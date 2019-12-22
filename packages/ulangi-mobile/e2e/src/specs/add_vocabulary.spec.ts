import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Add vocabulary', (): void => {
  describe('Test starts at AddVocabularyScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Japanese',
          'English'
        );
        await manageScreen.navigateToAddVocabularyScreen();
      }
    );

    it('add multiple vocabulary terms', async (): Promise<void> => {
      await addVocabularyScreen.fillAndSaveMultpleTerms([
        { vocabularyText: 'vocabulary 1', definitions: ['meaning'] },
        {
          vocabularyText: 'vocabulary 2',
          definitions: ['meaning 1', 'meaning 2'],
          category: 'category',
        },
      ]);
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
      await manageScreen.showVocabularyList();
      await manageScreen.expectVocabularyToExist('vocabulary 1');
      await manageScreen.expectVocabularyToExist('vocabulary 2');
      await manageScreen.expectVocabularyToHaveDefinition(
        'vocabulary 1',
        'meaning'
      );
      await manageScreen.expectVocabularyToHaveDefinition(
        'vocabulary 2',
        'meaning 1'
      );
      await manageScreen.expectVocabularyToHaveDefinition(
        'vocabulary 2',
        'meaning 2'
      );
      await manageScreen.showCategoryList();
      await manageScreen.expectCategoryToExist('Uncategorized');
      await manageScreen.expectCategoryToExist('category');
    });
  });
});
