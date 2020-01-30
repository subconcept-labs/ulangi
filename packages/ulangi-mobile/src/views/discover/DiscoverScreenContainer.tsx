/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ActivityState, ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDiscoverScreen,
  ObservablePublicSetListState,
  ObservablePublicVocabularyListState,
  ObservableTopBarButton,
  ObservableTouchableTopBar,
  ObservableTranslationListState,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { DiscoverScreenIds } from '../../constants/ids/DiscoverScreenIds';
import { DiscoverScreenFactory } from '../../factories/discover/DiscoverScreenFactory';
import { DiscoverScreen } from './DiscoverScreen';
import { DiscoverScreenStyle } from './DiscoverScreenContainer.style';

@observer
export class DiscoverScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? DiscoverScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : DiscoverScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new DiscoverScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private setSelectionMenuDelegate = this.screenFactory.createSetSelectionMenuDelegateWithStyles();

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  protected observableScreen = new ObservableDiscoverScreen(
    observable.box(''),
    observable.box(false),
    observable.box(false),
    observable.box(null),
    observable.box(null),
    new ObservablePublicSetListState(
      null,
      false,
      observable.box(ActivityState.INACTIVE),
      observable.box(false),
    ),
    new ObservablePublicVocabularyListState(
      null,
      false,
      observable.box(ActivityState.INACTIVE),
      observable.box(false),
    ),
    new ObservableTranslationListState(
      null,
      null,
      observable.box(ActivityState.INACTIVE),
      observable.box(undefined),
      observable.box(false),
    ),
    ScreenName.DISCOVER_SCREEN,
    new ObservableTouchableTopBar(
      DiscoverScreenIds.SHOW_SET_SELECTION_MENU_BTN,
      this.setSelectionMenuDelegate.getCurrentSetName(),
      this.setSelectionMenuDelegate.getCurrentFlagIcon(),
      (): void => {
        this.setSelectionMenuDelegate.showActiveSetsForSetSelection();
      },
      null,
      new ObservableTopBarButton(
        DiscoverScreenIds.TIP_BTN,
        null,
        {
          light: Images.INFO_WHITE_22X22,
          dark: Images.INFO_MILK_22X22,
        },
        (): void => {
          this.screenDelegate.showTip();
        },
      ),
    ),
  );

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidMount(): void {
    this.setSelectionMenuDelegate.autoUpdateSubtitleOnSetChange(
      this.observableScreen,
    );

    this.screenDelegate.autoRefreshOnSetChange();

    if (
      this.props.rootStore.setStore.existingCurrentSet
        .shouldShowPremadeFlashcards
    ) {
      this.screenDelegate.clearAndSearch();
    }
  }

  public componentWillUnmount(): void {
    this.screenDelegate.clearAllList();
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? DiscoverScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : DiscoverScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <DiscoverScreen
        setStore={this.props.rootStore.setStore}
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
