import { VocabularyFormIds } from '../../../src/constants/ids/VocabularyFormIds';
import { categorySelectorScreen } from "./CategorySelectorScreen";
import { Element } from '../adapters/Element';

export class VocabularyForm {
  public async fillVocabularyText(
    vocabularyText: string,
    setTextDirectly?: boolean,
    closeKeyboardOnDone?: boolean
  ): Promise<void> {
    await Element.byId(VocabularyFormIds.VOCABULARY_TEXT_INPUT).replaceText(
      vocabularyText,
      undefined,
      setTextDirectly
    );
    if (closeKeyboardOnDone === true){
      await this.closeKeyboard()
    }
  }

  public async clearVocabularyText(): Promise<void> {
    await Element.byId(VocabularyFormIds.VOCABULARY_TEXT_INPUT).clearText();
  }

  public async fillDefinitions(
    meanings: readonly string[],
    setTextDirectly?: boolean,
    closeKeyboardOnDone?: boolean
  ): Promise<void> {
    let index = 0;
    while (index < meanings.length) {
      if (index > 0) {
        await this.addMoreDefinition();
      }

      await this.fillDefinition(meanings[index], index, setTextDirectly, false);
      index++;
    }

    if (closeKeyboardOnDone === true){
      await this.closeKeyboard()
    }
  }

  public async clearDefinitions(indices: number[]): Promise<void> {
    let index = 0;
    while (index < indices.length) {
      await this.clearDefinition(indices[index]);
      index++;
    }
  }

  public async fillDefinition(
    meaning: string,
    index: number,
    setTextDirectly?: boolean,
    closeKeyboardOnDone?: boolean
  ): Promise<void> {
    await Element.byId(
      VocabularyFormIds.MEANING_INPUT_BY_INDEX(index)
    ).replaceText(meaning, undefined, setTextDirectly);
    
    if (closeKeyboardOnDone === true){
      await this.closeKeyboard()
    }
  }

  public async clearDefinition(index: number): Promise<void> {
    await Element.byId(
      VocabularyFormIds.MEANING_INPUT_BY_INDEX(index)
    ).clearText();
  }

  public async addMoreDefinition(): Promise<void> {
    await Element.byId(VocabularyFormIds.ADD_DEFINITION_BTN).tap();
  }

  public async deleteDefinition(index: number): Promise<void> {
    await Element.byId(VocabularyFormIds.DELETE_DEFINITION_BTN_BY_INDEX(index)).tap();
    // Confirm delete
    await Element.byId(VocabularyFormIds.DELETE_BTN).tap();
  }

  public async lookUp(): Promise<void> {
    await Element.byId(VocabularyFormIds.LOOK_UP_BTN).tap()
  }

  public async showExtraFieldsPickerForTerm(): Promise<void> {
    await Element.byId(VocabularyFormIds.VOCABULARY_EXTRA_FIELDS_BTN).tap()
  }

  public async showExtraFieldsPickerForDefinition(index: number): Promise<void> {
    await Element.byId(VocabularyFormIds.DEFINITION_EXTRA_FIELDS_BTN_BY_INDEX(index)).tap()
  }

  public async addExtraFieldForTerm(text: string, value?: string): Promise<void> {
    await Element.byId(
      VocabularyFormIds.EXTRA_FIELD_LIST
    ).scrollChildIntoView(
      Element.byId(
        VocabularyFormIds.ADD_EXTRA_FIELD_BTN_BY_TEXT(text)
      ),
      "down"
    );

    await Element.byId(
      VocabularyFormIds.ADD_EXTRA_FIELD_BTN_BY_TEXT(text)
    ).tap()

    if (typeof value !== "undefined"){
      await Element.byId(
        VocabularyFormIds.VOCABULARY_TEXT_INPUT
      ).typeText(value)
    }
  }

  public async addExtraFieldForDefinitionAtIndex(index: number, text: string, value?: string): Promise<void> {
    await Element.byId(
      VocabularyFormIds.EXTRA_FIELD_LIST
    ).scrollChildIntoView(
      Element.byId(
        VocabularyFormIds.ADD_EXTRA_FIELD_BTN_BY_TEXT(text)
      ),
      "down"
    );

    await Element.byId(
      VocabularyFormIds.ADD_EXTRA_FIELD_BTN_BY_TEXT(text)
    ).tap()

    if (typeof value !== "undefined"){
      await Element.byId(
        VocabularyFormIds.MEANING_INPUT_BY_INDEX(index)
      ).typeText(value)
    }
  }

  public async translate(): Promise<void> {
    await Element.byId(VocabularyFormIds.TRANSLATE_WITH_GOOGLE_BTN).tap();
  }

  public async addDefinitionFromTranslation(index: number): Promise<void> {
    await Element.byId(
      VocabularyFormIds.ADD_DEFINITION_FROM_TRANSLATION_BY_INDEX(index)
    ).tap();
  }

  public async addDefinitionFromDictionary(index: number): Promise<void> {
    await Element.byId(
      VocabularyFormIds.ADD_DEFINITION_FROM_DICTIONARY_BY_INDEX(index)
    ).tap();
  }

  public async expectSpecificLanguageRequiredForDictionaryToExist(): Promise<
    void
  > {
    await Element.byId(
      VocabularyFormIds.DICTIONARY_SPECIFIC_LANGUAGE_REQUIRED
    ).expectToExist();
  }

  public async expectSpecificLanguageRequiredForTranslationToExist(): Promise<
    void
  > {
    await Element.byId(
      VocabularyFormIds.DICTIONARY_SPECIFIC_LANGUAGE_REQUIRED
    ).expectToExist();
  }

  public async closeKeyboard(): Promise<void> {
    await Element.byId(VocabularyFormIds.VOCABULARY_TEXT_INPUT).tapAtPoint({x: 0, y: -10})
  }

  public async closePicker(): Promise<void> {
    await Element.byId(VocabularyFormIds.CLOSE_PICKER_BTN).tap()
  }

  public async showCategorySelectorScreen(): Promise<void> {
    await Element.byId(VocabularyFormIds.EDIT_CATEGORY_BTN).tap()
  }

  public async editCategory(categoryName: string): Promise<void> {
    await this.showCategorySelectorScreen()
    await categorySelectorScreen.clearCategory()
    await categorySelectorScreen.fillCategory(categoryName)
    await categorySelectorScreen.done()
  }
}

export const vocabularyForm = new VocabularyForm();
