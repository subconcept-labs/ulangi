import { addSetScreen } from '../screen-objects/AddSetScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { setManagementScreen } from '../screen-objects/SetManagementScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { lightBoxDialog } from '../screen-objects/lightBoxDialog';

describe('Select set from SetManagementScreen ', (): void => {
  describe('Tests start at SetManagementScreen after adding one more set', (): void => {
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
      }
    );

    it('select set to use', async (): Promise<void> => {
      await setManagementScreen.selectSetToUse('Korean - English');
      await setManagementScreen.expectSetToBeUsing('Korean - English');
    });
  });
});
