/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { computed, observable } from 'mobx';

import { ObservableCommandList } from '../animation/ObservableCommandList';
import { ObservableDimensions } from '../dimensions/ObservableDimensions';

export class ObservableOrigin {
  private observableDimensions: ObservableDimensions;

  public readonly commandList: ObservableCommandList;

  @observable
  public bottomOffset: number;

  @observable
  public outerShellDiameter: number;

  @observable
  public particleSize: number;

  @computed
  public get position(): { x: number; y: number } {
    const x = this.observableDimensions.windowWidth / 2;
    const windowHeight = this.observableDimensions.windowHeight;

    const y =
      windowHeight -
      this.bottomOffset -
      this.outerShellDiameter / 2 -
      this.particleSize / 2;

    return { x, y };
  }

  public constructor(
    observableDimensions: ObservableDimensions,
    bottomOffset: number,
    outerShellDiameter: number,
    particleSize: number
  ) {
    this.observableDimensions = observableDimensions;
    this.bottomOffset = bottomOffset;
    this.outerShellDiameter = outerShellDiameter;
    this.particleSize = particleSize;

    this.commandList = new ObservableCommandList();
  }
}
