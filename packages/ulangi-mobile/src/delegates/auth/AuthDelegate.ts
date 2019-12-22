/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';

export class AuthDelegate {
  private eventBus: EventBus;

  public constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  public signIn(
    email: string,
    password: string,
    callback: {
      onSigningIn: () => void;
      onSignInSucceeded: () => void;
      onSignInFailed: (errorCode: string) => void;
    }
  ): void {
    this.eventBus.pubsub(
      createAction(ActionType.USER__SIGN_IN, {
        email,
        password,
      }),
      group(
        on(ActionType.USER__SIGNING_IN, callback.onSigningIn),
        once(ActionType.USER__SIGN_IN_SUCCEEDED, callback.onSignInSucceeded),
        once(
          ActionType.USER__SIGN_IN_FAILED,
          ({ errorCode }): void => callback.onSignInFailed(errorCode)
        )
      )
    );
  }

  public signInAsGuest(callback: {
    onSigningInAsGuest: () => void;
    onSignInAsGuestSucceeded: () => void;
    onSignInAsGuestFailed: (errorCode: string) => void;
  }): void {
    this.eventBus.pubsub(
      createAction(ActionType.USER__SIGN_IN_AS_GUEST, null),
      group(
        on(ActionType.USER__SIGNING_IN_AS_GUEST, callback.onSigningInAsGuest),
        once(
          ActionType.USER__SIGN_IN_AS_GUEST_SUCCEEDED,
          callback.onSignInAsGuestSucceeded
        ),
        once(
          ActionType.USER__SIGN_IN_AS_GUEST_FAILED,
          ({ errorCode }): void => callback.onSignInAsGuestFailed(errorCode)
        )
      )
    );
  }

  public signUp(
    email: string,
    password: string,
    confirmPassword: string,
    callback: {
      onSigningUp: () => void;
      onSignUpSucceeded: () => void;
      onSignUpFailed: (errorCode: string) => void;
    }
  ): void {
    this.eventBus.pubsub(
      createAction(ActionType.USER__SIGN_UP, {
        email,
        password,
        confirmPassword,
      }),
      group(
        on(ActionType.USER__SIGNING_UP, callback.onSigningUp),
        once(ActionType.USER__SIGN_UP_SUCCEEDED, callback.onSignUpSucceeded),
        once(
          ActionType.USER__SIGN_UP_FAILED,
          ({ errorCode }): void => callback.onSignUpFailed(errorCode)
        )
      )
    );
  }
}
