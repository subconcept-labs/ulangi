import { LevelSelectionMenuIds } from '../../../src/constants/ids/LevelSelectionMenuIds';
import { Element } from '../adapters/Element';

export class LevelSelectionMenu {
  public async select(level: number): Promise<void> {
    await Element.byId(
      LevelSelectionMenuIds.SELECT_LEVEL_BTN_BY_LEVEL(level)
    ).tap();
  }
}

export const levelSelectionMenu = new LevelSelectionMenu();
