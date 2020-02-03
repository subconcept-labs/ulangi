/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableFeatureManagementScreen } from '@ulangi/ulangi-observable';

import { FeatureManagementScreenDelegate } from '../../delegates/learn/FeatureManagementScreenDelegate';
import { FeatureSettingsDelegate } from '../../delegates/learn/FeatureSettingsDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class FeatureManagementScreenFactory extends ScreenFactory {
  public createFeatureSettingsDelegate(): FeatureSettingsDelegate {
    return new FeatureSettingsDelegate(this.props.rootStore.setStore);
  }

  public createScreenDelegate(
    observableScreen: ObservableFeatureManagementScreen,
  ): FeatureManagementScreenDelegate {
    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    return new FeatureManagementScreenDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      observableScreen,
      dialogDelegate,
    );
  }
}
