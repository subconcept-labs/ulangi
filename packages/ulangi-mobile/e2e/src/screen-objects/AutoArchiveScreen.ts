import { AutoArchiveScreenIds } from '../../../src/constants/ids/AutoArchiveScreenIds';
import { Element } from '../adapters/Element';
import { levelSelectionMenu } from './LevelSelectionMenu';
import { Screen } from './Screen';

export class AutoArchiveScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(AutoArchiveScreenIds.SCREEN);
  }

  public async save(): Promise<void> {
    await Element.byId(AutoArchiveScreenIds.SAVE_BTN).tap();
  }

  public async back(): Promise<void> {
    await Element.byId(AutoArchiveScreenIds.BACK_BTN).tap();
  }

  public async toggle(): Promise<void> {
    await Element.byId(AutoArchiveScreenIds.AUTO_ARCHIVE_TOGGLE_BTN).tap();
  }

  public async setSRLevelThreshold(level: number): Promise<void> {
    await Element.byId(
      AutoArchiveScreenIds.SHOW_SELECT_SR_LEVEL_MENU_BTN
    ).tap();
    await levelSelectionMenu.select(level);
  }

  public async setWRLevelThreshold(level: number): Promise<void> {
    await Element.byId(
      AutoArchiveScreenIds.SHOW_SELECT_WR_LEVEL_MENU_BTN
    ).tap();
    await levelSelectionMenu.select(level);
  }

  public async expectToHaveSRLevelThreshold(level: number): Promise<void> {
    await Element.byId(
      AutoArchiveScreenIds.SHOW_SELECT_SR_LEVEL_MENU_BTN
    ).expectToHaveDescendant(Element.byText('Level ' + level));
  }

  public async expectToHaveWRLevelThreshold(level: number): Promise<void> {
    await Element.byId(
      AutoArchiveScreenIds.SHOW_SELECT_WR_LEVEL_MENU_BTN
    ).expectToHaveDescendant(Element.byText('Level ' + level));
  }
}

export const autoArchiveScreen = new AutoArchiveScreen();
