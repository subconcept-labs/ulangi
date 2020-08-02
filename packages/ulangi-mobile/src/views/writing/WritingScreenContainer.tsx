/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableTopBarButton,
  ObservableTouchableTopBar,
  ObservableWritingScreen,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { WritingScreenIds } from '../../constants/ids/WritingScreenIds';
import { WritingScreenFactory } from '../../factories/writing/WritingScreenFactory';
import { WritingScreen } from './WritingScreen';
import { WritingScreenStyle } from './WritingScreenContainer.style';

export interface WritingScreenPassedProps {
  selectedCategoryNames: undefined | string[];
}

@observer
export class WritingScreenContainer extends Container<
  WritingScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? WritingScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : WritingScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new WritingScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private setSelectionMenuDelegate = this.screenFactory.createSetSelectionMenuDelegateWithStyles();

  protected observableScreen = new ObservableWritingScreen(
    this.props.passedProps.selectedCategoryNames,
    this.props.componentId,
    ScreenName.WRITING_SCREEN,
    new ObservableTouchableTopBar(
      WritingScreenIds.SHOW_SET_SELECTION_MENU_BTN,
      this.setSelectionMenuDelegate.getCurrentSetName(),
      this.setSelectionMenuDelegate.getCurrentFlagIcon(),
      (): void => {
        this.setSelectionMenuDelegate.showActiveSetsForSetSelection();
      },
      new ObservableTopBarButton(
        WritingScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.dismissScreen();
        },
      ),
      null,
    ),
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidMount(): void {
    this.setSelectionMenuDelegate.autoUpdateSubtitleOnSetChange(
      this.observableScreen,
    );
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? WritingScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : WritingScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <WritingScreen
        observableDimensions={this.props.observableDimensions}
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
