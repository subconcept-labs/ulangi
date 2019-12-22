import { DiscoverScreenIds } from '../../../src/constants/ids/DiscoverScreenIds';
import { Element } from '../adapters/Element';
import { publicSetItem } from './PublicSetItem';
import { publicVocabularyItem } from './PublicVocabularyItem';
import { TabScreen } from './TabScreen';
import { translationItem } from './TranslationItem';

export class DiscoverScreen extends TabScreen {
  public getScreenElement(): Element {
    return Element.byId(DiscoverScreenIds.SCREEN);
  }

  public async search(term: string): Promise<void> {
    await Element.byId(DiscoverScreenIds.SEARCH_INPUT).replaceText(term);
  }

  public async clearSearch(): Promise<void> {
    await Element.byId(DiscoverScreenIds.SEARCH_INPUT).clearText();
  }

  public async pressClear(): Promise<void> {
    await Element.byId(DiscoverScreenIds.CLEAR_SEARCH_INPUT).tap();
  }

  public async viewPublicSetDetail(setTitle: string): Promise<void> {
    await publicSetItem.viewDetail(setTitle);
  }

  public async addFromPublicVocabulary(vocabularyText: string): Promise<void> {
    await publicVocabularyItem.add(vocabularyText);
  }

  public async addFromTranslation(vocabularyText: string): Promise<void> {
    await translationItem.add(vocabularyText);
  }

  public async showSearchSetResult(): Promise<void> {
    await Element.byId(DiscoverScreenIds.VIEW_SEARCH_SET_RESULT_BTN).tap();
  }

  public async showTranslationAndSearchVocabularyResult(): Promise<void> {
    await Element.byId(
      DiscoverScreenIds.VIEW_TRANSLATION_AND_SEARCH_VOCABULARY_RESULT_BTN
    ).tap();
  }

  public async expectTranslationAndPublicVocabularyListToExist(): Promise<
    void
  > {
    await Element.byId(
      DiscoverScreenIds.TRANSLATION_AND_PUBLIC_VOCABULARY_LIST
    ).expectToExist();
  }

  public async expectPublicSetListToExist(): Promise<void> {
    await Element.byId(DiscoverScreenIds.PUBLIC_SET_LIST).expectToExist();
  }

  public async expectToHavePublicSet(setTitle: string): Promise<void> {
    await publicSetItem.expectToExist(setTitle);
  }

  public async expectToHavePublicVocabularyTerm(
    vocabularyText: string
  ): Promise<void> {
    await publicVocabularyItem.expectToExist(vocabularyText);
  }

  public async expectToHaveTranslation(vocabularyText: string): Promise<void> {
    await translationItem.expectToExist(vocabularyText);
  }

  public async expectToBeUnsupported(): Promise<void> {
    await Element.byId(DiscoverScreenIds.UNSUPPORTED_SECTION).expectToExist();
  }

  public async openSetSelectionMenu(): Promise<void> {
    await Element.byId(DiscoverScreenIds.SHOW_SET_SELECTION_MENU_BTN).tap();
  }

  public async expectToHaveSubtitle(subtitle: string): Promise<void> {
    await Element.byId(DiscoverScreenIds.TOP_BAR).expectToHaveDescendant(
      Element.byText(subtitle)
    );
  }
}

export const discoverScreen = new DiscoverScreen();
