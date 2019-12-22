/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableScaleYCommand {
  public kind: 'scaleY';

  public scaleY: number;

  @observable
  public state: 'incompleted' | 'completed';

  public constructor(scaleY: number, state?: 'incompleted' | 'completed') {
    this.kind = 'scaleY';
    this.scaleY = scaleY;
    this.state = state || 'incompleted';
  }
}
