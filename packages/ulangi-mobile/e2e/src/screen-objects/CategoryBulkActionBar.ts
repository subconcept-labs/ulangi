import { CategoryBulkActionBarIds } from '../../../src/constants/ids/CategoryBulkActionBarIds';
import { Element } from '../adapters/Element';

export class CategoryBulkActionBar {
  public async openActionMenu(): Promise<void> {
    await Element.byId(CategoryBulkActionBarIds.BULK_ACTION_BTN).tap();
  }

  public async clear(): Promise<void> {
    await Element.byId(CategoryBulkActionBarIds.CLEAR_BTN).tap();
  }
}

export const categoryBulkActionBar = new CategoryBulkActionBar();
