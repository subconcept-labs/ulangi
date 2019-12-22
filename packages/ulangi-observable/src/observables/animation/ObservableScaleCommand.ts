/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableScaleCommand {
  public kind: 'scale';

  public scale: {
    scaleX: number;
    scaleY: number;
  };

  @observable
  public state: 'incompleted' | 'completed';

  public constructor(
    scale: { scaleX: number; scaleY: number },
    state?: 'incompleted' | 'completed'
  ) {
    this.kind = 'scale';
    this.scale = scale;
    this.state = state || 'incompleted';
  }
}
