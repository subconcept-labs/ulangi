/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AtomShellType } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

export class ObservableShell {
  @observable
  public highlightColor: 'green' | 'red' | null;

  @observable
  public shellType: AtomShellType;

  @observable
  public diameter: number;

  @observable
  public position: { x: number; y: number };

  @observable
  public max: number;

  public constructor(
    shellType: AtomShellType,
    diameter: number,
    position: { x: number; y: number },
    highlightColor: 'green' | null,
    max: number
  ) {
    this.shellType = shellType;
    this.diameter = diameter;
    this.position = position;
    this.highlightColor = highlightColor;
    this.max = max;
  }
}
