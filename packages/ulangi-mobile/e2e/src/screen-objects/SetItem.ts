import { SetItemIds } from '../../../src/constants/ids/SetItemIds';
import { Element } from '../adapters/Element';

export class SetItem {
  public async openActionMenu(setName: string): Promise<void> {
    await Element.byId(
      SetItemIds.SHOW_ACTION_MENU_BTN_BY_SET_NAME(setName)
    ).tap();
  }

  public async expectToExist(setName: string): Promise<void> {
    await Element.byId(
      SetItemIds.SET_ITEM_CONTAINER_BY_SET_NAME(setName)
    ).expectToExist();
  }

  public async expectToNotExist(setName: string): Promise<void> {
    await Element.byId(
      SetItemIds.SET_ITEM_CONTAINER_BY_SET_NAME(setName)
    ).expectToNotExist();
  }

  public async expectToBeUsing(setName: string): Promise<void> {
    await Element.byId(
      SetItemIds.SET_ITEM_CONTAINER_BY_SET_NAME(setName)
    ).expectToHaveDescendant(Element.byText('using'));
  }
}

export const setItem = new SetItem();
