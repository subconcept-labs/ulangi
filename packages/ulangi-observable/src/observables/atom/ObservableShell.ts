/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AtomShellType } from '@ulangi/ulangi-common/enums';
import { computed, observable } from 'mobx';

import { ObservableOrigin } from './ObservableOrigin';

export class ObservableShell {
  private origin: ObservableOrigin;

  @observable
  public highlightColor: 'green' | 'red' | null;

  @observable
  public shellType: AtomShellType;

  @observable
  public diameter: number;

  @observable
  public max: number;

  @computed
  public get position(): { x: number; y: number } {
    return this.origin.position;
  }

  public constructor(
    origin: ObservableOrigin,
    shellType: AtomShellType,
    diameter: number,
    highlightColor: 'green' | null,
    max: number
  ) {
    this.origin = origin;
    this.shellType = shellType;
    this.diameter = diameter;
    this.highlightColor = highlightColor;
    this.max = max;
  }
}
