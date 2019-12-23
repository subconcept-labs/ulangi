/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType } from '@ulangi/ulangi-action';
import { EventBus, on } from '@ulangi/ulangi-event';

export class VocabularyEventDelegate {
  private eventBus: EventBus;

  public constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  public onVocabularyChange(callback: () => void): void {
    this.eventBus.subscribe(
      on(
        [
          ActionType.VOCABULARY__ADD_SUCCEEDED,
          ActionType.VOCABULARY__ADD_MULTIPLE_SUCCEEDED,
          ActionType.VOCABULARY__DOWNLOAD_VOCABULARY_SUCCEEDED,
          ActionType.VOCABULARY__DOWNLOAD_INCOMPATIBLE_VOCABULARY_SUCCEEDED,
        ],
        callback,
      ),
    );
  }
  public onDownloadVocabularyCompleted(callback: () => void): void {
    this.eventBus.subscribe(
      on(
        [
          ActionType.VOCABULARY__DOWNLOAD_VOCABULARY_SUCCEEDED,
          ActionType.VOCABULARY__DOWNLOAD_INCOMPATIBLE_VOCABULARY_SUCCEEDED,
        ],
        callback,
      ),
    );
  }
}
