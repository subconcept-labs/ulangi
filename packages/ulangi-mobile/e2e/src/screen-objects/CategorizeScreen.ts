import { CategorizeScreenIds } from '../../../src/constants/ids/CategorizeScreenIds';
import { Element } from '../adapters/Element';
import { categoryForm } from './CategoryForm';
import { Screen } from './Screen';

export class CategorizeScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(CategorizeScreenIds.SCREEN);
  }

  public async save(): Promise<void> {
    await Element.byId(CategorizeScreenIds.SAVE_BTN).tap();
  }

  public async back(): Promise<void> {
    await Element.byId(CategorizeScreenIds.BACK_BTN).tap();
  }

  public async showAllCategories(): Promise<void> {
    await categoryForm.showAllCategories();
  }

  public async fillCategory(category: string): Promise<void> {
    await categoryForm.fillCategory(category);
  }

  public async clearCategory(): Promise<void> {
    await categoryForm.clearCategory();
  }

  public async useCategory(category: string): Promise<void> {
    await categoryForm.useCategory(category);
  }
}

export const categorizeScreen = new CategorizeScreen();
