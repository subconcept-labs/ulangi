import { CategoryItemIds } from '../../../src/constants/ids/CategoryItemIds';
import { Element } from '../adapters/Element';

export class CategoryItem {
  public async openActionMenu(categoryName: string): Promise<void> {
    await Element.byId(
      CategoryItemIds.SHOW_ACTION_MENU_BTN_BY_CATEGORY_NAME(categoryName)
    ).tap();
  }

  public async canSelect(categoryName: string): Promise<boolean> {
    return Element.byId(
      CategoryItemIds.SELECT_BTN_BY_CATEGORY_NAME(categoryName)
    ).isExisting();
  }

  public async select(categoryName: string): Promise<void> {
    await Element.byId(
      CategoryItemIds.SELECT_BTN_BY_CATEGORY_NAME(categoryName)
    ).tap();
  }

  public async unselect(categoryName: string): Promise<void> {
    await Element.byId(
      CategoryItemIds.UNSELECT_BTN_BY_CATEGORY_NAME(categoryName)
    ).tap();
  }

  public async viewDetail(categoryName: string): Promise<void> {
    await Element.byId(
      CategoryItemIds.VIEW_DETAIL_BTN_BY_CATEGORY_NAME(categoryName)
    ).tap();
  }

  public async expectToExist(categoryName: string): Promise<void> {
    await Element.byId(
      CategoryItemIds.VIEW_DETAIL_BTN_BY_CATEGORY_NAME(categoryName)
    ).expectToExist();
  }

  public async expectToNotExist(categoryName: string): Promise<void> {
    await Element.byId(
      CategoryItemIds.VIEW_DETAIL_BTN_BY_CATEGORY_NAME(categoryName)
    ).expectToNotExist();
  }
}

export const categoryItem = new CategoryItem();
