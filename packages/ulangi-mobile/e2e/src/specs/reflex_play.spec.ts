import { device } from '../adapters/Device';
import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { playScreen } from '../screen-objects/PlayScreen';
import { reflexGameOverScreen } from '../screen-objects/ReflexGameOverScreen';
import { reflexPausedScreen } from '../screen-objects/ReflexPausedScreen';
import { reflexScreen } from '../screen-objects/ReflexScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Reflex play', (): void => {
  describe('Tests start at ReflexScreen after adding multiple terms', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Japanese',
          'English'
        );
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
        await lightBoxDialog.close();
        await manageScreen.navigateToPlayScreen();
        await playScreen.navigateToReflexScreen();
      }
    );

    it('close reflex', async (): Promise<void> => {
      await reflexScreen.back();
    });

    it('pause game', async (): Promise<void> => {
      await device.disableSynchronization();
      await reflexScreen.startGame();
      await reflexScreen.pause();
      await device.enableSynchronization();
    });

    it('display game over when no more vocabulary left', async (): Promise<
      void
    > => {
      await device.disableSynchronization();
      await reflexScreen.startGame();
      await reflexScreen.answerCorrectly();
      await device.pause(1000);
      await reflexScreen.answerCorrectly();
      await reflexGameOverScreen.expectToExist();
      await device.enableSynchronization();
    });

    it('display game over when answer incorrecly', async (): Promise<void> => {
      await device.disableSynchronization();
      await reflexScreen.startGame();
      await reflexScreen.answerIncorrectly();
      await reflexGameOverScreen.expectToExist();
      await device.enableSynchronization();
    });

    it('display game over when timeout', async (): Promise<void> => {
      await device.disableSynchronization();
      await reflexScreen.startGame();
      await device.pause(10000);
      await reflexGameOverScreen.expectToExist();
      await device.enableSynchronization();
    });

    it('restart on game over', async (): Promise<void> => {
      await device.disableSynchronization();
      await reflexScreen.startGame();
      await device.pause(10000);
      await reflexGameOverScreen.expectToExist();

      await reflexGameOverScreen.restart();
      await reflexScreen.expectCorrectButtonToExist();
      await device.enableSynchronization();
    });

    it('quit on game over', async (): Promise<void> => {
      await device.disableSynchronization();
      await reflexScreen.startGame();
      await device.pause(10000);
      await reflexGameOverScreen.expectToExist();

      await reflexGameOverScreen.quit();
      await reflexScreen.expectToNotExist();
      await device.enableSynchronization();
    });

    it('continue on pause', async (): Promise<void> => {
      await device.disableSynchronization();
      await reflexScreen.startGame();
      await reflexScreen.pause();
      await reflexPausedScreen.continue();
      await reflexPausedScreen.expectToNotExist();
      await reflexScreen.expectCorrectButtonToExist();
      await device.enableSynchronization();
    });

    it('restart on pause', async (): Promise<void> => {
      await device.disableSynchronization();
      await reflexScreen.startGame();
      await reflexScreen.pause();
      await reflexPausedScreen.restart();
      await reflexPausedScreen.expectToNotExist();
      await reflexScreen.expectCorrectButtonToExist();
      await device.enableSynchronization();
    });

    it('quit on pause', async (): Promise<void> => {
      await device.disableSynchronization();
      await reflexScreen.startGame();
      await reflexScreen.pause();
      await reflexPausedScreen.quit();
      await reflexPausedScreen.expectToNotExist();
      await device.enableSynchronization();
      await reflexScreen.expectToNotExist();
    });
  });
});
