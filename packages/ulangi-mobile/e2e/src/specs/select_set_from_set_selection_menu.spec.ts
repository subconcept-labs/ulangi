import { device } from '../adapters/Device';
import { addSetScreen } from '../screen-objects/AddSetScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { discoverScreen } from '../screen-objects/DiscoverScreen';
import { learnScreen } from '../screen-objects/LearnScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { playScreen } from '../screen-objects/PlayScreen';
import { searchScreen } from '../screen-objects/SearchScreen';
import { setManagementScreen } from '../screen-objects/SetManagementScreen';
import { setSelectionMenu } from '../screen-objects/SetSelectionMenu';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { lightBoxDialog } from '../screen-objects/lightBoxDialog';

describe('Select set from SetSelectionMenu ', (): void => {
  describe('Tests start at MoreScreen after adding one more set', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Japanese',
          'English'
        );
        await manageScreen.navigateToMoreScreen();
        await moreScreen.navigateToSetManagementScreen();
        await setManagementScreen.navigateToAddSetScreen();
        await addSetScreen.selectLanguages('Korean', 'English');
        await addSetScreen.save();
        await lightBoxDialog.close();
        await setManagementScreen.back();
      }
    );

    it('select set from menu at ManageScreen', async (): Promise<void> => {
      await moreScreen.navigateToManageScreen();
      await manageScreen.openSetSelectionMenu();
      await setSelectionMenu.select('Korean - English');
      await manageScreen.expectToHaveSubtitle('Korean - English');
    });

    it('select set from menu at DiscoverScreen', async (): Promise<void> => {
      await moreScreen.navigateToDiscoverScreen();
      await discoverScreen.openSetSelectionMenu();
      await setSelectionMenu.select('Korean - English');
      await discoverScreen.expectToHaveSubtitle('Korean - English');
    });

    it('select set from menu at LearnScreen', async (): Promise<void> => {
      await moreScreen.navigateToLearnScreen();
      await learnScreen.openSetSelectionMenu();
      await setSelectionMenu.select('Korean - English');
      await learnScreen.expectToHaveSubtitle('Korean - English');
    });

    it('select set from menu at PlayScreen', async (): Promise<void> => {
      await moreScreen.navigateToPlayScreen();
      await playScreen.openSetSelectionMenu();
      await setSelectionMenu.select('Korean - English');
      await playScreen.expectToHaveSubtitle('Korean - English');
    });

    it('select set from menu at SearchScreen', async (): Promise<void> => {
      await moreScreen.navigateToManageScreen();
      await manageScreen.navigateToSearchScreen();

      // Wait to close keyboard first
      await device.pause(1000);
      await searchScreen.search('\n');

      await searchScreen.openSetSelectionMenu();
      await setSelectionMenu.select('Korean - English');
      await searchScreen.expectToHaveSubtitle('Korean - English');
    });
  });
});
