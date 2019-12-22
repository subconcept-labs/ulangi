/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { EventChannel, eventChannel } from 'redux-saga';

import { InterstitialAdAdapter } from '../adapters/InterstitialAdAdapter';
import { AdEventType } from '../enums/AdEventType';

export class AdEventChannel {
  private ad: InterstitialAdAdapter;

  public constructor(ad: InterstitialAdAdapter) {
    this.ad = ad;
  }

  public createChannel(): EventChannel<{
    eventType: AdEventType;
    errorCode?: string;
  }> {
    return eventChannel(
      (emitter): (() => void) => {
        _.values(AdEventType).forEach(
          (eventType): void => {
            this.ad.on(
              eventType,
              (errorCode?: string): void => {
                emitter({
                  eventType: eventType as AdEventType,
                  errorCode,
                });
              }
            );
          }
        );

        return _.noop;
      }
    );
  }
}
