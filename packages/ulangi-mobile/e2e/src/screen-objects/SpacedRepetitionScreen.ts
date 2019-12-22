import { SpacedRepetitionScreenIds } from '../../../src/constants/ids/SpacedRepetitionScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class SpacedRepetitionScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(SpacedRepetitionScreenIds.SCREEN);
  }

  public async navigateToSpacedRepetitionLessonScreen(): Promise<void> {
    await Element.byId(SpacedRepetitionScreenIds.START_BTN).tap();
  }

  public async navigateToSpacedRepetitionSettingsScreen(): Promise<void> {
    await Element.byId(SpacedRepetitionScreenIds.SETTINGS_BTN).tap();
  }

  public async navigateToSpacedRepetitionFAQScreen(): Promise<void> {
    await Element.byId(SpacedRepetitionScreenIds.FAQ_BTN).tap();
  }

  public async back(): Promise<void> {
    await Element.byId(SpacedRepetitionScreenIds.BACK_BTN).tap();
  }
}

export const spacedRepetitionScreen = new SpacedRepetitionScreen();
