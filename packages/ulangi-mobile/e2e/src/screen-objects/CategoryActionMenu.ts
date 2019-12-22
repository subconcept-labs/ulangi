import { CategoryActionMenuIds } from '../../../src/constants/ids/CategoryActionMenuIds';
import { Element } from '../adapters/Element';

export class CategoryActionMenu {
  public async select(): Promise<void> {
    await Element.byId(CategoryActionMenuIds.TOGGLE_SELECT_BTN).tap();
  }

  public async learnWithSpacedRepetition(): Promise<void> {
    await Element.byId(
      CategoryActionMenuIds.LEARN_WITH_SPACED_REPPETITION_BTN
    ).tap();
  }

  public async learnWithWriting(): Promise<void> {
    await Element.byId(CategoryActionMenuIds.LEARN_WITH_WRITING_BTN).tap();
  }

  public async quiz(): Promise<void> {
    await Element.byId(CategoryActionMenuIds.QUIZ_BTN).tap();
  }
}

export const categoryActionMenu = new CategoryActionMenu();
