import { contactSupportScreen } from '../screen-objects/ContactSupportScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Contact support', (): void => {
  describe('Tests start at ContactSupportScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Russian',
          'English'
        );
        await manageScreen.navigateToMoreScreen();
        await moreScreen.navigateToContactSupportScreen();
      }
    );

    it('send message', async (): Promise<void> => {
      await contactSupportScreen.setMessage(
        'This is a test message. Please ignore this.'
      );
      await contactSupportScreen.send();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
    });
  });
});
