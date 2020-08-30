/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType } from '@ulangi/ulangi-action';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { VocabularySelectionDelegate } from '@ulangi/ulangi-delegate';
import { EventBus, group, on } from '@ulangi/ulangi-event';
import {
  ObservableSearchScreen,
  ObservableVocabulary,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { VocabularyActionMenuDelegate } from '../vocabulary/VocabularyActionMenuDelegate';
import { VocabularyBulkActionMenuDelegate } from '../vocabulary/VocabularyBulkActionMenuDelegate';
import { VocabularyEventDelegate } from '../vocabulary/VocabularyEventDelegate';
import { SearchVocabularyDelegate } from './SearchVocabularyDelegate';

@boundClass
export class SearchScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservableSearchScreen;
  private searchVocabularyDelegate: SearchVocabularyDelegate;
  private vocabularyEventDelegate: VocabularyEventDelegate;
  private vocabularyActionMenuDelegate: VocabularyActionMenuDelegate;
  private vocabularyBulkActionMenuDelegate: VocabularyBulkActionMenuDelegate;
  private vocabularySelectionDelegate: VocabularySelectionDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableSearchScreen,
    searchVocabularyDelegate: SearchVocabularyDelegate,
    vocabularyEventDelegate: VocabularyEventDelegate,
    vocabularyActionMenuDelegate: VocabularyActionMenuDelegate,
    vocabularyBulkActionMenuDelegate: VocabularyBulkActionMenuDelegate,
    vocabularySelectionDelegate: VocabularySelectionDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.searchVocabularyDelegate = searchVocabularyDelegate;
    this.vocabularyEventDelegate = vocabularyEventDelegate;
    this.vocabularyActionMenuDelegate = vocabularyActionMenuDelegate;
    this.vocabularyBulkActionMenuDelegate = vocabularyBulkActionMenuDelegate;
    this.vocabularySelectionDelegate = vocabularySelectionDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public handleSearchInputEnd(): void {
    this.refresh(this.observableScreen.searchInput);
  }

  public prepareAndSearch(searchTerm: string): void {
    this.searchVocabularyDelegate.prepareAndSearch(searchTerm);
  }

  public search(): void {
    this.searchVocabularyDelegate.search();
  }

  public clearSearch(): void {
    this.searchVocabularyDelegate.clearSearch();
  }

  public refresh(searchTerm: string): void {
    this.searchVocabularyDelegate.refresh(searchTerm);
  }

  public refreshCurrentList(): void {
    this.refresh(this.observableScreen.searchInput);
  }

  public autoRefreshOnSetChange(): void {
    this.eventBus.subscribe(
      on(ActionType.SET__SELECT, (): void => this.refreshCurrentList()),
    );
  }

  public autoRefreshOnMultipleEdit(): void {
    this.eventBus.subscribe(
      on(
        ActionType.VOCABULARY__EDIT_MULTIPLE_SUCCEEDED,
        (): void => {
          this.refreshCurrentList();
        },
      ),
    );
  }

  public autoShowSyncCompleted(): void {
    this.vocabularyEventDelegate.onDownloadVocabularyCompleted(
      (): void => {
        this.observableScreen.vocabularyListState.shouldShowRefreshNotice.set(
          true,
        );
      },
    );
  }

  public autoShowSyncingInProgress(): void {
    this.eventBus.subscribe(
      group(
        on(
          [ActionType.SYNC__STOP, ActionType.SYNC__SYNC_COMPLETED],
          (): void => {
            this.observableScreen.vocabularyListState.shouldShowSyncingNotice.set(
              false,
            );
          },
        ),
        on(
          ActionType.SYNC__SYNCING,
          (): void => {
            this.observableScreen.vocabularyListState.shouldShowSyncingNotice.set(
              true,
            );
          },
        ),
      ),
    );
  }

  public showVocabularyDetail(vocabulary: ObservableVocabulary): void {
    this.navigatorDelegate.push(ScreenName.VOCABULARY_DETAIL_SCREEN, {
      vocabulary,
    });
  }

  public showVocabularyActionMenu(vocabulary: ObservableVocabulary): void {
    this.vocabularyActionMenuDelegate.show(vocabulary);
  }

  public showVocabularyBulkActionMenu(): void {
    this.vocabularyBulkActionMenuDelegate.show();
  }

  public toggleSelection(vocabulary: ObservableVocabulary): void {
    this.vocabularySelectionDelegate.setSelection(
      vocabulary.vocabularyId,
      !vocabulary.isSelected.get(),
    );
  }

  public clearSelections(): void {
    this.vocabularySelectionDelegate.clearSelections();
  }
}
