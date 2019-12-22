/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { isObservableArray, observable } from 'mobx';

import { ObservableArc } from './ObservableArc';

export class ObservableArcList {
  @observable
  public readonly arcs: ObservableArc[] = [];

  public constructor(arcs?: ObservableArc[]) {
    if (typeof arcs !== 'undefined') {
      this.merge(arcs);
    }
  }

  public merge(arcs: ObservableArc[]): void {
    this.arcs.push(...arcs);
  }

  public add(arc: ObservableArc): void {
    this.arcs.push(arc);
  }

  public replace(arcs: ObservableArc[]): void {
    if (isObservableArray(this.arcs)) {
      this.arcs.replace(arcs);
    } else {
      throw new Error('arcs is not an observable array');
    }
  }

  public clear(): void {
    if (isObservableArray(this.arcs)) {
      this.arcs.clear();
    } else {
      throw new Error('arcs is not an observable array');
    }
  }
}
