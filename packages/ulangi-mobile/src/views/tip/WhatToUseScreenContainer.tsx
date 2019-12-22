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
import { WhatToUseScreenIds } from '../../constants/ids/WhatToUseScreenIds';
import { WhatToUseScreenFactory } from '../../factories/tip/WhatToUseScreenFactory';
import { WhatToUseScreen } from './WhatToUseScreen';
import { WhatToUseScreenStyle } from './WhatToUseScreenContainer.style';

@observer
export class WhatToUseScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? WhatToUseScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : WhatToUseScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableScreen(
    ScreenName.WHAT_TO_USE_SCREEN
  );

  private screenFactory = new WhatToUseScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate();

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === WhatToUseScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? WhatToUseScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : WhatToUseScreenStyle.SCREEN_DARK_STYLES_ONLY
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <WhatToUseScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
