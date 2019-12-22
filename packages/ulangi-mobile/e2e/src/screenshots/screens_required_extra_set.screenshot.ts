import { device } from '../adapters/Device';
import { addSetScreen } from '../screen-objects/AddSetScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { setManagementScreen } from '../screen-objects/SetManagementScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Screens required extra set', (): void => {
  describe('Start at ManageScreen after adding one set', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Vietnamese',
          'English'
        );
        await manageScreen.navigateToMoreScreen();
        await moreScreen.navigateToSetManagementScreen();
        await setManagementScreen.navigateToAddSetScreen();
        await addSetScreen.selectLanguages('Japanese', 'English');
        await addSetScreen.save();
        await lightBoxDialog.close();
        await setManagementScreen.back();
        await moreScreen.navigateToManageScreen();
      }
    );

    it('SetManagementScreen', async (): Promise<void> => {
      await manageScreen.navigateToMoreScreen();
      await moreScreen.navigateToSetManagementScreen();
      await setManagementScreen.expectToExist();
      await device.takeScreenshot('SetManagementScreen');
    });
  });
});
