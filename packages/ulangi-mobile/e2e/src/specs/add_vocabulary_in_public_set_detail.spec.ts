import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { discoverScreen } from '../screen-objects/DiscoverScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { publicSetDetailScreen } from '../screen-objects/PublicSetDetailScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Add vocabulary in PublicSetDetailScreen', (): void => {
  describe('Tests start at PublicSetDetailScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Vietnamese',
          'English'
        );
        await manageScreen.navigateToDiscoverScreen();

        await discoverScreen.search('dog\n');
        await discoverScreen.showSearchSetResult();
        await discoverScreen.expectToHavePublicSet('Dogs');
      }
    );

    it('add a single term and it should be auto-categorized', async (): Promise<
      void
    > => {
      await publicSetDetailScreen.add('Mi-lu');
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
      await publicSetDetailScreen.back();
      await discoverScreen.navigateToManageScreen();
      await manageScreen.expectCategoryToExist('Dogs');
    });

    it('add all terms and all should be auto-categorized', async (): Promise<
      void
    > => {
      await publicSetDetailScreen.addAll();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
      await publicSetDetailScreen.back();
      await discoverScreen.navigateToManageScreen();
      await manageScreen.expectCategoryToExist('Dogs');
    });
  });
});
