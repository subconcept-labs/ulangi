import { TranslationItemIds } from '../../../src/constants/ids/TranslationItemIds';
import { Element } from '../adapters/Element';

export class TranslationItem {
  public async expectToExist(vocabularyText): Promise<void> {
    await Element.byId(
      TranslationItemIds.TRANSLATION_CONTAINER_BY_VOCABULARY_TEXT(
        vocabularyText
      )
    ).expectToExist();
  }

  public async add(vocabularyText): Promise<void> {
    await Element.byId(
      TranslationItemIds.ADD_VOCABULARY_FROM_TRANSLATION_BTN_BY_VOCABULARY_TEXT(
        vocabularyText
      )
    ).tap();
  }
}

export const translationItem = new TranslationItem();
