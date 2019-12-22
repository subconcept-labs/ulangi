import { PlayScreenIds } from '../../../src/constants/ids/PlayScreenIds';
import { Element } from '../adapters/Element';
import { TabScreen } from '../screen-objects/TabScreen';

export class PlayScreen extends TabScreen {
  public getScreenElement(): Element {
    return Element.byId(PlayScreenIds.SCREEN);
  }

  public async navigateToAtomScreen(): Promise<void> {
    await Element.byId(PlayScreenIds.ATOM_BTN).tap();
  }

  public async navigateToReflexScreen(): Promise<void> {
    await Element.byId(PlayScreenIds.REFLEX_BTN).tap();
  }

  public async openSetSelectionMenu(): Promise<void> {
    await Element.byId(PlayScreenIds.SHOW_SET_SELECTION_MENU_BTN).tap();
  }

  public async expectToHaveSubtitle(subtitle: string): Promise<void> {
    await Element.byId(PlayScreenIds.TOP_BAR).expectToHaveDescendant(
      Element.byText(subtitle)
    );
  }
}

export const playScreen = new PlayScreen();
