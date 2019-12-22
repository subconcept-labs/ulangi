/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableMembershipScreen,
  ObservableUpgradeButtonState,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { MembershipScreenIds } from '../../constants/ids/MembershipScreenIds';
import { MembershipScreenFactory } from '../../factories/membership/MembershipScreenFactory';
import { MembershipScreen } from '../../views/membership/MembershipScreen';
import { MembershipScreenStyle } from './MembershipScreenContainer.style';

@observer
export class MembershipScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? MembershipScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : MembershipScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableMembershipScreen(
    null,
    new ObservableUpgradeButtonState('Fetching product... '),
    ScreenName.MEMBERSHIP_SCREEN
  );

  private screenFactory = new MembershipScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === MembershipScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    } else if (buttonId === MembershipScreenIds.RESTORE_BTN) {
      this.screenDelegate.restorePurchases();
    }
  }

  public componentDidMount(): void {
    if (
      this.props.rootStore.userStore.existingCurrentUser.isPremium === false
    ) {
      this.screenDelegate.fetchLocalizedPrice();
      this.screenDelegate.autoUpdateUpgradeButton();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? MembershipScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : MembershipScreenStyle.SCREEN_DARK_STYLES_ONLY
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <MembershipScreen
        userStore={this.props.rootStore.userStore}
        screenDelegate={this.screenDelegate}
        observableScreen={this.observableScreen}
      />
    );
  }
}
