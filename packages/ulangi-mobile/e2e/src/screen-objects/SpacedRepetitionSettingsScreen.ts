import { SpacedRepetitionSettingsScreenIds } from '../../../src/constants/ids/SpacedRepetitionSettingsScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class SpacedRepetitionSettingsScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(SpacedRepetitionSettingsScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(SpacedRepetitionSettingsScreenIds.BACK_BTN).tap();
  }

  public async save(): Promise<void> {
    await Element.byId(SpacedRepetitionSettingsScreenIds.SAVE_BTN).tap();
  }

  public async changeInterval(interval: number): Promise<void> {
    await Element.byId(
      SpacedRepetitionSettingsScreenIds.INITIAL_INTERVAL_BTN
    ).tap();
    await Element.byId(
      SpacedRepetitionSettingsScreenIds.SELECT_INITIAL_INTERVAL_BTN_BY_INITIAL_INTERVAL(
        interval
      )
    ).tap();
  }

  public async expectToNotHaveInterval(interval: number): Promise<void> {
    await Element.byId(
      SpacedRepetitionSettingsScreenIds.INITIAL_INTERVAL_BTN
    ).expectToNotHaveDescendant(Element.byText(interval + ' hours'));
  }

  public async expectToHaveInterval(interval: number): Promise<void> {
    await Element.byId(
      SpacedRepetitionSettingsScreenIds.INITIAL_INTERVAL_BTN
    ).expectToHaveDescendant(Element.byText(interval + ' hours'));
  }
}

export const spacedRepetitionSettingsScreen = new SpacedRepetitionSettingsScreen();
