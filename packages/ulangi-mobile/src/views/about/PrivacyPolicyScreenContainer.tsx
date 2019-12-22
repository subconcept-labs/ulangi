/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { PrivacyPolicyScreenIds } from '../../constants/ids/PrivacyPolicyScreenIds';
import { PrivacyPolicyScreenFactory } from '../../factories/about/PrivacyPolicyScreenFactory';
import { PrivacyPolicyScreen } from './PrivacyPolicyScreen';
import { PrivacyPolicyScreenStyle } from './PrivacyPolicyScreenContainer.style';

@observer
export class PrivacyPolicyScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? PrivacyPolicyScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : PrivacyPolicyScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableScreen(
    ScreenName.PRIVACY_POLICY_SCREEN
  );

  private screenFactory = new PrivacyPolicyScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === PrivacyPolicyScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? PrivacyPolicyScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : PrivacyPolicyScreenStyle.SCREEN_DARK_STYLES_ONLY
    );
  }

  public render(): React.ReactElement<any> {
    return <PrivacyPolicyScreen />;
  }
}
