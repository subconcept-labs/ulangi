/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableMoreScreen } from '@ulangi/ulangi-observable';

import { AdDelegate } from '../../delegates/ad/AdDelegate';
import { AutoArchiveSettingsDelegate } from '../../delegates/auto-archive/AutoArchiveSettingsDelegate';
import { LinkingDelegate } from '../../delegates/linking/LinkingDelegate';
import { MoreScreenDelegate } from '../../delegates/more/MoreScreenDelegate';
import { InAppRatingDelegate } from '../../delegates/rating/InAppRatingDelegate';
import { ReminderSettingsDelegate } from '../../delegates/reminder/ReminderSettingsDelegate';
import { ThemeSettingsDelegate } from '../../delegates/theme/ThemeSettingsDelegate';
import { PrimaryScreenStyle } from '../../styles/PrimaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class MoreScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableMoreScreen,
  ): MoreScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const rootScreenDelegate = this.createRootScreenDelegate();

    const inAppRatingDelegate = new InAppRatingDelegate(
      this.eventBus,
      this.props.rootStore.userStore,
      this.props.rootStore.remoteConfigStore,
      dialogDelegate,
    );

    const adDelegate = new AdDelegate(
      this.eventBus,
      this.props.rootStore.adStore,
      this.props.rootStore.userStore,
      this.props.rootStore.remoteConfigStore,
    );

    const autoArchiveSettingsDelegate = new AutoArchiveSettingsDelegate(
      this.props.rootStore.userStore,
    );

    const reminderSettingsDelegate = new ReminderSettingsDelegate(
      this.props.rootStore.userStore,
      this.props.rootStore.notificationStore,
    );

    const linkingDelegate = new LinkingDelegate(dialogDelegate);

    const themeSettingsDelegate = new ThemeSettingsDelegate(
      this.props.rootStore.userStore,
    );

    return new MoreScreenDelegate(
      this.observer,
      this.props.rootStore.userStore,
      this.props.rootStore.themeStore,
      this.props.observableLightBox,
      observableScreen,
      rootScreenDelegate,
      adDelegate,
      inAppRatingDelegate,
      autoArchiveSettingsDelegate,
      reminderSettingsDelegate,
      themeSettingsDelegate,
      linkingDelegate,
      dialogDelegate,
      navigatorDelegate,
    );
  }
}
