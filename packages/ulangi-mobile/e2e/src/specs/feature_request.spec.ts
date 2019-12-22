import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { featureRequestScreen } from '../screen-objects/FeatureRequestScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Feature request', (): void => {
  describe('Tests start at FeatureRequestScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Russian',
          'English'
        );

        await manageScreen.navigateToMoreScreen();
        await moreScreen.navigateToFeatureRequestScreen();
      }
    );

    it('send message', async (): Promise<void> => {
      await featureRequestScreen.setMessage(
        'This is a test message. Please ignore this.'
      );
      await featureRequestScreen.send();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
    });
  });
});
