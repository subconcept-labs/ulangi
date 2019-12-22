import { CategorySelectorScreenIds } from '../../../src/constants/ids/CategorySelectorScreenIds';
import { Element } from '../adapters/Element';
import { categoryForm } from './CategoryForm';
import { Screen } from './Screen';

export class CategorySelectorScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(CategorySelectorScreenIds.SCREEN);
  }

  public async done(): Promise<void> {
    await Element.byId(CategorySelectorScreenIds.DONE_BTN).tap();
  }

  public async back(): Promise<void> {
    await Element.byId(CategorySelectorScreenIds.BACK_BTN).tap();
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

export const categorySelectorScreen = new CategorySelectorScreen();
