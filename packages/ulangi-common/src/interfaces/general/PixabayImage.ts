/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export interface PixabayImage {
  readonly id: number;
  readonly previewURL: string;
  readonly previewWidth: number;
  readonly previewHeight: number;
  readonly webformatURL: string;
  readonly webformatWidth: number;
  readonly webformatHeight: number;
  readonly largeImageURL: string;
}
