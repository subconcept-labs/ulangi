import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { discoverScreen } from '../screen-objects/DiscoverScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { publicSetDetailScreen } from '../screen-objects/PublicSetDetailScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Search public set', (): void => {
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

    it('view public set detail from search result', async (): Promise<void> => {
      await discoverScreen.search('dog\n');
      await discoverScreen.showSearchSetResult();
      await discoverScreen.viewPublicSetDetail('Dogs');
      await publicSetDetailScreen.expectToExist();
      await publicSetDetailScreen.back();
      await publicSetDetailScreen.expectToNotExist();
    });
  });
});
