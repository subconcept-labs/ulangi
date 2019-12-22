/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType } from '@ulangi/ulangi-action';
import { ScreenName, VocabularyFilterType } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on } from '@ulangi/ulangi-event';
import {
  ObservableCategoryDetailScreen,
  ObservableVocabulary,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { CategoryActionMenuDelegate } from '../category/CategoryActionMenuDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { VocabularyActionMenuDelegate } from '../vocabulary/VocabularyActionMenuDelegate';
import { VocabularyBulkActionMenuDelegate } from '../vocabulary/VocabularyBulkActionMenuDelegate';
import { VocabularyEventDelegate } from '../vocabulary/VocabularyEventDelegate';
import { VocabularyFilterMenuDelegate } from '../vocabulary/VocabularyFilterMenuDelegate';
import { VocabularyListDelegate } from '../vocabulary/VocabularyListDelegate';
import { VocabularyLiveUpdateDelegate } from '../vocabulary/VocabularyLiveUpdateDelegate';
import { VocabularySelectionDelegate } from '../vocabulary/VocabularySelectionDelegate';

@boundClass
export class CategoryDetailScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservableCategoryDetailScreen;
  private categoryActionMenuDelegate: CategoryActionMenuDelegate;
  private vocabularyEventDelegate: VocabularyEventDelegate;
  private vocabularyListDelegate: VocabularyListDelegate;
  private vocabularyFilterMenuDelegate: VocabularyFilterMenuDelegate;
  private vocabularyActionMenuDelegate: VocabularyActionMenuDelegate;
  private vocabularyBulkActionMenuDelegate: VocabularyBulkActionMenuDelegate;
  private vocabularyLiveUpdateDelegate: VocabularyLiveUpdateDelegate;
  private vocabularySelectionDelegate: VocabularySelectionDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableCategoryDetailScreen,
    categoryActionMenuDelegate: CategoryActionMenuDelegate,
    vocabularyEventDelegate: VocabularyEventDelegate,
    vocabularyListDelegate: VocabularyListDelegate,
    vocabularyFilterMenuDelegate: VocabularyFilterMenuDelegate,
    vocabularyActionMenuDelegate: VocabularyActionMenuDelegate,
    vocabularyBulkActionMenuDelegate: VocabularyBulkActionMenuDelegate,
    vocabularyLiveUpdateDelegate: VocabularyLiveUpdateDelegate,
    vocabularySelectionDelegate: VocabularySelectionDelegate,
    navigatorDelegate: NavigatorDelegate
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.categoryActionMenuDelegate = categoryActionMenuDelegate;
    this.vocabularyEventDelegate = vocabularyEventDelegate;
    this.vocabularyListDelegate = vocabularyListDelegate;
    this.vocabularyFilterMenuDelegate = vocabularyFilterMenuDelegate;
    this.vocabularyActionMenuDelegate = vocabularyActionMenuDelegate;
    this.vocabularyBulkActionMenuDelegate = vocabularyBulkActionMenuDelegate;
    this.vocabularyLiveUpdateDelegate = vocabularyLiveUpdateDelegate;
    this.vocabularySelectionDelegate = vocabularySelectionDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public prepareAndFetch(filterType: VocabularyFilterType): void {
    this.vocabularyListDelegate.prepareAndFetch(
      filterType,
      this.observableScreen.category.categoryName
    );
  }

  public fetch(): void {
    this.vocabularyListDelegate.fetch();
  }

  public clearFetch(): void {
    this.vocabularyListDelegate.clearFetch();
  }

  public refresh(filterType: VocabularyFilterType): void {
    this.vocabularyListDelegate.refresh(
      filterType,
      this.observableScreen.category.categoryName
    );
  }

  public refreshCurrentList(): void {
    this.refresh(this.observableScreen.selectedFilterType.get());
  }

  public autoUpdateEditedVocabulary(): void {
    this.vocabularyLiveUpdateDelegate.autoUpdateEditedVocabulary(true, true);
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
        }
      )
    );
  }

  public autoShowSyncCompleted(): void {
    this.vocabularyEventDelegate.onDownloadVocabularyCompleted(
      (): void => {
        this.observableScreen.vocabularyListState.shouldShowSyncCompletedNotice.set(
          true
        );
      }
    );
  }

  public autoShowSyncingInProgress(): void {
    this.eventBus.subscribe(
      group(
        on(
          [ActionType.SYNC__STOP, ActionType.SYNC__SYNC_COMPLETED],
          (): void => {
            this.observableScreen.vocabularyListState.shouldShowSyncingNotice.set(
              false
            );
          }
        ),
        on(
          ActionType.SYNC__SYNCING,
          (): void => {
            this.observableScreen.vocabularyListState.shouldShowSyncingNotice.set(
              true
            );
          }
        )
      )
    );
  }

  public showVocabularyDetail(vocabulary: ObservableVocabulary): void {
    this.navigatorDelegate.push(ScreenName.VOCABULARY_DETAIL_SCREEN, {
      vocabulary,
    });
  }

  public toggleSelection(vocabularyId: string): void {
    this.vocabularySelectionDelegate.toggleSelection(vocabularyId);
  }

  public clearSelections(): void {
    this.vocabularySelectionDelegate.clearSelections();
  }

  public showCategoryActionMenu(): void {
    this.categoryActionMenuDelegate.show(
      this.observableScreen.category,
      this.observableScreen.selectedFilterType.get(),
      true
    );
  }

  public showVocabularyFilterMenu(): void {
    this.vocabularyFilterMenuDelegate.show(
      this.observableScreen.selectedFilterType.get(),
      (filterType): void => {
        this.observableScreen.selectedFilterType.set(filterType);
        this.refresh(filterType);
      }
    );
  }

  public showVocabularyActionMenu(vocabulary: ObservableVocabulary): void {
    this.vocabularyActionMenuDelegate.show(vocabulary);
  }

  public showVocabularyBulkActionMenu(): void {
    this.vocabularyBulkActionMenuDelegate.show();
  }
}
