/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableMoveToCommand {
  public readonly kind: 'moveTo';

  public readonly position: { x: number; y: number };

  @observable
  public state: 'incompleted' | 'completed';

  public constructor(
    position: { x: number; y: number },
    state?: 'incompleted' | 'completed'
  ) {
    this.kind = 'moveTo';
    this.position = position;
    this.state = state || 'incompleted';
  }
}
