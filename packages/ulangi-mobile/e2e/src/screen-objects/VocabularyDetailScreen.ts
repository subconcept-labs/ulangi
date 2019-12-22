import { VocabularyDetailScreenIds } from '../../../src/constants/ids/VocabularyDetailScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class VocabularyDetailScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(VocabularyDetailScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(VocabularyDetailScreenIds.BACK_BTN).tap();
  }
}

export const vocabularyDetailScreen = new VocabularyDetailScreen();
