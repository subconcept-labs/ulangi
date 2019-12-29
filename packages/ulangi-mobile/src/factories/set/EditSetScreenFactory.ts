/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableAddEditSetScreen } from '@ulangi/ulangi-observable';

import { EditSetDelegate } from '../../delegates/set/EditSetDelegate';
import { EditSetScreenDelegate } from '../../delegates/set/EditSetScreenDelegate';
import { PickerDelegate } from '../../delegates/set/PickerDelegate';
import { SetFormDelegate } from '../../delegates/set/SetFormDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class EditSetScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableAddEditSetScreen,
  ): EditSetScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const pickerDelegate = new PickerDelegate(
      this.observer,
      observableScreen.setFormState.pickerState,
    );

    const setFormDelegate = new SetFormDelegate(
      observableScreen.setFormState,
      pickerDelegate,
    );

    const editSetDelegate = new EditSetDelegate(
      this.eventBus,
      observableScreen.setFormState,
    );

    return new EditSetScreenDelegate(
      observableScreen.setFormState,
      setFormDelegate,
      pickerDelegate,
      editSetDelegate,
      dialogDelegate,
      navigatorDelegate,
    );
  }
}
