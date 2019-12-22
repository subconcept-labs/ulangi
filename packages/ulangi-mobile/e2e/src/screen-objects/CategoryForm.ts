import { CategoryFormIds } from '../../../src/constants/ids/CategoryFormIds';
import { Element } from '../adapters/Element';

export class CategoryForm {
  public async fillCategory(category: string): Promise<void> {
    await Element.byId(CategoryFormIds.CATEGORY_INPUT).replaceText(
      category
    );
  }

  public async showAllCategories(): Promise<void> {
    await Element.byId(CategoryFormIds.SHOW_ALL_BTN).tap();
  }

  public async clearCategory(): Promise<void> {
    await Element.byId(CategoryFormIds.CATEGORY_INPUT).clearText();
  }

  public async useCategory(category: string): Promise<void> {
    await Element.byId(
      CategoryFormIds.USE_BTN_BY_CATEGORY_NAME(category)
    ).tap();
  }
}

export const categoryForm = new CategoryForm();
