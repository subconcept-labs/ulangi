import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { atomPausedScreen } from '../screen-objects/AtomPausedScreen';
import { atomPlayScreen } from '../screen-objects/AtomPlayScreen';
import { atomScreen } from '../screen-objects/AtomScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { playScreen } from '../screen-objects/PlayScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Atom play', (): void => {
  describe('Tests start at AtomScreen after adding one term', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Japanese',
          'English'
        );
        await manageScreen.navigateToAddVocabularyScreen();
        await addVocabularyScreen.fillAndSaveTerm({
          vocabularyText: 'vocabulary 1',
          definitions: ['meaning 1'],
        });
        await lightBoxDialog.close();
        await manageScreen.navigateToPlayScreen();

        await playScreen.navigateToAtomScreen();
      }
    );

    it('restart on pause', async (): Promise<void> => {
      await atomScreen.navigateToAtomPlayScreen();
      await atomPlayScreen.pause();
      await atomPausedScreen.restart();
      await atomPausedScreen.expectToNotExist();
      await atomPlayScreen.expectToExist();
    });

    it('quit on pause', async (): Promise<void> => {
      await atomScreen.navigateToAtomPlayScreen();
      await atomPlayScreen.pause();
      await atomPausedScreen.quit();
      await atomPausedScreen.expectToNotExist();
      await atomPlayScreen.expectToNotExist();
    });
  });
});
