import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { learnScreen } from '../screen-objects/LearnScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { spacedRepetitionLessonScreen } from '../screen-objects/SpacedRepetitionLessonScreen';
import { spacedRepetitionScreen } from '../screen-objects/SpacedRepetitionScreen';
import { welcomeScreen } from '../screen-objects/welcomeScreen';

describe('Spaced repetition minimum required', (): void => {
  describe('Tests start at ManageScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'English',
          'English'
        );
      }
    );

    it('cannot start lesson because no terms available', async (): Promise<
      void
    > => {
      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToSpacedRepetitionScreen();
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
      await lightBoxDialog.expectFailedDialogToExist();
      await lightBoxDialog.close();
    });

    it('can start lesson if it has one term', async (): Promise<void> => {
      await manageScreen.navigateToAddVocabularyScreen();
      await addVocabularyScreen.fillAndSaveMultpleTerms([
        {
          vocabularyText: 'vocabulary 1',
          definitions: ['meaning 1'],
        },
      ]);
      await lightBoxDialog.close();
      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToSpacedRepetitionScreen();
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
      await spacedRepetitionLessonScreen.expectToExist();
      await spacedRepetitionLessonScreen.back();
      await spacedRepetitionLessonScreen.expectToNotExist();
    });
  });
});
