import { device } from '../adapters/Device';
import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { playScreen } from '../screen-objects/PlayScreen';
import { reflexScreen } from '../screen-objects/ReflexScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Reflex minimum required', (): void => {
  describe('Tests start at ManageScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Japanese',
          'English'
        );
      }
    );

    it('cannot start game if it only has one vocabulary term', async (): Promise<
      void
    > => {
      await manageScreen.navigateToAddVocabularyScreen();
      await addVocabularyScreen.fillAndSaveTerm({
        vocabularyText: 'vocabulary 1',
        definitions: ['meaning 1'],
      });
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
      await manageScreen.navigateToPlayScreen();
      await playScreen.navigateToReflexScreen();
      await reflexScreen.startGame();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('can start game if it has two vocabulary terms', async (): Promise<
      void
    > => {
      await manageScreen.navigateToAddVocabularyScreen();
      await addVocabularyScreen.fillAndSaveMultpleTerms([
        {
          vocabularyText: 'vocabulary 1',
          definitions: ['meaning 1'],
        },
        {
          vocabularyText: 'vocabulary 2',
          definitions: ['meaning 2'],
        },
      ]);
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
      await manageScreen.navigateToPlayScreen();
      await playScreen.navigateToReflexScreen();
      await device.disableSynchronization();
      await reflexScreen.startGame();
      await reflexScreen.pause();
      await device.enableSynchronization();
    });
  });
});
