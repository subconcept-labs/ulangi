import { PublicSetDetailScreenIds } from '../../../src/constants/ids/PublicSetDetailScreenIds';
import { Element } from '../adapters/Element';
import { publicVocabularyItem } from './PublicVocabularyItem';
import { Screen } from './Screen';

export class PublicSetDetailScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(PublicSetDetailScreenIds.SCREEN);
  }

  public async add(vocabularyText: string): Promise<void> {
    await Element.byId(
      PublicSetDetailScreenIds.PUBLIC_VOCABULARY_LIST
    ).scrollChildIntoView(
      publicVocabularyItem.getItemElement(vocabularyText),
      'down'
    );
    await publicVocabularyItem.add(vocabularyText);
  }

  public async addAll(): Promise<void> {
    await Element.byId(PublicSetDetailScreenIds.ADD_ALL_BTN).tap();
    await Element.byId(PublicSetDetailScreenIds.CONFIRM_ADD_ALL_BTN).tap();
  }

  public async back(): Promise<void> {
    await Element.byId(PublicSetDetailScreenIds.BACK_BTN).tap();
  }
}

export const publicSetDetailScreen = new PublicSetDetailScreen();
