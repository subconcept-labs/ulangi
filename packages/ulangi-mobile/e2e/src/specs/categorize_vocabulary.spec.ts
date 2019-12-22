import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { categorizeScreen } from '../screen-objects/CategorizeScreen';
import { categoryDetailScreen } from '../screen-objects/CategoryDetailScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { editVocabularyScreen } from '../screen-objects/EditVocabularyScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { categorySelectorScreen } from "../screen-objects/CategorySelectorScreen"

describe('Categorize vocabulary', (): void => {
  describe('Test starts at ManageScreen after adding some terms', (): void => {
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
          },
          {
            vocabularyText: 'vocabulary2',
            definitions: ['meaning2'],
            category: 'category2',
          },
          {
            vocabularyText: 'vocabulary3',
            definitions: ['meaning3'],
            category: 'category3',
          },
        ]);
        await lightBoxDialog.close();
      }
    );

    it('move a term to Uncategorized in ManageScreen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.categorizeVocabulary('vocabulary2');
      await categorizeScreen.clearCategory();
      await categorizeScreen.save();
      await lightBoxDialog.okay();
      await lightBoxDialog.close();
      await manageScreen.showCategoryList();
      await manageScreen.expectCategoryToExist('Uncategorized');
      await manageScreen.expectCategoryToNotExist('category2');
      await manageScreen.viewCategoryDetail('Uncategorized');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary2');
    });

    it('move a term to an existing category in ManageScreen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.categorizeVocabulary('vocabulary2');
      await categorizeScreen.showAllCategories();
      await categorizeScreen.useCategory('category3');
      await categorizeScreen.save();
      await lightBoxDialog.close();
      await manageScreen.showCategoryList();
      await manageScreen.expectCategoryToExist('category3');
      await manageScreen.expectCategoryToNotExist('category2');
      await manageScreen.viewCategoryDetail('category3');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary2');
    });

    it('move a term to a new category in ManageScreen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.categorizeVocabulary('vocabulary2');
      await categorizeScreen.fillCategory('new category');
      await categorizeScreen.save();
      await lightBoxDialog.close();
      await manageScreen.showCategoryList();
      await manageScreen.expectCategoryToExist('new category');
      await manageScreen.expectCategoryToNotExist('category2');
      await manageScreen.viewCategoryDetail('new category');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary2');
    });

    it('move a term to Uncategorized in CategoryDetailScreen', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.viewCategoryDetail('category2');
      await categoryDetailScreen.categorizeVocabulary('vocabulary2');
      await categorizeScreen.clearCategory();
      await categorizeScreen.save();
      await lightBoxDialog.okay();
      await lightBoxDialog.close();
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary2');
      await categoryDetailScreen.back();
      await manageScreen.showCategoryList();
      await manageScreen.viewCategoryDetail('Uncategorized');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary2');
    });

    it('move a term to an existing category in CategoryDetailScreen', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.viewCategoryDetail('category2');
      await categoryDetailScreen.categorizeVocabulary('vocabulary2');
      await categorizeScreen.showAllCategories();
      await categorizeScreen.useCategory('category3');
      await categorizeScreen.save();
      await lightBoxDialog.close();
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary2');
      await categoryDetailScreen.back();
      await manageScreen.showCategoryList();
      await manageScreen.viewCategoryDetail('category3');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary2');
    });

    it('move a term to a new category in CategoryDetailScreen', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.viewCategoryDetail('category2');
      await manageScreen.categorizeVocabulary('vocabulary2');
      await categorizeScreen.fillCategory('new category');
      await categorizeScreen.save();
      await lightBoxDialog.close();
      await categoryDetailScreen.expectVocabularyToNotExist('vocabulary2');
      await categoryDetailScreen.back();
      await manageScreen.showCategoryList();
      await manageScreen.viewCategoryDetail('new category');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary2');
    });

    it('categorize vocabulary by entering new category at AddVocabularyScreen', async (): Promise<
      void
    > => {
      await manageScreen.navigateToAddVocabularyScreen();
      await addVocabularyScreen.fillVocabularyText('new vocabulary');
      await addVocabularyScreen.fillDefinitions(['meaning']);
      await addVocabularyScreen.showCategorySelectorScreen();
      await categorySelectorScreen.fillCategory('new category');
      await categorySelectorScreen.done();
      await addVocabularyScreen.save();
      await lightBoxDialog.close();
      await manageScreen.showCategoryList();
      await manageScreen.expectCategoryToExist('new category');
    });

    it('categorize vocabulary by selecting an existing category at AddVocabularyScreen', async (): Promise<
      void
    > => {
      await manageScreen.navigateToAddVocabularyScreen();
      await addVocabularyScreen.fillVocabularyText('new vocabulary');
      await addVocabularyScreen.fillDefinitions(['meaning']);
      await addVocabularyScreen.showCategorySelectorScreen();
      await categorySelectorScreen.useCategory('category2');
      await categorySelectorScreen.done();
      await addVocabularyScreen.save();
      await lightBoxDialog.close();
      await manageScreen.showCategoryList();
      await manageScreen.viewCategoryDetail('category2');
      await categoryDetailScreen.expectVocabularyToExist('new vocabulary');
    });

    it('categorize vocabulary by entering new category at EditVocabularyScreen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.editVocabulary('vocabulary1');
      await editVocabularyScreen.showCategorySelectorScreen();
      await categorySelectorScreen.fillCategory('new category');
      await categorySelectorScreen.done();
      await editVocabularyScreen.save();
      await lightBoxDialog.close();
      await manageScreen.showCategoryList();
      await manageScreen.expectCategoryToExist('new category');
    });

    it('categorize vocabulary by selecting an existing category at EditVocabularyScreen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.editVocabulary('vocabulary1');
      await editVocabularyScreen.showCategorySelectorScreen();
      await categorySelectorScreen.useCategory('category2');
      await categorySelectorScreen.done();
      await editVocabularyScreen.save();
      await lightBoxDialog.close();
      await manageScreen.showCategoryList();
      await manageScreen.viewCategoryDetail('category2');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary1');
    });
  });
});
