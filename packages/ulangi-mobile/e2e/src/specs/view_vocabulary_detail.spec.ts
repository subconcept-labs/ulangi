import { categoryDetailScreen } from '../screen-objects/CategoryDetailScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';
import { vocabularyDetailScreen } from '../screen-objects/vocabularyDetailScreen';

describe('View vocabulary detail', (): void => {
  describe(`Test starts at ManageScreen after adding one vocabulary`, (): void => {
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
      }
    );

    it('view vocabulary detail from ManageScreen', async (): Promise<void> => {
      await manageScreen.showVocabularyList();
      await manageScreen.viewVocabularyDetail('vocabulary 1');
      await vocabularyDetailScreen.back();
      await vocabularyDetailScreen.expectToNotExist();
    });

    it('view vocabulary detail from CategoryDetailScreen', async (): Promise<
      void
    > => {
      await manageScreen.viewCategoryDetail('Uncategorized');
      await categoryDetailScreen.viewVocabularyDetail('vocabulary 1');
      await vocabularyDetailScreen.back();
      await vocabularyDetailScreen.expectToNotExist();
    });
  });
});
