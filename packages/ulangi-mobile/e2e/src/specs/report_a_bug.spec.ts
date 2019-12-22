import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { reportABugScreen } from '../screen-objects/ReportABugScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Report a bug', (): void => {
  describe('Tests start at ReportABugScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Russian',
          'English'
        );
        await manageScreen.navigateToMoreScreen();
        await moreScreen.navigateToReportABugScreen();
      }
    );

    it('send message', async (): Promise<void> => {
      await reportABugScreen.setMessage(
        'This is a test message. Please ignore this.'
      );
      await reportABugScreen.send();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
    });
  });
});
