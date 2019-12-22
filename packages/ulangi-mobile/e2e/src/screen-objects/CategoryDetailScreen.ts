import { VocabularyFilterType } from '@ulangi/ulangi-common/enums';

import { CategoryDetailScreenIds } from '../../../src/constants/ids/CategoryDetailScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';
import { vocabularyActionMenu } from './VocabularyActionMenu';
import { vocabularyBulkActionBar } from './VocabularyBulkActionBar';
import { vocabularyBulkActionMenu } from './VocabularyBulkActionMenu';
import { vocabularyFilterMenu } from './VocabularyFilterMenu';
import { vocabularyItem } from './VocabularyItem';

export class CategoryDetailScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(CategoryDetailScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(CategoryDetailScreenIds.BACK_BTN).tap();
  }

  public async openMenuAndSelectFilter(
    filterType: VocabularyFilterType
  ): Promise<void> {
    await this.openFilterMenu();
    await vocabularyFilterMenu.selectFilter(filterType);
  }

  public async openFilterMenu(): Promise<void> {
    await Element.byId(
      CategoryDetailScreenIds.SHOW_VOCABULARY_FILTER_MENU_BTN
    ).tap();
  }

  public async selectVocabulary(vocabularyTerm: string): Promise<void> {
    if (await vocabularyItem.canSelect(vocabularyTerm)) {
      await vocabularyItem.select(vocabularyTerm);
    } else {
      await this.openVocabularyActionMenu(vocabularyTerm);
      await vocabularyActionMenu.select();
    }
  }

  public async unselectVocabulary(vocabularyTerm: string): Promise<void> {
    await vocabularyItem.unselect(vocabularyTerm);
  }

  public async editVocabulary(vocabularyTerm: string): Promise<void> {
    await this.openVocabularyActionMenu(vocabularyTerm);
    await vocabularyActionMenu.edit();
  }

  public async moveVocabulary(vocabularyTerm: string): Promise<void> {
    await this.openVocabularyActionMenu(vocabularyTerm);
    await vocabularyActionMenu.move();
  }

  public async categorizeVocabulary(vocabularyTerm: string): Promise<void> {
    await this.openVocabularyActionMenu(vocabularyTerm);
    await vocabularyActionMenu.categorize();
  }

  public async restoreVocabulary(vocabularyTerm: string): Promise<void> {
    await this.openVocabularyActionMenu(vocabularyTerm);
    await vocabularyActionMenu.restore();
  }

  public async archiveVocabulary(vocabularyTerm: string): Promise<void> {
    await this.openVocabularyActionMenu(vocabularyTerm);
    await vocabularyActionMenu.archive();
  }

  public async deleteVocabulary(vocabularyTerm: string): Promise<void> {
    await this.openVocabularyActionMenu(vocabularyTerm);
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

  public async expectVocabularyToHaveDefinition(
    vocabularyTerm: string,
    definition: string
  ): Promise<void> {
    await vocabularyItem.expectVocabularyToHaveDefinition(vocabularyTerm, definition);
  }

  public async expectVocabularyToNotHaveDefinition(
    vocabularyTerm: string,
    definition: string
  ): Promise<void> {
    await vocabularyItem.expectVocabularyToNotHaveDefinition(vocabularyTerm, definition);
  }

  public async openVocabularyActionMenu(vocabularyTerm): Promise<void> {
    await vocabularyItem.openActionMenu(vocabularyTerm);
  }

  public async openVocabularyBulkActionMenu(): Promise<void> {
    await vocabularyBulkActionBar.openActionMenu();
  }

  public async expectVocabularyToExist(vocabularyTerm: string): Promise<void> {
    await vocabularyItem.expectToExist(vocabularyTerm);
  }

  public async expectVocabularyToNotExist(
    vocabularyTerm: string
  ): Promise<void> {
    await vocabularyItem.expectToNotExist(vocabularyTerm);
  }

  public async viewVocabularyDetail(vocabularyTerm: string): Promise<void> {
    await vocabularyItem.viewDetail(vocabularyTerm);
  }
}

export const categoryDetailScreen = new CategoryDetailScreen();
