/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableAddEditSetScreen } from '@ulangi/ulangi-observable';

import { AddSetDelegate } from '../../delegates/set/AddSetDelegate';
import { AddSetScreenDelegate } from '../../delegates/set/AddSetScreenDelegate';
import { PickerDelegate } from '../../delegates/set/PickerDelegate';
import { SetFormDelegate } from '../../delegates/set/SetFormDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class AddSetScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableAddEditSetScreen,
  ): AddSetScreenDelegate {
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

    const addSetDelegate = new AddSetDelegate(
      this.eventBus,
      observableScreen.setFormState,
    );

    return new AddSetScreenDelegate(
      observableScreen.setFormState,
      setFormDelegate,
      pickerDelegate,
      addSetDelegate,
      dialogDelegate,
      navigatorDelegate,
      this.props.analytics,
    );
  }
}
