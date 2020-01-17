/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableThemeScreen,
  ObservableThemeSettings,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { ThemeScreenIds } from '../../constants/ids/ThemeScreenIds';
import { ThemeScreenFactory } from '../../factories/theme/ThemeScreenFactory';
import { ThemeScreen } from './ThemeScreen';
import { ThemeScreenStyle } from './ThemeScreenContainer.style';

@observer
export class ThemeScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? ThemeScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : ThemeScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new ThemeScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private themeSettingsDelegate = this.screenFactory.createThemeSettingsDelegate();

  private currentSettings = this.themeSettingsDelegate.getCurrentSettings();

  protected observableScreen = new ObservableThemeScreen(
    new ObservableThemeSettings(this.currentSettings.trigger),
    ScreenName.THEME_SCREEN,
    new ObservableTitleTopBar(
      'Theme',
      new ObservableTopBarButton(
        ThemeScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.pop();
        },
      ),
      new ObservableTopBarButton(
        ThemeScreenIds.SAVE_BTN,
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

  public onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? ThemeScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : ThemeScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <ThemeScreen
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
