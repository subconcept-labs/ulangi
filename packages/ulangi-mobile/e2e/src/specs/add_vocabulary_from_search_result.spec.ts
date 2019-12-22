import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { discoverScreen } from '../screen-objects/DiscoverScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Add vocabulary from search result', (): void => {
  describe('Tests start at DiscoverScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Vietnamese',
          'English'
        );
        await manageScreen.navigateToDiscoverScreen();
      }
    );

    it('add vocabulary from public vocabulary list', async (): Promise<
      void
    > => {
      await discoverScreen.search('dog\n');
      await discoverScreen.showTranslationAndSearchVocabularyResult();
      await discoverScreen.addFromPublicVocabulary('chó');
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();

      // Make sure add persists
      await discoverScreen.navigateToManageScreen();
      await manageScreen.showVocabularyList();
      await manageScreen.expectVocabularyToExist('chó');
    });

    it('add vocabulary from translation', async (): Promise<void> => {
      await discoverScreen.search('dog\n');
      await discoverScreen.showTranslationAndSearchVocabularyResult();
      await discoverScreen.addFromTranslation('chó');
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();

      // Make sure add persists
      await discoverScreen.navigateToManageScreen();
      await manageScreen.showVocabularyList();
      await manageScreen.expectVocabularyToExist('chó');
    });
  });
});
