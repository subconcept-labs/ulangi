/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableStopAndResetCommand {
  public kind: 'stopAndReset';

  @observable
  public state: 'incompleted' | 'completed';

  public constructor(state?: 'incompleted' | 'completed') {
    this.kind = 'stopAndReset';
    this.state = state || 'incompleted';
  }
}
