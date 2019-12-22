import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { editSetScreen } from '../screen-objects/EditSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { setManagementScreen } from '../screen-objects/SetManagementScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Edit set', (): void => {
  describe('Tests start at EditSetScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Italian',
          'English'
        );
        await manageScreen.navigateToMoreScreen();
        await moreScreen.navigateToSetManagementScreen();
        await setManagementScreen.editSet('Italian - English');
      }
    );

    it('edit set with empty setName', async (): Promise<void> => {
      await editSetScreen.clearSetName();
      await editSetScreen.selectLanguages('Vietnamese', 'English');
      await editSetScreen.save();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();

      // Make sure edit persists
      await setManagementScreen.expectSetToExist('Vietnamese - English');
    });

    it('edit set with setName', async (): Promise<void> => {
      await editSetScreen.fillSetName('Edited set');
      await editSetScreen.selectLanguages('Vietnamese', 'English');
      await editSetScreen.save();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();

      // Make sure edit persists
      await setManagementScreen.expectSetToExist('Edited set');
    });
  });
});
