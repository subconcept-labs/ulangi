import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { searchScreen } from '../screen-objects/SearchScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';

describe('Search specs', (): void => {
  describe('Tests start at ManageScreen after adding a term', (): void => {
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
        await lightBoxDialog.expectSuccessDialogToExist();
        await lightBoxDialog.close();

        await manageScreen.navigateToSearchScreen();
      }
    );

    it('search by vocabulary text', async (): Promise<void> => {
      await searchScreen.search('voca\n');
      await searchScreen.expectVocabularyToExist('vocabulary 1');

      await searchScreen.search('oca\n');
      await searchScreen.expectNoResults();
    });

    it('search by meaning', async (): Promise<void> => {
      await searchScreen.search('mean\n');
      await searchScreen.expectVocabularyToExist('vocabulary 1');

      await searchScreen.search('ean\n');
      await searchScreen.expectNoResults();
    });
  });
});
