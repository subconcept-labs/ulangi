/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableTitleTopBar,
  ObservableTopBarButton,
  ObservableWritingSettingsScreen,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { WritingSettingsScreenIds } from '../../constants/ids/WritingSettingsScreenIds';
import { WritingSettingsScreenFactory } from '../../factories/writing/WritingSettingsScreenFactory';
import { WritingSettingsScreen } from './WritingSettingsScreen';
import { WritingSettingsScreenStyle } from './WritingSettingsScreenContainer.style';

@observer
export class WritingSettingsScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? WritingSettingsScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : WritingSettingsScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new WritingSettingsScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private writingSettingsDelegate = this.screenFactory.createWritingSettingsDelegate();

  private originalSettings = this.writingSettingsDelegate.getCurrentSettings();

  protected observableScreen = new ObservableWritingSettingsScreen(
    this.originalSettings.initialInterval,
    this.originalSettings.limit,
    this.originalSettings.feedbackButtons,
    this.originalSettings.autoplayAudio,
    ScreenName.WRITING_SETTINGS_SCREEN,
    new ObservableTitleTopBar(
      'Settings',
      new ObservableTopBarButton(
        WritingSettingsScreenIds.BACK_BTN,
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
        WritingSettingsScreenIds.SAVE_BTN,
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
        ? WritingSettingsScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : WritingSettingsScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <WritingSettingsScreen
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
