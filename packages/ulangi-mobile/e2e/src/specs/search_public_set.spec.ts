import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { discoverScreen } from '../screen-objects/DiscoverScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Search native set', (): void => {
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

    it('search', async (): Promise<void> => {
      await discoverScreen.search('dog\n');
      await discoverScreen.showSearchSetResult();
      await discoverScreen.expectToHavePublicSet('Dogs');
    });

    it('clear search by tapping clear button then search again', async (): Promise<
      void
    > => {
      await discoverScreen.search('dog\n');

      // Clear by tapping button
      await discoverScreen.pressClear();
      await discoverScreen.search('one\n');
      await discoverScreen.showSearchSetResult();
      await discoverScreen.expectToHavePublicSet('One');
    });

    it('clear search from keyboard then search again', async (): Promise<
      void
    > => {
      await discoverScreen.search('dog\n');

      // Clear from keyboard
      await discoverScreen.clearSearch();
      await discoverScreen.search('one\n');
      await discoverScreen.showSearchSetResult();
      await discoverScreen.expectToHavePublicSet('One');
    });
  });
});
