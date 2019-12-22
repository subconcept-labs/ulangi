/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, InferableAction } from '@ulangi/ulangi-action';
import { ErrorCode } from '@ulangi/ulangi-common/enums';
import { ObservableAdStore } from '@ulangi/ulangi-observable';

import { Reducer } from './Reducer';

export class AdStoreReducer extends Reducer {
  private adStore: ObservableAdStore;

  public constructor(adStore: ObservableAdStore) {
    super();
    this.adStore = adStore;
  }

  public perform(action: InferableAction): void {
    if (action.is(ActionType.AD__SET_UP_SUCCEEDED)) {
      this.setUpSucceeded();
    } else if (action.is(ActionType.AD__SET_UP_FAILED)) {
      this.setUpFailed();
    } else if (action.is(ActionType.AD__INITIALIZE_SUCCEEDED)) {
      this.initializeSucceeded();
    } else if (action.is(ActionType.AD__INITIALIZE_FAILED)) {
      this.initializeFailed(action);
    } else if (action.is(ActionType.AD__GET_CONSENT_STATUS_SUCCEEDED)) {
      this.getConsentStatusSucceeded(action);
    } else if (action.is(ActionType.AD__GET_REQUEST_LOCATION_SUCCEEDED)) {
      this.getRequestLocationSucceeded(action);
    } else if (
      action.is(ActionType.SPACED_REPETITION__SAVE_RESULT) ||
      action.is(ActionType.WRITING__SAVE_RESULT)
    ) {
      this.addNumberOfTermsReviewed(action);
    } else if (action.is(ActionType.AD__LOAD_AD_SUCCEEDED)) {
      this.loadAdSucceeded();
    } else if (action.is(ActionType.AD__CONSENT_STATUS_CHANGED)) {
      this.consentStatusChanged(action);
    } else if (action.is(ActionType.AD__CLEAR_AD)) {
      this.clearAd();
    }
  }

  private setUpSucceeded(): void {
    this.adStore.isSetUp = true;
  }

  private setUpFailed(): void {
    this.adStore.isSetUp = false;
  }

  private initializeSucceeded(): void {
    this.adStore.isInitialized = true;
  }

  private initializeFailed(
    action: Action<ActionType.AD__INITIALIZE_FAILED>
  ): void {
    if (action.payload.errorCode === ErrorCode.AD__ALREADY_INITIALIZED) {
      this.adStore.isInitialized = true;
    } else {
      this.adStore.isInitialized = false;
    }
  }

  private getConsentStatusSucceeded(
    action: Action<ActionType.AD__GET_CONSENT_STATUS_SUCCEEDED>
  ): void {
    this.adStore.consentStatus = action.payload.consentStatus;
  }

  private getRequestLocationSucceeded(
    action: Action<ActionType.AD__GET_REQUEST_LOCATION_SUCCEEDED>
  ): void {
    this.adStore.isRequestLocationInEeaOrUnknown =
      action.payload.isInEeaOrUnknown;
  }

  private addNumberOfTermsReviewed(
    action: Action<
      | ActionType.SPACED_REPETITION__SAVE_RESULT
      | ActionType.WRITING__SAVE_RESULT
    >
  ): void {
    this.adStore.numberOfTermsReviewed += action.payload.vocabularyList.size;
  }

  private loadAdSucceeded(): void {
    this.adStore.isAdLoaded = true;
  }

  private consentStatusChanged(
    action: Action<ActionType.AD__CONSENT_STATUS_CHANGED>
  ): void {
    this.adStore.consentStatus = action.payload.consentStatus;
  }

  private clearAd(): void {
    this.adStore.numberOfTermsReviewed = 0;
    this.adStore.isAdLoaded = false;
  }
}
