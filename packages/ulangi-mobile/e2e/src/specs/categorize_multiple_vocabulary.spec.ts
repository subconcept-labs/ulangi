import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { categorizeScreen } from '../screen-objects/CategorizeScreen';
import { categoryDetailScreen } from '../screen-objects/CategoryDetailScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Categorize multiple vocabulary', (): void => {
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
            category: 'category',
          },
          {
            vocabularyText: 'vocabulary3',
            definitions: ['meaning3'],
            category: 'category',
          },
          {
            vocabularyText: 'vocabulary4',
            definitions: ['meaning4'],
            category: 'another category',
          },
        ]);
        await lightBoxDialog.close();
      }
    );

    it('move multiple terms to Uncategorized in ManageScreen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.selectVocabulary('vocabulary2');
      await manageScreen.selectVocabulary('vocabulary3');
      await manageScreen.selectVocabulary('vocabulary4');
      await manageScreen.categorizeSelectedVocabulary();
      await categorizeScreen.save();
      await lightBoxDialog.okay();
      await lightBoxDialog.close();
      await manageScreen.showCategoryList();
      await manageScreen.expectCategoryToExist('Uncategorized');
      await manageScreen.expectCategoryToNotExist('category');
      await manageScreen.expectCategoryToNotExist('another category');
      await manageScreen.viewCategoryDetail('Uncategorized');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary2');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary3');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary4');
    });

    it('move multiple terms to an existing category in ManageScreen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.selectVocabulary('vocabulary1');
      await manageScreen.selectVocabulary('vocabulary2');
      await manageScreen.selectVocabulary('vocabulary3');
      await manageScreen.categorizeSelectedVocabulary();
      await categorizeScreen.showAllCategories();
      await categorizeScreen.useCategory('another category');
      await categorizeScreen.save();
      await lightBoxDialog.close();
      await manageScreen.showCategoryList();
      await manageScreen.expectCategoryToExist('another category');
      await manageScreen.expectCategoryToNotExist('Uncategorized');
      await manageScreen.expectCategoryToNotExist('category');
      await manageScreen.viewCategoryDetail('another category');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary1');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary2');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary3');
    });

    it('move multiple terms to a new category in ManageScreen', async (): Promise<
      void
    > => {
      await manageScreen.showVocabularyList();
      await manageScreen.selectVocabulary('vocabulary1');
      await manageScreen.selectVocabulary('vocabulary2');
      await manageScreen.selectVocabulary('vocabulary3');
      await manageScreen.selectVocabulary('vocabulary4');
      await manageScreen.categorizeSelectedVocabulary();
      await categorizeScreen.fillCategory('new category');
      await categorizeScreen.save();
      await lightBoxDialog.close();
      await manageScreen.showCategoryList();
      await manageScreen.expectCategoryToExist('new category');
      await manageScreen.expectCategoryToNotExist('Uncategorized');
      await manageScreen.expectCategoryToNotExist('category');
      await manageScreen.expectCategoryToNotExist('another category');
      await manageScreen.viewCategoryDetail('new category');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary1');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary2');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary3');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary4');
    });

    it('move multiple terms to Uncategorized in CategoryDetailScreen', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.viewCategoryDetail('category');
      await categoryDetailScreen.selectVocabulary('vocabulary2');
      await categoryDetailScreen.selectVocabulary('vocabulary3');
      await categoryDetailScreen.categorizeSelectedVocabulary();
      await categorizeScreen.save();
      await lightBoxDialog.okay();
      await lightBoxDialog.close();
      await categoryDetailScreen.back();
      await manageScreen.showCategoryList();
      await manageScreen.expectCategoryToExist('Uncategorized');
      await manageScreen.expectCategoryToNotExist('category');
      await manageScreen.viewCategoryDetail('Uncategorized');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary2');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary3');
    });

    it('move multiple terms to an existing category in CategoryDetailScreen', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.viewCategoryDetail('category');
      await categoryDetailScreen.selectVocabulary('vocabulary2');
      await categoryDetailScreen.selectVocabulary('vocabulary3');
      await categoryDetailScreen.categorizeSelectedVocabulary();
      await categorizeScreen.showAllCategories();
      await categorizeScreen.useCategory('another category');
      await categorizeScreen.save();
      await lightBoxDialog.close();
      await categoryDetailScreen.back();
      await manageScreen.showCategoryList();
      await manageScreen.expectCategoryToExist('another category');
      await manageScreen.expectCategoryToNotExist('category');
      await manageScreen.viewCategoryDetail('another category');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary3');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary4');
    });

    it('move multiple terms to a new category in CategoryDetailScreen', async (): Promise<
      void
    > => {
      await manageScreen.showCategoryList();
      await manageScreen.viewCategoryDetail('category');
      await categoryDetailScreen.selectVocabulary('vocabulary2');
      await categoryDetailScreen.selectVocabulary('vocabulary3');
      await categoryDetailScreen.categorizeSelectedVocabulary();
      await categorizeScreen.fillCategory('new category');
      await categorizeScreen.save();
      await lightBoxDialog.close();
      await categoryDetailScreen.back();
      await manageScreen.showCategoryList();
      await manageScreen.expectCategoryToExist('new category');
      await manageScreen.expectCategoryToNotExist('category');
      await manageScreen.viewCategoryDetail('new category');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary2');
      await categoryDetailScreen.expectVocabularyToExist('vocabulary3');
    });
  });
});
