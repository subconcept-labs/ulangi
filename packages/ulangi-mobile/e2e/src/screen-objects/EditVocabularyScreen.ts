import { EditVocabularyScreenIds } from '../../../src/constants/ids/EditVocabularyScreenIds';
import { Element } from '../adapters/Element';
import { AddEditVocabularyScreen } from '../screen-objects/AddEditVocabularyScreen';

export class EditVocabularyScreen extends AddEditVocabularyScreen {
  public getScreenElement(): Element {
    return Element.byId(EditVocabularyScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(EditVocabularyScreenIds.BACK_BTN).tap();
  }

  public async save(): Promise<void> {
    await Element.byId(EditVocabularyScreenIds.SAVE_BTN).tap();
  }
}

export const editVocabularyScreen = new EditVocabularyScreen();
