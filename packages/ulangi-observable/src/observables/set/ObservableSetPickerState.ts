/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SetFormPickerType } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

export class ObservableSetPickerState {
  @observable
  public currentPicker: SetFormPickerType | null;

  @observable
  public languagePickerShouldRunCloseAnimation: boolean;

  @observable
  public disabled: boolean;

  public constructor(
    currentPicker: SetFormPickerType | null,
    languagePickerShouldRunCloseAnimation: boolean,
    disabled: boolean
  ) {
    this.currentPicker = currentPicker;
    this.languagePickerShouldRunCloseAnimation = languagePickerShouldRunCloseAnimation;
    this.disabled = disabled;
  }
}
