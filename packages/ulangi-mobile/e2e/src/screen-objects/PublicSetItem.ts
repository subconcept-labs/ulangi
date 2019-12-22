import { PublicSetItemIds } from '../../../src/constants/ids/PublicSetItemIds';
import { Element } from '../adapters/Element';

export class PublicSetItem {
  public async expectToExist(setTitle: string): Promise<void> {
    await Element.byId(
      PublicSetItemIds.VIEW_DETAIL_BTN_BY_SET_TITLE(setTitle)
    ).expectToExist();
  }

  public async viewDetail(setTitle: string): Promise<void> {
    await Element.byId(
      PublicSetItemIds.VIEW_DETAIL_BTN_BY_SET_TITLE(setTitle)
    ).tap();
  }
}

export const publicSetItem = new PublicSetItem();
