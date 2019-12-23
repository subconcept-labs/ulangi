/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ActivityState } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableCategoryFormState,
  ObservableSetStore,
  Observer,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observable, runInAction } from 'mobx';

export class CategoryFormDelegate {
  private eventBus: EventBus;
  private observer: Observer;
  private setStore: ObservableSetStore;
  private categoryFormState: ObservableCategoryFormState;

  public constructor(
    eventBus: EventBus,
    observer: Observer,
    setStore: ObservableSetStore,
    categoryFormState: ObservableCategoryFormState,
  ) {
    this.eventBus = eventBus;
    this.observer = observer;
    this.setStore = setStore;
    this.categoryFormState = categoryFormState;
  }

  public setCategoryName(categoryName: string): void {
    this.categoryFormState.categoryName = categoryName;
  }

  public clearFetchSuggestions(): void {
    this.categoryFormState.fetchSuggestionsState.set(ActivityState.INACTIVE);
    this.categoryFormState.suggestions = null;
    this.categoryFormState.noMoreSuggestions = false;
    this.eventBus.publish(
      createAction(ActionType.CATEGORY__CLEAR_FETCH_SUGGESTIONS, null),
    );
  }

  public showAllCategories(): void {
    this.clearFetchSuggestions();
    this.prepareAndFetchSuggestions('');
  }

  public prepareAndFetchSuggestions(term: string): void {
    this.eventBus.pubsub(
      createAction(ActionType.CATEGORY__PREPARE_FETCH_SUGGESTIONS, {
        setId: this.setStore.existingCurrentSetId,
        term,
      }),
      group(
        on(
          ActionType.CATEGORY__PREPARING_FETCH_SUGGESTIONS,
          (): void => {
            this.categoryFormState.fetchSuggestionsState.set(
              ActivityState.ACTIVE,
            );
          },
        ),
        once(
          ActionType.CATEGORY__PREPARE_FETCH_SUGGESTIONS_SUCCEEDED,
          (): void => {
            this.categoryFormState.fetchSuggestionsState.set(
              ActivityState.INACTIVE,
            );
            this.fetchSuggestions();
          },
        ),
        once(
          ActionType.CATEGORY__PREPARE_FETCH_SUGGESTIONS_FAILED,
          (): void => {
            this.categoryFormState.fetchSuggestionsState.set(
              ActivityState.INACTIVE,
            );
          },
        ),
        once(ActionType.CATEGORY__CLEAR_FETCH_SUGGESTIONS, _.noop),
      ),
    );
  }

  public fetchSuggestions(): void {
    if (
      this.categoryFormState.noMoreSuggestions === false &&
      this.categoryFormState.fetchSuggestionsState.get() ===
        ActivityState.INACTIVE
    ) {
      this.categoryFormState.fetchSuggestionsState.set(ActivityState.ACTIVE);
      this.eventBus.pubsub(
        createAction(ActionType.CATEGORY__FETCH_SUGGESTIONS, null),
        group(
          once(
            ActionType.CATEGORY__FETCH_SUGGESTIONS_SUCCEEDED,
            ({ categoryNames, noMore }): void => {
              runInAction(
                (): void => {
                  this.categoryFormState.fetchSuggestionsState.set(
                    ActivityState.INACTIVE,
                  );
                  this.categoryFormState.noMoreSuggestions = noMore;
                  if (this.categoryFormState.suggestions === null) {
                    this.categoryFormState.suggestions = observable.array();
                  }

                  this.categoryFormState.suggestions.push(
                    ...categoryNames.slice(),
                  );
                },
              );
            },
          ),
          once(
            ActionType.CATEGORY__FETCH_SUGGESTIONS_FAILED,
            (): void => {
              this.categoryFormState.fetchSuggestionsState.set(
                ActivityState.INACTIVE,
              );
            },
          ),
          once(ActionType.CATEGORY__CLEAR_FETCH_SUGGESTIONS, _.noop),
        ),
      );
    }
  }

  public autoRefreshCategorySuggestionsOnNameChange(
    debounceTime: number,
  ): void {
    const debouncedPrepareAndFetchCategorySuggestions = _.debounce((): void => {
      this.prepareAndFetchSuggestions(this.categoryFormState.categoryName);
    }, debounceTime);

    this.observer.reaction(
      (): undefined | string => this.categoryFormState.categoryName,
      (): void => {
        this.clearFetchSuggestions();
        debouncedPrepareAndFetchCategorySuggestions();
      },
    );
  }
}
