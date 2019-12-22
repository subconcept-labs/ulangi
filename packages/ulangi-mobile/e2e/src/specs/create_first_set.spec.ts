import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('create first set', (): void => {
  describe('Tests start at CreateFirstSetScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
      }
    );

    it('select languages then submit', async (): Promise<void> => {
      await createFirstSetScreen.selectLanguagesAndSubmit(
        'Vietnamese',
        'English'
      );
      await manageScreen.expectToExist();
    });
  });
});
