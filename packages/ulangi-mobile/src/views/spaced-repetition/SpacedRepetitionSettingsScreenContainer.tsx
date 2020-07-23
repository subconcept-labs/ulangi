/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableSpacedRepetitionSettingsScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
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
    this.originalSettings.reviewStrategy,
    this.originalSettings.feedbackButtons,
    this.originalSettings.autoplayAudio,
    this.props.componentId,
    ScreenName.SPACED_REPETITION_SETTINGS_SCREEN,
    new ObservableTitleTopBar(
      'Settings',
      new ObservableTopBarButton(
        SpacedRepetitionSettingsScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.dismissScreen();
        },
      ),
      new ObservableTopBarButton(
        SpacedRepetitionSettingsScreenIds.SAVE_BTN,
        'Save',
        null,
        (): void => {
          this.screenDelegate.save();
        },
      ),
    ),
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

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
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
