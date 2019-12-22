import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { editVocabularyScreen } from '../screen-objects/EditVocabularyScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { addVocabularyScreen } from '../screen-objects/addVocabularyScreen';
import { categorySelectorScreen } from "../screen-objects/CategorySelectorScreen";

describe('Edit vocabulary', (): void => {
  describe(`Test starts at ManagementScreen`, (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Japanese',
          'English'
        );
      }
    );

    it('remove definition', async (): Promise<void> => {
      await manageScreen.navigateToAddVocabularyScreen();
      await addVocabularyScreen.fillAndSaveTerm({
        vocabularyText: 'old vocabulary 1',
        definitions: ['old meaning 1', 'old meaning 2'],
      });
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
      await manageScreen.showVocabularyList();
      await manageScreen.editVocabulary('old vocabulary 1');

      await editVocabularyScreen.deleteDefinition(0);
      await editVocabularyScreen.save();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();

      await manageScreen.showVocabularyList();
      await manageScreen.expectVocabularyToHaveDefinition(
        'old vocabulary 1',
        'old meaning 2'
      );
      await manageScreen.expectVocabularyToNotHaveDefinition(
        'old vocabulary 1',
        'old meaning 1'
      );
    });

    it('recategorized an uncategorized vocabulary', async (): Promise<void> => {
      await manageScreen.navigateToAddVocabularyScreen();
      await addVocabularyScreen.fillAndSaveTerm({
        vocabularyText: 'old vocabulary 1',
        definitions: ['old meaning 1'],
      });
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
      await manageScreen.showVocabularyList();
      await manageScreen.editVocabulary('old vocabulary 1');

      await editVocabularyScreen.showCategorySelectorScreen();
      await categorySelectorScreen.fillCategory('Recategorized');
      await categorySelectorScreen.done();
      await editVocabularyScreen.save();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();

      await manageScreen.showCategoryList();
      await manageScreen.expectCategoryToExist('Recategorized');
    });

    it('recategorized a categorized vocabulary', async (): Promise<void> => {
      await manageScreen.navigateToAddVocabularyScreen();
      await addVocabularyScreen.fillAndSaveTerm({
        vocabularyText: 'old vocabulary 1',
        definitions: ['old meaning 1'],
        category: 'categorized',
      });
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
      await manageScreen.showVocabularyList();
      await manageScreen.editVocabulary('old vocabulary 1');
      await editVocabularyScreen.showCategorySelectorScreen()
      await categorySelectorScreen.fillCategory('recategorized');
      await categorySelectorScreen.done();
      await editVocabularyScreen.save();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();

      await manageScreen.showCategoryList();
      await manageScreen.expectCategoryToExist('recategorized');
    });

    it('uncategorized a categorized vocabulary', async (): Promise<void> => {
      await manageScreen.navigateToAddVocabularyScreen();
      await addVocabularyScreen.fillAndSaveTerm({
        vocabularyText: 'old vocabulary 1',
        definitions: ['old meaning 1'],
        category: 'categorized',
      });
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();
      await manageScreen.showVocabularyList();
      await manageScreen.editVocabulary('old vocabulary 1');
      await editVocabularyScreen.showCategorySelectorScreen();
      await categorySelectorScreen.clearCategory();
      await categorySelectorScreen.done();
      await editVocabularyScreen.save();
      await lightBoxDialog.expectSuccessDialogToExist();
      await lightBoxDialog.close();

      await manageScreen.showCategoryList();
      await manageScreen.expectCategoryToExist('Uncategorized');
    });
  });
});
