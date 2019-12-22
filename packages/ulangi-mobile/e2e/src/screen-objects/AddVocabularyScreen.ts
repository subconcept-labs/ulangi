import { AddVocabularyScreenIds } from '../../../src/constants/ids/AddVocabularyScreenIds';
import { Element } from '../adapters/Element';
import { AddEditVocabularyScreen } from '../screen-objects/AddEditVocabularyScreen';
import { lightBoxDialog } from './LightBoxDialog';

export class AddVocabularyScreen extends AddEditVocabularyScreen {
  public getScreenElement(): Element {
    return Element.byId(AddVocabularyScreenIds.SCREEN);
  }

  public async back(): Promise<void> {
    await Element.byId(AddVocabularyScreenIds.BACK_BTN).tap();
  }

  public async save(): Promise<void> {
    await Element.byId(AddVocabularyScreenIds.SAVE_BTN).tap();
  }

  public async fillAndSaveMultpleTerms(
    vocabularyList: readonly {
      vocabularyText: string;
      category?: string;
      definitions: readonly string[];
    }[],
    setTextDirectly?: boolean
  ): Promise<void> {
    let index = 0;
    while (index < vocabularyList.length) {
      const vocabulary = vocabularyList[index];

      await this.fillAndSaveTerm(vocabulary, setTextDirectly);
      await lightBoxDialog.expectSuccessDialogToExist();

      if (index < vocabularyList.length - 1) {
        await this.pressAddMore();
      }
      index++;
    }
  }

  public async pressAddMore(): Promise<void> {
    await Element.byId(AddVocabularyScreenIds.ADD_MORE_BTN).tap();
  }
}

export const addVocabularyScreen = new AddVocabularyScreen();
