/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ActivityState, ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableSearchScreen,
  ObservableTopBarButton,
  ObservableTouchableTopBar,
  ObservableVocabularyListState,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { SearchScreenIds } from '../../constants/ids/SearchScreenIds';
import { SearchScreenFactory } from '../../factories/search/SearchScreenFactory';
import { SearchScreen } from './SearchScreen';
import { SearchScreenStyle } from './SearchScreenContainer.style';

@observer
export class SearchScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? SearchScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : SearchScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private searchFactory = new SearchScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private setSelectionMenuDelegate = this.searchFactory.createSetSelectionMenuDelegateWithStyles();

  private navigatorDelegate = this.searchFactory.createNavigatorDelegate();

  protected observableScreen = new ObservableSearchScreen(
    '',
    new ObservableVocabularyListState(
      null,
      false,
      observable.box(ActivityState.INACTIVE),
      observable.box(this.props.rootStore.syncStore.currentState === 'SYNCING'),
      observable.box(false),
      observable.box(false),
      observable.box(false),
    ),
    ScreenName.SEARCH_SCREEN,
    new ObservableTouchableTopBar(
      SearchScreenIds.SHOW_SET_SELECTION_MENU_BTN,
      this.setSelectionMenuDelegate.getCurrentSetName(),
      this.setSelectionMenuDelegate.getCurrentFlagIcon(),
      (): void => {
        this.setSelectionMenuDelegate.showActiveSetsForSetSelection();
      },
      new ObservableTopBarButton(
        SearchScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_WHITE_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.pop();
        },
      ),
      null,
    ),
  );

  private screenDelegate = this.searchFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidMount(): void {
    this.setSelectionMenuDelegate.autoUpdateSubtitleOnSetChange(
      this.observableScreen,
    );
    this.screenDelegate.autoRefreshOnSetChange();
    this.screenDelegate.autoRefreshOnMultipleEdit();
    this.screenDelegate.autoShowSyncingInProgress();
    this.screenDelegate.autoShowSyncCompleted();
  }

  public componentWillUnmount(): void {
    this.screenDelegate.clearSearch();
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? SearchScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : SearchScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <SearchScreen
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
