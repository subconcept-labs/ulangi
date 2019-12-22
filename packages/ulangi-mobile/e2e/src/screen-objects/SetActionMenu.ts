import { SetActionMenuIds } from '../../../src/constants/ids/SetActionMenuIds';
import { Element } from '../adapters/Element';

export class SetActionMenu {
  public async use(): Promise<void> {
    await Element.byId(SetActionMenuIds.USE_THIS_SET_BTN).tap();
  }

  public async edit(): Promise<void> {
    await Element.byId(SetActionMenuIds.EDIT_BTN).tap();
  }

  public async restore(): Promise<void> {
    await Element.byId(SetActionMenuIds.RESTORE_BTN).tap();
  }

  public async archive(): Promise<void> {
    await Element.byId(SetActionMenuIds.ARCHIVE_BTN).tap();
  }

  public async delete(): Promise<void> {
    await Element.byId(SetActionMenuIds.DELETE_BTN).tap();
  }
}

export const setActionMenu = new SetActionMenu();
