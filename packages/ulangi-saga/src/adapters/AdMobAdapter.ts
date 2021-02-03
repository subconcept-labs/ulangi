/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ConsentStatus } from '@ulangi/ulangi-common/enums';

import { InterstitialAdAdapter } from './InterstitialAdAdapter';

export class AdMobAdapter {
  private adMob: any;
  private adConsent: any;

  public constructor(adMob: any, adConsent: any) {
    this.adMob = adMob;
    this.adConsent = adConsent;
  }

  public initialize(adAppId: string): void {
    this.adMob().initialize(adAppId);
  }

  public loadInterstitialAd(
    addUnitId: string,
    consentStatus: ConsentStatus,
    adTestDeviceId: undefined | string
  ): InterstitialAdAdapter {
    let adRequest = new this.adMob.AdRequest();

    adRequest = adRequest.tagForChildDirectedTreatment(true);

    if (typeof adTestDeviceId !== 'undefined') {
      adRequest = adRequest.addTestDevice(adTestDeviceId);
    }

    if (consentStatus === ConsentStatus.NON_PERSONALIZED) {
      adRequest = adRequest.addNetworkExtra('npa', '1');
    }

    const interstitialAd = this.adMob().interstitial(addUnitId);

    interstitialAd.loadAd(adRequest.build());

    return new InterstitialAdAdapter(interstitialAd);
  }

  public async requestConsentInfoUpdate(
    publisherId: string
  ): Promise<ConsentStatus> {
    return this.adConsent.requestConsentInfoUpdate({
      publisherId,
    });
  }

  public async isRequestLocationInEeaOrUnknown(): Promise<boolean> {
    return this.adConsent.isRequestLocationInEeaOrUnknown();
  }

  public async showGoogleConsentForm(
    privacyPolicyUrl: string,
    shouldOfferAdFree: boolean
  ): Promise<ConsentStatus | 'prefers_ad_free'> {
    return this.adConsent.showGoogleConsentForm({
      privacyPolicyUrl,
      shouldOfferAdFree,
    });
  }

  public async setDebugGeography(
    consentFormDebugDeviceId: string,
    consentFormDebugGeography: 'EEA' | 'NOT_EEA'
  ): Promise<void> {
    await this.adConsent.addTestDevice(consentFormDebugDeviceId);

    return this.adConsent.setDebugGeography(consentFormDebugGeography);
  }

  public async setConsentStatus(status: ConsentStatus): Promise<boolean> {
    return this.adConsent.setConsentStatus(status);
  }
}
