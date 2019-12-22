import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Transation and dictionary unsupported', (): void => {
  describe('Tests start at AddVocabularyScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Any Language',
          'English'
        );
        await manageScreen.navigateToAddVocabularyScreen();
      }
    );

    test('show specific language required for dictionary', async (): Promise<
      void
    > => {
      await addVocabularyScreen.fillVocabularyText('vocabulary', false, true);
      await addVocabularyScreen.expectSpecificLanguageRequiredForDictionaryToExist();
    });

    test('show specific language required for translation', async (): Promise<
      void
    > => {
      await addVocabularyScreen.fillVocabularyText('vocabulary', false, true);
      await addVocabularyScreen.expectSpecificLanguageRequiredForTranslationToExist();
    });
  });
});
