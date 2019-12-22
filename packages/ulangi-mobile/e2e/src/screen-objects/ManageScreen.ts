import { VocabularyFilterType } from '@ulangi/ulangi-common/enums';

import { ManageScreenIds } from '../../../src/constants/ids/ManageScreenIds';
import { Element } from '../adapters/Element';
import { categoryActionMenu } from './CategoryActionMenu';
import { categoryBulkActionBar } from './CategoryBulkActionBar';
import { categoryBulkActionMenu } from './CategoryBulkActionMenu';
import { categoryItem } from './CategoryItem';
import { manageListSelectionMenu } from './ManageListSelectionMenu';
import { TabScreen } from './TabScreen';
import { vocabularyActionMenu } from './VocabularyActionMenu';
import { vocabularyBulkActionBar } from './VocabularyBulkActionBar';
import { vocabularyBulkActionMenu } from './VocabularyBulkActionMenu';
import { vocabularyFilterMenu } from './VocabularyFilterMenu';
import { vocabularyItem } from './VocabularyItem';

export class ManageScreen extends TabScreen {
  public getScreenElement(): Element {
    return Element.byId(ManageScreenIds.SCREEN);
  }

  public async openMenuAndSelectFilter(
    filterType: VocabularyFilterType
  ): Promise<void> {
    await this.openFilterMenu();
    await vocabularyFilterMenu.selectFilter(filterType);
  }

  public async selectCategory(categoryName: string): Promise<void> {
    if (await categoryItem.canSelect(categoryName)) {
      await categoryItem.select(categoryName);
    } else {
      await this.openCategoryActionMenu(categoryName);
      await categoryActionMenu.select();
    }
  }

  public async unselectCategory(categoryName: string): Promise<void> {
    await categoryItem.unselect(categoryName);
  }

  public async selectAllFetchedCategories(): Promise<void> {
    await this.openCategoryBulkActionMenu();
    await categoryBulkActionMenu.selectAllFetchedCategories();
  }

  public async learnCategoryWithSpacedRepetition(
    categoryName: string
  ): Promise<void> {
    await this.openCategoryActionMenu(categoryName);
    await categoryActionMenu.learnWithSpacedRepetition();
  }

  public async learnCategoryWithWriting(categoryName: string): Promise<void> {
    await this.openCategoryActionMenu(categoryName);
    await categoryActionMenu.learnWithWriting();
  }

  public async quizCategory(categoryName: string): Promise<void> {
    await this.openCategoryActionMenu(categoryName);
    await categoryActionMenu.quiz();
  }

  public async learnSelectedCategoriesWithSpacedRepetition(): Promise<void> {
    await categoryBulkActionBar.openActionMenu();
    await categoryBulkActionMenu.learnWithSpacedRepetition();
  }

  public async learnSelectedCategoriesWithWriting(): Promise<void> {
    await categoryBulkActionBar.openActionMenu();
    await categoryBulkActionMenu.learnWithWriting();
  }

  public async quizSelectedCategories(): Promise<void> {
    await categoryBulkActionBar.openActionMenu();
    await categoryBulkActionMenu.quiz();
  }

  public async selectVocabulary(vocabularyText: string): Promise<void> {
    if (await vocabularyItem.canSelect(vocabularyText)) {
      await vocabularyItem.select(vocabularyText);
    } else {
      await this.openVocabularyActionMenu(vocabularyText);
      await vocabularyActionMenu.select();
    }
  }

  public async unselectVocabulary(vocabularyText: string): Promise<void> {
    await vocabularyItem.unselect(vocabularyText);
  }

  public async editVocabulary(vocabularyText: string): Promise<void> {
    await this.openVocabularyActionMenu(vocabularyText);
    await vocabularyActionMenu.edit();
  }

  public async moveVocabulary(vocabularyText: string): Promise<void> {
    await this.openVocabularyActionMenu(vocabularyText);
    await vocabularyActionMenu.move();
  }

  public async categorizeVocabulary(vocabularyText: string): Promise<void> {
    await this.openVocabularyActionMenu(vocabularyText);
    await vocabularyActionMenu.categorize();
  }

  public async restoreVocabulary(vocabularyText: string): Promise<void> {
    await this.openVocabularyActionMenu(vocabularyText);
    await vocabularyActionMenu.restore();
  }

  public async archiveVocabulary(vocabularyText: string): Promise<void> {
    await this.openVocabularyActionMenu(vocabularyText);
    await vocabularyActionMenu.archive();
  }

  public async deleteVocabulary(vocabularyText: string): Promise<void> {
    await this.openVocabularyActionMenu(vocabularyText);
    await vocabularyActionMenu.delete();
  }

  public async selectAllFetchedTerms(): Promise<void> {
    await this.openVocabularyBulkActionMenu();
    await vocabularyBulkActionMenu.selectAllFetchedTerms();
  }

  public async moveSelectedVocabulary(): Promise<void> {
    await this.openVocabularyBulkActionMenu();
    await vocabularyBulkActionMenu.moveSelected();
  }

  public async categorizeSelectedVocabulary(): Promise<void> {
    await this.openVocabularyBulkActionMenu();
    await vocabularyBulkActionMenu.categorizeSelected();
  }

  public async restoreSelectedVocabulary(): Promise<void> {
    await this.openVocabularyBulkActionMenu();
    await vocabularyBulkActionMenu.restoreSelected();
  }

  public async archiveSelectedVocabulary(): Promise<void> {
    await this.openVocabularyBulkActionMenu();
    await vocabularyBulkActionMenu.archiveSelected();
  }

  public async deleteSelectedVocabulary(): Promise<void> {
    await this.openVocabularyBulkActionMenu();
    await vocabularyBulkActionMenu.deleteSelected();
  }

  public async showVocabularyList(): Promise<void> {
    await this.openListTypeMenu();
    await manageListSelectionMenu.select('vocabularyList');
  }

  public async showCategoryList(): Promise<void> {
    await this.openListTypeMenu();
    await manageListSelectionMenu.select('categoryList');
  }

  public async viewCategoryDetail(categoryName: string): Promise<void> {
    await categoryItem.viewDetail(categoryName);
  }

  public async expectCategoryToExist(categoryName: string): Promise<void> {
    await categoryItem.expectToExist(categoryName);
  }

  public async expectCategoryToNotExist(categoryName: string): Promise<void> {
    await categoryItem.expectToNotExist(categoryName);
  }

  public async viewVocabularyDetail(vocabularyText: string): Promise<void> {
    await vocabularyItem.viewDetail(vocabularyText);
  }

  public async expectVocabularyToExist(vocabularyText: string): Promise<void> {
    await vocabularyItem.expectToExist(vocabularyText);
  }

  public async expectVocabularyToNotExist(
    vocabularyText: string
  ): Promise<void> {
    await vocabularyItem.expectToNotExist(vocabularyText);
  }

  public async expectVocabularyHaveExtraField(vocabularyTerm: string, name: string, value: string): Promise<void> {
    await vocabularyItem.expectVocabularyToHaveExtraField(vocabularyTerm, name, value);
  }

  public async expectVocabularyToHaveDefinitionExtraFieldAtIndex(
    vocabularyTerm: string,
    definitionIndex: number,
    name: string,
    value: string
  ): Promise<void> {
    await vocabularyItem.expectVocabularyToHaveDefinitionExtraFieldAtIndex(
      vocabularyTerm,
      definitionIndex,
      name,
      value
    );
  }

  public async expectVocabularyToHaveWordClassAtIndex(
    vocabularyTerm: string,
    definitionIndex: number,
    wordClass: string,
  ): Promise<void> {
    await vocabularyItem.expectVocabularyToHaveWordClassAtIndex(
      vocabularyTerm,
      definitionIndex,
      wordClass
    );
  }

  public async navigateToAddVocabularyScreen(): Promise<void> {
    await Element.byId(ManageScreenIds.ADD_VOCABULARY_BTN).tap();
  }

  public async navigateToSearchScreen(): Promise<void> {
    await Element.byId(ManageScreenIds.SEARCH_BTN).tap();
  }

  public async openListTypeMenu(): Promise<void> {
    await Element.byId(
      ManageScreenIds.SHOW_MANAGE_LIST_SELECTION_MENU_BTN
    ).tap();
  }

  public async openFilterMenu(): Promise<void> {
    await Element.byId(ManageScreenIds.SHOW_VOCABULARY_FILTER_MENU_BTN).tap();
  }

  public async openCategoryActionMenu(categoryName): Promise<void> {
    await categoryItem.openActionMenu(categoryName);
  }

  public async openCategoryBulkActionMenu(): Promise<void> {
    await categoryBulkActionBar.openActionMenu();
  }

  public async openVocabularyActionMenu(vocabularyText): Promise<void> {
    await vocabularyItem.openActionMenu(vocabularyText);
  }

  public async openVocabularyBulkActionMenu(): Promise<void> {
    await vocabularyBulkActionBar.openActionMenu();
  }

  public async openSetSelectionMenu(): Promise<void> {
    await Element.byId(ManageScreenIds.SHOW_SET_SELECTION_MENU_BTN).tap();
  }

  public async expectToHaveSubtitle(subtitle: string): Promise<void> {
    await Element.byId(ManageScreenIds.TOP_BAR).expectToHaveDescendant(
      Element.byText(subtitle)
    );
  }

  public async expectVocabularyToHaveDefinition(
    vocabularyText: string,
    definition: string
  ): Promise<void> {
    await vocabularyItem.expectVocabularyToHaveDefinition(vocabularyText, definition);
  }

  public async expectVocabularyToNotHaveDefinition(
    vocabularyText: string,
    definition: string
  ): Promise<void> {
    await vocabularyItem.expectVocabularyToNotHaveDefinition(vocabularyText, definition);
  }
}

export const manageScreen = new ManageScreen();
