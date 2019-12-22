import { SetFormIds } from '../../../src/constants/Ids/SetFormIds';
import { Element } from '../adapters/Element';

export class SetForm {
  public async clearSetName(): Promise<void> {
    await Element.byId(SetFormIds.SET_NAME_INPUT).clearText();
  }

  public async fillSetName(setName: string): Promise<void> {
    await Element.byId(SetFormIds.SET_NAME_INPUT).replaceText(setName);
  }

  public async selectLanguages(
    learningLanguageName: string,
    translatedToLanguageName: string
  ): Promise<void> {
    await this.selectLearningLanguage(learningLanguageName);
    await this.selectTranslatedToLanguage(translatedToLanguageName);
  }

  public async selectLearningLanguage(
    learningLanguageName: string
  ): Promise<void> {
    await Element.byId(SetFormIds.SHOW_LEARNING_LANGUAGE_PICKER_BTN).tap();

    await Element.byId(SetFormIds.LANGUAGE_LIST).scrollChildIntoView(
      Element.byId(
        SetFormIds.SELECT_LANGUAGE_BTN_BY_LANGUAGE_NAME(learningLanguageName)
      ),
      'down'
    );

    await Element.byId(
      SetFormIds.SELECT_LANGUAGE_BTN_BY_LANGUAGE_NAME(learningLanguageName)
    ).tap();
  }

  public async selectTranslatedToLanguage(
    translatedToLanguageName: string
  ): Promise<void> {
    await Element.byId(SetFormIds.SHOW_TRANSLATED_TO_LANGUAGE_PICKER_BTN).tap();

    await Element.byId(SetFormIds.LANGUAGE_LIST).scrollChildIntoView(
      Element.byId(
        SetFormIds.SELECT_LANGUAGE_BTN_BY_LANGUAGE_NAME(
          translatedToLanguageName
        )
      ),
      'down'
    );

    await Element.byId(
      SetFormIds.SELECT_LANGUAGE_BTN_BY_LANGUAGE_NAME(translatedToLanguageName)
    ).tap();
  }
}

export const setForm = new SetForm();
