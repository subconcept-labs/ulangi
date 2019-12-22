/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableCategory,
  ObservableLightBox,
} from '@ulangi/ulangi-observable';
import { ObservableMap, runInAction, when } from 'mobx';

import { CategoryBulkActionMenuIds } from '../../constants/ids/CategoryBulkActionMenuIds';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

interface ObservableScreen {
  categoryList: null | ObservableMap<string, ObservableCategory>;
  selectedCategoryNames: string[];
}

export class CategoryBulkActionMenuDelegate {
  private observableLightBox: ObservableLightBox;
  private observableScreen: ObservableScreen;
  private navigatorDelegate: NavigatorDelegate;
  private styles: {
    light: Options;
    dark: Options;
  };

  public constructor(
    observableLightBox: ObservableLightBox,
    observableScreen: ObservableScreen,
    navigatorDelegate: NavigatorDelegate,
    styles: {
      light: Options;
      dark: Options;
    }
  ) {
    this.observableLightBox = observableLightBox;
    this.observableScreen = observableScreen;
    this.navigatorDelegate = navigatorDelegate;
    this.styles = styles;
  }

  public show(): void {
    const items: SelectionItem[] = [];

    items.push(
      this.getSelectAllFetchedTermsBtn(),
      this.getLearnWithSpacedRepetitionBtn(),
      this.getLearnWithWritingBtn(),
      this.getQuizBtn(),
      this.getPlayWithReflex(),
      this.getPlayWithAtom()
      //this.getAutoplayBtn()
    );

    this.observableLightBox.actionMenu = {
      testID: CategoryBulkActionMenuIds.ACTION_MENU,
      title: 'Action',
      items,
    };

    this.navigatorDelegate.showLightBox(
      ScreenName.LIGHT_BOX_ACTION_MENU_SCREEN,
      {},
      this.styles
    );
  }

  private getSelectAllFetchedTermsBtn(): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.SELECT_ALL_FETCHED_CATEGORIES_BTN,
      text: 'Select all fetched categories',
      onPress: (): void => {
        runInAction(
          (): void => {
            if (this.observableScreen.categoryList !== null) {
              Array.from(this.observableScreen.categoryList.values()).forEach(
                (vocabulary): void => {
                  vocabulary.isSelected.set(true);
                }
              );
            }
          }
        );
        this.navigatorDelegate.dismissLightBox();
      },
    };
  }

  private getLearnWithSpacedRepetitionBtn(): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.LEARN_WITH_SPACED_REPPETITION_BTN,
      text: 'Review by Spaced Repetition',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.SPACED_REPETITION_SCREEN, {
          selectedCategoryNames: this.observableScreen.selectedCategoryNames.slice(),
        });
      },
    };
  }

  private getLearnWithWritingBtn(): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.LEARN_WITH_WRITING_BTN,
      text: 'Review by Writing',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.WRITING_SCREEN, {
          selectedCategoryNames: this.observableScreen.selectedCategoryNames.slice(),
        });
      },
    };
  }

  private getQuizBtn(): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.QUIZ_BTN,
      text: 'Quiz',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.QUIZ_SCREEN, {
          selectedCategoryNames: this.observableScreen.selectedCategoryNames.slice(),
        });
      },
    };
  }

  private getPlayWithReflex(): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.PLAY_WITH_REFLEX_BTN,
      text: 'Play Reflex',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        // Wait for light box to closed first, otherwise app will crash
        when(
          (): boolean => this.observableLightBox.state === 'unmounted',
          (): void => {
            this.navigatorDelegate.push(ScreenName.REFLEX_SCREEN, {
              selectedCategoryNames: this.observableScreen.selectedCategoryNames.slice(),
            });
          }
        );
      },
    };
  }

  private getPlayWithAtom(): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.PLAY_WITH_ATOM_BTN,
      text: 'Play Atom',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        // Wait for light box to closed first, otherwise app will crash
        when(
          (): boolean => this.observableLightBox.state === 'unmounted',
          (): void => {
            this.navigatorDelegate.push(ScreenName.ATOM_SCREEN, {
              selectedCategoryNames: this.observableScreen.selectedCategoryNames.slice(),
            });
          }
        );
      },
    };
  }
  /*
  private getAutoplayBtn(): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.AUTOPLAY_BTN,
      text: 'Autoplay',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        // Wait for light box to closed first, otherwise app will crash
        when(
          (): boolean => this.observableLightBox.state === "unmounted",
          (): void => {
            this.navigatorDelegate.push(ScreenName.FLASHCARD_PLAYER_SCREEN, {
              selectedCategoryNames: this.observableScreen.selectedCategoryNames.slice(),
            });
          }
        )
      },
    };
  }
  */
}
