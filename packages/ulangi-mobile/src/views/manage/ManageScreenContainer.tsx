/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import {
  ActivityState,
  CategorySortType,
  ScreenName,
  Theme,
  VocabularyFilterType,
} from '@ulangi/ulangi-common/enums';
import {
  ObservableCategoryListState,
  ObservableManageScreen,
  ObservableTopBarButton,
  ObservableTouchableTopBar,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { ManageScreenIds } from '../../constants/ids/ManageScreenIds';
import { ManageScreenFactory } from '../../factories/manage/ManageScreenFactory';
import { ManageScreen } from './ManageScreen';
import { ManageScreenStyle } from './ManageScreenContainer.style';

@observer
export class ManageScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? ManageScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : ManageScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new ManageScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private setSelectionMenuDelegate = this.screenFactory.createSetSelectionMenuDelegateWithStyles();

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  protected observableScreen = new ObservableManageScreen(
    0,
    observable.box(CategorySortType.SORT_BY_NAME_ASC),
    observable.box(VocabularyFilterType.ACTIVE),
    new ObservableCategoryListState(
      null,
      false,
      observable.box(ActivityState.INACTIVE),
      observable.box(this.props.rootStore.syncStore.currentState === 'SYNCING'),
      observable.box(false),
      observable.box(false),
      observable.box(false),
    ),
    this.props.componentId,
    ScreenName.MANAGE_SCREEN,
    new ObservableTouchableTopBar(
      ManageScreenIds.SHOW_SET_SELECTION_MENU_BTN,
      this.setSelectionMenuDelegate.getCurrentSetName(),
      this.setSelectionMenuDelegate.getCurrentFlagIcon(),
      (): void => {
        this.setSelectionMenuDelegate.showActiveSetsForSetSelection();
      },
      new ObservableTopBarButton(
        ManageScreenIds.SEARCH_BTN,
        null,
        {
          light: Images.SEARCH_WHITE_20X20,
          dark: Images.SEARCH_MILK_20X20,
        },
        (): void => {
          this.screenDelegate.goToSearchVocabulary();
        },
      ),
      new ObservableTopBarButton(
        ManageScreenIds.QUICK_TUTORIAL_BTN,
        null,
        {
          light: Images.INFO_WHITE_22X22,
          dark: Images.INFO_MILK_22X22,
        },
        (): void => {
          this.screenDelegate.showQuickTutorial();
        },
      ),
    ),
  );

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidAppear(): void {
    this.observableScreen.screenAppearedTimes += 1;

    // Do not put autorun in componentDidMount
    // because some are fired too early (before screen appears)
    if (this.observableScreen.screenAppearedTimes === 1) {
      this.setSelectionMenuDelegate.autoUpdateSubtitleOnSetChange(
        this.observableScreen,
      );
      this.screenDelegate.autoShowSyncingInProgress();
      this.screenDelegate.autoShowRefreshNotice();
      this.screenDelegate.autoRefreshOnSetChange();
      this.screenDelegate.autoRefreshOnMultipleEdit();
      this.screenDelegate.prepareAndFetch();

      this.screenDelegate.autorun();
    }

    if (this.observableScreen.categoryListState.shouldShowRefreshNotice.get()) {
      this.screenDelegate.refresh();
    }
  }

  public componentWillUnmount(): void {
    this.screenDelegate.clearFetch();
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? ManageScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : ManageScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <ManageScreen
        setStore={this.props.rootStore.setStore}
        themeStore={this.props.rootStore.themeStore}
        observableDimensions={this.props.observableDimensions}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
