import { VocabularyActionMenuIds } from '../../../src/constants/ids/VocabularyActionMenuIds';
import { Element } from '../adapters/Element';

export class VocabularyActionMenu {
  public async select(): Promise<void> {
    await Element.byId(VocabularyActionMenuIds.TOGGLE_SELECT_BTN).tap();
  }

  public async edit(): Promise<void> {
    await Element.byId(VocabularyActionMenuIds.EDIT_BTN).tap();
  }

  public async categorize(): Promise<void> {
    await Element.byId(VocabularyActionMenuIds.CATEGORIZE_BTN).tap();
  }

  public async move(): Promise<void> {
    await Element.byId(VocabularyActionMenuIds.MOVE_BTN).tap();
  }

  public async restore(): Promise<void> {
    await Element.byId(VocabularyActionMenuIds.RESTORE_BTN).tap();
  }

  public async archive(): Promise<void> {
    await Element.byId(VocabularyActionMenuIds.ARCHIVE_BTN).tap();
  }

  public async delete(): Promise<void> {
    await Element.byId(VocabularyActionMenuIds.DELETE_BTN).tap();
  }
}

export const vocabularyActionMenu = new VocabularyActionMenu();
