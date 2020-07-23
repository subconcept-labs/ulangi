/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { Observer } from '@ulangi/ulangi-observable';
import { IObservableValue } from 'mobx';

import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

export class AdAfterLessonDelegate {
  private observer: Observer;
  private shouldShowAdOrGoogleConsentForm: IObservableValue<boolean>;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observer: Observer,
    shouldShowAdOrGoogleConsentForm: IObservableValue<boolean>,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observer = observer;
    this.shouldShowAdOrGoogleConsentForm = shouldShowAdOrGoogleConsentForm;
    this.navigatorDelegate = navigatorDelegate;
  }

  public showAdOrGoogleConsentForm(onClose: () => void): void {
    this.navigatorDelegate.push(ScreenName.AD_SCREEN, {
      onClose,
    });
  }

  public handleShowAdOrGoogleConsentForm(): boolean {
    let willShow = false;
    if (this.shouldShowAdOrGoogleConsentForm.get()) {
      willShow = true;
      this.showAdOrGoogleConsentForm(
        (): void => {
          this.navigatorDelegate.dismissScreen();
        },
      );
    }

    return willShow;
  }

  public autoDisablePopGestureWhenAdRequiredToShow(): void {
    this.observer.autorun(
      (): void => {
        if (this.shouldShowAdOrGoogleConsentForm.get()) {
          this.navigatorDelegate.mergeOptions({
            popGesture: false,
          });
        }
      },
    );
  }
}
