import { CreateFirstSetScreenIds } from '../../../src/constants/Ids/CreateFirstSetScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';
import { setForm } from './SetForm';

export class CreateFirstSetScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(CreateFirstSetScreenIds.SCREEN);
  }

  public async selectLanguagesAndSubmit(
    learningLanguageName: string,
    translatedToLanguageName: string
  ): Promise<void> {
    await setForm.selectLanguages(
      learningLanguageName,
      translatedToLanguageName
    );
    await this.submitButton();
  }

  public async submitButton(): Promise<void> {
    await Element.byId(CreateFirstSetScreenIds.SUBMIT_BTN).tap();
  }

  public async logOut(): Promise<void> {
    await Element.byId(CreateFirstSetScreenIds.LOG_OUT_BTN).tap();
    await Element.byId(CreateFirstSetScreenIds.YES_BTN).tap();
  }
}

export const createFirstSetScreen = new CreateFirstSetScreen();
