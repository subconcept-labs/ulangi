/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType } from '@ulangi/ulangi-action';
import { EventBus, on } from '@ulangi/ulangi-event';
import { ObservableAdScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import * as _ from 'lodash';
import { BackHandler } from 'react-native';

import { AdDelegate } from '../ad/AdDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class AdScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservableAdScreen;
  private adDelegate: AdDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableAdScreen,
    adDelegate: AdDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.adDelegate = adDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public showAdOrGoogleConsentForm(): void {
    this.adDelegate.showAdOrGoogleConsentForm();
  }

  public clearAd(): void {
    this.adDelegate.clearAd();
  }

  public autoPopOnAdClosedOrConsentStatusChanged(): void {
    this.eventBus.subscribe(
      on(
        [ActionType.AD__AD_CLOSED, ActionType.AD__CONSENT_STATUS_CHANGED],
        (): void => this.back(),
      ),
    );
  }

  public back(): void {
    this.navigatorDelegate.pop();
  }

  public closableAfterMs(millis: number): void {
    _.delay((): void => {
      this.observableScreen.closable = true;
      this.navigatorDelegate.mergeOptions({
        popGesture: true,
      });
    }, millis);
  }

  public addBackButtonHandler(handler: () => void): void {
    BackHandler.addEventListener('hardwareBackPress', handler);
  }

  public removeBackButtonHandler(handler: () => void): void {
    BackHandler.removeEventListener('hardwareBackPress', handler);
  }

  public handleBackButton(): boolean {
    return this.observableScreen.closable;
  }
}
