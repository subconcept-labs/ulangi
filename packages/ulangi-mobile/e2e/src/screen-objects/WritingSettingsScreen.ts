import { WritingSettingsScreenIds } from '../../../src/constants/ids/WritingSettingsScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class WritingSettingsScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(WritingSettingsScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(WritingSettingsScreenIds.BACK_BTN).tap();
  }

  public async save(): Promise<void> {
    await Element.byId(WritingSettingsScreenIds.SAVE_BTN).tap();
  }

  public async changeInterval(interval: number): Promise<void> {
    await Element.byId(WritingSettingsScreenIds.INITIAL_INTERVAL_BTN).tap();
    await Element.byId(
      WritingSettingsScreenIds.SELECT_INITIAL_INTERVAL_BTN_BY_INITIAL_INTERVAL(
        interval
      )
    ).tap();
  }

  public async expectToHaveInterval(interval: number): Promise<void> {
    await Element.byId(
      WritingSettingsScreenIds.INITIAL_INTERVAL_BTN
    ).expectToHaveDescendant(Element.byText(interval + ' hours'));
  }
}

export const writingSettingsScreen = new WritingSettingsScreen();
