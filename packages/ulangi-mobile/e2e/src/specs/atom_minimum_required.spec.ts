import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { atomPlayScreen } from '../screen-objects/AtomPlayScreen';
import { atomScreen } from '../screen-objects/AtomScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { playScreen } from '../screen-objects/PlayScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Atom minimum required', (): void => {
  describe('Tests start at ManageScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Chinese',
          'English'
        );
      }
    );

    it('cannot start game when no terms are added', async (): Promise<void> => {
      await manageScreen.navigateToPlayScreen();
      await playScreen.navigateToAtomScreen();
      await atomScreen.navigateToAtomPlayScreen();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('can start game when one term are added', async (): Promise<void> => {
      await manageScreen.navigateToAddVocabularyScreen();
      await addVocabularyScreen.fillAndSaveTerm({
        vocabularyText: 'vocabulary 1',
        definitions: ['meaning 1'],
      });
      await lightBoxDialog.close();
      await manageScreen.navigateToPlayScreen();
      await playScreen.navigateToAtomScreen();
      await atomScreen.navigateToAtomPlayScreen();
      await atomPlayScreen.expectToExist();
    });
  });
});
