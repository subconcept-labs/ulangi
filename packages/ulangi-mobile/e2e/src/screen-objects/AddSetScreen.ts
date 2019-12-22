import { AddSetScreenIds } from '../../../src/constants/ids/AddSetScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';
import { setForm } from './SetForm';

export class AddSetScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(AddSetScreenIds.SCREEN);
  }

  public async save(): Promise<void> {
    await Element.byId(AddSetScreenIds.SAVE_BTN).tap();
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

export const addSetScreen = new AddSetScreen();
