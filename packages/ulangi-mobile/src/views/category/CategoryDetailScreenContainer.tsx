/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import {
  ActivityState,
  ScreenName,
  Theme,
  VocabularyFilterType,
} from '@ulangi/ulangi-common/enums';
import { Category } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableCategoryDetailScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
  ObservableVocabularyListState,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { CategoryDetailScreenIds } from '../../constants/ids/CategoryDetailScreenIds';
import { CategoryDetailScreenFactory } from '../../factories/category/CategoryDetailScreenFactory';
import { CategoryDetailScreen } from './CategoryDetailScreen';
import { CategoryDetailScreenStyle } from './CategoryDetailScreenContainer.style';

export interface CategoryDetailScreenPassedProps {
  readonly selectedFilterType: VocabularyFilterType;
  readonly category: Category;
}

@observer
export class CategoryDetailScreenContainer extends Container<
  CategoryDetailScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? CategoryDetailScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : CategoryDetailScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new CategoryDetailScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableCategoryDetailScreen(
    this.props.observableConverter.convertToObservableCategory(
      this.props.passedProps.category,
    ),
    observable.box(this.props.passedProps.selectedFilterType),
    new ObservableVocabularyListState(
      null,
      false,
      observable.box(ActivityState.INACTIVE),
      observable.box(this.props.rootStore.syncStore.currentState === 'SYNCING'),
      observable.box(false),
      observable.box(false),
      observable.box(false),
    ),
    ScreenName.CATEGORY_DETAIL_SCREEN,
    new ObservableTitleTopBar(
      'Detail',
      new ObservableTopBarButton(
        CategoryDetailScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.pop();
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
    this.screenDelegate.autoUpdateEditedVocabulary();
    this.screenDelegate.autoRefreshOnMultipleEdit();
    this.screenDelegate.autoShowSyncCompleted();
    this.screenDelegate.autoShowSyncingInProgress();
    this.screenDelegate.prepareAndFetch(
      this.observableScreen.selectedFilterType.get(),
    );
  }

  public componentWillUnmount(): void {
    this.screenDelegate.clearFetch();
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? CategoryDetailScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : CategoryDetailScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <CategoryDetailScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
