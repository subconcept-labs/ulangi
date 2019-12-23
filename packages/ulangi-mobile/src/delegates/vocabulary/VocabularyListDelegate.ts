/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  ActivityState,
  VocabularyDueType,
  VocabularyFilterType,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import {
  isVocabularyDueType,
  isVocabularyStatus,
} from '@ulangi/ulangi-common/utils';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableSetStore,
  ObservableVocabulary,
  ObservableVocabularyListState,
  mergeList,
} from '@ulangi/ulangi-observable';

import { SpacedRepetitionSettingsDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSettingsDelegate';
import { WritingSettingsDelegate } from '../../delegates/writing/WritingSettingsDelegate';

export class VocabularyListDelegate {
  private forManageScreen: boolean;
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableConverter: ObservableConverter;
  private vocabularyListState: ObservableVocabularyListState;
  private spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate;
  private writingSettingsDelegate: WritingSettingsDelegate;

  public constructor(
    forManageScreen: boolean,
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableConverter: ObservableConverter,
    vocabularyListState: ObservableVocabularyListState,
    spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate,
    writingSettingsDelegate: WritingSettingsDelegate,
  ) {
    this.forManageScreen = forManageScreen;
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableConverter = observableConverter;
    this.vocabularyListState = vocabularyListState;
    this.spacedRepetitionSettingsDelegate = spacedRepetitionSettingsDelegate;
    this.writingSettingsDelegate = writingSettingsDelegate;
  }

  public prepareAndFetch(
    filterType: VocabularyFilterType,
    categoryName?: string,
  ): void {
    this.eventBus.pubsub(
      createAction(
        this.forManageScreen
          ? ActionType.MANAGE__PREPARE_FETCH_VOCABULARY
          : ActionType.VOCABULARY__PREPARE_FETCH,
        this.createPrepareFetchPayload(filterType, categoryName),
      ),
      group(
        on(
          this.forManageScreen
            ? ActionType.MANAGE__PREPARING_FETCH_VOCABULARY
            : ActionType.VOCABULARY__PREPARING_FETCH,
          (): void => {
            this.vocabularyListState.fetchState.set(ActivityState.ACTIVE);
          },
        ),
        once(
          this.forManageScreen
            ? ActionType.MANAGE__PREPARE_FETCH_VOCABULARY_SUCCEEDED
            : ActionType.VOCABULARY__PREPARE_FETCH_SUCCEEDED,
          (): void => {
            this.vocabularyListState.fetchState.set(ActivityState.INACTIVE);
            this.fetch();
          },
        ),
        once(
          this.forManageScreen
            ? ActionType.MANAGE__PREPARE_FETCH_VOCABULARY_FAILED
            : ActionType.VOCABULARY__PREPARE_FETCH_FAILED,
          (): void => {
            this.vocabularyListState.fetchState.set(ActivityState.ERROR);
          },
        ),
      ),
    );
  }

  public refresh(
    filterType: VocabularyFilterType,
    categoryName?: string,
  ): void {
    this.vocabularyListState.isRefreshing.set(true);
    this.vocabularyListState.shouldShowSyncCompletedNotice.set(false);
    this.clearFetch();
    this.prepareAndFetch(filterType, categoryName);
  }

  public fetch(): void {
    if (
      this.vocabularyListState.noMore === false &&
      this.vocabularyListState.fetchState.get() === ActivityState.INACTIVE
    ) {
      this.vocabularyListState.fetchState.set(ActivityState.ACTIVE);
      this.eventBus.pubsub(
        createAction(
          this.forManageScreen
            ? ActionType.MANAGE__FETCH_VOCABULARY
            : ActionType.VOCABULARY__FETCH,
          null,
        ),
        group(
          once(
            this.forManageScreen
              ? ActionType.MANAGE__FETCH_VOCABULARY_SUCCEEDED
              : ActionType.VOCABULARY__FETCH_SUCCEEDED,
            ({ vocabularyList, noMore }): void => {
              this.vocabularyListState.fetchState.set(ActivityState.INACTIVE);
              this.vocabularyListState.isRefreshing.set(false);
              this.vocabularyListState.noMore = noMore;
              this.vocabularyListState.vocabularyList = mergeList(
                this.vocabularyListState.vocabularyList,
                vocabularyList.map(
                  (vocabulary): [string, ObservableVocabulary] => [
                    vocabulary.vocabularyId,
                    this.observableConverter.convertToObservableVocabulary(
                      vocabulary,
                    ),
                  ],
                ),
              );
            },
          ),
          once(
            this.forManageScreen
              ? ActionType.MANAGE__FETCH_VOCABULARY_FAILED
              : ActionType.VOCABULARY__FETCH_FAILED,
            (): void => {
              this.vocabularyListState.fetchState.set(ActivityState.ERROR);
              this.vocabularyListState.isRefreshing.set(false);
            },
          ),
        ),
      );
    }
  }

  public clearFetch(): void {
    this.vocabularyListState.fetchState.set(ActivityState.INACTIVE);
    this.vocabularyListState.vocabularyList = null;
    this.vocabularyListState.noMore = false;
    this.eventBus.publish(
      createAction(
        this.forManageScreen
          ? ActionType.MANAGE__CLEAR_FETCH_VOCABULARY
          : ActionType.VOCABULARY__CLEAR_FETCH,
        null,
      ),
    );
  }

  public refreshIfEmpty(
    filterType: VocabularyFilterType,
    categoryName?: string,
  ): void {
    if (
      this.vocabularyListState.vocabularyList !== null &&
      this.vocabularyListState.vocabularyList.size === 0
    ) {
      this.refresh(filterType, categoryName);
    }
  }

  private createPrepareFetchPayload(
    filterType: VocabularyFilterType,
    categoryName?: string,
  ):
    | {
        filterBy: 'VocabularyStatus';
        setId: string;
        vocabularyStatus: VocabularyStatus;
        categoryName: undefined | string;
      }
    | {
        filterBy: 'VocabularyDueType';
        setId: string;
        initialInterval: number;
        dueType: VocabularyDueType;
        categoryName: undefined | string;
      } {
    if (isVocabularyStatus(filterType)) {
      return {
        filterBy: 'VocabularyStatus',
        setId: this.setStore.existingCurrentSetId,
        vocabularyStatus: filterType,
        categoryName,
      };
    } else if (isVocabularyDueType(filterType)) {
      return {
        filterBy: 'VocabularyDueType',
        setId: this.setStore.existingCurrentSetId,
        initialInterval:
          filterType === VocabularyDueType.DUE_BY_SPACED_REPETITION
            ? this.spacedRepetitionSettingsDelegate.getCurrentSettings()
                .initialInterval
            : this.writingSettingsDelegate.getCurrentSettings().initialInterval,
        dueType: filterType,
        categoryName,
      };
    } else {
      throw new Error('Invalid filter type');
    }
  }
}
