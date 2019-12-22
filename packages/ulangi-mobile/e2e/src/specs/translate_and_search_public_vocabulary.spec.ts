import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { discoverScreen } from '../screen-objects/DiscoverScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Search public vocabulary', (): void => {
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

    it('search and translate', async (): Promise<void> => {
      await discoverScreen.search('dog\n');
      await discoverScreen.showTranslationAndSearchVocabularyResult();
      await discoverScreen.expectToHaveTranslation('chó');
      await discoverScreen.expectToHavePublicVocabularyTerm('cún');
    });

    // eslint-disable-next-line
    it('clear search by tapping clear button then search again', async (): Promise<
      void
    > => {
      await discoverScreen.search('dog\n');

      // Clear by tapping button
      await discoverScreen.pressClear();
      await discoverScreen.search('one\n');
      await discoverScreen.showTranslationAndSearchVocabularyResult();
      await discoverScreen.expectToHaveTranslation('một');
      await discoverScreen.expectToHavePublicVocabularyTerm('một');
    });

    it('clear search from keyboard then search again', async (): Promise<
      void
    > => {
      await discoverScreen.search('dog\n');

      // Clear from keyboard
      await discoverScreen.clearSearch();
      await discoverScreen.search('one\n');
      await discoverScreen.showTranslationAndSearchVocabularyResult();
      await discoverScreen.expectToHaveTranslation('một');
      await discoverScreen.expectToHavePublicVocabularyTerm('một');
    });
  });
});
