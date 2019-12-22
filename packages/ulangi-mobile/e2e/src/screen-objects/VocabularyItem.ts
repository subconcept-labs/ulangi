import { VocabularyItemIds } from '../../../src/constants/ids/VocabularyItemIds';
import { Element } from '../adapters/Element';

export class VocabularyItem {
  public async openActionMenu(vocabularyTerm: string): Promise<void> {
    await Element.byId(
      VocabularyItemIds.SHOW_ACTION_MENU_BTN_BY_VOCABULARY_TERM(vocabularyTerm)
    ).tap();
  }

  public async canSelect(vocabularyTerm: string): Promise<boolean> {
    return Element.byId(
      VocabularyItemIds.SELECT_BTN_BY_VOCABULARY_TERM(vocabularyTerm)
    ).isExisting();
  }

  public async select(vocabularyTerm: string): Promise<void> {
    await Element.byId(
      VocabularyItemIds.SELECT_BTN_BY_VOCABULARY_TERM(vocabularyTerm)
    ).tap();
  }

  public async unselect(vocabularyTerm: string): Promise<void> {
    await Element.byId(
      VocabularyItemIds.UNSELECT_BTN_BY_VOCABULARY_TERM(vocabularyTerm)
    ).tap();
  }

  public async viewDetail(vocabularyTerm: string): Promise<void> {
    await Element.byId(
      VocabularyItemIds.VIEW_DETAIL_BTN_BY_VOCABULARY_TERM(vocabularyTerm)
    ).tap();
  }

  public async expectToExist(vocabularyTerm: string): Promise<void> {
    await Element.byId(
      VocabularyItemIds.VIEW_DETAIL_BTN_BY_VOCABULARY_TERM(vocabularyTerm)
    ).expectToExist();
  }

  public async expectToNotExist(vocabularyTerm: string): Promise<void> {
    await Element.byId(
      VocabularyItemIds.VIEW_DETAIL_BTN_BY_VOCABULARY_TERM(vocabularyTerm)
    ).expectToNotExist();
  }

  public async expectVocabularyToHaveExtraField(vocabularyTerm: string, name: string, value: string): Promise<void> {
    await Element.byId(
      VocabularyItemIds.VIEW_DETAIL_BTN_BY_VOCABULARY_TERM(vocabularyTerm),
    ).expectToHaveDescendant(
      Element.byId(
        VocabularyItemIds.VOCABULARY_EXTRA_FIELD_BY_NAME_VALUE(name, value)
      )
    );
  }

  public async expectVocabularyToHaveDefinition(
    vocabularyTerm: string,
    definition: string
  ): Promise<void> {
    await Element.byId(
      VocabularyItemIds.VIEW_DETAIL_BTN_BY_VOCABULARY_TERM(vocabularyTerm)
    ).expectToHaveDescendant(Element.byText(definition));
  }

  public async expectVocabularyToNotHaveDefinition(
    vocabularyTerm: string,
    definition: string
  ): Promise<void> {
    await Element.byId(
      VocabularyItemIds.VIEW_DETAIL_BTN_BY_VOCABULARY_TERM(vocabularyTerm)
    ).expectToNotHaveDescendant(Element.byText(definition));
  }

  public async expectVocabularyToHaveDefinitionAtIndex(
    vocabularyTerm: string,
    index: number
  ): Promise<void> {
    await Element.byId(
      VocabularyItemIds.VIEW_DETAIL_BTN_BY_VOCABULARY_TERM(vocabularyTerm)
    ).expectToNotHaveDescendant(
      Element.byId(
        VocabularyItemIds.DEFINITION_BY_INDEX(index)
      )
    );
  }

  public async expectVocabularyToHaveDefinitionExtraFieldAtIndex(
    vocabularyTerm: string,
    index: number,
    name: string,
    value: string
  ): Promise<void> {
    await Element.byId(
      VocabularyItemIds.VIEW_DETAIL_BTN_BY_VOCABULARY_TERM(vocabularyTerm)
    ).withDescendant(
      Element.byId(
        VocabularyItemIds.DEFINITION_BY_INDEX(index)
      )
    ).expectToHaveDescendant(
      Element.byId(
        VocabularyItemIds.DEFINITION_EXTRA_FIELD_BY_NAME_VALUE(name, value)
      )
    )
  }

  public async expectVocabularyToHaveWordClassAtIndex(
    vocabularyTerm: string,
    index: number,
    wordClass: string,
  ): Promise<void> {
    await Element.byId(
      VocabularyItemIds.VIEW_DETAIL_BTN_BY_VOCABULARY_TERM(vocabularyTerm)
    ).withDescendant(
      Element.byId(
        VocabularyItemIds.DEFINITION_BY_INDEX(index)
      )
    ).expectToHaveDescendant(
      Element.byId(
        VocabularyItemIds.WORD_CLASS_BY_VALUE(wordClass)
      )
    )
  }
}

export const vocabularyItem = new VocabularyItem();
