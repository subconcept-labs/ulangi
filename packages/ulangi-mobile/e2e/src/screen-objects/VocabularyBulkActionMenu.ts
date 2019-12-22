import { VocabularyBulkActionMenuIds } from '../../../src/constants/ids/VocabularyBulkActionMenuIds';
import { Element } from '../adapters/Element';

export class VocabularyBulkActionMenu {
  public async selectAllFetchedTerms(): Promise<void> {
    await Element.byId(
      VocabularyBulkActionMenuIds.SELECT_ALL_FETCHED_TERMS_BTN
    ).tap();
  }

  public async categorizeSelected(): Promise<void> {
    await Element.byId(
      VocabularyBulkActionMenuIds.CATEGORIZE_SELECTED_BTN
    ).tap();
  }

  public async moveSelected(): Promise<void> {
    await Element.byId(VocabularyBulkActionMenuIds.MOVE_SELECTED_BTN).tap();
  }

  public async restoreSelected(): Promise<void> {
    await Element.byId(VocabularyBulkActionMenuIds.RESTORE_SELECTED_BTN).tap();
  }

  public async archiveSelected(): Promise<void> {
    await Element.byId(VocabularyBulkActionMenuIds.ARCHIVE_SELECTED_BTN).tap();
  }

  public async deleteSelected(): Promise<void> {
    await Element.byId(VocabularyBulkActionMenuIds.DELETE_SELECTED_BTN).tap();
  }
}

export const vocabularyBulkActionMenu = new VocabularyBulkActionMenu();
