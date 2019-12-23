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
import { TermsOfServiceScreenIds } from '../../constants/ids/TermsOfServiceScreenIds';
import { TermsOfServiceScreenFactory } from '../../factories/about/TermsOfServiceScreenFactory';
import { TermsOfServiceScreen } from './TermsOfServiceScreen';
import { TermsOfServiceScreenStyle } from './TermsOfServiceScreenContainer.style';

@observer
export class TermsOfServiceScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? TermsOfServiceScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : TermsOfServiceScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableScreen(
    ScreenName.TERMS_OF_SERVICE_SCREEN,
  );

  private screenFactory = new TermsOfServiceScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === TermsOfServiceScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? TermsOfServiceScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : TermsOfServiceScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return <TermsOfServiceScreen />;
  }
}
