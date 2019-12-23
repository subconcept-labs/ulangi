/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableMembershipScreen } from '@ulangi/ulangi-observable';

import { MembershipScreenDelegate } from '../../delegates/membership/MembershipScreenDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class MembershipScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableMembershipScreen,
  ): MembershipScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    return new MembershipScreenDelegate(
      this.eventBus,
      this.observer,
      this.props.rootStore.userStore,
      this.props.rootStore.purchaseStore,
      observableScreen,
      dialogDelegate,
      navigatorDelegate,
    );
  }
}
