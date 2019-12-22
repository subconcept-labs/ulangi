import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { termsOfServiceScreen } from '../screen-objects/TermsOfServiceScreen';

describe('Terms of service', (): void => {
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

    it('navigate to TermsOfServiceScreen and back', async (): Promise<void> => {
      await moreScreen.navigateToTermsOfServiceScreen();
      await termsOfServiceScreen.back();
      await termsOfServiceScreen.expectToNotExist();
    });
  });
});
