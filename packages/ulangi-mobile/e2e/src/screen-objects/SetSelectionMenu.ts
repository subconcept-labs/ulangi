import { SetSelectionMenuIds } from '../../../src/constants/ids/SetSelectionMenuIds';
import { Element } from '../adapters/Element';

export class SetSelectionMenu {
  public async select(setName: string): Promise<void> {
    await Element.byId(
      SetSelectionMenuIds.SELECT_SET_BTN_BY_SET_NAME(setName)
    ).tap();
  }

  public async navigateToAddSetScreen(): Promise<void> {
    await Element.byId(SetSelectionMenuIds.ADD_SET_BTN).tap();
  }

  public async navigateToSetManagementScreen(): Promise<void> {
    await Element.byId(SetSelectionMenuIds.MANAGE_BTN).tap();
  }
}

export const setSelectionMenu = new SetSelectionMenu();
