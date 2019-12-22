import { CategoryBulkActionMenuIds } from '../../../src/constants/ids/CategoryBulkActionMenuIds';
import { Element } from '../adapters/Element';

export class CategoryBulkActionMenu {
  public async selectAllFetchedCategories(): Promise<void> {
    await Element.byId(
      CategoryBulkActionMenuIds.SELECT_ALL_FETCHED_CATEGORIES_BTN
    ).tap();
  }

  public async learnWithSpacedRepetition(): Promise<void> {
    await Element.byId(
      CategoryBulkActionMenuIds.LEARN_WITH_SPACED_REPPETITION_BTN
    ).tap();
  }

  public async learnWithWriting(): Promise<void> {
    await Element.byId(CategoryBulkActionMenuIds.LEARN_WITH_WRITING_BTN).tap();
  }

  public async quiz(): Promise<void> {
    await Element.byId(CategoryBulkActionMenuIds.QUIZ_BTN).tap();
  }
}

export const categoryBulkActionMenu = new CategoryBulkActionMenu();
