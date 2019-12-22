/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { PixabayImage } from '@ulangi/ulangi-common/interfaces';
import { IObservableValue, observable } from 'mobx';

export class ObservablePixabayImage {
  public readonly id: number;

  public readonly previewURL: string;
  public readonly previewWidth: number;
  public readonly previewHeight: number;

  public readonly webformatURL: string;
  public readonly webformatWidth: number;
  public readonly webformatHeight: number;
  public readonly largeImageURL: string;

  @observable
  public isSelected: IObservableValue<boolean>;

  public constructor(
    id: number,
    previewURL: string,
    previewWidth: number,
    previewHeight: number,
    webformatURL: string,
    webformatWidth: number,
    webformatHeight: number,
    largeImageURL: string,
    isSelected: IObservableValue<boolean>
  ) {
    this.id = id;
    this.previewURL = previewURL;
    this.previewWidth = previewWidth;
    this.previewHeight = previewHeight;
    this.webformatURL = webformatURL;
    this.webformatWidth = webformatWidth;
    this.webformatHeight = webformatHeight;
    this.largeImageURL = largeImageURL;
    this.isSelected = isSelected;
  }

  public toRaw(): PixabayImage {
    return {
      id: this.id,
      previewURL: this.previewURL,
      previewWidth: this.previewWidth,
      previewHeight: this.previewHeight,
      webformatURL: this.webformatURL,
      webformatWidth: this.webformatWidth,
      webformatHeight: this.webformatHeight,
      largeImageURL: this.largeImageURL,
    };
  }
}
