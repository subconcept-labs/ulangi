/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ConsentStatus } from '@ulangi/ulangi-common/enums';
import { computed, observable } from 'mobx';

import { ObservableStore } from '../stores/ObservableStore';

export class ObservableAdStore extends ObservableStore {
  @observable
  public isSetUp: boolean;

  @observable
  public isInitialized: boolean;

  @observable
  public consentStatus: ConsentStatus;

  @observable
  public isRequestLocationInEeaOrUnknown: boolean;

  @observable
  public isAdLoaded: boolean;

  @observable
  public numberOfTermsReviewed: number;

  @computed
  public get isAdConsentRequired(): boolean {
    return (
      this.consentStatus === ConsentStatus.UNKNOWN &&
      this.isRequestLocationInEeaOrUnknown === true
    );
  }

  public constructor(
    isSetUp: boolean,
    isInitialized: boolean,
    consentStatus: ConsentStatus,
    isRequestLocationInEeaOrUnknown: boolean,
    isAdLoaded: boolean,
    numberOfTermsReviewed: number
  ) {
    super();
    this.isSetUp = isSetUp;
    this.isInitialized = isInitialized;
    this.consentStatus = consentStatus;
    this.isRequestLocationInEeaOrUnknown = isRequestLocationInEeaOrUnknown;
    this.isAdLoaded = isAdLoaded;
    this.numberOfTermsReviewed = numberOfTermsReviewed;
  }
}
