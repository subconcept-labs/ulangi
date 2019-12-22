import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { whatsNewScreen } from '../screen-objects/WhatsNewScreen';

describe("What's New", (): void => {
  describe('Tests start at MoreScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Vietnamese',
          'English'
        );

        await manageScreen.navigateToMoreScreen();
      }
    );

    it('navigate to WhatsNewScreen and back', async (): Promise<void> => {
      await moreScreen.navigateToWhatsNewScreen();
      await whatsNewScreen.back();
      await whatsNewScreen.expectToNotExist();
    });
  });
});
