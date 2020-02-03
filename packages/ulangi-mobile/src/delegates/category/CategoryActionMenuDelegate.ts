/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, VocabularyFilterType } from '@ulangi/ulangi-common/enums';
import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableCategory,
  ObservableLightBox,
} from '@ulangi/ulangi-observable';
import { when } from 'mobx';

import { CategoryActionMenuIds } from '../../constants/ids/CategoryActionMenuIds';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { CategorySelectionDelegate } from './CategorySelectionDelegate';

export class CategoryActionMenuDelegate {
  private observableLightBox: ObservableLightBox;
  private navigatorDelegate: NavigatorDelegate;
  private categorySelectionDelegate?: CategorySelectionDelegate;
  private styles: {
    light: Options;
    dark: Options;
  };

  public constructor(
    observableLightBox: ObservableLightBox,
    categorySelectionDelegate: undefined | CategorySelectionDelegate,
    navigatorDelegate: NavigatorDelegate,
    styles: {
      light: Options;
      dark: Options;
    },
  ) {
    this.observableLightBox = observableLightBox;
    this.categorySelectionDelegate = categorySelectionDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.styles = styles;
  }

  public show(
    category: ObservableCategory,
    filterType: VocabularyFilterType,
    options: {
      hideReviewBySpacedRepetitionButton: boolean;
      hideReviewByWritingButton: boolean;
      hideQuizButton: boolean;
      hidePlayReflexButton: boolean;
      hidePlayAtomButton: boolean;
      hideViewDetailButton: boolean;
    },
  ): void {
    const items: SelectionItem[] = [];

    if (typeof this.categorySelectionDelegate !== 'undefined') {
      items.push(this.getToggleSelectButton(category.categoryName));
    }

    if (options.hideViewDetailButton === false) {
      items.push(this.getViewDetailButton(category, filterType));
    }

    items.push(this.getAddTermsButton(category.categoryName));

    if (options.hideReviewBySpacedRepetitionButton === false) {
      items.push(this.getReviewBySpacedRepetitionBtn(category.categoryName));
    }

    if (options.hideReviewByWritingButton === false) {
      items.push(this.getReviewByWritingBtn(category.categoryName));
    }

    if (options.hideQuizButton === false) {
      items.push(this.getQuizBtn(category.categoryName));
    }

    if (options.hidePlayReflexButton === false) {
      items.push(this.getPlayReflexBtn(category.categoryName));
    }

    if (options.hidePlayAtomButton === false) {
      items.push(this.getPlayAtomBtn(category.categoryName));
    }

    this.observableLightBox.actionMenu = {
      testID: CategoryActionMenuIds.ACTION_MENU,
      title: 'Action',
      items,
    };

    this.navigatorDelegate.showLightBox(
      ScreenName.LIGHT_BOX_ACTION_MENU_SCREEN,
      {},
      this.styles,
    );
  }

  private getToggleSelectButton(categoryName: string): SelectionItem {
    const categorySelectionDelegate = assertExists(
      this.categorySelectionDelegate,
      'categorySelectionDelegate is required to render toggle select button',
    );
    return {
      testID: CategoryActionMenuIds.TOGGLE_SELECT_BTN,
      text: 'Select',
      onPress: (): void => {
        categorySelectionDelegate.toggleSelection(categoryName);
        this.navigatorDelegate.dismissLightBox();
      },
    };
  }

  private getViewDetailButton(
    category: ObservableCategory,
    selectedFilterType: VocabularyFilterType,
  ): SelectionItem {
    return {
      testID: CategoryActionMenuIds.VIEW_DETAIL_BTN,
      text: 'View detail',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.CATEGORY_DETAIL_SCREEN, {
          selectedFilterType,
          category,
        });
      },
    };
  }

  private getAddTermsButton(categoryName: string): SelectionItem {
    return {
      testID: CategoryActionMenuIds.ADD_TERMS_BTN,
      text: 'Add terms',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.ADD_VOCABULARY_SCREEN, {
          categoryName,
          closeOnSaveSucceeded: false,
        });
      },
    };
  }

  private getReviewBySpacedRepetitionBtn(categoryName: string): SelectionItem {
    return {
      testID: CategoryActionMenuIds.LEARN_WITH_SPACED_REPPETITION_BTN,
      text: 'Review by Spaced Repetition',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.SPACED_REPETITION_SCREEN, {
          selectedCategoryNames: [categoryName],
        });
      },
    };
  }

  private getReviewByWritingBtn(categoryName: string): SelectionItem {
    return {
      testID: CategoryActionMenuIds.LEARN_WITH_WRITING_BTN,
      text: 'Review by Writing',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.WRITING_SCREEN, {
          selectedCategoryNames: [categoryName],
        });
      },
    };
  }

  private getQuizBtn(categoryName: string): SelectionItem {
    return {
      testID: CategoryActionMenuIds.QUIZ_BTN,
      text: 'Quiz',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.QUIZ_SCREEN, {
          selectedCategoryNames: [categoryName],
        });
      },
    };
  }

  private getPlayReflexBtn(categoryName: string): SelectionItem {
    return {
      testID: CategoryActionMenuIds.PLAY_WITH_REFLEX,
      text: 'Play Reflex',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        // Wait for light box to closed first, otherwise app will crash
        when(
          (): boolean => this.observableLightBox.state === 'unmounted',
          (): void => {
            this.navigatorDelegate.push(ScreenName.REFLEX_SCREEN, {
              selectedCategoryNames: [categoryName],
            });
          },
        );
      },
    };
  }

  private getPlayAtomBtn(categoryName: string): SelectionItem {
    return {
      testID: CategoryActionMenuIds.PLAY_WITH_ATOM,
      text: 'Play Atom',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        // Wait for light box to closed first, otherwise app will crash
        when(
          (): boolean => this.observableLightBox.state === 'unmounted',
          (): void => {
            this.navigatorDelegate.push(ScreenName.ATOM_SCREEN, {
              selectedCategoryNames: [categoryName],
            });
          },
        );
      },
    };
  }
}
