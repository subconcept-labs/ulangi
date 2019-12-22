import { SearchScreenIds } from '../../../src/constants/ids/SearchScreenIds';
import { VocabularyItemIds } from '../../../src/constants/ids/VocabularyItemIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';
import { vocabularyItem } from './VocabularyItem';

export class SearchScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(SearchScreenIds.SCREEN);
  }

  public isVocabularyTermDisplayed(vocabularyTerm: string): Promise<boolean> {
    return Element.byId(
      VocabularyItemIds.VIEW_DETAIL_BTN_BY_VOCABULARY_TERM(vocabularyTerm)
    ).isDisplayed();
  }

  public async search(term: string): Promise<void> {
    await Element.byId(SearchScreenIds.SEARCH_INPUT).replaceText(term);
  }

  public async back(): Promise<void> {
    await Element.byId(SearchScreenIds.BACK_BTN).tap();
  }

  public async openSetSelectionMenu(): Promise<void> {
    await Element.byId(SearchScreenIds.SHOW_SET_SELECTION_MENU_BTN).tap();
  }

  public async expectVocabularyToExist(vocabularyTerm: string): Promise<void> {
    await vocabularyItem.expectToExist(vocabularyTerm);
  }

  public async expectNoResults(): Promise<void> {
    await Element.byId(SearchScreenIds.NO_RESULTS).expectToExist();
  }

  public async expectToHaveSubtitle(subtitle: string): Promise<void> {
    await Element.byId(SearchScreenIds.TOP_BAR).expectToHaveDescendant(
      Element.byText(subtitle)
    );
  }
}

export const searchScreen = new SearchScreen();
