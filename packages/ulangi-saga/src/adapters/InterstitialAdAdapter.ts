/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export class InterstitialAdAdapter {
  private interstitialAd: any;

  public constructor(interstitialAd: any) {
    this.interstitialAd = interstitialAd;
  }

  public show(): void {
    this.interstitialAd.show();
  }

  public on(event: string, callback: () => void): void {
    this.interstitialAd.on(event, callback);
  }

  public isLoaded(): boolean {
    return this.interstitialAd.isLoaded();
  }
}
