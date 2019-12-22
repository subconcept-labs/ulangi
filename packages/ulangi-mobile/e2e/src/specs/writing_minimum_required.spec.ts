import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { learnScreen } from '../screen-objects/LearnScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { writingLessonScreen } from '../screen-objects/WritingLessonScreen';
import { writingScreen } from '../screen-objects/WritingScreen';
import { welcomeScreen } from '../screen-objects/welcomeScreen';

describe('Writing minimum required', (): void => {
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
      await learnScreen.navigateToWritingScreen();
      await writingScreen.navigateToWritingLessonScreen();
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
      await learnScreen.navigateToWritingScreen();
      await writingScreen.navigateToWritingLessonScreen();
      await writingLessonScreen.expectToExist();
      await writingLessonScreen.back();
      await writingLessonScreen.expectToNotExist();
    });
  });
});
