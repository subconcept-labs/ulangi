import { addSetScreen } from '../screen-objects/AddSetScreen';
import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { categoryDetailScreen } from '../screen-objects/CategoryDetailScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { setManagementScreen } from '../screen-objects/SetManagementScreen';
import { setSelectionMenu } from '../screen-objects/SetSelectionMenu';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Move vocabulary', (): void => {
  describe('Test starts at ManageScreen after adding a new set and a term', (): void => {
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
            vocabularyText: 'vocabulary1',
            definitions: ['meaning1'],
            category: 'category1',
          },
        ]);
        await lightBoxDialog.close();
        await manageScreen.navigateToMoreScreen();
        await moreScreen.navigateToSetManagementScreen();
        await setManagementScreen.navigateToAddSetScreen();
        await addSetScreen.selectLanguages('Korean', 'English');
        await addSetScreen.save();
        await lightBoxDialog.close();
        await setManagementScreen.back();
        await moreScreen.navigateToManageScreen();
      }
    );

    it('move a term to a new set in ManageScreen', async (): Promise<void> => {
      await manageScreen.showVocabularyList();
      await manageScreen.moveVocabulary('vocabulary1');
      await setSelectionMenu.select('Korean - English');
      await manageScreen.expectVocabularyToNotExist('vocabulary1');
      await manageScreen.openSetSelectionMenu();
      await setSelectionMenu.select('Korean - English');
      await manageScreen.expectVocabularyToExist('vocabulary1');
    });

    it('move a term to Uncategorized in CategoryDetailScreen', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.viewCategoryDetail('category1');
      await categoryDetailScreen.moveVocabulary('vocabulary1');
      await setSelectionMenu.select('Korean - English');
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary1');
      await categoryDetailScreen.back();
      await manageScreen.openSetSelectionMenu();
      await setSelectionMenu.select('Korean - English');
      await manageScreen.viewCategoryDetail('category1');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary1');
    });
  });
});
