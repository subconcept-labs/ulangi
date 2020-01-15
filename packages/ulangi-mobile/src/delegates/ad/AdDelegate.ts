/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { UserMembership } from '@ulangi/ulangi-common/enums';
import { EventBus } from '@ulangi/ulangi-event';
import {
  ObservableAdStore,
  ObservableRemoteConfigStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import { Platform } from 'react-native';

import { env } from '../../constants/env';

export class AdDelegate {
  private eventBus: EventBus;
  private adStore: ObservableAdStore;
  private userStore: ObservableUserStore;
  private remoteConfigStore: ObservableRemoteConfigStore;

  public constructor(
    eventBus: EventBus,
    adStore: ObservableAdStore,
    userStore: ObservableUserStore,
    remoteConfigStore: ObservableRemoteConfigStore,
  ) {
    this.eventBus = eventBus;
    this.adStore = adStore;
    this.userStore = userStore;
    this.remoteConfigStore = remoteConfigStore;
  }

  public shouldSetUp(): boolean {
    // set up even if user has a Premium account
    return (
      this.userStore.existingCurrentUser.isSessionValid === true &&
      this.adStore.isSetUp === false
    );
  }

  public setUp(): void {
    if (env.ADMOB_PUBLISHER_ID !== null) {
      this.eventBus.publish(
        createAction(ActionType.AD__SET_UP, {
          publisherId: env.ADMOB_PUBLISHER_ID,
          consentFormDebugGeography: env.CONSENT_FORM_DEBUG_GEOGRAPHY,
          consentFormDebugDeviceId: Platform.select({
            ios: env.IOS_CONSENT_FORM_DEBUG_DEVICE_ID,
            android: env.ANDROID_CONSENT_FORM_DEBUG_DEVICE_ID,
          }),
        }),
      );
    } else {
      console.warn('AdConsent is not configured');
    }
  }

  public shouldInitialize(): boolean {
    return (
      this.userStore.existingCurrentUser.membership ===
        UserMembership.REGULAR &&
      this.adStore.isSetUp === true &&
      this.adStore.isInitialized === false &&
      this.adStore.isAdConsentRequired === false
    );
  }

  public initialize(): void {
    if (env.IOS_AD_APP_ID !== null && env.ANDROID_AD_APP_ID !== null) {
      this.eventBus.publish(
        createAction(ActionType.AD__INITIALIZE, {
          adAppId: Platform.select({
            ios: env.IOS_AD_APP_ID,
            android: env.ANDROID_AD_APP_ID,
          }),
        }),
      );
    } else {
      console.warn('AdConsent is not configured');
    }
  }

  public shouldLoadAd(): boolean {
    return (
      this.userStore.existingCurrentUser.membership ===
        UserMembership.REGULAR &&
      this.adStore.numberOfTermsReviewed >=
        this.remoteConfigStore.existingRemoteConfig.ad
          .numOfTermsToReviewBeforeShowingAds &&
      this.adStore.isInitialized === true &&
      this.adStore.isAdLoaded === false
    );
  }

  public loadAd(): void {
    if (env.IOS_AD_UNIT_ID !== null && env.ANDROID_AD_UNIT_ID !== null) {
      this.eventBus.publish(
        createAction(ActionType.AD__LOAD_AD, {
          adUnitId: Platform.select({
            ios: env.IOS_AD_UNIT_ID,
            android: env.ANDROID_AD_UNIT_ID,
          }),
          consentStatus: this.adStore.consentStatus,
          adTestDeviceId: Platform.select({
            ios: env.IOS_AD_TEST_DEVICE_ID,
            android: env.ANDROID_AD_TEST_DEVICE_ID,
          }),
        }),
      );
    } else {
      console.warn('AdMob is not configured');
    }
  }

  public shouldShowAdOrGoogleConsentForm(): boolean {
    return this.shouldShowAd() || this.shouldShowGoogleConsentForm();
  }

  public shouldShowAd(): boolean {
    return (
      this.userStore.existingCurrentUser.membership ===
        UserMembership.REGULAR && this.adStore.isAdLoaded
    );
  }

  public showAdOrGoogleConsentForm(): void {
    if (this.shouldShowAd()) {
      this.showAd();
    } else {
      this.showGoogleConsentForm();
    }
  }

  public showAd(): void {
    this.eventBus.publish(createAction(ActionType.AD__SHOW_AD, null));
  }

  public shouldShowGoogleConsentForm(): boolean {
    return (
      this.userStore.existingCurrentUser.membership ===
        UserMembership.REGULAR &&
      this.adStore.numberOfTermsReviewed >=
        this.remoteConfigStore.existingRemoteConfig.ad
          .numOfTermsToReviewBeforeShowingAds &&
      this.adStore.isAdConsentRequired === true
    );
  }

  public showGoogleConsentForm(): void {
    if (
      env.PRIVACY_POLICY_URL !== null &&
      env.CONSENT_FORM_SHOULD_OFFER_AD_FREE !== null
    ) {
      this.eventBus.publish(
        createAction(ActionType.AD__SHOW_GOOGLE_CONSENT_FORM, {
          privacyPolicyUrl: env.PRIVACY_POLICY_URL,
          shouldOfferAdFree: env.CONSENT_FORM_SHOULD_OFFER_AD_FREE,
        }),
      );
    } else {
      console.warn('AdConsent is not configured');
    }
  }

  public clearAd(): void {
    this.eventBus.publish(createAction(ActionType.AD__CLEAR_AD, null));
  }
}
