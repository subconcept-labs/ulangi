/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableSetManagementScreen } from '@ulangi/ulangi-observable';

import { FetchSetDelegate } from '../../delegates/set/FetchSetDelegate';
import { SetActionMenuDelegate } from '../../delegates/set/SetActionMenuDelegate';
import { SetManagementScreenDelegate } from '../../delegates/set/SetManagementScreenDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class SetManagementScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableSetManagementScreen
  ): SetManagementScreenDelegate {
    const setActionMenuDelegate = new SetActionMenuDelegate(
      this.eventBus,
      this.props.observableLightBox,
      this.createNavigatorDelegate(),
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    const fetchSetDelegate = new FetchSetDelegate(this.eventBus);

    return new SetManagementScreenDelegate(
      this.eventBus,
      this.props.observableConverter,
      observableScreen,
      fetchSetDelegate,
      setActionMenuDelegate
    );
  }
}
