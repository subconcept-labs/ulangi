/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType } from '@ulangi/ulangi-action';
import {
  ManageListType,
  ScreenName,
  VocabularyFilterType,
} from '@ulangi/ulangi-common/enums';
import { Category } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on } from '@ulangi/ulangi-event';
import {
  ObservableCategory,
  ObservableManageScreen,
  ObservableVocabulary,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { CategoryActionMenuDelegate } from '../category/CategoryActionMenuDelegate';
import { CategoryBulkActionMenuDelegate } from '../category/CategoryBulkActionMenuDelegate';
import { CategoryListDelegate } from '../category/CategoryListDelegate';
import { CategorySelectionDelegate } from '../category/CategorySelectionDelegate';
import { LevelBreakdownDelegate } from '../level/LevelBreakdownDelegate';
import { AutorunDelegate } from '../manage/AutorunDelegate';
import { ManageListSelectionMenuDelegate } from '../manage/ManageListSelectionMenuDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { VocabularyActionMenuDelegate } from '../vocabulary/VocabularyActionMenuDelegate';
import { VocabularyBulkActionMenuDelegate } from '../vocabulary/VocabularyBulkActionMenuDelegate';
import { VocabularyEventDelegate } from '../vocabulary/VocabularyEventDelegate';
import { VocabularyFilterMenuDelegate } from '../vocabulary/VocabularyFilterMenuDelegate';
import { VocabularyListDelegate } from '../vocabulary/VocabularyListDelegate';
import { VocabularyLiveUpdateDelegate } from '../vocabulary/VocabularyLiveUpdateDelegate';
import { VocabularySelectionDelegate } from '../vocabulary/VocabularySelectionDelegate';

@boundClass
export class ManageScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservableManageScreen;
  private categoryListDelegate: CategoryListDelegate;
  private categoryActionMenuDelegate: CategoryActionMenuDelegate;
  private categoryBulkActionMenuDelegate: CategoryBulkActionMenuDelegate;
  private categorySelectionDelegate: CategorySelectionDelegate;
  private levelBreakdownDelegate: LevelBreakdownDelegate;
  private vocabularyEventDelegate: VocabularyEventDelegate;
  private vocabularyListDelegate: VocabularyListDelegate;
  private vocabularyActionMenuDelegate: VocabularyActionMenuDelegate;
  private vocabularyBulkActionMenuDelegate: VocabularyBulkActionMenuDelegate;
  private vocabularyFilterMenuDelegate: VocabularyFilterMenuDelegate;
  private vocabularyLiveUpdateDelegate: VocabularyLiveUpdateDelegate;
  private vocabularySelectionDelegate: VocabularySelectionDelegate;
  private manageListSelectionMenuDelegate: ManageListSelectionMenuDelegate;
  private autorunDelegate: AutorunDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableManageScreen,
    categoryListDelegate: CategoryListDelegate,
    categoryActionMenuDelegate: CategoryActionMenuDelegate,
    categoryBulkActionMenuDelegate: CategoryBulkActionMenuDelegate,
    categorySelectionDelegate: CategorySelectionDelegate,
    levelBreakdownDelegate: LevelBreakdownDelegate,
    vocabularyEventDelegate: VocabularyEventDelegate,
    vocabularyListDelegate: VocabularyListDelegate,
    vocabularyActionMenuDelegate: VocabularyActionMenuDelegate,
    vocabularyBulkActionMenuDelegate: VocabularyBulkActionMenuDelegate,
    vocabularyFilterMenuDelegate: VocabularyFilterMenuDelegate,
    vocabularyLiveUpdateDelegate: VocabularyLiveUpdateDelegate,
    vocabularySelectionDelegate: VocabularySelectionDelegate,
    manageListSelectionMenuDelegate: ManageListSelectionMenuDelegate,
    autorunDelegate: AutorunDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.categoryListDelegate = categoryListDelegate;
    this.categoryActionMenuDelegate = categoryActionMenuDelegate;
    this.categoryBulkActionMenuDelegate = categoryBulkActionMenuDelegate;
    this.categorySelectionDelegate = categorySelectionDelegate;
    this.levelBreakdownDelegate = levelBreakdownDelegate;
    this.vocabularyEventDelegate = vocabularyEventDelegate;
    this.vocabularyListDelegate = vocabularyListDelegate;
    this.vocabularyActionMenuDelegate = vocabularyActionMenuDelegate;
    this.vocabularyBulkActionMenuDelegate = vocabularyBulkActionMenuDelegate;
    this.vocabularyFilterMenuDelegate = vocabularyFilterMenuDelegate;
    this.vocabularyLiveUpdateDelegate = vocabularyLiveUpdateDelegate;
    this.vocabularySelectionDelegate = vocabularySelectionDelegate;
    this.manageListSelectionMenuDelegate = manageListSelectionMenuDelegate;
    this.autorunDelegate = autorunDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public prepareAndFetch(filterType: VocabularyFilterType): void {
    if (
      this.observableScreen.manageListType.get() ===
      ManageListType.CATEGORY_LIST
    ) {
      this.categoryListDelegate.prepareAndFetch(filterType);
    } else {
      this.vocabularyListDelegate.prepareAndFetch(filterType);
    }
  }

  public fetch(): void {
    if (
      this.observableScreen.manageListType.get() ===
      ManageListType.CATEGORY_LIST
    ) {
      this.categoryListDelegate.fetch();
    } else {
      this.vocabularyListDelegate.fetch();
    }
  }

  public clearFetch(): void {
    if (
      this.observableScreen.manageListType.get() ===
      ManageListType.CATEGORY_LIST
    ) {
      this.categoryListDelegate.clearFetch();
    } else {
      this.vocabularyListDelegate.clearFetch();
    }
  }

  public refresh(filterType: VocabularyFilterType): void {
    if (
      this.observableScreen.manageListType.get() ===
      ManageListType.CATEGORY_LIST
    ) {
      this.categoryListDelegate.refresh(filterType);
    } else {
      this.vocabularyListDelegate.refresh(filterType);
    }
  }

  public refreshCurrentList(): void {
    this.refresh(this.observableScreen.selectedFilterType.get());
  }

  public refreshCurrentListIfEmpty(): void {
    if (
      this.observableScreen.manageListType.get() ===
      ManageListType.CATEGORY_LIST
    ) {
      this.categoryListDelegate.refreshIfEmpty(
        this.observableScreen.selectedFilterType.get(),
      );
    } else {
      this.vocabularyListDelegate.refreshIfEmpty(
        this.observableScreen.selectedFilterType.get(),
      );
    }
  }

  public showVocabularyDetail(vocabulary: ObservableVocabulary): void {
    this.navigatorDelegate.push(ScreenName.VOCABULARY_DETAIL_SCREEN, {
      vocabulary,
    });
  }

  public showCategoryDetail(category: ObservableCategory): void {
    this.navigatorDelegate.push(ScreenName.CATEGORY_DETAIL_SCREEN, {
      selectedFilterType: this.observableScreen.selectedFilterType.get(),
      category,
    });
  }

  public showCategoryActionMenu(
    category: ObservableCategory,
    filterType: VocabularyFilterType,
  ): void {
    this.categoryActionMenuDelegate.show(category, filterType, false);
  }

  public showCategoryBulkActionMenu(): void {
    this.categoryBulkActionMenuDelegate.show();
  }

  public showVocabularyActionMenu(vocabulary: ObservableVocabulary): void {
    this.vocabularyActionMenuDelegate.show(vocabulary);
  }

  public showVocabularyBulkActionMenu(): void {
    this.vocabularyBulkActionMenuDelegate.show();
  }

  public showVocabularyFilterMenu(): void {
    this.vocabularyFilterMenuDelegate.show(
      this.observableScreen.selectedFilterType.get(),
      (filterType): void => {
        this.observableScreen.selectedFilterType.set(filterType);
        this.refresh(filterType);
      },
    );
  }

  public showManageListSelectionMenu(): void {
    this.manageListSelectionMenuDelegate.show(
      this.observableScreen.manageListType.get(),
      (listType): void => {
        this.observableScreen.manageListType.set(listType);
        this.refresh(this.observableScreen.selectedFilterType.get());
      },
    );
  }

  public autoRefreshEmptyListOnVocabularyChange(): void {
    this.vocabularyEventDelegate.onVocabularyChange(
      (): void => {
        this.refreshCurrentListIfEmpty();
      },
    );
  }

  public autoRefreshOnMultipleEdit(): void {
    this.eventBus.subscribe(
      on(
        [
          ActionType.VOCABULARY__ADD_MULTIPLE_SUCCEEDED,
          ActionType.VOCABULARY__EDIT_MULTIPLE_SUCCEEDED,
        ],
        (): void => {
          this.refreshCurrentList();
        },
      ),
    );
  }

  public autoShowRefreshNotice(): void {
    this.vocabularyEventDelegate.onDownloadVocabularyCompleted(
      (): void => {
        if (
          this.observableScreen.manageListType.get() ===
          ManageListType.CATEGORY_LIST
        ) {
          this.observableScreen.categoryListState.shouldShowRefreshNotice.set(
            true,
          );
        } else {
          this.observableScreen.vocabularyListState.shouldShowRefreshNotice.set(
            true,
          );
        }
      },
    );
  }

  public autoShowSyncingInProgress(): void {
    this.eventBus.subscribe(
      group(
        on(
          [ActionType.SYNC__STOP, ActionType.SYNC__SYNC_COMPLETED],
          (): void => {
            this.observableScreen.categoryListState.shouldShowSyncingNotice.set(
              false,
            );
            this.observableScreen.vocabularyListState.shouldShowSyncingNotice.set(
              false,
            );
          },
        ),
        on(
          ActionType.SYNC__SYNCING,
          (): void => {
            this.observableScreen.categoryListState.shouldShowSyncingNotice.set(
              true,
            );
            this.observableScreen.vocabularyListState.shouldShowSyncingNotice.set(
              true,
            );
          },
        ),
      ),
    );
  }

  public autoRefreshOnSetChange(): void {
    this.eventBus.subscribe(
      on(
        ActionType.SET__SELECT,
        (): void => {
          this.refreshCurrentList();
        },
      ),
    );
  }

  public autoUpdateEditedVocabulary(): void {
    this.vocabularyLiveUpdateDelegate.autoUpdateEditedVocabulary(true, false);
  }

  public toggleSelection(id: string): void {
    if (
      this.observableScreen.manageListType.get() ===
      ManageListType.CATEGORY_LIST
    ) {
      this.categorySelectionDelegate.toggleSelection(id);
    } else {
      this.vocabularySelectionDelegate.toggleSelection(id);
    }
  }

  public clearSelections(): void {
    if (
      this.observableScreen.manageListType.get() ===
      ManageListType.CATEGORY_LIST
    ) {
      this.categorySelectionDelegate.clearSelections();
    } else {
      this.vocabularySelectionDelegate.clearSelections();
    }
  }

  public showQuickTutorial(): void {
    this.navigatorDelegate.push(ScreenName.QUICK_TUTORIAL_SCREEN, {});
  }

  public goToAddVocabulary(): void {
    this.navigatorDelegate.push(ScreenName.ADD_VOCABULARY_SCREEN, {
      closeOnSaveSucceeded: false,
    });
  }

  public goToSearchVocabulary(): void {
    this.navigatorDelegate.push(ScreenName.SEARCH_SCREEN, {});
  }

  public goToSpacedRepetition(selectedCategoryNames: string[]): void {
    this.navigatorDelegate.push(ScreenName.SPACED_REPETITION_SCREEN, {
      selectedCategoryNames,
    });
  }

  public goToWriting(selectedCategoryNames: string[]): void {
    this.navigatorDelegate.push(ScreenName.WRITING_SCREEN, {
      selectedCategoryNames,
    });
  }

  public autorun(): void {
    this.autorunDelegate.autorun();
  }

  public showLevelBreakdownForSR(category: Category): void {
    this.levelBreakdownDelegate.show({
      totalCount: category.totalCount,
      level0Count: category.srLevel0Count,
      level1To3Count: category.srLevel1To3Count,
      level4To6Count: category.srLevel4To6Count,
      level7To8Count: category.srLevel7To8Count,
      level9To10Count: category.srLevel9To10Count,
    });
  }

  public showLevelBreakdownForWR(category: Category): void {
    this.levelBreakdownDelegate.show({
      totalCount: category.totalCount,
      level0Count: category.wrLevel0Count,
      level1To3Count: category.wrLevel1To3Count,
      level4To6Count: category.wrLevel4To6Count,
      level7To8Count: category.wrLevel7To8Count,
      level9To10Count: category.wrLevel9To10Count,
    });
  }
}
