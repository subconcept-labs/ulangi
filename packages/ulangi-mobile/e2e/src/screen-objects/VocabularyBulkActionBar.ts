import { VocabularyBulkActionBarIds } from '../../../src/constants/ids/VocabularyBulkActionBarIds';
import { Element } from '../adapters/Element';

export class VocabularyBulkActionBar {
  public async openActionMenu(): Promise<void> {
    await Element.byId(VocabularyBulkActionBarIds.BULK_ACTION_BTN).tap();
  }

  public async clear(): Promise<void> {
    await Element.byId(VocabularyBulkActionBarIds.CLEAR_BTN).tap();
  }
}

export const vocabularyBulkActionBar = new VocabularyBulkActionBar();
