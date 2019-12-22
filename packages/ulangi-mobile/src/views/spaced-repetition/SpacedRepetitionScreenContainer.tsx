/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableSpacedRepetitionScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { SpacedRepetitionScreenIds } from '../../constants/ids/SpacedRepetitionScreenIds';
import { SpacedRepetitionScreenFactory } from '../../factories/spaced-repetition/SpacedRepetitionScreenFactory';
import { SpacedRepetitionScreen } from '../../views/spaced-repetition/SpacedRepetitionScreen';
import { SpacedRepetitionScreenStyle } from '../../views/spaced-repetition/SpacedRepetitionScreenContainer.style';

export interface SpacedRepetitionScreenPassedProps {
  selectedCategoryNames: undefined | string[];
}

@observer
export class SpacedRepetitionScreenContainer extends Container<
  SpacedRepetitionScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? SpacedRepetitionScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : SpacedRepetitionScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new SpacedRepetitionScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  protected observableScreen = new ObservableSpacedRepetitionScreen(
    this.props.passedProps.selectedCategoryNames,
    ScreenName.SPACED_REPETITION_SCREEN
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === SpacedRepetitionScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? SpacedRepetitionScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : SpacedRepetitionScreenStyle.SCREEN_DARK_STYLES_ONLY
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <SpacedRepetitionScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
