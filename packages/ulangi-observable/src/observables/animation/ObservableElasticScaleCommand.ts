/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableElasticScaleCommand {
  public kind: 'elasticScale';

  public scaleTo: {
    scaleX: number;
    scaleY: number;
  };

  public scaleBack: {
    scaleX: number;
    scaleY: number;
  };

  @observable
  public state: 'incompleted' | 'completed';

  public constructor(
    scaleTo: { scaleX: number; scaleY: number },
    scaleBack: { scaleX: number; scaleY: number },
    state?: 'incompleted' | 'completed'
  ) {
    this.kind = 'elasticScale';
    this.scaleTo = scaleTo;
    this.scaleBack = scaleBack;
    this.state = state || 'incompleted';
  }
}
