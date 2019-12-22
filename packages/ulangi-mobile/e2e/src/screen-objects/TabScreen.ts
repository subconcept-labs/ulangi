import { BottomTabIds } from '../../../src/constants/ids/BottomTabIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export abstract class TabScreen extends Screen {
  public async navigateToManageScreen(): Promise<void> {
    await Element.byId(BottomTabIds.MANAGE_BTN).tap();
  }

  public async navigateToDiscoverScreen(): Promise<void> {
    await Element.byId(BottomTabIds.DISCOVER_BTN).tap();
  }

  public async navigateToLearnScreen(): Promise<void> {
    await Element.byId(BottomTabIds.LEARN_BTN).tap();
  }

  public async navigateToPlayScreen(): Promise<void> {
    await Element.byId(BottomTabIds.PLAY_BTN).tap();
  }

  public async navigateToMoreScreen(): Promise<void> {
    await Element.byId(BottomTabIds.MORE_BTN).tap();
  }
}
