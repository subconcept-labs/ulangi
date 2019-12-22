import { Screen } from '../screen-objects/Screen';
import { categoryForm } from './CategoryForm';
import { vocabularyForm } from './VocabularyForm';

export abstract class AddEditVocabularyScreen extends Screen {
  public abstract save(): Promise<void>;

  public async closePicker(): Promise<void> {
    await vocabularyForm.closePicker();
  }

  public async closeKeyboard(): Promise<void> {
    await vocabularyForm.closeKeyboard();
  }

  public async clearVocabularyText(): Promise<void> {
    await vocabularyForm.clearVocabularyText();
  }

  public async fillVocabularyText(
    vocabularyText: string,
    setTextDirectly?: boolean,
    closeKeyboardOnDone?: boolean
  ): Promise<void> {
    await vocabularyForm.fillVocabularyText(
      vocabularyText,
      setTextDirectly,
      closeKeyboardOnDone
    );
  }

  public async clearDefinition(index: number): Promise<void> {
    await vocabularyForm.clearDefinition(index);
  }

  public async fillDefinitions(
    definitions: readonly string[],
    setTextDirectly?: boolean,
    closeKeyboardOnDone?: boolean
  ): Promise<void> {
    await vocabularyForm.fillDefinitions(definitions, setTextDirectly, closeKeyboardOnDone);
  }

  public async showCategorySelectorScreen(): Promise<void> {
    await vocabularyForm.showCategorySelectorScreen();
  }

  public async editCategory(categoryName: string): Promise<void> {
    await vocabularyForm.editCategory(categoryName);
  }

  public async fillAndSaveTerm(
    vocabulary: {
      vocabularyText: string;
      category?: string;
      definitions: readonly string[];
    },
    setTextDirectly?: boolean
  ): Promise<void> {
    const { vocabularyText, category, definitions } = vocabulary;

    await this.fillVocabularyText(vocabularyText, setTextDirectly);
    await this.fillDefinitions(definitions, setTextDirectly);

    if (typeof category !== 'undefined') {
      await this.editCategory(category);
    }

    await this.save();
  }

  public async addMoreDefinition(): Promise<void> {
    await vocabularyForm.addMoreDefinition();
  }

  public async deleteDefinition(index: number): Promise<void> {
    await vocabularyForm.deleteDefinition(index);
  }

  public async addExtraFieldForTerm(text: string, value?: string): Promise<void> {
    await vocabularyForm.addExtraFieldForTerm(text, value)
  }

  public async addExtraFieldForDefinitionAtIndex(index: number, text: string, value?: string): Promise<void> {
    await vocabularyForm.addExtraFieldForDefinitionAtIndex(index, text, value)
  }

  public async translate(): Promise<void> {
    await vocabularyForm.translate();
  }

  public async addDefinitionFromTranslation(index: number): Promise<void> {
    await vocabularyForm.addDefinitionFromTranslation(index);
  }

  public async addDefinitionFromDictionary(index: number): Promise<void> {
    await vocabularyForm.addDefinitionFromDictionary(index);
  }

  public async expectSpecificLanguageRequiredForDictionaryToExist(): Promise<
    void
  > {
    await vocabularyForm.expectSpecificLanguageRequiredForDictionaryToExist();
  }

  public async expectSpecificLanguageRequiredForTranslationToExist(): Promise<
    void
  > {
    await vocabularyForm.expectSpecificLanguageRequiredForTranslationToExist();
  }

  public async lookUp(): Promise<void> {
    await vocabularyForm.lookUp()
  }

  public async showExtraFieldsPickerForTerm(): Promise<void> {
    await vocabularyForm.showExtraFieldsPickerForTerm()
  }

  public async showExtraFieldsPickerForDefinition(index: number): Promise<void> {
    await vocabularyForm.showExtraFieldsPickerForDefinition(index)
  }
}
