/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import * as _ from 'lodash';

import { config } from '../../constants/config';

export class FetchVocabularyDelegate {
  private eventBus: EventBus;

  public constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  public fetch(callback: {
    onFetching: () => void;
    onFetchSucceeded: (
      vocabularyList: readonly Vocabulary[],
      noMore: boolean,
    ) => void;
    onFetchFailed: (errorCode: string) => void;
  }): void {
    this.eventBus.pubsub(
      createAction(ActionType.ATOM__FETCH_VOCABULARY, null),
      group(
        on(ActionType.ATOM__FETCHING_VOCABULARY, callback.onFetching),
        once(
          ActionType.ATOM__FETCH_VOCABULARY_SUCCEEDED,
          ({ vocabularyList, noMore }): void =>
            callback.onFetchSucceeded(vocabularyList, noMore),
        ),
        once(
          ActionType.ATOM__FETCH_VOCABULARY_FAILED,
          ({ errorCode }): void => callback.onFetchFailed(errorCode),
        ),
      ),
    );
  }

  public fetchVocabularyIfBelowThreshold(
    currentNumberOfQuestionLeft: number,
    callback: {
      onFetchSucceeded: (
        vocabularyList: readonly Vocabulary[],
        noMore: boolean,
      ) => void;
    },
  ): void {
    if (currentNumberOfQuestionLeft < config.atom.fetchTriggerThreshold) {
      this.fetch({
        onFetching: _.noop,
        onFetchSucceeded: callback.onFetchSucceeded,
        onFetchFailed: _.noop,
      });
    }
  }

  public clearFetch(): void {
    this.eventBus.publish(
      createAction(ActionType.ATOM__CLEAR_FETCH_VOCABULARY, null),
    );
  }
}
