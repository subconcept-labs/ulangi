import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { privacyPolicyScreen } from '../screen-objects/PrivacyPolicyScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Privacy policy', (): void => {
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

    it('navigate to PrivacyPolicyScreen and back', async (): Promise<void> => {
      await moreScreen.navigateToPrivacyPolicyScreen();
      await privacyPolicyScreen.back();
      await privacyPolicyScreen.expectToNotExist();
    });
  });
});
