/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableDimensionChangeCommand {
  public kind: 'dimensionChange';

  public dimension: {
    height: number;
    width: number;
  };

  @observable
  public state: 'incompleted' | 'completed';

  public constructor(
    dimension: { height: number; width: number },
    state?: 'incompleted' | 'completed'
  ) {
    this.kind = 'dimensionChange';
    this.dimension = dimension;
    this.state = state || 'incompleted';
  }
}
