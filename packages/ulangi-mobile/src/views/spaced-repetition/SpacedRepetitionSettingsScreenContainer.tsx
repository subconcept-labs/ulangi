/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableSpacedRepetitionSettingsScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { SpacedRepetitionSettingsScreenIds } from '../../constants/ids/SpacedRepetitionSettingsScreenIds';
import { SpacedRepetitionSettingsScreenFactory } from '../../factories/spaced-repetition/SpacedRepetitionSettingsScreenFactory';
import { SpacedRepetitionSettingsScreen } from './SpacedRepetitionSettingsScreen';
import { SpacedRepetitionSettingsScreenStyle } from './SpacedRepetitionSettingsScreenContainer.style';

@observer
export class SpacedRepetitionSettingsScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? SpacedRepetitionSettingsScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : SpacedRepetitionSettingsScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new SpacedRepetitionSettingsScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private spacedRepetitionSettingsDelegate = this.screenFactory.createSpacedRepetitionSettingsDelegate();

  private originalSettings = this.spacedRepetitionSettingsDelegate.getCurrentSettings();

  protected observableScreen = new ObservableSpacedRepetitionSettingsScreen(
    this.originalSettings.initialInterval,
    this.originalSettings.limit,
    ScreenName.SPACED_REPETITION_SETTINGS_SCREEN,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === SpacedRepetitionSettingsScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    } else if (buttonId === SpacedRepetitionSettingsScreenIds.SAVE_BTN) {
      this.screenDelegate.save();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? SpacedRepetitionSettingsScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : SpacedRepetitionSettingsScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <SpacedRepetitionSettingsScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
