/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { ConsentStatus, ErrorCode } from '@ulangi/ulangi-common/enums';
import { call, cancel, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { AdMobAdapter } from '../adapters/AdMobAdapter';
import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { InterstitialAdAdapter } from '../adapters/InterstitialAdAdapter';
import { AdEventChannel } from '../channels/AdEventChannel';
import { AdEventType } from '../enums/AdEventType';
import { PublicSaga } from '../sagas/PublicSaga';

export class AdSaga extends PublicSaga {
  private adMob: AdMobAdapter;
  private crashlytics: CrashlyticsAdapter;

  public constructor(adMob: AdMobAdapter, crashlytics: CrashlyticsAdapter) {
    super();
    this.adMob = adMob;
    this.crashlytics = crashlytics;
  }

  public *run(): IterableIterator<any> {
    yield fork([this, this.allowSetUp]);
  }

  public *allowSetUp(): IterableIterator<any> {
    try {
      const action: Action<ActionType.AD__SET_UP> = yield take(
        ActionType.AD__SET_UP
      );

      const {
        publisherId,
        consentFormDebugDeviceId,
        consentFormDebugGeography,
      } = action.payload;

      if (
        typeof consentFormDebugDeviceId !== 'undefined' &&
        typeof consentFormDebugGeography !== 'undefined'
      ) {
        yield call(
          [this.adMob, 'setDebugGeography'],
          consentFormDebugDeviceId,
          consentFormDebugGeography
        );
      }

      const consentStatus: PromiseType<
        ReturnType<AdMobAdapter['requestConsentInfoUpdate']>
      > = yield call([this.adMob, 'requestConsentInfoUpdate'], publisherId);

      yield put(
        createAction(ActionType.AD__GET_CONSENT_STATUS_SUCCEEDED, {
          consentStatus,
        })
      );

      const isInEeaOrUnknown: PromiseType<
        ReturnType<AdMobAdapter['isRequestLocationInEeaOrUnknown']>
      > = yield call([this.adMob, 'isRequestLocationInEeaOrUnknown']);

      yield put(
        createAction(ActionType.AD__GET_REQUEST_LOCATION_SUCCEEDED, {
          isInEeaOrUnknown,
        })
      );

      yield fork([this, this.allowInit]);
      yield fork([this, this.allowShowGoogleConsentForm]);

      yield put(createAction(ActionType.AD__SET_UP_SUCCEEDED, null));
    } catch (error) {
      yield put(
        createAction(ActionType.AD__SET_UP_FAILED, {
          errorCode: this.crashlytics.getErrorCode(error),
        })
      );
    }
  }

  public *allowInit(): IterableIterator<any> {
    let initialized = false;

    while (true) {
      try {
        const action: Action<ActionType.AD__INITIALIZE> = yield take(
          ActionType.AD__INITIALIZE
        );

        if (initialized === true) {
          throw new Error(ErrorCode.AD__ALREADY_INITIALIZED);
        } else {
          this.adMob.initialize(action.payload.adAppId);
          initialized = true;
          yield put(createAction(ActionType.AD__INITIALIZE_SUCCEEDED, null));
          yield fork([this, this.allowLoadAd]);
        }
      } catch (error) {
        yield put(
          createAction(ActionType.AD__INITIALIZE_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  private *allowShowGoogleConsentForm(): IterableIterator<any> {
    while (true) {
      try {
        const action: Action<
          ActionType.AD__SHOW_GOOGLE_CONSENT_FORM
        > = yield take(ActionType.AD__SHOW_GOOGLE_CONSENT_FORM);

        const response: PromiseType<
          ReturnType<AdMobAdapter['showGoogleConsentForm']>
        > = yield call(
          [this.adMob, 'showGoogleConsentForm'],
          action.payload.privacyPolicyUrl,
          action.payload.shouldOfferAdFree
        );

        const consentStatus =
          response === 'prefers_ad_free' ? ConsentStatus.UNKNOWN : response;

        yield call([this.adMob, 'setConsentStatus'], consentStatus);
        yield put(
          createAction(ActionType.AD__CONSENT_STATUS_CHANGED, {
            consentStatus,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.AD__SHOW_GOOGLE_CONSENT_FORM_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  private *allowLoadAd(): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.AD__LOAD_AD> = yield take(
        ActionType.AD__LOAD_AD
      );

      try {
        yield put(createAction(ActionType.AD__LOADING_AD, null));

        const interstitialAd = this.adMob.loadInterstitialAd(
          action.payload.adUnitId,
          action.payload.consentStatus,
          action.payload.adTestDeviceId
        );

        const observeAdEventTask = yield fork(
          [this, this.observeAdEvent],
          interstitialAd
        );
        const showAdTask = yield fork([this, this.allowShowAd], interstitialAd);

        yield take(ActionType.AD__CLEAR_AD);
        yield cancel(observeAdEventTask);
        yield cancel(showAdTask);
      } catch (error) {
        yield put(
          createAction(ActionType.AD__LOAD_AD_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  private *allowShowAd(ad: InterstitialAdAdapter): IterableIterator<any> {
    try {
      yield take(ActionType.AD__SHOW_AD);
      if (ad.isLoaded()) {
        yield put(createAction(ActionType.AD__SHOWING_AD, null));
        ad.show();

        yield take(ActionType.AD__AD_OPENED);
        yield put(createAction(ActionType.AD__SHOW_AD_SUCCEEDED, null));
      } else {
        throw new Error(ErrorCode.AD__AD_NOT_YET_LOADED);
      }
    } catch (error) {
      yield put(
        createAction(ActionType.AD__SHOW_AD_FAILED, {
          errorCode: this.crashlytics.getErrorCode(error),
        })
      );
    }
  }

  private *observeAdEvent(ad: InterstitialAdAdapter): IterableIterator<any> {
    const channel = new AdEventChannel(ad).createChannel();
    try {
      while (true) {
        const { eventType, errorCode } = yield take(channel);
        switch (eventType) {
          case AdEventType.ON_AD_LOADED:
            yield put(createAction(ActionType.AD__LOAD_AD_SUCCEEDED, null));
            break;

          case AdEventType.ON_AD_FAILED_TO_LOAD:
            yield put(
              createAction(ActionType.AD__LOAD_AD_FAILED, {
                errorCode: this.crashlytics.getErrorCode(errorCode),
              })
            );
            break;

          case AdEventType.ON_AD_OPENED:
            yield put(createAction(ActionType.AD__AD_OPENED, null));
            break;

          case AdEventType.ON_AD_CLOSED:
            yield put(createAction(ActionType.AD__AD_CLOSED, null));
            break;
        }
      }
    } finally {
      channel.close();
    }
  }
}
