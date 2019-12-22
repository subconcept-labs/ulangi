import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { setManagementScreen } from '../screen-objects/SetManagementScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Archive set', (): void => {
  describe('Tests start at SetManagementScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Italian',
          'English'
        );
        await manageScreen.navigateToMoreScreen();
        await moreScreen.navigateToSetManagementScreen();
      }
    );

    it('archive active set', async (): Promise<void> => {
      await setManagementScreen.archiveSet('Italian - English');
      await setManagementScreen.expectSetToNotExist('Italian - English');

      await setManagementScreen.showSets('archived');
      await setManagementScreen.expectSetToExist('Italian - English');
    });

    it('archive deleted set', async (): Promise<void> => {
      await setManagementScreen.deleteSet('Italian - English');
      await setManagementScreen.showSets('deleted');

      await setManagementScreen.archiveSet('Italian - English');
      await setManagementScreen.expectSetToNotExist('Italian - English');

      await setManagementScreen.showSets('archived');
      await setManagementScreen.expectSetToExist('Italian - English');
    });
  });
});
