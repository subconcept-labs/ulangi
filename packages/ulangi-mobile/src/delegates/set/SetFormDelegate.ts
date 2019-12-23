/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SetFormPickerType } from '@ulangi/ulangi-common/enums';
import { ObservableSetFormState } from '@ulangi/ulangi-observable';

import { PickerDelegate } from './PickerDelegate';

export class SetFormDelegate {
  private setFormState: ObservableSetFormState;
  private pickerDelegate: PickerDelegate;

  public constructor(
    setFormState: ObservableSetFormState,
    pickerDelegate: PickerDelegate,
  ) {
    this.setFormState = setFormState;
    this.pickerDelegate = pickerDelegate;
  }

  public handleLanguageSelected(languageCode: string): void {
    if (
      this.setFormState.pickerState.currentPicker ===
      SetFormPickerType.TRANSLATED_INTO
    ) {
      this.setFormState.translatedToLanguageCode = languageCode;
    } else if (
      this.setFormState.pickerState.currentPicker === SetFormPickerType.LEARN
    ) {
      this.setFormState.learningLanguageCode = languageCode;
    } else {
      throw new Error(
        'currentPicker should be either translatedToLanguage or learningLanguage',
      );
    }
    this.pickerDelegate.hidePicker();
  }
}
