/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType } from '@ulangi/ulangi-action';
import { ScreenName, VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { Category } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on } from '@ulangi/ulangi-event';
import {
  ObservableCategory,
  ObservableManageScreen,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { CategoryActionMenuDelegate } from '../category/CategoryActionMenuDelegate';
import { CategoryBulkActionMenuDelegate } from '../category/CategoryBulkActionMenuDelegate';
import { CategoryListDelegate } from '../category/CategoryListDelegate';
import { CategorySelectionDelegate } from '../category/CategorySelectionDelegate';
import { CategorySortMenuDelegate } from '../category/CategorySortMenuDelegate';
import { FeatureSettingsDelegate } from '../learn/FeatureSettingsDelegate';
import { LevelBreakdownDelegate } from '../level/LevelBreakdownDelegate';
import { AutorunDelegate } from '../manage/AutorunDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { InAppRatingDelegate } from '../rating/InAppRatingDelegate';
import { VocabularyFilterMenuDelegate } from '../vocabulary/VocabularyFilterMenuDelegate';

@boundClass
export class ManageScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservableManageScreen;
  private categoryListDelegate: CategoryListDelegate;
  private categoryActionMenuDelegate: CategoryActionMenuDelegate;
  private categoryBulkActionMenuDelegate: CategoryBulkActionMenuDelegate;
  private categorySelectionDelegate: CategorySelectionDelegate;
  private categorySortMenuDelegate: CategorySortMenuDelegate;
  private levelBreakdownDelegate: LevelBreakdownDelegate;
  private vocabularyFilterMenuDelegate: VocabularyFilterMenuDelegate;
  private featureSettingsDelegate: FeatureSettingsDelegate;
  private autorunDelegate: AutorunDelegate;
  private inAppRatingDelegate: InAppRatingDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableManageScreen,
    categoryListDelegate: CategoryListDelegate,
    categoryActionMenuDelegate: CategoryActionMenuDelegate,
    categoryBulkActionMenuDelegate: CategoryBulkActionMenuDelegate,
    categorySelectionDelegate: CategorySelectionDelegate,
    categorySortMenuDelegate: CategorySortMenuDelegate,
    levelBreakdownDelegate: LevelBreakdownDelegate,
    vocabularyFilterMenuDelegate: VocabularyFilterMenuDelegate,
    featureSettingsDelegate: FeatureSettingsDelegate,
    autorunDelegate: AutorunDelegate,
    inAppRatingDelegate: InAppRatingDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.categoryListDelegate = categoryListDelegate;
    this.categoryActionMenuDelegate = categoryActionMenuDelegate;
    this.categoryBulkActionMenuDelegate = categoryBulkActionMenuDelegate;
    this.categorySelectionDelegate = categorySelectionDelegate;
    this.categorySortMenuDelegate = categorySortMenuDelegate;
    this.levelBreakdownDelegate = levelBreakdownDelegate;
    this.vocabularyFilterMenuDelegate = vocabularyFilterMenuDelegate;
    this.featureSettingsDelegate = featureSettingsDelegate;
    this.autorunDelegate = autorunDelegate;
    this.inAppRatingDelegate = inAppRatingDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public prepareAndFetch(): void {
    this.categoryListDelegate.prepareAndFetch(
      this.observableScreen.selectedVocabularyStatus.get(),
      this.observableScreen.selectedSortType.get(),
    );
  }

  public fetch(): void {
    this.categoryListDelegate.fetch(
      this.observableScreen.selectedVocabularyStatus.get() ===
        VocabularyStatus.ACTIVE,
    );
  }

  public clearFetch(): void {
    this.categoryListDelegate.clearFetch();
  }

  public refresh(): void {
    this.categoryListDelegate.refresh(
      this.observableScreen.selectedVocabularyStatus.get(),
      this.observableScreen.selectedSortType.get(),
    );
  }

  public refreshIfEmpty(): void {
    this.categoryListDelegate.refreshIfEmpty(
      this.observableScreen.selectedVocabularyStatus.get(),
      this.observableScreen.selectedSortType.get(),
    );
  }

  public showCategoryDetail(category: ObservableCategory): void {
    this.navigatorDelegate.push(ScreenName.CATEGORY_DETAIL_SCREEN, {
      selectedVocabularyStatus: this.observableScreen.selectedVocabularyStatus.get(),
      category,
    });
  }

  public showCategoryActionMenu(
    category: ObservableCategory,
    vocabularyStatus: VocabularyStatus,
  ): void {
    const featureSettings = this.featureSettingsDelegate.getCurrentSettings();

    this.categoryActionMenuDelegate.show(category, vocabularyStatus, {
      hideViewDetailButton: false,
      hideCategorizeButton: false,
      hideMoveButton: false,
      hideRestoreButton: false,
      hideArchiveButton: false,
      hideDeleteButton: false,
      hideReviewBySpacedRepetitionButton: !featureSettings.spacedRepetitionEnabled,
      hideReviewByWritingButton: !featureSettings.writingEnabled,
      hideQuizButton: !featureSettings.quizEnabled,
      hidePlayReflexButton: !featureSettings.reflexEnabled,
      hidePlayAtomButton: !featureSettings.atomEnabled,
    });
  }

  public showCategoryBulkActionMenu(): void {
    const featureSettings = this.featureSettingsDelegate.getCurrentSettings();

    this.categoryBulkActionMenuDelegate.show(
      this.observableScreen.selectedVocabularyStatus.get(),
      this.observableScreen.categoryListState.categoryList,
      this.observableScreen.categoryListState.selectedCategoryNames,
      {
        hideReviewBySpacedRepetitionButton: !featureSettings.spacedRepetitionEnabled,
        hideReviewByWritingButton: !featureSettings.writingEnabled,
        hideQuizButton: !featureSettings.quizEnabled,
        hidePlayReflexButton: !featureSettings.reflexEnabled,
        hidePlayAtomButton: !featureSettings.atomEnabled,
      },
    );
  }

  public showCategorySortMenu(): void {
    this.categorySortMenuDelegate.show(
      this.observableScreen.selectedSortType.get(),
      (sortType): void => {
        this.observableScreen.selectedSortType.set(sortType);
        this.refresh();
      },
    );
  }

  public showVocabularyFilterMenu(): void {
    this.vocabularyFilterMenuDelegate.show(
      this.observableScreen.selectedVocabularyStatus.get(),
      (vocabularyStatus): void => {
        this.observableScreen.selectedVocabularyStatus.set(vocabularyStatus);
        this.refresh();
      },
    );
  }

  public autoRefreshOnMultipleEdit(): void {
    this.eventBus.subscribe(
      on(
        [
          ActionType.VOCABULARY__ADD_MULTIPLE_SUCCEEDED,
          ActionType.VOCABULARY__EDIT_MULTIPLE_SUCCEEDED,
          ActionType.VOCABULARY__BULK_EDIT_SUCCEEDED,
        ],
        (): void => {
          this.refresh();
        },
      ),
    );
  }

  public autoShowRefreshNotice(): void {
    this.eventBus.subscribe(
      on(
        [
          ActionType.SET__ADD_SUCCEEDED,
          ActionType.SET__EDIT_SUCCEEDED,
          ActionType.SET__DOWNLOAD_SETS_SUCCEEDED,
          ActionType.SET__DOWNLOAD_INCOMPATIBLE_SETS_FAILED,
          ActionType.VOCABULARY__ADD_SUCCEEDED,
          ActionType.VOCABULARY__ADD_MULTIPLE_SUCCEEDED,
          ActionType.VOCABULARY__EDIT_SUCCEEDED,
          ActionType.VOCABULARY__DOWNLOAD_VOCABULARY_SUCCEEDED,
          ActionType.VOCABULARY__DOWNLOAD_INCOMPATIBLE_VOCABULARY_SUCCEEDED,
          ActionType.SPACED_REPETITION__SAVE_RESULT,
          ActionType.WRITING__SAVE_RESULT,
        ],
        (): void => {
          this.observableScreen.categoryListState.shouldShowRefreshNotice.set(
            true,
          );
        },
      ),
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
          },
        ),
        on(
          ActionType.SYNC__SYNCING,
          (): void => {
            this.observableScreen.categoryListState.shouldShowSyncingNotice.set(
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
          this.refresh();
        },
      ),
    );
  }

  public autoUpdateDueAndNewCounts(): void {
    this.categoryListDelegate.autoUpdateSpacedRepetitionDueAndNewCounts();
    this.categoryListDelegate.autoUpdateWritingDueAndNewCounts();
  }

  public toggleSelection(id: string): void {
    this.categorySelectionDelegate.toggleSelection(id);
  }

  public clearSelections(): void {
    this.categorySelectionDelegate.clearSelections();
  }

  public showQuickTutorial(): void {
    this.navigatorDelegate.push(ScreenName.QUICK_TUTORIAL_SCREEN, {});
  }

  public goToGoogleSheetsAddOnScreen(): void {
    this.navigatorDelegate.push(ScreenName.GOOGLE_SHEETS_ADD_ON_SCREEN, {});
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
      onClose: (): void => {
        this.inAppRatingDelegate.autoShowInAppRating();
      },
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

  public shouldShowLevelProgressForSR(): boolean {
    const featureSettings = this.featureSettingsDelegate.getCurrentSettings();
    return featureSettings.spacedRepetitionEnabled;
  }

  public shouldShowLevelProgressForWR(): boolean {
    const featureSettings = this.featureSettingsDelegate.getCurrentSettings();
    return featureSettings.writingEnabled;
  }
}
