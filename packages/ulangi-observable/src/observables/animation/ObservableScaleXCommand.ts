/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableScaleXCommand {
  public kind: 'scaleX';

  public scaleX: number;

  public duration: number;

  @observable
  public state: 'incompleted' | 'completed';

  public constructor(
    scaleX: number,
    duration: number,
    state?: 'incompleted' | 'completed'
  ) {
    this.kind = 'scaleX';
    this.scaleX = scaleX;
    this.duration = duration || 500;
    this.state = state || 'incompleted';
  }
}
