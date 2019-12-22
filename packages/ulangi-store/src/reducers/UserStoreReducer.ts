/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, InferableAction } from '@ulangi/ulangi-action';
import {
  ObservableConverter,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';

import { Reducer } from './Reducer';

export class UserStoreReducer extends Reducer {
  private userStore: ObservableUserStore;
  private observableConverter: ObservableConverter;

  public constructor(
    userStore: ObservableUserStore,
    observableConverter: ObservableConverter
  ) {
    super();
    this.userStore = userStore;
    this.observableConverter = observableConverter;
  }

  public perform(action: InferableAction): void {
    if (action.is(ActionType.USER__GET_SESSION_SUCCEEDED)) {
      this.getSessionSucceeded(action);
    } else if (action.is(ActionType.USER__CHECK_SESSION_SUCCEEDED)) {
      this.checkSessionSucceeded(action);
    } else if (action.is(ActionType.USER__SIGN_IN_SUCCEEDED)) {
      this.signInSucceeded(action);
    } else if (action.is(ActionType.USER__SIGN_IN_AS_GUEST_SUCCEEDED)) {
      this.signInAsGuestSucceeded(action);
    } else if (action.is(ActionType.USER__SIGN_UP_SUCCEEDED)) {
      this.signUpSucceeded(action);
    } else if (
      action.is(ActionType.USER__CHANGE_EMAIL_AND_PASSWORD_SUCCEEDED)
    ) {
      this.changeEmailAndPasswordSucceeded(action);
    } else if (action.is(ActionType.USER__CHANGE_EMAIL_SUCCEEDED)) {
      this.changeEmailSucceeded(action);
    } else if (action.is(ActionType.USER__EDIT_SUCCEEDED)) {
      this.editSucceeded(action);
    } else if (action.is(ActionType.USER__FETCH_SUCCEEDED)) {
      this.fetchSucceeded(action);
    }
  }

  private getSessionSucceeded(
    action: Action<ActionType.USER__GET_SESSION_SUCCEEDED>
  ): void {
    const { user } = action.payload;
    this.userStore.currentUser =
      user === null
        ? null
        : this.observableConverter.convertToObservableUser(user, null);
  }

  private checkSessionSucceeded(
    action: Action<ActionType.USER__CHECK_SESSION_SUCCEEDED>
  ): void {
    this.userStore.existingCurrentUser.isSessionValid = action.payload.valid;
  }

  private signInSucceeded(
    action: Action<ActionType.USER__SIGN_IN_SUCCEEDED>
  ): void {
    const { user } = action.payload;
    this.userStore.currentUser = this.observableConverter.convertToObservableUser(
      user,
      true
    );
  }

  private signInAsGuestSucceeded(
    action: Action<ActionType.USER__SIGN_IN_AS_GUEST_SUCCEEDED>
  ): void {
    const { user } = action.payload;
    this.userStore.currentUser = this.observableConverter.convertToObservableUser(
      user,
      true
    );
  }

  private signUpSucceeded(
    action: Action<ActionType.USER__SIGN_UP_SUCCEEDED>
  ): void {
    const { user } = action.payload;
    this.userStore.currentUser = this.observableConverter.convertToObservableUser(
      user,
      true
    );
  }

  private changeEmailAndPasswordSucceeded(
    action: Action<ActionType.USER__CHANGE_EMAIL_AND_PASSWORD_SUCCEEDED>
  ): void {
    const { newEmail } = action.payload;
    if (this.userStore.currentUser !== null) {
      this.userStore.currentUser.email = newEmail;
    }
  }

  private changeEmailSucceeded(
    action: Action<ActionType.USER__CHANGE_EMAIL_SUCCEEDED>
  ): void {
    const { newEmail } = action.payload;
    if (this.userStore.currentUser !== null) {
      this.userStore.currentUser.email = newEmail;
    }
  }

  private editSucceeded(action: Action<ActionType.USER__EDIT_SUCCEEDED>): void {
    const { user } = action.payload;
    if (this.userStore.currentUser !== null) {
      this.userStore.currentUser = this.observableConverter.convertToObservableUser(
        user,
        this.userStore.existingCurrentUser.isSessionValid
      );
    }
  }

  private fetchSucceeded(
    action: Action<ActionType.USER__FETCH_SUCCEEDED>
  ): void {
    const { user } = action.payload;
    if (this.userStore.currentUser !== null) {
      this.userStore.currentUser = this.observableConverter.convertToObservableUser(
        user,
        this.userStore.existingCurrentUser.isSessionValid
      );
    }
  }
}
