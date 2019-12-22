/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableArc {
  @observable
  public fromPosition: { x: number; y: number };

  @observable
  public toPosition: { x: number; y: number };

  @observable
  public radius: number;

  public constructor(
    fromPosition: { x: number; y: number },
    toPosition: { x: number; y: number },
    radius: number
  ) {
    this.fromPosition = fromPosition;
    this.toPosition = toPosition;
    this.radius = radius;
  }
}
