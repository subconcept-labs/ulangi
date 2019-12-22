import { ManageListSelectionMenuIds } from '../../../src/constants/ids/ManageListSelectionMenuIds';
import { Element } from '../adapters/Element';

export class ManageListSelectionMenu {
  public async select(
    listType: 'vocabularyList' | 'categoryList'
  ): Promise<void> {
    await Element.byId(
      ManageListSelectionMenuIds.SELECT_LIST_BTN_BY_LIST_TYPE(listType)
    ).tap();
  }
}

export const manageListSelectionMenu = new ManageListSelectionMenu();
