/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { PixabayImage } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';

export class UploadImageDelegate {
  private eventBus: EventBus;

  public constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  public uploadImages(
    images: PixabayImage[],
    callback: {
      onUploading: () => void;
      onUploadSucceeded: (urls: string[]) => void;
      onUploadFailed: (errorCode: string) => void;
    },
  ): void {
    this.eventBus.pubsub(
      createAction(ActionType.IMAGE__UPLOAD_IMAGES, {
        images,
      }),
      group(
        on(ActionType.IMAGE__UPLOADING_IMAGES, callback.onUploading),
        once(
          ActionType.IMAGE__UPLOAD_IMAGES_SUCCEEDED,
          ({ urls }): void => callback.onUploadSucceeded(urls),
        ),
        once(
          ActionType.IMAGE__UPLOAD_IMAGES_FAILED,
          ({ errorCode }): void => callback.onUploadFailed(errorCode),
        ),
      ),
    );
  }
}
