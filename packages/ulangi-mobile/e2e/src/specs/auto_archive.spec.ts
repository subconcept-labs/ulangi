import { autoArchiveScreen } from '../screen-objects/AutoArchiveScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Auto archive', (): void => {
  describe('Test starts at AutoArchiveScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Japanese',
          'English'
        );
        await manageScreen.navigateToMoreScreen();
        await moreScreen.navigateToAutoArchiveScreen();
      }
    );

    it('save auto archive settings', async (): Promise<void> => {
      await autoArchiveScreen.setSRLevelThreshold(2);
      await autoArchiveScreen.expectToHaveSRLevelThreshold(2);
      await autoArchiveScreen.setWRLevelThreshold(3);
      await autoArchiveScreen.expectToHaveWRLevelThreshold(3);
      await autoArchiveScreen.save();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
    });
  });
});
