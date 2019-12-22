import { EditSetScreenIds } from '../../../src/constants/ids/EditSetScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';
import { setForm } from './SetForm';

export class EditSetScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(EditSetScreenIds.SCREEN);
  }

  public async save(): Promise<void> {
    await Element.byId(EditSetScreenIds.SAVE_BTN).tap();
  }

  public async clearSetName(): Promise<void> {
    await setForm.clearSetName();
  }

  public async fillSetName(setName: string): Promise<void> {
    await setForm.fillSetName(setName);
  }

  public async selectLanguages(
    learningLanguageName: string,
    translatedToLanguageName: string
  ): Promise<void> {
    await setForm.selectLanguages(
      learningLanguageName,
      translatedToLanguageName
    );
  }
}

export const editSetScreen = new EditSetScreen();
