/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SetFormPickerType } from '@ulangi/ulangi-common/enums';
import { ObservableSetPickerState, Observer } from '@ulangi/ulangi-observable';
import { Keyboard } from 'react-native';

export class PickerDelegate {
  private observer: Observer;
  private pickerState: ObservableSetPickerState;

  public constructor(
    observer: Observer,
    pickerState: ObservableSetPickerState
  ) {
    this.observer = observer;
    this.pickerState = pickerState;
  }

  public showPicker(pickerType: SetFormPickerType): void {
    Keyboard.dismiss();
    if (pickerType !== this.pickerState.currentPicker) {
      if (this.pickerState.currentPicker !== null) {
        // Hide other picker first
        this.hidePicker();
      }

      this.observer.when(
        (): boolean => this.pickerState.currentPicker === null,
        (): void => {
          this.pickerState.currentPicker = pickerType;
        }
      );
    }
  }

  public hidePicker(): void {
    if (this.pickerState.currentPicker !== null) {
      this.pickerState.languagePickerShouldRunCloseAnimation = true;
      this.observer.when(
        (): boolean =>
          this.pickerState.languagePickerShouldRunCloseAnimation === false,
        (): void => {
          this.pickerState.currentPicker = null;
        }
      );
    }
  }
}
