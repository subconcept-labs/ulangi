/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { InferableAction } from '@ulangi/ulangi-action';
import { Action, AnyAction, Dispatch, Middleware } from 'redux';
import * as uuid from 'uuid';

import { Event } from './interfaces/Event';
import { EventListener } from './types/EventListener';

export class EventFacade {
  private currentId: number = 0;
  private subscribeMap: Map<number, EventListener> = new Map();

  public getMiddleware(): Middleware {
    return (): ReturnType<Middleware> => {
      return (next: Dispatch<Action>): Dispatch<Action> => {
        return <Action>(action: AnyAction): Action => {
          const result = next(action);

          this.notifySubscribers({
            eventId: uuid.v4(),
            action: new InferableAction(action.type, action.payload),
          });

          return (result as unknown) as Action;
        };
      };
    };
  }

  public subscribe(listener: EventListener): () => void {
    const currentId = this.nextId();

    this.subscribeMap.set(currentId, listener);

    return (): void => this.unsubscribe(currentId);
  }

  private unsubscribe(id: number): void {
    this.subscribeMap.delete(id);
  }

  private notifySubscribers(event: Event): void {
    for (const [id, listener] of this.subscribeMap.entries()) {
      listener(event, (): void => this.unsubscribe(id));
    }
  }

  private nextId(): number {
    return ++this.currentId;
  }
}
