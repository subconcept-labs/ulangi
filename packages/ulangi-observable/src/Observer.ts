/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  IAutorunOptions,
  IReactionOptions,
  IReactionPublic,
  IWhenOptions,
  Lambda,
  autorun,
  reaction,
  when,
} from 'mobx';

export class Observer {
  private currentId: number = 0;
  private unsubscribeMap: Map<number, () => void> = new Map();

  public autorun(
    view: (r: IReactionPublic) => any,
    opts?: IAutorunOptions
  ): () => void {
    const currentId = this.nextId();

    const disposer = autorun(view, opts);

    this.unsubscribeMap.set(currentId, disposer);

    return (): void => this.unsubscribe(currentId);
  }

  public reaction<T>(
    expression: (r: IReactionPublic) => T,
    effect: (arg: T, r: IReactionPublic) => void,
    opts?: IReactionOptions
  ): () => void {
    const currentId = this.nextId();

    const disposer = reaction(expression, effect, opts);

    this.unsubscribeMap.set(currentId, disposer);

    return (): void => this.unsubscribe(currentId);
  }

  public when(
    predicate: () => boolean,
    effect: Lambda,
    opts?: IWhenOptions
  ): () => void {
    const currentId = this.nextId();

    const disposer = when(predicate, effect, opts);

    this.unsubscribeMap.set(currentId, disposer);

    return (): void => this.unsubscribe(currentId);
  }

  public unsubscribeAll(): void {
    for (const id of this.unsubscribeMap.keys()) {
      this.unsubscribe(id);
    }
  }

  private nextId(): number {
    return ++this.currentId;
  }

  private unsubscribe(id: number): void {
    const unsubscribe = this.unsubscribeMap.get(id);
    if (typeof unsubscribe !== 'undefined') {
      unsubscribe();
    }
    this.unsubscribeMap.delete(id);
  }
}
