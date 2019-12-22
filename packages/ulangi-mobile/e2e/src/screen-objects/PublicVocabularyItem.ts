import { PublicVocabularyItemIds } from '../../../src/constants/ids/PublicVocabularyItemIds';
import { Element } from '../adapters/Element';

export class PublicVocabularyItem {
  public getItemElement(vocabularyText: string): Element {
    return Element.byId(
      PublicVocabularyItemIds.PUBLIC_VOCABULARY_CONTAINER_BY_VOCABULARY_TEXT(
        vocabularyText
      )
    );
  }

  public async expectToExist(vocabularyText: string): Promise<void> {
    await this.getItemElement(vocabularyText).expectToExist();
  }

  public async add(vocabularyText: string): Promise<void> {
    await Element.byId(
      PublicVocabularyItemIds.ADD_VOCABULARY_BTN_BY_VOCABULARY_TEXT(
        vocabularyText
      )
    ).tap();
  }
}

export const publicVocabularyItem = new PublicVocabularyItem();
