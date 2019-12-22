/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableAddEditSetScreen } from '@ulangi/ulangi-observable';

import { AddSetDelegate } from '../../delegates/set/AddSetDelegate';
import { CreateFirstSetScreenDelegate } from '../../delegates/set/CreateFirstSetScreenDelegate';
import { PickerDelegate } from '../../delegates/set/PickerDelegate';
import { SetFormDelegate } from '../../delegates/set/SetFormDelegate';
import { ScreenFactory } from '../../factories/ScreenFactory';
import { SingleScreenStyle } from '../../styles/SingleScreenStyle';

export class CreateFirstSetScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableAddEditSetScreen
  ): CreateFirstSetScreenDelegate {
    const rootScreenDelegate = this.createRootScreenDelegate();

    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SingleScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    const pickerDelegate = new PickerDelegate(
      this.observer,
      observableScreen.setFormState.pickerState
    );

    const setFormDelegate = new SetFormDelegate(
      observableScreen.setFormState,
      pickerDelegate
    );

    const addSetDelegate = new AddSetDelegate(
      this.eventBus,
      observableScreen.setFormState
    );

    return new CreateFirstSetScreenDelegate(
      this.eventBus,
      this.observer,
      this.props.observableLightBox,
      observableScreen.setFormState,
      setFormDelegate,
      pickerDelegate,
      addSetDelegate,
      rootScreenDelegate,
      dialogDelegate,
      navigatorDelegate
    );
  }
}
