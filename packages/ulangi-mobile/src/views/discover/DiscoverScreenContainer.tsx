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
  ObservableTranslationListState,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
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
    {
      title: 'Discover',
      testID: DiscoverScreenIds.SHOW_SET_SELECTION_MENU_BTN,
      subtitle: this.props.rootStore.setStore.existingCurrentSet.setName,
      icon: _.has(
        Images.FLAG_ICONS_BY_LANGUAGE_CODE,
        this.props.rootStore.setStore.existingCurrentSet.learningLanguageCode,
      )
        ? _.get(
            Images.FLAG_ICONS_BY_LANGUAGE_CODE,
            this.props.rootStore.setStore.existingCurrentSet
              .learningLanguageCode,
          )
        : Images.FLAG_ICONS_BY_LANGUAGE_CODE.any,
      onTitlePress: (): void => {
        this.setSelectionMenuDelegate.showActiveSetsForSetSelection();
      },
    },
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private setSelectionMenuDelegate = this.screenFactory.createSetSelectionMenuDelegate();

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

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === DiscoverScreenIds.TIP_BTN) {
      this.screenDelegate.showTip();
    }
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
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
