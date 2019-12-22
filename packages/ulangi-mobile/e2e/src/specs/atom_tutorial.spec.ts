import { atomScreen } from '../screen-objects/AtomScreen';
import { atomTutorialScreen } from '../screen-objects/AtomTutorialScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { playScreen } from '../screen-objects/PlayScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Atom tutorial', (): void => {
  describe('Tests start at AtomScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Chinese',
          'English'
        );
        await manageScreen.navigateToPlayScreen();
        await playScreen.navigateToAtomScreen();
      }
    );

    it('navigate to AtomTutorialScreen and back', async (): Promise<void> => {
      await atomScreen.navigateToAtomTutorialScreen();
      await atomTutorialScreen.back();
    });
  });
});
