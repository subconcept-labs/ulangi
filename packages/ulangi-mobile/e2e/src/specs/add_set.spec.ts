import { addSetScreen } from '../screen-objects/AddSetScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { setManagementScreen } from '../screen-objects/SetManagementScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Add set', (): void => {
  describe('Tests start at AddSetScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Italian',
          'English'
        );
        await manageScreen.navigateToMoreScreen();
        await moreScreen.navigateToSetManagementScreen();
        await setManagementScreen.navigateToAddSetScreen();
      }
    );

    it('add new set with empty set name', async (): Promise<void> => {
      await addSetScreen.selectLanguages('Vietnamese', 'English');
      await addSetScreen.save();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();

      // Make sure add persists
      await setManagementScreen.expectSetToExist('Vietnamese - English');
    });

    it('add new set with set name', async (): Promise<void> => {
      await addSetScreen.fillSetName('New set');
      await addSetScreen.selectLanguages('Vietnamese', 'English');
      await addSetScreen.save();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();

      // Make sure add persists
      await setManagementScreen.expectSetToExist('New set');
    });
  });
});
