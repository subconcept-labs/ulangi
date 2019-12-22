import { SetManagementScreenIds } from '../../../src/constants/ids/SetManagementScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';
import { setActionMenu } from './SetActionMenu';
import { setItem } from './SetItem';

export class SetManagementScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(SetManagementScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(SetManagementScreenIds.BACK_BTN).tap();
  }

  public async navigateToAddSetScreen(): Promise<void> {
    await Element.byId(SetManagementScreenIds.ADD_BTN).tap();
  }

  public async showSets(
    setStatus: 'active' | 'archived' | 'deleted'
  ): Promise<void> {
    await Element.byId(
      SetManagementScreenIds.SELECT_TAB_BTN_BY_SET_STATUS(setStatus)
    ).tap();
  }

  public async editSet(setName: string): Promise<void> {
    await setItem.openActionMenu(setName);
    await setActionMenu.edit();
  }

  public async restoreSet(setName: string): Promise<void> {
    await setItem.openActionMenu(setName);
    await setActionMenu.restore();
  }

  public async archiveSet(setName: string): Promise<void> {
    await setItem.openActionMenu(setName);
    await setActionMenu.archive();
  }

  public async deleteSet(setName: string): Promise<void> {
    await setItem.openActionMenu(setName);
    await setActionMenu.delete();
  }

  public async selectSetToUse(setName: string): Promise<void> {
    await setItem.openActionMenu(setName);
    await setActionMenu.use();
  }

  public async expectSetToExist(setName: string): Promise<void> {
    await setItem.expectToExist(setName);
  }

  public async expectSetToNotExist(setName: string): Promise<void> {
    await setItem.expectToNotExist(setName);
  }

  public async expectSetToBeUsing(setName: string): Promise<void> {
    await setItem.expectToBeUsing(setName);
  }
}

export const setManagementScreen = new SetManagementScreen();
